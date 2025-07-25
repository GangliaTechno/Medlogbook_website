import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "axios";
import Notification from "../Components/Notification";

const ManageLogbook = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [editedCategories, setEditedCategories] = useState({});
  const [notification, setNotification] = useState({ isOpen: false, title: "", message: "", type: "info" });
  const navigate = useNavigate();
  const userEmail = useSelector((state) => state.auth?.user?.email);

  // ✅ Fetch categories from backend instead of localStorage
  useEffect(() => {
    //const userEmail = useSelector((state) => state.auth?.user?.email); // Get logged-in user's email

const fetchCategories = async () => {
  try {
    const response = await axios.get(`https://medlogbook-website.onrender.com/api/category/all?email=${encodeURIComponent(userEmail)}`);

        setCategoryList(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // ✅ Delete category from backend
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    setNotification({ isOpen: true, title: "Info", message: `Deleting category with ID: ${id}`, type: "info" }); 
  
    try {
      const response = await axios.delete(`https://medlogbook-website.onrender.com/api/category/delete/${id}`);
      console.log("Delete response:", response.data);
      setNotification({ isOpen: true, title: "Success", message: "Category deleted successfully!", type: "success" });
      
      // Remove category from the state
      setCategoryList(categoryList.filter((category) => category._id !== id));
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to delete category. Please try again.";
      setNotification({ isOpen: true, title: "Error", message: errorMessage, type: "error" });
    }
  };
  

  // ✅ Update category name in frontend state
  const handleEdit = (id, newName) => {
    setEditedCategories({ ...editedCategories, [id]: newName });
  };

  // ✅ Save updated category name to backend
  const handleSave = async (id, e) => {
    e.stopPropagation();
    try {
      const updatedName = editedCategories[id];
      await axios.put(`https://medlogbook-website.onrender.com/api/category/update/${id}`, { name: updatedName });
      setCategoryList(
        categoryList.map((category) =>
          category._id === id ? { ...category, name: updatedName } : category
        )
      );
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div style={styles.container} className="text-black">
      
      <h2 className="text-2xl font-bold text-blue-600 mb-6"
      style={{
    textAlign: "center",
    fontWeight: 900,
    fontSize: "30px",
    color: "rgb(16, 137, 211)"
  }}>Manage logbook categories</h2>
      <p className="text-center mb-2 text-teal-700">
        You can change the name of a category and delete categories you no longer require.
      </p>
      <button style={{
    display: "block",
    width: "100%",
    fontWeight: "bold",
    background: "linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)",
    color: "white",
    paddingBlock: "15px",
    margin: "20px auto",
    borderRadius: "20px",
    boxShadow: "rgba(133, 189, 215, 0.8784313725) 0px 20px 10px -15px",
    border: "none",
    transition: "all 0.2s ease-in-out",
    cursor: "pointer"
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "scale(1.03)";
    e.currentTarget.style.boxShadow = "rgba(133, 189, 215, 0.8784313725) 0px 23px 10px -20px";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "rgba(133, 189, 215, 0.8784313725) 0px 20px 10px -15px";
  }}
  onMouseDown={(e) => {
    e.currentTarget.style.transform = "scale(0.95)";
    e.currentTarget.style.boxShadow = "rgba(133, 189, 215, 0.8784313725) 0px 15px 10px -10px";
  }}
  onMouseUp={(e) => {
    e.currentTarget.style.transform = "scale(1.03)";
    e.currentTarget.style.boxShadow = "rgba(133, 189, 215, 0.8784313725) 0px 23px 10px -20px";
  }} className="w-full p-4 bg-[#008080] font-semibold rounded-md cursor-pointer transition delay-300 hover:#015b5b" onClick={() => navigate("/add-category")}>
        Add additional category
      </button>
      <div style={styles.categoryList}>
        {categoryList.map((category) => (
          <div key={category._id} style={styles.categoryItem}>
            <input
              type="text"
              value={editedCategories[category._id] ?? category.name}
              onChange={(e) => handleEdit(category._id, e.target.value)}
              style={{
    width: "100%",
    background: "white",
    border: "none",
    padding: "15px 20px",
    borderRadius: "20px",
    marginTop: "10px",
    boxShadow: "#cff0ff 0px 10px 10px -5px",
    borderInline: "2px solid transparent",
    color: "#000",
    outline: "none",
    fontSize: "14px"
  }}
  onFocus={(e) =>
    (e.target.style.borderInline = "2px solid #12b1d1")
  }
  onBlur={(e) =>
    (e.target.style.borderInline = "2px solid transparent")
  }
            />
            <button style={{ ...styles.button, ...styles.saveButton }} onClick={(e) => handleSave(category._id, e)}>
              ✔️
            </button>
            <button style={{ ...styles.button, ...styles.deleteButton }} onClick={(e) => handleDelete(category._id, e)}>
              🗑️
            </button>
          </div>
        ))}
      </div>

       {/* Notification Modal */}
            <Notification
              isOpen={notification.isOpen}
              onRequestClose={() => setNotification({ ...notification, isOpen: false })}
              title={notification.title}
              message={notification.message}
              type={notification.type}
            />
    </div>
  );
};

// ✅ Keeping your original styles
const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  addButton: {
    display: "block",
    marginBottom: "15px",
    padding: "8px 12px",
    fontSize: "14px",
    cursor: "pointer",
  },
  categoryList: {
    display: "flex",
    flexDirection: "column",
    
  },
  categoryItem: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "15px",
    minWidth: "400px",
    
    borderRadius: "8px",
  },
  input: {
    flexGrow: 1,
    padding: "8px",
    fontSize: "16px",
  },
  button: {
    fontSize: "14px",
    padding: "5px 8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "transparent",
  },
  saveButton: {
    right: "40px",
  },
  deleteButton: {
    right: "10px",
  },
};

export default ManageLogbook;
