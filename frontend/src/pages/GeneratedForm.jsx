// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";

// const GeneratedForm = () => {
//   const { category } = useParams(); // Get category name from URL
//   const [fields, setFields] = useState([]);

//   useEffect(() => {
//     // ✅ Retrieve stored fields for this category
//     const storedForms = JSON.parse(localStorage.getItem("formFields")) || {};
//     if (storedForms[category]) {
//       setFields(storedForms[category]);
//     }
//   }, [category]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert("Form submitted successfully!");
//   };

//   return (
//     <div style={styles.container}>
//       <h2>{category} Form</h2>
//       <form onSubmit={handleSubmit}>
//         {fields.length > 0 ? (
//           fields.map((field, index) => (
//             <div key={index} style={styles.fieldContainer}>
//               <label>{field.name}</label>
//               {field.type === "text" && <input type="text" style={styles.input} />}
//               {field.type === "number" && <input type="number" style={styles.input} />}
//               {field.type === "date" && <input type="date" style={styles.input} />}
//               {field.type === "file" && <input type="file" style={styles.input} />}
//             </div>
//           ))
//         ) : (
//           <p>No fields available for this category.</p>
//         )}

//         <button type="submit" style={styles.submitButton}>Submit</button>
//       </form>
//     </div>
//   );
// };

// // ✅ Basic styles
// const styles = {
//   container: { padding: "20px", maxWidth: "500px", margin: "0 auto", textAlign: "center" },
//   fieldContainer: { marginBottom: "15px" },
//   input: { width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" },
//   submitButton: { padding: "10px 15px", background: "teal", color: "white", cursor: "pointer" },
// };

// export default GeneratedForm;


// import React, { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCategories } from "../reducers/categoryReducer"; // Import Redux action
// import DynamicCategoryForm from "../Components/DynamicCategoryForm";

// const GeneratedForm = () => {
//   const { category } = useParams(); // Get category name from URL
//   const dispatch = useDispatch();
//   const categories = useSelector((state) => state.category.categories);
//   const loading = useSelector((state) => state.category.loading);
//   const error = useSelector((state) => state.category.error);

//   // Fetch categories when component mounts (if not already available)
//   useEffect(() => {
//     if (categories.length === 0) {
//       dispatch(fetchCategories());
//     }
//   }, [dispatch, categories]);

//   console.log("Category from URL:", category);
//   console.log("Redux Categories:", categories);

//   // Find the selected category from Redux state
//   const selectedCategory = categories.find((cat) => cat.name === category);

//   return (
//     <div style={styles.container}>
//       {/* <h2>{category} Form</h2> */}

//       {loading ? (
//         <p>Loading form fields...</p>
//       ) : error ? (
//         <p>Error loading categories: {error}</p>
//       ) : !selectedCategory ? (
//         <p>Category not found.</p>
//       ) : (
//         <DynamicCategoryForm categoryName={category} />
//       )}
//     </div>
//   );
// };

// // ✅ Basic styles
// const styles = {
//   container: { padding: "20px", maxWidth: "500px", margin: "0 auto", textAlign: "center" },
// };

// export default GeneratedForm;
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../reducers/categoryReducer";
import DynamicCategoryForm from "../Components/DynamicCategoryForm";

const GeneratedForm = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state.auth?.user?.email); // ✅ Get email from auth
  const categories = useSelector((state) => state.category.categories);
  const loading = useSelector((state) => state.category.loading);
  const error = useSelector((state) => state.category.error);

  useEffect(() => {
    if (categories.length === 0 && userEmail) {
      dispatch(fetchCategories(userEmail)); // ✅ Pass email
    }
  }, [dispatch, categories.length, userEmail]);

  const selectedCategory = categories.find((cat) => cat.name === category);

  return (
    <div style={styles.container}>
      {loading ? (
        <p>Loading form fields...</p>
      ) : error ? (
        <p>Error loading categories: {error}</p>
      ) : !selectedCategory ? (
        <p>Category not found.</p>
      ) : (
        <DynamicCategoryForm categoryName={category} className="text-black" />
      )}
    
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    maxWidth: "1200px",
    margin: "40px auto",
    width: "100%",
    borderRadius: "30px",
    color: "black",
    background: "linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(219, 239, 245) 100%)",
    border: "5px solid rgb(255, 255, 255)",
    boxShadow: "rgba(133, 189, 215, 0.88) 0px 30px 30px -20px",
  },
};


export default GeneratedForm;
