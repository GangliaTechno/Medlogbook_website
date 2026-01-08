const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Gemini client setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const upload = multer({ dest: 'uploads/' });


// 🔒 Redact patient-identifying fields before sending to AI
const redactSensitiveFields = (data) => {
  const SENSITIVE_KEYS = [
    'patientname',
    'name',
    'patientlocation',
    'location',
    'patientid',
    'uhid',
    'mrn',
    'reference',
    'yourreference'
  ];

  const sanitized = {};

  for (const key in data) {
    const normalizedKey = key.toLowerCase().replace(/\s+/g, '');

    // ❌ Skip patient-identifying fields
    if (SENSITIVE_KEYS.includes(normalizedKey)) {
      continue;
    }

    // 🔁 Handle nested objects safely
    if (typeof data[key] === 'object' && data[key] !== null) {
      sanitized[key] = redactSensitiveFields(data[key]);
    } else {
      sanitized[key] = data[key];
    }
  }

  return sanitized;
};


// Retry wrapper for Gemini requests
const retryGeminiCall = async (model, prompt, retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.warn(`Gemini retry ${i + 1} failed:`, err.message);
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, delay));
    }
  }
};


const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("GEMINI_TIMEOUT")), ms)
    )
  ]);

// 🔍 Summarize a full entry (with optional file)
router.post('/summarize', upload.single('file'), async (req, res) => {
  try {
    const { entryData } = req.body;

    if (!entryData) {
      return res.status(400).json({ error: 'entryData is required' });
    }

    // Parse incoming form data
    const parsedData = JSON.parse(entryData);

    // 🔐 Redact patient-identifying information
    const sanitizedData = redactSensitiveFields(parsedData);

    // Flatten nested objects (clean prompt for AI)
    for (const key in sanitizedData) {
      if (typeof sanitizedData[key] === 'object') {
        sanitizedData[key] = JSON.stringify(sanitizedData[key]);
      }
    }

    // Handle optional attached file
    let fileText = '';
    if (req.file) {
      try {
        fileText = fs.readFileSync(req.file.path, 'utf-8');
        fs.unlinkSync(req.file.path); // cleanup temp file
      } catch (fileError) {
        console.warn('File read/delete failed:', fileError.message);
      }
    }

    // 🔍 Debug log (prove redaction works)
    console.log('🔒 Data sent to AI (sanitized):', sanitizedData);

    // AI Prompt
    const inputPrompt = `
You are a clinical assistant. Generate a brief, professional, and formal summary of the student's medical entry.
Do NOT include patient name, location, or any identifying information.

Structured Entry Data:
${JSON.stringify(sanitizedData, null, 2)}

Attached Notes (if any):
${fileText || 'No attached notes.'}
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const summary = await retryGeminiCall(model, inputPrompt);

    res.json({ summary });

  } catch (error) {
    console.error('Gemini summarization error:', error?.message || error);

    res.status(503).json({
      summary: 'Summary unavailable due to AI service issue. Please try again later.',
      fallback: true
    });
  }
});


// 🎧 Audio Transcription
// router.post('/transcribe', upload.single('audio'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'Audio file required' });
//     }

//     const allowed = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
//     if (!allowed.includes(req.file.mimetype)) {
//       fs.unlinkSync(req.file.path);
//       return res.status(400).json({ error: 'Invalid audio format' });
//     }

//     const audioBuffer = fs.readFileSync(req.file.path);
//     fs.unlinkSync(req.file.path);

//     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

//     const response = await withTimeout(
//       model.generateContent({
//         contents: [{
//           role: "user",
//           parts: [
//             {
//               inlineData: {
//                 mimeType: req.file.mimetype,
//                 data: audioBuffer.toString("base64")
//               }
//             },
//             { text: "Transcribe this medical audio accurately." }
//           ]
//         }]
//       }),
//       20000
//     );

//     res.json({
//       success: true,
//       transcript: response.response.text()
//     });

//   } catch (err) {
//     console.error("Audio transcription error:", err.message);
//     res.status(503).json({ error: "Transcription failed" });
//   }
// });

router.post('/generateform', async (req, res) => {
  console.log("🧪 Using MOCK AI response for form filling");

  const mockResponse = {
    "Patient Name": "Nithin",
    "Admission Date": "2025-07-17",
    "Date": "2025-07-25",
    "Hospital": "KMC",
    "Location": "A & E Major",
    "Referral Source": "GP Referral",
    "Your Reference": "NKSDJNSD",
    "Gender": "Male",
    "Age": 21,
    "Role": "Clerked",
    "Specialty Area": "General Medicine",
    "Problem": "Shortness of breath",
    "Outcome": "Referred On",
    "Notes": "Patient stable, advised further evaluation"
  };

  return res.json({
    success: true,
    formData: mockResponse,
    fallback: true,
    message: "Mock AI response used for testing"
  });
});



// 🎤 NEW: Generate form JSON from speech text
// Add this route to your existing routes/gemini.js file, right after the summarize route

// 🎤 Generate form JSON from speech text
// Add this route to your existing routes/gemini.js file, after the summarize route

// 🎤 Generate form JSON from speech text
router.post('/generateform', async (req, res) => {
  console.log('🎤 /generateform route hit in medlog');
  console.log('Request body:', req.body);
  console.log('API Key available:', !!process.env.GEMINI_API_KEY);

  try {
    const { speechText, category } = req.body;

    if (!speechText || !category) {
      console.error('❌ Missing required fields');
      return res.status(400).json({ error: 'speechText and category are required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ No API key configured');
      return res.status(500).json({ error: 'API key not configured' });
    }

    console.log(`📝 Processing speech for category: ${category}`);
    console.log(`🗣️ Speech text length: ${speechText.length} characters`);

    // Use the same example formats as your existing forms
    const exampleFormats = {
      Admissions: {
        "Patient Name": "",
        "Admission Date": "",
        "Date": "",
        "Hospital": "",
        "Location": "",
        "Referral Source": "",
        "Your Reference": "",
        "Gender": "",
        "Age": "",
        "Role": "",
        "Specialty Area": "",
        "Problem": "",
        "Outcome": "",
        "Notes": "",
      },
      CPD: {
        "Type of CPD Activity": "",
        "Date": "",
        "Duration (hours)": "",
        "Location": "",
        "Organizer": "",
        "Topic/Subject": "",
        "Learning Objectives": "",
        "Key Learning Points": "",
        "How this applies to practice": "",
        "Reflection": "",
        "Evidence/Certificate": ""
      },
      POCUS: {
        "Site/Type": "",
        "Supervision": "",
        "Gender": "",
        "Age": "",
        "Date": "",
        "Clinical Indication": "",
        "Findings": "",
        "Image Quality": "",
        "Diagnostic Confidence": "",
        "Clinical Impact": "",
        "Learning Points": "",
        "Supervisor Feedback": ""
      },
      Procedures: {
        "Procedure": "",
        "Supervision": "",
        "Gender": "",
        "Age": "",
        "Date": "",
        "Clinical Indication": "",
        "Technique Used": "",
        "Complications": "",
        "Outcome": "",
        "Patient Consent": "",
        "Learning Points": "",
        "Supervisor Feedback": ""
      }
    };

    const exampleFormat = exampleFormats[category] || exampleFormats.Admissions;

    const inputPrompt = `
You are a medical assistant helping to structure clinical log entries. Based on the following speech transcript, extract and organize the information into a structured JSON format.

Category: ${category}

Expected JSON structure (fill in relevant fields, leave others empty if not mentioned):
${JSON.stringify(exampleFormat, null, 2)}

Speech transcript:
"${speechText}"

Instructions:
1. Extract relevant information from the speech and map it to appropriate fields
2. Use proper medical terminology where appropriate
3. If dates are mentioned, format them as YYYY-MM-DD
4. If times are mentioned, use 24-hour format (HH:MM)
5. For dropdown fields, choose the most appropriate option or leave empty if unclear
6. Be precise and professional in language
7. Only include information that was actually mentioned in the speech
8. Return ONLY the JSON object, no additional text or explanations

JSON Response:`;

    console.log('🤖 Calling Gemini API...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await withTimeout(
      retryGeminiCall(model, inputPrompt),
      15000 // 15 seconds
    );

    console.log('📤 Raw Gemini response:', response.substring(0, 200) + '...');

    // Clean up the response to ensure it's valid JSON
    let cleanedResponse = response.trim();

    // Remove any markdown code blocks
    cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    // Try to parse the JSON to validate it
    try {
      const parsedJSON = JSON.parse(cleanedResponse);
      console.log('✅ Successfully generated form data');
      res.json({ formData: parsedJSON, success: true });
    } catch (parseError) {
      console.warn('⚠️ JSON parsing failed, attempting to fix:', parseError.message);

      // Attempt to fix common JSON issues
      cleanedResponse = cleanedResponse.replace(/'/g, '"'); // Replace single quotes with double quotes
      cleanedResponse = cleanedResponse.replace(/,\s*}/g, '}'); // Remove trailing commas
      cleanedResponse = cleanedResponse.replace(/,\s*]/g, ']'); // Remove trailing commas in arrays

      try {
        const parsedJSON = JSON.parse(cleanedResponse);
        console.log('✅ Successfully generated form data (after fixing)');
        res.json({ formData: parsedJSON, success: true });
      } catch (secondParseError) {
        console.error('❌ Failed to parse Gemini response as JSON:', secondParseError.message);
        console.error('Cleaned response:', cleanedResponse);

        // Return a fallback response
        const fallbackData = { ...exampleFormat };
        fallbackData["Learning Points"] = `Original speech: "${speechText}"`;

        res.json({
          formData: fallbackData,
          success: true,
          fallback: true,
          message: 'AI parsing failed, please fill manually'
        });
      }
    }

  } catch (error) {
    console.error('❌ Form generation error:', error?.message || error);

    let errorMessage = 'Form generation failed';
    if (error.message.includes('API_KEY_INVALID')) {
      errorMessage = 'Invalid API key';
    } else if (error.message.includes('QUOTA_EXCEEDED')) {
      errorMessage = 'API quota exceeded';
    } else if (error.message.includes('RATE_LIMIT')) {
      errorMessage = 'Rate limit exceeded, please try again later';
    }

    res.status(503).json({
      error: errorMessage,
      details: error.message,
      fallback: true
    });
  }
});

module.exports = router;