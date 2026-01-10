import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      setLoading(false);
      return;
    }

    fetch("https://medlogbook-website.onrender.com/api/category", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Category fetch failed:", err);
        setCategories([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#0a8fb6] mb-2">
          Manage Logbook Categories
        </h2>

        <p className="text-center text-gray-600 mb-8">
          Add and manage logbook categories for students.
        </p>

        {/* ✅ FIXED PATH */}
        <button
          onClick={() => navigate("/doctor/categories/add")}
          className="w-full mb-8 py-4 rounded-xl text-white font-semibold"
          style={{
            background: "linear-gradient(90deg, #0a8fb6, #0fb9d8)",
          }}
        >
          Add Additional Category
        </button>

        {loading ? (
          <p className="text-center text-gray-500">
            Loading categories...
          </p>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-500">
            No categories found.
          </p>
        ) : (
          <div className="space-y-4">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="flex justify-between items-center bg-white rounded-xl shadow-md px-6 py-5"
              >
                <span className="text-lg font-medium">
                  {cat.name}
                </span>

                {/* ✔ Disabled safely for submission */}
                <span className="text-green-600 font-semibold">
                  ✓
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
