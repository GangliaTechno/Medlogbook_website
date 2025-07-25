const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Gemini client setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

// 🎤 Generate form JSON from speech text
router.post('/generateform', async (req, res) => {
  console.log('🎤 /generateform route hit');
  console.log('Request body:', req.body);
  
  try {
    const { speechText, category } = req.body;

    if (!speechText || !category) {
      return res.status(400).json({ error: 'speechText and category are required' });
    }

    // Define example JSON structures for different categories
    const exampleFormats = {
      Admissions: {
        "Patient Name": "",
        "Admission Date": "",
        "Date": "",
        "Hospital": "",
        "Location": "",
        "Referral Source": "",
        "Age": "",
        "Date": "",
        "Time": "",
        "Patient Presenting Complaint": "",
        "History of Presenting Complaint": "",
        "Past Medical History": "",
        "Drug History": "",
        "Social History": "",
        "Family History": "",
        "Systems Review": "",
        "Examination Findings": "",
        "Investigations": "",
        "Diagnosis": "",
        "Treatment Plan": "",
        "Learning Points": ""
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

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await retryGeminiCall(model, inputPrompt);

    // Clean up the response to ensure it's valid JSON
    let cleanedResponse = response.trim();
    
    // Remove any markdown code blocks
    cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Try to parse the JSON to validate it
    try {
      const parsedJSON = JSON.parse(cleanedResponse);
      console.log('✅ Successfully generated form data:', parsedJSON);
      res.json({ formData: parsedJSON, success: true });
    } catch (parseError) {
      console.warn('JSON parsing failed, attempting to fix:', parseError.message);
      
      // Attempt to fix common JSON issues
      cleanedResponse = cleanedResponse.replace(/'/g, '"'); // Replace single quotes with double quotes
      cleanedResponse = cleanedResponse.replace(/,\s*}/g, '}'); // Remove trailing commas
      cleanedResponse = cleanedResponse.replace(/,\s*]/g, ']'); // Remove trailing commas in arrays
      
      try {
        const parsedJSON = JSON.parse(cleanedResponse);
        console.log('✅ Successfully generated form data (after fixing):', parsedJSON);
        res.json({ formData: parsedJSON, success: true });
      } catch (secondParseError) {
        console.error('Failed to parse Gemini response as JSON:', secondParseError.message);
        res.status(500).json({ 
          error: 'Failed to generate valid form data',
          rawResponse: cleanedResponse
        });
      }
    }

  } catch (error) {
    console.error('Form generation error:', error?.message || error);
    res.status(503).json({ 
      error: 'Form generation unavailable due to model overload. Please try again later.',
      fallback: true 
    });
  }
});

module.exports = router;