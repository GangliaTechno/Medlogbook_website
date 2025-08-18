import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import Notification from "../Components/Notification";

const DynamicCategoryForm = () => {
    const { category } = useParams();
    console.log("🔍 Category from useParams:", category);

    const categories = useSelector((state) => state.category.categories || []);
    const userEmail = useSelector((state) => state.auth.user?.email);
    const [customFields, setCustomFields] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({});
    const [fileInputs, setFileInputs] = useState({});
    const [notification, setNotification] = useState({ isOpen: false, message: "", type: "info" });
    
    // Speech-to-text states
    const [isListening, setIsListening] = useState(false);
    const [speechText, setSpeechText] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
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
        setSpeechText(prev => prev + finalTranscript);
    }

    setInterimText(interimTranscript);
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
        const response = await axios.post("https://medlogbook-website.onrender.com/api/ai/generateform", {
            speechText: speechText,
            category: selectedCategory?.name || category
        });

        console.log('✅ Generate form response:', response.data);

        if (response.data.success) {
            // Merge the generated form data with existing form data
            const generatedData = response.data.formData;
            
            // Add categoryId to the generated data
            generatedData.categoryId = selectedCategory._id;
            
            setFormData(generatedData);
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
        const errorMessage = error.response?.data?.error || 
                           error.response?.data?.details || 
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
            console.error("❌ Email is missing! Ensure the user is logged in.");
            setNotification({ isOpen: true, message: "You must be logged in to submit an entry.", type: "error" });
            return;
        }

        if (!selectedCategory || !selectedCategory._id) {
            console.error("❌ Category ID is missing!");
            setNotification({ isOpen: true, message: "Category not found.", type: "error" });
            return;
        }

        console.log("🔹 Submitting log entry with Category ID:", selectedCategory._id);

        const formDataToSend = new FormData();
        formDataToSend.append("email", userEmail);
        formDataToSend.append("categoryId", selectedCategory._id);

        // Append text fields
        Object.entries(formData).forEach(([key, value]) => {
            if (!fileInputs[key]) {
                formDataToSend.append(key, value || "");
            }
        });

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
            const response = await axios.post("https://medlogbook-website.onrender.com/api/logentry/add", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 201) {
                console.log("✅ Entry saved successfully:", response.data);
                setNotification({ isOpen: true, message: "Log entry submitted successfully!", type: "success" });

                // Reset form after successful submission
                setFormData({});
                setFileInputs({});
                setCustomFields([]);
                setSpeechText("");
                setShowGeneratedForm(false);
            } else {
                console.error("❌ Unexpected response:", response);
                setNotification({ isOpen: true, message: "Something went wrong. Try again.", type: "error" });
            }
        } catch (error) {
            console.error("❌ Error saving entry:", error.response?.data || error.message);
            const errorMessage = error.response?.data?.error || "Failed to save entry. Please try again.";
            setNotification({ isOpen: true, message: errorMessage, type: "error" });
        }
    };

    if (!categories.length) return <p style={{ color: "black" }}>Loading categories from database...</p>;
    if (!selectedCategory) return <p>❌ Category not found!</p>;

    return (
        <form onSubmit={handleSubmit} className="text-black font-semibold relative max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-6"
                style={{
                    textAlign: "center",
                    fontWeight: 900,
                    fontSize: "30px",
                    color: "rgb(16, 137, 211)"
                }}>{selectedCategory.name} Form</h2>

            {/* Speech-to-Text Section */}
            {speechSupported && (
                <div
                    className="mb-6 p-8 bg-gradient-to-br from-blue-100 via-indigo-300 to-blue-200 rounded-2xl border-2 border-blue-300 shadow-2xl"
                    style={{ position: "relative" }}
                >
                    <h3 className="text-2xl font-extrabold mb-6 text-blue-900 flex items-center gap-2">
                        <span className="text-3xl"><svg xmlns="http://www.w3.org/2000/svg" height="44px" viewBox="0 -960 960 960" width="44px" fill="#0b3ea3ff"><path d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm0-240Zm-40 520v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Zm40-360q17 0 28.5-11.5T520-520v-240q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240q0 17 11.5 28.5T480-480Z"/></svg></span>
                        Voice Dictation
                    </h3>

                    {/* SVG Loader in top right - always visible */}
                    <div
                        style={{
                            position: "absolute",
                            top: 18,
                            right: 24,
                            zIndex: 20,
                            width: 54,
                            height: 54,
                        }}
                    >
                        <div className="analyze">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                height="54"
                                width="54"
                            >
                                <rect height="24" width="24"></rect>
                                <path
                                    strokeLinecap="round"
                                    strokeWidth="1.5"
                                    stroke="white"
                                    d="M19.25 9.25V5.25C19.25 4.42157 18.5784 3.75 17.75 3.75H6.25C5.42157 3.75 4.75 4.42157 4.75 5.25V18.75C4.75 19.5784 5.42157 20.25 6.25 20.25H12.25"
                                    className="board"
                                ></path>
                                <path
                                    d="M9.18748 11.5066C9.12305 11.3324 8.87677 11.3324 8.81234 11.5066L8.49165 12.3732C8.47139 12.428 8.42823 12.4711 8.37348 12.4914L7.50681 12.8121C7.33269 12.8765 7.33269 13.1228 7.50681 13.1872L8.37348 13.5079C8.42823 13.5282 8.47139 13.5714 8.49165 13.6261L8.81234 14.4928C8.87677 14.6669 9.12305 14.6669 9.18748 14.4928L9.50818 13.6261C9.52844 13.5714 9.5716 13.5282 9.62634 13.5079L10.493 13.1872C10.6671 13.1228 10.6671 12.8765 10.493 12.8121L9.62634 12.4914C9.5716 12.4711 9.52844 12.428 9.50818 12.3732L9.18748 11.5066Z"
                                    className="star-2"
                                ></path>
                                <path
                                    d="M11.7345 6.63394C11.654 6.41629 11.3461 6.41629 11.2656 6.63394L10.8647 7.71728C10.8394 7.78571 10.7855 7.83966 10.717 7.86498L9.6337 8.26585C9.41605 8.34639 9.41605 8.65424 9.6337 8.73478L10.717 9.13565C10.7855 9.16097 10.8394 9.21493 10.8647 9.28335L11.2656 10.3667C11.3461 10.5843 11.654 10.5843 11.7345 10.3667L12.1354 9.28335C12.1607 9.21493 12.2147 9.16097 12.2831 9.13565L13.3664 8.73478C13.5841 8.65424 13.5841 8.34639 13.3664 8.26585L12.2831 7.86498C12.2147 7.83966 12.1607 7.78571 12.1354 7.71728L11.7345 6.63394Z"
                                    className="star-1"
                                ></path>
                                <path
                                    className="stick"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    stroke="white"
                                    d="M17 14L21.2929 18.2929C21.6834 18.6834 21.6834 19.3166 21.2929 19.7071L20.7071 20.2929C20.3166 20.6834 19.6834 20.6834 19.2929 20.2929L15 16M17 14L15.7071 12.7071C15.3166 12.3166 14.6834 12.3166 14.2929 12.7071L13.7071 13.2929C13.3166 13.6834 13.3166 14.3166 13.7071 14.7071L15 16M17 14L15 16"
                                ></path>
                            </svg>
                            <style>
                                {`
                                .analyze svg path.stick {
                                  transform: translate(0);
                                  animation: stick 2s ease infinite;
                                }
                                .analyze svg path.star-1 {
                                  fill: #ff4500;
                                  animation: sparkles 2s ease infinite, scaleStars 2s ease infinite, colorChange 2s ease infinite;
                                  animation-delay: 150ms;
                                }
                                .analyze svg path.star-2 {
                                  fill: #00ff00;
                                  animation: sparkles 2s ease infinite, scaleStars 2s ease infinite, colorChange 2s ease infinite;
                                }
                                .board {
                                  animation: bounce 2s ease infinite;
                                }
                                @keyframes sparkles {
                                  0% { opacity: 1; }
                                  35% { opacity: 1; }
                                  55% { opacity: 0; }
                                  75% { opacity: 1; }
                                  100% { opacity: 1; }
                                }
                                @keyframes stick {
                                  0% { transform: translate3d(0, 0, 0) rotate(0);}
                                  25% { transform: translate3d(0, 0, 0) rotate(0);}
                                  50% { transform: translate3d(3px, -2px, 0) rotate(8deg);}
                                  75% { transform: translate3d(0, 0, 0) rotate(0);}
                                  100% { transform: translate3d(0, 0, 0) rotate(0);}
                                }
                                @keyframes scaleStars {
                                  0% { transform: scale(1);}
                                  50% { transform: scale(0.9);}
                                  100% { transform: scale(1);}
                                }
                                @keyframes bounce {
                                  0% { transform: translateY(0);}
                                  25% { transform: translateY(0);}
                                  50% { transform: translateY(0);}
                                  75% { transform: translateY(-1px);}
                                  100% { transform: translateY(0);}
                                }
                                @keyframes colorChange {
                                  0% { fill: #ffffffff;}
                                  25% { fill: #0004ffff;}
                                  50% { fill: #000000ff;}
                                  75% { fill: #f30000ff;}
                                  100% { fill: #09ff00ff;}
                                }
                                `}
                            </style>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-6">
                        <button
                            type="button"
                            onClick={isListening ? stopListening : startListening}
                            disabled={isProcessing}
                            className="px-6 py-3 rounded-[16px] cursor-pointer flex justify-center items-center gap-1.5 mt-2 text-white font-semibold transition-transform duration-200 shadow-md"
                            style={{
                                background: "linear-gradient(45deg, #7fbefcff, #7ab8f5)",
                                boxShadow: "0 6px 12px rgba(122, 184, 245, 0.3)",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                        >
                            {isListening ? '⏸️ Stop Dictating' : '▶️ Start Dictation'}
                        </button>
                        
                        <button
                            type="button"
                            onClick={generateFormFromSpeech}
                            disabled={!speechText.trim() || isProcessing}
                            className="px-6 py-3 rounded-[20px] cursor-pointer font-semibold text-white shadow-md transition-transform duration-200"
                            style={{
                                background: "linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)",
                                boxShadow: "rgba(133, 189, 215, 0.88) 0px 10px 15px -10px",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                        >
                            {isProcessing ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    Processing...
                                </>
                            ) : (
                                <>✨ Fill Form</>
                            )}
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => {
                                setSpeechText("");
                                setShowGeneratedForm(false);
                            }}
                            disabled={isProcessing}
                            className=" px-6 py-3 rounded-[16px] cursor-pointer flex justify-center items-center gap-1.5 mt-2 text-white font-semibold transition-transform duration-200 shadow-md"
                            style={{
                                background: "linear-gradient(45deg, #b3d9ff, #7ab8f5)",
                                boxShadow: "0 6px 12px rgba(122, 184, 245, 0.3)",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M269-86q-53 0-89.5-36.5T143-212v-497q-26 0-44.5-18.5T80-772q0-26 18.5-44.5T143-835h194q0-26 18.5-44.5T400-898h158q26 0 44.5 18.5T621-835h196q26 0 44.5 18.5T880-772q0 26-18.5 44.5T817-709v497q0 53-36.5 89.5T691-86H269Zm422-623H269v497h422v-497ZM394-281q21 0 36-15t15-36v-258q0-21-15-36t-36-15q-21 0-36.5 15T342-590v258q0 21 15.5 36t36.5 15Zm173 0q21 0 36-15t15-36v-258q0-21-15-36t-36-15q-21 0-36.5 15T515-590v258q0 21 15.5 36t36.5 15ZM269-709v497-497Z"/></svg> Clear All
                        </button>
                    </div>

                    {speechText && (
                        <div className="bg-white p-5 rounded-xl border-2 border-blue-100 shadow-inner min-h-[120px] mb-4">
                            <label className="block text-base font-bold text-blue-700 mb-2">
                                📝 Transcribed Speech:
                            </label>
                            <div className="text-gray-900 whitespace-pre-wrap leading-relaxed text-lg">
                                {speechText || "Your speech will appear here..."}
                            </div>
                        </div>
                    )}

                    {isListening && (
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-4 text-blue-700 font-bold text-xl">
                                <div className="animate-pulse bg-red-500 rounded-full h-4 w-4"></div>
                                🎤 Recording... Speak your complete log entry clearly
                                <div className="animate-pulse bg-red-500 rounded-full h-4 w-4"></div>
                                {/* Preloader spinner */}
                                <div className="ml-3 animate-spin rounded-full h-6 w-6 border-4 border-blue-400 border-t-transparent"></div>
                            </div>
                            <p className="text-base text-gray-600 mt-2">
                                Include all details: patient info, procedures, findings, etc.
                            </p>
                        </div>
                    )}

                    {showGeneratedForm && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-800 font-medium">
                                ✅ Form generated successfully! Review the fields below and make any necessary edits before submitting.
                            </p>
                        </div>
                    )}

                    {/* Loader at bottom border when generating */}
                    {isProcessing && (
                        <span
                            style={{
                                position: "absolute",
                                left: 0,
                                bottom: 0,
                                width: "100%",
                                height: "12px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "flex-end",
                                pointerEvents: "none",
                                zIndex: 10
                            }}
                        >
                            <span
                                style={{
                                    width: "0",
                                    height: "4.8px",
                                    display: "inline-block",
                                    position: "relative",
                                    background: "#FFF",
                                    boxShadow: "0 0 10px rgba(255,255,255,0.5)",
                                    boxSizing: "border-box",
                                    animation: "animFw 8s linear infinite"
                                }}
                            >
                                <style>
                                    {`
                                    @keyframes animFw {
                                        0% { width: 0; }
                                        100% { width: 100%; }
                                    }
                                    @keyframes coli1 {
                                        0% { transform: rotate(-45deg) translateX(0px); opacity: 0.7; }
                                        100% { transform: rotate(-45deg) translateX(-45px); opacity: 0; }
                                    }
                                    @keyframes coli2 {
                                        0% { transform: rotate(45deg) translateX(0px); opacity: 1; }
                                        100% { transform: rotate(45deg) translateX(-45px); opacity: 0.7; }
                                    }
                                    `}
                                </style>
                                <span
                                    style={{
                                        content: "''",
                                        width: "10px",
                                        height: "1px",
                                        background: "#FFF",
                                        position: "absolute",
                                        top: "9px",
                                        right: "-2px",
                                        opacity: 0,
                                        transform: "rotate(-45deg) translateX(0px)",
                                        boxSizing: "border-box",
                                        animation: "coli1 0.3s linear infinite"
                                    }}
                                ></span>
                                <span
                                    style={{
                                        content: "''",
                                        width: "10px",
                                        height: "1px",
                                        background: "#FFF",
                                        position: "absolute",
                                        top: "-4px",
                                        right: "-2px",
                                        opacity: 0,
                                        transform: "rotate(45deg) translateX(0px)",
                                        boxSizing: "border-box",
                                        animation: "coli2 0.3s linear infinite"
                                    }}
                                ></span>
                            </span>
                        </span>
                    )}
                </div>
            )}

            {!speechSupported && (
                <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800 flex items-center gap-2">
                        <span>⚠️</span>
                        Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari for voice dictation.
                    </p>
                </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {selectedCategory.fields.map((field, index) => {
                    const options = dropdownOptions[selectedCategory.name]?.[field.name] || null;

                    return (
                        <div key={index} className={`space-y-2 ${field.name.toLowerCase() === "notes" ? "col-span-1" : ""}`}>
                            <label className="block text-sm font-medium text-gray-700">
                                {field.name}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            
                            {field.type === "file" ? (
                                <>
                                    <input
                                        type="file"
                                        name={field.name}
                                        onChange={(e) => handleFileChange(e, field.name)}
                                        className="text-black w-full p-3 rounded-lg bg-white border-2 border-transparent focus:border-blue-400 outline-none transition-all duration-200"
                                        style={{
                                            boxShadow: "#cff0ff 0px 10px 10px -5px",
                                        }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Title (required)"
                                        name={`${field.name}_title`}
                                        onChange={handleChange}
                                        value={formData[`${field.name}_title`] || ""}
                                        required
                                        className="text-black w-full p-3 rounded-lg bg-white border-2 border-transparent focus:border-blue-400 outline-none transition-all duration-200"
                                        style={{
                                            boxShadow: "#cff0ff 0px 10px 10px -5px",
                                        }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Description (required)"
                                        name={`${field.name}_description`}
                                        onChange={handleChange}
                                        value={formData[`${field.name}_description`] || ""}
                                        required
                                        className="text-black w-full p-3 rounded-lg bg-white border-2 border-transparent focus:border-blue-400 outline-none transition-all duration-200"
                                        style={{
                                            boxShadow: "#cff0ff 0px 10px 10px -5px",
                                        }}
                                    />
                                </>
                            ) : options ? (
                                <select
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                    className="text-black w-full p-3 rounded-lg bg-white border-2 border-transparent focus:border-blue-400 outline-none transition-all duration-200"
                                    style={{
                                        boxShadow: "#cff0ff 0px 10px 10px -5px",
                                    }}
                                >
                                    <option value="">Select {field.name}</option>
                                    {options.map((option, idx) => (
                                        <option key={idx} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : field.name.toLowerCase() === "notes" ? (
                                <textarea
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                    placeholder={`Enter ${field.name}`}
                                    rows={5}
                                    className="text-black w-full p-3 rounded-lg bg-white border-2 border-transparent focus:border-blue-400 outline-none transition-all duration-200"
                                    style={{
                                        boxShadow: "#cff0ff 0px 10px 10px -5px",
                                        resize: "vertical",
                                        width: "100%",
                                        maxWidth: "100%"
                                    }}
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                    placeholder={`Enter ${field.name}`}
                                    className="text-black w-full p-3 rounded-lg bg-white border-2 border-transparent focus:border-blue-400 outline-none transition-all duration-200"
                                    style={{
                                        boxShadow: "#cff0ff 0px 10px 10px -5px",
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Custom Fields Section */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Custom Fields</h3>
                {customFields.map((field, index) => (
                    <div key={index} className="mb-4 p-4 bg-white rounded-lg border">
                        <div className="flex gap-3 mb-3">
                            <input
                                type="text"
                                value={field.name}
                                placeholder="Field Name"
                                onChange={(e) => updateCustomField(index, "name", e.target.value)}
                                className="flex-1 p-3 rounded-lg bg-white border-2 border-gray-200 focus:border-blue-400 outline-none transition-all duration-200"
                            />
                            <select
                                value={field.type}
                                onChange={(e) => updateCustomField(index, "type", e.target.value)}
                                className="p-3 rounded-lg bg-white border-2 border-gray-200 focus:border-blue-400 outline-none transition-all duration-200"
                            >
                                <option value="text">Text</option>
                                <option value="file">File</option>
                                <option value="number">Number</option>
                                <option value="date">Date</option>
                            </select>
                            <button
                                type="button"
                                onClick={() => deleteCustomField(index)}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                Remove
                            </button>
                        </div>

                        {field.name && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {field.name}
                                </label>
                                {field.type === "file" ? (
                                    <input
                                        type="file"
                                        name={field.name}
                                        onChange={(e) => handleFileChange(e, field.name)}
                                        className="w-full p-3 rounded-lg bg-white border-2 border-gray-200 focus:border-blue-400 outline-none transition-all duration-200"
                                    />
                                ) : (
                                    <input
                                        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                                        name={field.name}
                                        value={formData[field.name] || ""}
                                        onChange={handleChange}
                                        placeholder={`Enter ${field.name}`}
                                        className="w-full p-3 rounded-lg bg-white border-2 border-gray-200 focus:border-blue-400 outline-none transition-all duration-200"
                                    />
                                )}
                            </div>
                        )}
                    </div>
                ))}
                
                <button
                    type="button"
                    onClick={addCustomField}
                    className="w-full px-6 py-3 rounded-[16px] cursor-pointer flex justify-center items-center gap-1.5 mt-2 text-white font-semibold transition-transform duration-200 shadow-md"
                    style={{
                        background: "linear-gradient(45deg, #b3d9ff, #7ab8f5)",
                        boxShadow: "0 6px 12px rgba(122, 184, 245, 0.3)",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                >
                    + Add Custom Field
                </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
                <button
                    type="submit"
                    className=" px-6 py-3 rounded-[20px] cursor-pointer font-semibold text-white shadow-md transition-transform duration-200"
                    style={{
                        background: "linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)",
                        boxShadow: "rgba(133, 189, 215, 0.88) 0px 10px 15px -10px",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
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