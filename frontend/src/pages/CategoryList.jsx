import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("doctorLogbookCategories")) || [];
    setCategories(stored);
  }, []);

  const deleteCategory = (index) => {
    const updated = categories.filter((_, i) => i !== index);
    setCategories(updated);
    localStorage.setItem(
      "doctorLogbookCategories",
      JSON.stringify(updated)
    );
  };

  return (
    <div className="min-h-screen bg-[#eef7fd] px-6 py-10 flex justify-center">
      <div className="w-full max-w-3xl text-center">

        <h1 className="text-3xl font-bold text-blue-600 mb-3">
          Manage logbook categories
        </h1>

        <p className="text-gray-600 mb-10">
          You can change the name of a category and delete categories you no longer require.
        </p>

        {/* ADD CATEGORY */}
        <button
          onClick={() => navigate("/doctor/categories/add")}
          className="w-full py-4 mb-12 rounded-full
                     text-white font-semibold text-lg
                     bg-gradient-to-r from-blue-600 to-cyan-500
                     shadow-lg hover:opacity-90 transition"
        >
          Add additional category
        </button>

        {/* CATEGORY LIST */}
        <div className="space-y-6">
          {categories.map((cat, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-1 bg-white rounded-full px-6 py-4 shadow-md text-left">
                <p className="font-medium">{cat.name}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Fields: {cat.fields.join(", ")}
                </p>
              </div>

              <button
                onClick={() => deleteCategory(index)}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <FaTrash />
              </button>
            </div>
          ))}

          {categories.length === 0 && (
            <p className="text-gray-400">No categories added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
