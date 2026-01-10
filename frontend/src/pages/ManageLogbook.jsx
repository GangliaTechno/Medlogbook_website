import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Notification from "../Components/Notification";

const ManageLogbook = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [editedCategories, setEditedCategories] = useState({});
  const [notification, setNotification] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const navigate = useNavigate();
  const userEmail = useSelector((state) => state.auth?.user?.email);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `https://medlogbook-website.onrender.com/api/category/all?email=${encodeURIComponent(
            userEmail
          )}`
        );
        setCategoryList(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (userEmail) fetchCategories();
  }, [userEmail]);

  // Delete category
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(
        `https://medlogbook-website.onrender.com/api/category/delete/${id}`
      );
      setCategoryList(categoryList.filter((c) => c._id !== id));
      setNotification({
        isOpen: true,
        title: "Success",
        message: "Category deleted successfully!",
        type: "success",
      });
    } catch (error) {
      setNotification({
        isOpen: true,
        title: "Error",
        message: "Failed to delete category.",
        type: "error",
      });
    }
  };

  // Edit category
  const handleEdit = (id, newName) => {
    setEditedCategories({ ...editedCategories, [id]: newName });
  };

  // Save category
  const handleSave = async (id, e) => {
    e.stopPropagation();
    try {
      const updatedName = editedCategories[id];
      await axios.put(
        `https://medlogbook-website.onrender.com/api/category/update/${id}`,
        { name: updatedName }
      );
      setCategoryList(
        categoryList.map((category) =>
          category._id === id
            ? { ...category, name: updatedName }
            : category
        )
      );
      setNotification({
        isOpen: true,
        title: "Success",
        message: "Category updated successfully!",
        type: "success",
      });
    } catch (error) {
      setNotification({
        isOpen: true,
        title: "Error",
        message: "Failed to update category.",
        type: "error",
      });
    }
  };

  return (
    /* 🔹 CENTERING WRAPPER (LAYOUT FIX) */
    <div className="w-full flex justify-center text-black">
      <div style={styles.container}>
        <h2
          className="text-2xl font-bold mb-6"
          style={{
            textAlign: "center",
            fontWeight: 900,
            fontSize: "30px",
            color: "rgb(16, 137, 211)",
          }}
        >
          Manage logbook categories
        </h2>

        <p className="text-center mb-4 text-teal-700">
          You can change the name of a category and delete categories you no
          longer require.
        </p>

        {/* Add category button */}
        <button
          onClick={() => navigate("/doctor/categories/add")}
          style={{
            display: "block",
            width: "100%",
            fontWeight: "bold",
            background:
              "linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)",
            color: "white",
            paddingBlock: "15px",
            margin: "20px auto",
            borderRadius: "20px",
            boxShadow:
              "rgba(133, 189, 215, 0.88) 0px 20px 10px -15px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add additional category
        </button>

        {/* Category list */}
        <div style={styles.categoryList}>
          {categoryList.map((category) => (
            <div key={category._id} style={styles.categoryItem}>
              <input
                type="text"
                value={editedCategories[category._id] ?? category.name}
                onChange={(e) =>
                  handleEdit(category._id, e.target.value)
                }
                style={styles.input}
              />

              <button
                style={styles.actionButton}
                onClick={(e) => handleSave(category._id, e)}
              >
                ✔️
              </button>

              <button
                style={styles.actionButton}
                onClick={(e) => handleDelete(category._id, e)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {/* Notification */}
        <Notification
          isOpen={notification.isOpen}
          onRequestClose={() =>
            setNotification({ ...notification, isOpen: false })
          }
          title={notification.title}
          message={notification.message}
          type={notification.type}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    width: "100%",
    maxWidth: "700px", // 👈 centered width
  },
  categoryList: {
    display: "flex",
    flexDirection: "column",
  },
  categoryItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "12px",
  },
  input: {
    flexGrow: 1,
    padding: "15px 20px",
    borderRadius: "20px",
    border: "none",
    boxShadow: "#cff0ff 0px 10px 10px -5px",
    outline: "none",
  },
  actionButton: {
    fontSize: "16px",
    cursor: "pointer",
    background: "transparent",
    border: "none",
  },
};

export default ManageLogbook;
