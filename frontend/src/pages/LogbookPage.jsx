import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LogbookCategory from "../Components/logbookCategory";
import { FaClipboardList, FaChevronRight } from "react-icons/fa"; 
import axios from "axios";

const LogbookPage = () => {
  const navigate = useNavigate();
  const userEmail = useSelector((state) => state.auth?.user?.email);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `https://medlogbook-website.onrender.com/api/category/all?email=${encodeURIComponent(userEmail)}`
        );

        const categories = response.data.map((category) => ({
          name: category.name,
          description: `Manage ${category.name}`,
          icon: <FaClipboardList />,
          route: `/generated-form/${category.name}`,
        }));
        setCategoryList(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (

    <div className="h-screen flex flex-col text-black p-8">
      {/* Scrollable content */}
      <div className="flex-grow overflow-y-auto max-w-7xl w-full mx-auto">
        
        <h2 className="text-2xl font-bold text-blue-600 mb-6"
      style={{
    textAlign: "center",
    fontWeight: 900,
    fontSize: "30px",
    color: "rgb(16, 137, 211)"
  }}> Welcome to your new logbook!</h2>
        <p className="text-gray-900 text-center mb-8 max-w-4xl mx-auto">
          Log entries you've made in previous jobs are filed separately, and can be accessed and added via the jobs page. 
          Logbooks from multiple jobs can still be combined to produce reports on the Reports page.
        </p>

        {/* Dynamic category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-black">
          {categoryList.map((category, index) => (
            <LogbookCategory
              key={index}
              icon={category.icon}
              title={category.name}
              description={category.description}
              route={category.route}
            />
          ))}
        </div>
      </div>

      {/* Fixed bottom section */}
      {/*<div className="mt-auto max-w-8xl w-full mx-auto mb-20">
        <div
          onClick={() => navigate("/manage-logbook")}
          className="flex items-center cursor-pointer text-blue-400 hover:text-blue-200 font-medium mb-2"
        >
          <FaChevronRight className="mr-2" />
          <h3>Manage logbook categories</h3>
        </div>

        <p className="text-sm text-gray-400 max-w-3xl text-left">
          You can opt into one of our growing list of other, more specialist, logbook categories at any time using the 
          "Add category" button on the category picker. If you have any questions, please contact us via email.
        </p>
      </div>*/}

    </div>
  );
};

export default LogbookPage;
