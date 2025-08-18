import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import Notification from "../Components/Notification";

const DynamicCategoryForm = () => {
    const { category } = useParams();
    const categories = useSelector((state) => state.category.categories || []);
    const userEmail = useSelector((state) => state.auth.user?.email);
    const [customFields, setCustomFields] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({});
    const [fileInputs, setFileInputs] = useState({});
    const [notification, setNotification] = useState({ isOpen: false, message: "", type: "info" });
    const [isListening, setIsListening] = useState(false);
    const [speechText, setSpeechText] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(false);
    const [showGeneratedForm, setShowGeneratedForm] = useState(false);
    const recognitionRef = useRef(null);

    // ... DropdownOptions, speech recognition hooks, etc. unchanged ...

    useEffect(() => {
        if (!category || !categories.length) return;
        const normalizedCategory = category.trim().toLowerCase();
        const foundCategory = categories.find((c) => c.name?.trim().toLowerCase() === normalizedCategory);
        if (foundCategory) {
            const updatedCategory = { ...foundCategory, _id: foundCategory.id || foundCategory._id };
            setSelectedCategory(updatedCategory);
            if (!showGeneratedForm) {
                const initialFormData = updatedCategory.fields.reduce((acc, field) => {
                    acc[field.name] = field.type === "file" ? null : "";
                    return acc;
                }, {});
                initialFormData.categoryId = updatedCategory._id; // In case backend expects
                setFormData(initialFormData);
            }
        }
    }, [categories, category, showGeneratedForm]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleFileChange = (e, fieldName) => {
        setFileInputs({ ...fileInputs, [fieldName]: e.target.files[0] });
    };

    // Custom field management omitted for brevity, remain unchanged

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
                formDataToSend,
                { headers: { "Content-Type": "multipart/form-data" } }
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
        <form onSubmit={handleSubmit} className="text-black font-semibold relative max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-6"
                style={{
                    textAlign: "center",
                    fontWeight: 900,
                    fontSize: "30px",
                    color: "rgb(16, 137, 211)"
                }}>{selectedCategory.name} Form</h2>
            {/* ... rest of your fields, voice section, and custom fields rendering ... */}
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
