import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCategory } from "../reducers/categoryReducer";
import Notification from "../Components/Notification";

const categories = [
  "Bone Marrow Reporting", "Clinical Events", "Clinics",
  "CUSIC", "General Surgery", "Echocardiograms",
  "Multi-Disciplinary Team Meetings", "O & G Ultrasound",
  "Radiology Reporting", "Research",
  "Thoracic Ultrasound", "Ward Rounds"
];

const AddCategory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state.auth?.user?.email);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryExists, setCategoryExists] = useState(false);
  const [fields, setFields] = useState([]);
  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "info",
  });

  const addField = () => {
    setFields([...fields, { name: "", type: "text" }]);
  };

  const updateField = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const handleDeleteField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  // ✅ FIXED SAVE HANDLER
  const handleSave = () => {
    if (!selectedCategory) {
      setNotification({
        isOpen: true,
        message: "Please select a category before saving.",
        type: "error",
      });
      return;
    }

    if (fields.some((field) => field.name.trim() === "")) {
      setNotification({
        isOpen: true,
        message: "Field names cannot be empty.",
        type: "error",
      });
      return;
    }

    dispatch(addCategory({ name: selectedCategory, fields, createdBy: userEmail }))
      .unwrap()
      .then(() => {
        setNotification({
          isOpen: true,
          message: "Category saved successfully!",
          type: "success",
        });

        // ✅ GO BACK TO CATEGORY LIST (DOCTOR)
        setTimeout(() => {
          navigate("/doctor/categories");
        }, 1500);
      })
      .catch((error) => {
        setNotification({
          isOpen: true,
          message: error,
          type: "error",
        });
      });
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-black">
      <Notification
        isOpen={notification.isOpen}
        onRequestClose={() =>
          setNotification({ ...notification, isOpen: false })
        }
        title="Notification"
        message={notification.message}
        type={notification.type}
      />

      <h2
        className="text-2xl font-bold mb-6 text-center"
        style={{ color: "rgb(16, 137, 211)", fontWeight: 900 }}
      >
        Add Category
      </h2>

      <label className="block mb-2 font-bold">Logbook category *</label>
      <select
        value={selectedCategory}
        onChange={async (e) => {
          const category = e.target.value;
          setSelectedCategory(category);

          if (category) {
            const response = await fetch(
              `https://medlogbook-website.onrender.com/api/category/exists?name=${encodeURIComponent(
                category
              )}&email=${encodeURIComponent(userEmail)}`
            );
            const data = await response.json();
            setCategoryExists(data.exists);
          }
        }}
        className="w-full p-4 rounded-xl bg-white shadow mb-4"
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {!categoryExists && (
        <>
          <h3 className="font-semibold mt-4 mb-2">Define Fields</h3>

          {fields.map((field, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Field name"
                value={field.name}
                onChange={(e) =>
                  updateField(index, "name", e.target.value)
                }
                className="flex-1 p-3 rounded-xl shadow"
              />

              <select
                value={field.type}
                onChange={(e) =>
                  updateField(index, "type", e.target.value)
                }
                className="p-3 rounded-xl"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="file">File</option>
              </select>

              <button
                onClick={() => handleDeleteField(index)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          ))}

          <button
            onClick={addField}
            className="w-full py-3 mt-2 rounded-xl text-white font-semibold"
            style={{
              background:
                "linear-gradient(45deg, rgb(16,137,211), rgb(18,177,209))",
            }}
          >
            + Add Field
          </button>
        </>
      )}

      <div className="flex gap-4 mt-6">
        {/* ✅ FIXED CANCEL */}
        <button
          onClick={() => navigate("/doctor/categories")}
          className="w-1/2 py-3 rounded-xl bg-gray-300"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          className="w-1/2 py-3 rounded-xl text-white"
          style={{
            background:
              "linear-gradient(45deg, #0a8fb6, #0fb9d8)",
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddCategory;
