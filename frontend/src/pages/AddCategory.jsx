import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CATEGORY_OPTIONS = [
  "Bone Marrow Reporting",
  "Clinical Events",
  "Clinics",
  "CUSIC",
  "General Surgery",
  "Echocardiograms",
  "Multi-Disciplinary Team Meetings",
  "O & G Ultrasound",
  "Radiology Reporting",
  "Research",
  "Thoracic Ultrasound",
  "Ward Rounds",
];

const AddCategory = () => {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [fields, setFields] = useState([]);
  const [fieldInput, setFieldInput] = useState("");

  const addField = () => {
    if (!fieldInput.trim()) return;
    setFields([...fields, fieldInput.trim()]);
    setFieldInput("");
  };

  const saveCategory = () => {
    if (!selectedCategory) {
      alert("Please select a logbook category");
      return;
    }

    const stored =
      JSON.parse(localStorage.getItem("doctorLogbookCategories")) || [];

    // prevent duplicates
    if (stored.some((c) => c.name === selectedCategory)) {
      alert("This category already exists");
      return;
    }

    stored.push({
      name: selectedCategory,
      fields,
    });

    localStorage.setItem(
      "doctorLogbookCategories",
      JSON.stringify(stored)
    );

    navigate("/doctor/categories");
  };

  return (
    <div className="min-h-screen bg-[#eef7fd] px-4 py-6 md:px-6 md:py-10 flex justify-center">
      <div className="w-full max-w-3xl text-center">

        <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4">
          Add Category
        </h1>

        <p className="text-gray-600 mb-8">
          Logbook categories help you organize your logbook.
        </p>

        {/* CATEGORY DROPDOWN */}
        <div className="text-left mb-2 font-semibold">
          Logbook category *
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-6 py-4 rounded-full shadow-md outline-none mb-8 bg-white appearance-none"
        >
          <option value="">Select a category</option>
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* DEFINE FIELDS */}
        <div className="text-left mb-4 font-semibold">
          Define Fields
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            value={fieldInput}
            onChange={(e) => setFieldInput(e.target.value)}
            placeholder="Enter field name"
            className="flex-1 px-6 py-3 rounded-full shadow outline-none w-full"
          />
          <button
            onClick={addField}
            className="px-6 py-3 md:py-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500
                       text-white font-semibold shadow w-full md:w-auto hover:opacity-90 transition-opacity"
          >
            Add
          </button>
        </div>

        {/* FIELD LIST */}
        <div className="flex flex-wrap gap-3 mb-10 justify-start">
          {fields.map((field, index) => (
            <div
              key={index}
              className="bg-white px-5 py-2 rounded-full shadow text-sm break-all"
            >
              {field}
            </div>
          ))}

          {fields.length === 0 && (
            <p className="text-gray-400 text-sm">
              No fields added yet
            </p>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={() => navigate("/doctor/categories")}
            className="flex-1 py-4 rounded-lg bg-blue-300 text-white font-semibold hover:bg-blue-400 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={saveCategory}
            className="flex-1 py-4 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
