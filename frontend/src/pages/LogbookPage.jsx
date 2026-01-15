import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import LogbookCategory from "../Components/logbookCategory";
import { FaClipboardList } from "react-icons/fa";
import axios from "axios";
import studentPanelBg from "../assets/studentPanelBg.png";

const LogbookPage = () => {
  const userEmail = useSelector((state) => state.auth?.user?.email);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userEmail) return;

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `https://medlogbook-website.onrender.com/api/category/all?email=${encodeURIComponent(
            userEmail
          )}`
        );

        const fetchedCategories = response.data.map((category) => ({
          name: category.name,
          description: `Manage ${category.name} log entries`,
          icon: <FaClipboardList />,
          route: `/logbook/${category.name}`,
        }));

        setCategoryList(fetchedCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err.message || "Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [userEmail]);

  return (
    <div
      className="
        w-full
        pt-20
        px-4
        pb-10
        sm:pt-8
        sm:px-6
        lg:px-10
        min-h-screen
      "
      style={{
        backgroundImage: `url(${studentPanelBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="space-y-8 sm:space-y-10">

        {/* HEADER */}
        <header className="border-b border-slate-100 pb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 tracking-tight">
            Clinical Logbook
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Access and manage your clinical logbook categories. Entries from
            previous jobs are stored separately but can be combined for reporting.
          </p>
        </header>

        {/* ERROR STATE */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 font-medium animate-pulse">
              Loading logbooks...
            </p>
          </div>
        ) : (
          /* Cards Grid */
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-3
              gap-4
              sm:gap-6
            "
          >
            {categoryList.length > 0 ? (
              categoryList.map((category, index) => (
                <LogbookCategory
                  key={index}
                  icon={category.icon}
                  title={category.name}
                  description={category.description}
                  route={category.route}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-200 border-dashed">
                <p className="text-slate-500">No categories available.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogbookPage;