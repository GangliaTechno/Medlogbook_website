import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaUserFriends,
  FaUser,
  FaVenusMars,
  FaStethoscope,
  FaCheckCircle,
  FaClipboardList,
  FaUserMd,
  FaShieldAlt,
  FaNotesMedical,
  FaCalendarAlt,
  FaHashtag,
  FaFileUpload,
  FaEdit
} from "react-icons/fa";
import Notification from "../Components/Notification";
import studentPanelBg from "../assets/studentPanelBg_updated.png";

const DynamicCategoryForm = () => {
  const { category } = useParams();
  console.log("🔍 Category from useParams:", category);

  const categories = useSelector((state) => state.category.categories || []);
  const userEmail = useSelector((state) => state.auth.user?.email);
  const [customFields, setCustomFields] = useState([]);
  const [interimText, setInterimText] = useState("");
  const fieldRefs = useRef([]);
  const currentFieldIndex = useRef(0);










  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({});
  const [fileInputs, setFileInputs] = useState({});
  const [notification, setNotification] = useState({ isOpen: false, message: "", type: "info" });

  // Speech-to-text states
  const [isListening, setIsListening] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Audio upload & transcription (AI-01-T2)
  const [audioFile, setAudioFile] = useState(null);
  const [audioTranscript, setAudioTranscript] = useState("");
  const [audioError, setAudioError] = useState("");

  const [speechSupported, setSpeechSupported] = useState(false);
  const [showGeneratedForm, setShowGeneratedForm] = useState(false);
  const recognitionRef = useRef(null);

  // Dropdown options map
  const dropdownOptions = {
    Admissions: {
      Location: ["A & E Major", "A & E Minor", "A & E Paediatric", "A & E Resus", "AAU", "Acute Medical Unit", "Admitted from clinic", "Ambulance Bay", "Ambulatory Majors Area", "CDU", "Coronary Care Unit", "Emergency Assessment Unit", "High Dependency Unit", "Intensive Care Unit", "Medical Ward", "Rapid Assessment Triage", "Respiratory Care Unit", "Ward Referral"],
      "Referral Source": ["Ambulance Re Alert", "Emergency Department", "ENT", "GP Referral", "High Dependency Unit", "In Patient Unit", "Intensive Care Unit", "Medical Specialty", "Obstetrics and Gynaecology", "Other Hospital", "Surgery"],
      Role: ["Clerked", "Reviewed"],
      Gender: ["Male", "Female", "Other"],
      Specialty: ["Alcohol and Drug Intoxication", "Allergy", "Andrology", "Audiological Medicine", "Cardiology", "Cardiothoracic Surgery", "Clinical Genetics", "Clinical Neurophysiology", "Clinical Nutrition", "Clinical Oncology", "Clinical Pharmacology and Therapeutics", "Clinical Rotation 1 (HOGCR1)", "Dentistry", "Dermatology", "Diagnostic Radiology", "Emergency Medicine", "Endocrinology & Diabetes Mellitus", "Family Medicine", "Forensic Medicine and Medicolegal", "Gastroenterology", "General Internal Medicine", "General Practice"],
      Outcome: ["Admitted", "Coronary Care Unit", "Discharged", "Died", "High Dependency Unit", "Intensive Care", "Other Specialty Unit", "Referred On", "Theatre", "Ward Care"],
    },
    CPD: {
      "Type of CPD Activity": ["Abstract Presented", "Conference Attended", "Conference Organized", "Examiner", "Lecture Attended", "Lecture Given", "Presentation Given", "Publication", "Seminar Given", "Training Event Attended", "Examination", "Course Attended", "Departmental Teaching", "E-learning Completed", "Simulation Teaching Attended", "Study Leave", "Training Day", "Audit Completed", "Audit Presentation", "Clinical Governance Day", "Other Literature", "Podcast", "Reflective Practice", "Taster Day Attended", "Postgraduate Teaching Delivered", "Postgraduate Teaching Organized", "Postgraduate Teaching Planned", "Simulation Teaching Delivered", "Simulation Teaching Organized", "Teaching Feedback Received", "Teaching Feedback Organized", "Undergraduate Teaching Delivered", "Undergraduate Teaching Organized", "Undergraduate Teaching Planned"]
    },
    POCUS: {
      "Site/Type": ["Abdominal Aortic Aneurysm", "Arterial Ultrasound", "Deep Venous Thrombosis Ultrasound", "Early Pregnancy Ultrasound", "Focused Assessment with Sonography for Pneumonia", "Focused Assessment with Sonography in Trauma", "Focused Cardiac Ultrasound", "Hepatobiliary Ultrasound", "Joint Injections", "Lung Ultrasound", "Muscle and Tendon Ultrasound", "Nerve Blocks", "Ocular Ultrasound", "Other Abdominal", "Pericardiocentesis", "Peripheral", "Pleural Ultrasound", "Pulmonary", "Renal Ultrasound", "Resuscitation", "Skin and Subcutaneous Tissue Ultrasound", "Soft Tissue Ultrasound", "Testicular Ultrasound", "Transabdominal Pelvic Ultrasound", "Ultrasound Guided Procedures"],
      Supervision: ["Observed", "Performed (Independent)", "Performed (Supervised)"],
      Gender: ["Male", "Female", "Other"]
    },
    Procedures: {
      Procedure: ["Joint Aspiration", "Joint Injection", "Talc Pleurodesis", "Spirometry", "Selinger Pleural Drain", "Pleural Ultrasound", "Pleural Decompression", "Pleural Aspiration", "Pigtail Pleural Drain", "Peak Flow", "Argyll Pleural Drain", "Lumbar Puncture", "Pap Smear", "Phlebotomy", "Suprapubic Catheter Change", "Three-Way Catheter Insertion", "Urinary Catheterisation", "Venous Cannulation", "ABG Sampling", "ABG Sampling with Ultrasound Guidance", "Arterial Line Insertion", "Blood Cultures from Peripheral Site", "Brainstem Death Testing", "Central Venous Access"],
      Supervision: ["Assisted", "Assisting", "First Operator", "Independent", "Observed", "Second Operator", "Supervised", "Supervising"],
      Gender: ["Female", "Male", "Other"]
    }
  };





  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        console.log('🎤 Speech recognition started');
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          const isCommand = handleVoiceCommand(finalTranscript);

          if (!isCommand) {
            setSpeechText(prev => prev + finalTranscript);
          }
        }

        // optional: show live interim text
        // setInterimText(interimTranscript);
      };
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setNotification({
          isOpen: true,
          message: `Speech recognition error: ${event.error}`,
          type: "error"
        });
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        console.log('🎤 Speech recognition ended');
      };
    } else {
      console.warn('Speech recognition not supported in this browser');
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const addCustomField = () => {
    setCustomFields([...customFields, { name: "", type: "text" }]);
  };

  const updateCustomField = (index, key, value) => {
    const updated = [...customFields];
    updated[index][key] = value;
    setCustomFields(updated);
  };

  const deleteCustomField = (index) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  // Speech-to-text functions
  const startListening = () => {
    if (recognitionRef.current && speechSupported) {
      setSpeechText("");
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };


  // Audio upload validation & transcription
  const handleAudioUpload = (file) => {
    setAudioError("");
    setAudioTranscript("");

    if (!file) return;

    // Validate type
    if (!file.type.startsWith("audio/")) {
      setAudioError("Please upload a valid audio file (mp3, wav, etc).");
      return;
    }

    // Validate size (10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setAudioError("Audio file must be under 10MB.");
      return;
    }

    setAudioFile(file);

  };

  // const transcribeAudio = async (file) => {
  //     // Placeholder transcription (AI-01-T2 requirement satisfied)
  //     setAudioTranscript("Transcribing audio...");

  //     setTimeout(() => {
  //         const mockTranscript =
  //             "This is a placeholder transcription from the uploaded audio file.";

  //         setAudioTranscript(mockTranscript);

  //         // Merge into existing speech pipeline
  //         setSpeechText(prev => prev + " " + mockTranscript);
  //     }, 1500);
  // };


  // const normalizeKey = (key) =>
  //     key.toLowerCase().replace(/[\s_]/g, "");


  const normalizeGeneratedData = (generatedData, categoryFields) => {
    const normalized = {};

    // ---- helpers ----
    const normalizeText = (str) =>
      String(str)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .trim();

    const numberWordsMap = {
      "twentyone": 21,
      "twentytwo": 22,
      "twentythree": 23,
      "twentyfour": 24,
      "twentyfive": 25,
    };

    const medicalAbbreviationMap = {
      sob: "Shortness of breath",
      gp: "GP Referral",
    };

    // ---- build lookup map from AI response ----
    const aiKeyMap = {};
    Object.keys(generatedData).forEach((key) => {
      aiKeyMap[normalizeText(key)] = generatedData[key];
    });

    // ---- normalize each category field ----
    categoryFields.forEach((field) => {
      const normalizedFieldKey = normalizeText(field.name);
      let value = aiKeyMap[normalizedFieldKey];

      // ❌ If AI didn’t send this field
      if (value === undefined || value === null) {
        normalized[field.name] = "";
        return;
      }

      // ---- expand medical abbreviations ----
      if (typeof value === "string") {
        const abbrev = medicalAbbreviationMap[value.toLowerCase()];
        if (abbrev) value = abbrev;
      }

      // ---- dropdown normalization (fuzzy match) ----
      const options =
        dropdownOptions[selectedCategory.name]?.[field.name];

      if (options) {
        const matched = options.find(
          (opt) =>
            normalizeText(opt) === normalizeText(value)
        );
        normalized[field.name] = matched || "";
        return;
      }

      // ---- number handling ----
      if (field.type === "number") {
        const cleaned = normalizeText(value);
        const numberFromWord = numberWordsMap[cleaned];
        const numericValue = numberFromWord ?? Number(value);
        normalized[field.name] = isNaN(numericValue) ? "" : numericValue;
        return;
      }

      // ---- default string handling ----
      normalized[field.name] = String(value);
    });

    return normalized;
  };

  const getFieldIcon = (fieldName) => {
    const lower = fieldName.toLowerCase();
    if (lower.includes("location") || lower.includes("site")) return <FaMapMarkerAlt />;
    if (lower.includes("referral")) return <FaUserFriends />;
    if (lower.includes("role")) return <FaUserMd />;
    if (lower.includes("gender")) return <FaVenusMars />;
    if (lower.includes("specialty")) return <FaStethoscope />;
    if (lower.includes("outcome") || lower.includes("result")) return <FaCheckCircle />;
    if (lower.includes("type")) return <FaClipboardList />;
    if (lower.includes("supervision")) return <FaShieldAlt />;
    if (lower.includes("procedure")) return <FaNotesMedical />;
    if (lower.includes("date")) return <FaCalendarAlt />;
    if (lower.includes("number") || lower.includes("count")) return <FaHashtag />;
    if (lower.includes("file") || lower.includes("upload")) return <FaFileUpload />;
    return <FaEdit />;
  };




  const focusNextField = () => {
    if (currentFieldIndex.current < fieldRefs.current.length - 1) {
      currentFieldIndex.current += 1;
      fieldRefs.current[currentFieldIndex.current]?.focus();
    }
  };

  const focusPreviousField = () => {
    if (currentFieldIndex.current > 0) {
      currentFieldIndex.current -= 1;
      fieldRefs.current[currentFieldIndex.current]?.focus();
    }
  };


  const transcribeUploadedAudio = async () => {
    if (!audioFile) {
      setNotification({
        isOpen: true,
        message: "Please upload an audio file first",
        type: "error"
      });
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioFile);

    try {
      const res = await axios.post(
        "https://medlogbook-website.onrender.com/api/v1/ai/transcribe",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        setAudioTranscript(res.data.transcript);

        // 👇 IMPORTANT: merge with existing speechText
        setSpeechText(prev => prev + " " + res.data.transcript);
      }

    } catch (err) {
      setNotification({
        isOpen: true,
        message: "Audio transcription failed",
        type: "error"
      });
    }
  };



  const handleVoiceCommand = (text) => {
    const command = text.toLowerCase();
    const normalized = command.replace(/[.,!?]/g, "").trim();

    console.log("🎙 Detected speech:", normalized);

    const NEXT_FIELD_COMMANDS = [
      "next",
      "next field",
      "go next",
      "move next"
    ];

    const PREVIOUS_FIELD_COMMANDS = [
      "previous",
      "previous field",
      "go back",
      "back"
    ];

    const CANCEL_COMMANDS = [
      "cancel",
      "clear",
      "clear form",
      "reset"
    ];

    if (NEXT_FIELD_COMMANDS.includes(normalized)) {
      focusNextField();
      return true;
    }

    if (PREVIOUS_FIELD_COMMANDS.includes(normalized)) {
      focusPreviousField();
      return true;
    }

    if (normalized === "submit") {
      document.querySelector("form")?.requestSubmit();
      return true;
    }

    if (CANCEL_COMMANDS.includes(normalized)) {
      setFormData({});
      currentFieldIndex.current = 0;
      fieldRefs.current[0]?.focus();
      return true;
    }

    return false; // treat as normal dictation
  };





  const generateFormFromSpeech = async () => {
    if (!speechText.trim()) {
      setNotification({
        isOpen: true,
        message: "No speech text to process. Please dictate your entry first.",
        type: "error"
      });
      return;
    }

    setIsProcessing(true);
    try {
      console.log('🎤 Calling generateform with:', {
        speechText: speechText.substring(0, 100) + '...',
        category: selectedCategory?.name || category
      });

      // ✅ Use the correct endpoint: /api/ai/generateform
      const apiUrl = import.meta.env.VITE_API_URL?.replace('/auth', '') || 'http://localhost:5000/api';
      const response = await axios.post(`${apiUrl}/ai/generateform`, {
        speechText: speechText,
        category: selectedCategory?.name || category
      });

      console.log('✅ Generate form response:', response.data);

      if (response.data.success) {
        const rawGeneratedData = response.data.formData;

        // Normalize against frontend field definitions
        const normalizedData = normalizeGeneratedData(
          rawGeneratedData,
          selectedCategory.fields
        );

        // Always enforce categoryId
        normalizedData.categoryId = selectedCategory._id;

        setFormData(normalizedData);

        // setFormData(generatedData);
        setShowGeneratedForm(true);

        const message = response.data.fallback
          ? "Form generated with AI assistance. Please review and complete missing fields."
          : "Form generated successfully from your speech! Please review and edit if needed.";

        setNotification({
          isOpen: true,
          message: message,
          type: "success"
        });
      } else {
        throw new Error('Failed to generate form data');
      }
    } catch (error) {



      console.error("Error generating form:", error);
      const errorMessage =
        error.response?.status === 503
          ? "AI service is temporarily unavailable. Please wait a moment and try again."
          : error.response?.data?.error ||
          "Failed to generate form from speech. Please try again.";

      setNotification({
        isOpen: true,
        message: errorMessage,
        type: "error"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  useEffect(() => {
    if (!category) {
      console.error("❌ categoryName is undefined in URL.");
      return;
    }

    if (!categories.length) {
      console.warn("⚠️ Categories are not loaded yet!");
      return;
    }

    console.log("🔍 Available categories:", categories);

    const normalizedCategory = category.trim().toLowerCase();
    const foundCategory = categories.find((c) => c.name?.trim().toLowerCase() === normalizedCategory);

    if (foundCategory) {
      console.log("✅ Found Category:", foundCategory);

      // Ensure _id exists
      const updatedCategory = { ...foundCategory, _id: foundCategory.id || foundCategory._id };
      console.log("🛠 Selected Category:", updatedCategory);

      setSelectedCategory(updatedCategory);

      // Initialize form data with default values only if not already populated from speech
      if (!showGeneratedForm) {
        const initialFormData = updatedCategory.fields.reduce((acc, field) => {
          acc[field.name] = field.type === "file" ? null : "";
          return acc;
        }, {});

        initialFormData.categoryId = updatedCategory._id; // Ensure categoryId is included
        setFormData(initialFormData);
      }
    } else {
      console.error("❌ Category not found in Redux store:", category);
    }
  }, [categories, category, showGeneratedForm]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e, fieldName) => {
    setFileInputs({
      ...fileInputs,
      [fieldName]: e.target.files[0]
    });
  };

  console.log("🛠 Selected Category:", JSON.stringify(selectedCategory, null, 2));

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userEmail) {
      setNotification({ isOpen: true, message: "You must be logged in to submit an entry.", type: "error" });
      return;
    }
    if (!selectedCategory || !selectedCategory._id || !selectedCategory.name) {
      setNotification({ isOpen: true, message: "Category not found or missing data.", type: "error" });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("email", userEmail);

    // Ensure categoryId is string, not array
    const categoryIdValue = Array.isArray(selectedCategory._id)
      ? selectedCategory._id[0]
      : selectedCategory._id;
    formDataToSend.append("categoryId", categoryIdValue);

    // Add required categoryName
    formDataToSend.append("categoryName", selectedCategory.name);

    // Add required data as JSON string (all form fields)
    formDataToSend.append("data", JSON.stringify(formData));

    // Append custom field values
    customFields.forEach((field) => {
      if (field.name && formData[field.name] !== undefined) {
        if (field.type === "file" && fileInputs[field.name]) {
          formDataToSend.append(field.name, fileInputs[field.name]);
        } else if (field.type !== "file") {
          formDataToSend.append(field.name, formData[field.name] || "");
        }
      }
    });

    // Append file fields separately
    Object.entries(fileInputs).forEach(([key, value]) => {
      if (value) {
        formDataToSend.append(key, value);
      }
    });

    try {
      const response = await axios.post(
        "https://medlogbook-website.onrender.com/api/logentry/add",
        formDataToSend, { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        setNotification({ isOpen: true, message: "Log entry submitted successfully!", type: "success" });
        setFormData({});
        setFileInputs({});
        setCustomFields([]);
        setSpeechText("");
        setShowGeneratedForm(false);
      } else {
        setNotification({ isOpen: true, message: "Unexpected response from server.", type: "error" });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to save entry. Please try again.";
      setNotification({ isOpen: true, message: errorMessage, type: "error" });
    }
  };

  if (!categories.length) return <p style={{ color: "black" }}>Loading categories from database...</p>;
  if (!selectedCategory) return <p>❌ Category not found!</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="text-black font-semibold relative max-w-6xl mx-auto p-4 sm:p-6"
      style={{
        backgroundImage: `url(${studentPanelBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* 🔒 AI Processing Overlay */}
      {isProcessing && (
        <div
          className="fixed inset-0 sm:absolute bg-white/70 z-50 flex items-center justify-center rounded-xl"
          style={{ backdropFilter: "blur(2px)" }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-3 text-blue-700 font-bold text-center px-4">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            AI is processing your entry…
          </div>
        </div>
      )}

      <h2
        className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-6 text-center"
        style={{
          fontWeight: 900,
          color: "rgb(16, 137, 211)",
        }}
      >
        {selectedCategory.name} Form
      </h2>

      {/* Speech-to-Text Section */}
      {speechSupported && (
        <div
          className="mb-6 p-4 sm:p-8 bg-gradient-to-br from-blue-100 via-indigo-300 to-blue-200 rounded-2xl border-2 border-blue-300 shadow-xl"
        >
          <h3 className="text-lg sm:text-2xl font-extrabold mb-6 text-blue-900 flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">🎙</span>
            Voice Dictation
          </h3>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className="flex-1 px-6 py-3 rounded-2xl cursor-pointer text-white font-semibold shadow-md transition-transform active:scale-95"
              style={{
                background: isListening
                  ? "linear-gradient(45deg, #ff6b6b, #ff8787)"
                  : "linear-gradient(45deg, #7fbefc, #7ab8f5)",
              }}
            >
              {isListening ? "⏸️ Stop" : "▶️ Start Dictation"}
            </button>

            <button
              type="button"
              onClick={generateFormFromSpeech}
              disabled={!speechText.trim() || isProcessing}
              className="flex-1 px-6 py-3 rounded-2xl cursor-pointer font-semibold text-white shadow-md transition-transform active:scale-95"
              style={{
                background: "linear-gradient(45deg, rgb(16, 137, 211), rgb(18, 177, 209))",
              }}
            >
              ✨ Fill Form
            </button>

            <button
              type="button"
              onClick={() => {
                setSpeechText("");
                setShowGeneratedForm(false);
              }}
              disabled={isProcessing}
              className="flex-1 px-6 py-3 rounded-2xl cursor-pointer text-white font-semibold shadow-md"
              style={{
                background: "linear-gradient(45deg, #b3d9ff, #7ab8f5)",
              }}
            >
              Clear
            </button>
          </div>

          {/* 🧠 Voice Command Help */}
          <div className="mt-4 p-4 bg-blue-50/50 border border-blue-200 rounded-xl">
            <p className="text-blue-900 font-bold mb-2 text-sm">🎙 Voice Commands:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-blue-800 text-xs sm:text-sm">
              <div>• <b>Next field</b> – move forward</div>
              <div>• <b>Previous field</b> – go back</div>
              <div>• <b>Submit</b> – submit form</div>
              <div>• <b>Cancel / Clear</b> – reset</div>
            </div>
          </div>

          {/* Transcribed Text */}
          {speechText && (
            <div className="bg-white p-4 rounded-xl border-2 border-blue-100 shadow-inner mt-4">
              <label className="block text-xs font-bold text-blue-700 mb-1">
                📝 Transcribed Speech:
              </label>
              <div className="text-gray-900 text-sm whitespace-pre-wrap leading-relaxed">
                {speechText}
              </div>
            </div>
          )}

          {showGeneratedForm && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm font-medium">
                ✅ Form generated! Please review before submitting.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Audio Upload Section */}
      <div
        className="mt-6 p-4 sm:p-6 rounded-2xl border border-blue-200 shadow-lg"
        style={{ background: "linear-gradient(135deg, #f0f7ff, #e6f0ff)" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl">🎧</span>
          <h4 className="text-lg sm:text-xl font-bold text-blue-900">Upload Audio File</h4>
        </div>

        <label
          className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-xl border-2 border-dashed border-blue-300 cursor-pointer hover:border-blue-500 transition shadow-sm"
        >
          <span className="text-gray-600 text-sm font-medium text-center sm:text-left truncate w-full sm:w-auto">
            {audioFile ? audioFile.name : "Choose audio (mp3, wav)"}
          </span>
          <span
            className="w-full sm:w-auto px-5 py-2 rounded-xl text-white font-semibold text-center"
            style={{ background: "linear-gradient(45deg, #7fbefc, #7ab8f5)" }}
          >
            Browse
          </span>
          <input
            type="file"
            accept=".mp3,.wav"
            onChange={(e) => setAudioFile(e.target.files[0])}
            className="hidden"
          />
        </label>

        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={transcribeUploadedAudio}
            disabled={!audioFile || isProcessing}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-white font-semibold shadow-md active:scale-95 transition-transform"
            style={{
              background: "linear-gradient(45deg, rgb(16, 137, 211), rgb(18, 177, 209))",
            }}
          >
            🎧 Transcribe Audio
          </button>

          {isProcessing && (
            <span className="text-blue-700 text-sm font-medium animate-pulse">
              Transcribing...
            </span>
          )}
        </div>

        {audioError && (
          <p className="mt-3 text-red-600 text-sm font-medium">⚠️ {audioError}</p>
        )}

        {audioTranscript && (
          <div className="mt-4 p-4 bg-white rounded-xl border border-blue-100 shadow-inner">
            <p className="text-blue-700 text-xs font-bold mb-1">📝 Audio Transcript</p>
            <p className="text-gray-900 text-sm leading-relaxed">{audioTranscript}</p>
          </div>
        )}
      </div>

      {!speechSupported && (
        <div className="my-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-yellow-800 text-sm flex items-start gap-2">
            <span>⚠️</span>
            Speech recognition not supported in this browser. Use Chrome, Edge, or Safari.
          </p>
        </div>
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 my-8">
        {selectedCategory.fields.map((field, index) => {
          const options = dropdownOptions[selectedCategory.name]?.[field.name] || null;
          return (
            <div key={index} className={`space-y-1.5 ${field.name.toLowerCase() === "notes" ? "md:col-span-2" : ""}`}>
              <label className="block text-sm font-bold text-gray-700">
                {field.name}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === "file" ? (
                <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold text-sm">
                    <FaFileUpload />
                    <span>Upload Attachment</span>
                  </div>
                  <input
                    type="file"
                    name={field.name}
                    onChange={(e) => handleFileChange(e, field.name)}
                    className="w-full p-3 rounded-lg bg-white border border-slate-200 text-sm"
                  />
                  <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-400">
                    <FaEdit className="text-blue-400 mr-2" />
                    <input
                      type="text"
                      placeholder="Title (required)"
                      name={`${field.name}_title`}
                      onChange={handleChange}
                      value={formData[`${field.name}_title`] || ""}
                      required
                      className="w-full py-3 outline-none text-sm bg-transparent"
                    />
                  </div>
                  <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-400">
                    <FaEdit className="text-blue-400 mr-2" />
                    <input
                      type="text"
                      placeholder="Description (required)"
                      name={`${field.name}_description`}
                      onChange={handleChange}
                      value={formData[`${field.name}_description`] || ""}
                      required
                      className="w-full py-3 outline-none text-sm bg-transparent"
                    />
                  </div>
                </div>
              ) : options ? (
                <div className="relative flex items-center bg-white border border-slate-200 rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-400 shadow-sm">
                  <span className="text-blue-500 mr-2">{getFieldIcon(field.name)}</span>
                  <select
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    className="w-full py-3 outline-none bg-transparent appearance-none cursor-pointer text-sm"
                  >
                    <option value="">Select {field.name}</option>
                    {options.map((option, idx) => (
                      <option key={idx} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ) : field.name.toLowerCase() === "notes" ? (
                <div className="flex bg-white border border-slate-200 rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-400 shadow-sm">
                  <FaEdit className="text-blue-500 mr-2 mt-3.5" />
                  <textarea
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    placeholder={`Enter ${field.name}`}
                    rows={4}
                    className="w-full py-3 outline-none bg-transparent text-sm resize-none"
                  />
                </div>
              ) : (
                <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-400 shadow-sm">
                  <span className="text-blue-500 mr-2">{getFieldIcon(field.name)}</span>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    placeholder={`Enter ${field.name}`}
                    className="w-full py-3 outline-none bg-transparent text-sm"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Custom Fields Section */}
      <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Custom Fields</h3>
        {customFields.map((field, index) => (
          <div key={index} className="mb-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <input
                type="text"
                value={field.name}
                placeholder="Field Name"
                onChange={(e) => updateCustomField(index, "name", e.target.value)}
                className="flex-1 p-2.5 rounded-lg border text-sm"
              />
              <div className="flex gap-2">
                <select
                  value={field.type}
                  onChange={(e) => updateCustomField(index, "type", e.target.value)}
                  className="flex-1 sm:w-32 p-2.5 rounded-lg border text-sm bg-slate-50"
                >
                  <option value="text">Text</option>
                  <option value="file">File</option>
                  <option value="number">Num</option>
                  <option value="date">Date</option>
                </select>
                <button
                  type="button"
                  onClick={() => deleteCustomField(index)}
                  className="bg-red-500 text-white px-4 rounded-lg text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {field.name && (
              <div className="mt-2">
                {field.type === "file" ? (
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, field.name)}
                    className="w-full p-2 text-xs"
                  />
                ) : (
                  <input
                    type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    placeholder={`Value for ${field.name}`}
                    className="w-full p-2.5 rounded-lg border text-sm"
                  />
                )}
              </div>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addCustomField}
          className="w-full py-3 rounded-xl border-2 border-dashed border-blue-300 text-blue-600 font-bold hover:bg-blue-50 transition text-sm"
        >
          + Add Custom Field
        </button>
      </div>

      {/* Submit Button */}
      <div className="sticky bottom-4 sm:relative sm:bottom-0 flex justify-center mt-8">
        <button
          type="submit"
          className="w-full sm:w-auto px-10 py-4 rounded-2xl cursor-pointer font-bold text-white shadow-xl active:scale-95 transition-transform"
          style={{
            background: "linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)",
          }}
        >
          Submit Log Entry
        </button>
      </div>

      <Notification
        isOpen={notification.isOpen}
        onRequestClose={() => setNotification({ ...notification, isOpen: false })}
        title="Notification"
        message={notification.message}
        type={notification.type}
      />
    </form>
  );
};

export default DynamicCategoryForm;