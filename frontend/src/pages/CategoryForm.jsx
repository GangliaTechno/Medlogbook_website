
// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const CategoryForm = () => {
//   const { category } = useParams();
//   const navigate = useNavigate();
//   const [fields, setFields] = useState([{ name: "", type: "text" }]);

//   const addField = () => {
//     setFields([...fields, { name: "", type: "text" }]);
//   };

//   const updateField = (index, key, value) => {
//     const updatedFields = [...fields];
//     updatedFields[index][key] = value;
//     setFields(updatedFields);
//   };

//   const saveFields = () => {
//     console.log("Saved Fields:", fields);
  
//     // ✅ Store category in localStorage
//     const storedCategories = JSON.parse(localStorage.getItem("categories")) || [];
//     if (!storedCategories.includes(category)) {
//       storedCategories.push(category);
//       localStorage.setItem("categories", JSON.stringify(storedCategories));
//     }
  
//     // ✅ Store fields in localStorage
//     const storedForms = JSON.parse(localStorage.getItem("formFields")) || {};
//     storedForms[category] = fields;
//     localStorage.setItem("formFields", JSON.stringify(storedForms));
  
//     alert("Fields saved successfully!");
//     navigate("/logbook");  // ✅ Redirect to LogbookPage
//   };
  

//   return (
//     <div style={styles.container}>
//       <h2>Category Form</h2>
//       <p>Category Name: <strong>{category}</strong></p>

//       {fields.map((field, index) => (
//         <div key={index} style={styles.fieldRow}>
//           <input
//             type="text"
//             placeholder="Enter field name"
//             value={field.name}
//             onChange={(e) => updateField(index, "name", e.target.value)}
//             style={styles.input}
//           />
//           <select
//             value={field.type}
//             onChange={(e) => updateField(index, "type", e.target.value)}
//             style={styles.select}
//           >
//             <option value="text">Text</option>
//             <option value="date">Date</option>
//             <option value="number">Number</option>
//             <option value="file">File</option>
//           </select>
//         </div>
//       ))}

//       <button style={styles.addButton} onClick={addField}>+ Add Field</button>
//       <button style={styles.saveButton} onClick={saveFields}>Save</button>
//       <button style={styles.backButton} onClick={() => navigate(-1)}>Back</button>
//     </div>
//   );
// };

// // ✅ Adding the missing `styles` object
// const styles = {
//   container: { padding: "20px", maxWidth: "700px", margin: "0 auto", textAlign: "center" },
//   fieldRow: { display: "flex", gap: "15px", marginBottom: "15px", alignItems: "center" },
//   input: { flex: "3", padding: "14px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px" },
//   select: { flex: "2", padding: "14px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px" },
//   addButton: { margin: "10px 5px", padding: "12px", background: "#4CAF50", color: "white", cursor: "pointer", border: "none", borderRadius: "8px" },
//   saveButton: { margin: "10px 5px", padding: "12px", background: "teal", color: "white", cursor: "pointer", border: "none", borderRadius: "8px" },
//   backButton: { margin: "10px 5px", padding: "12px", background: "#ccc", cursor: "pointer", border: "none", borderRadius: "8px" }
// };

// export default CategoryForm;


import React from "react";
import { useParams } from "react-router-dom";
import DynamicCategoryForm from "../Components/DynamicCategoryForm";

const CategoryForm = () => {
  const { category } = useParams();

  if (!category) {
    return <p className="text-center mt-10">No category selected</p>;
  }

  return (
    <div className="bg-white min-h-screen p-8">
      <h2 className="text-2xl font-bold mb-4">Category Form</h2>
      <p className="mb-6">
        Category Name: <strong>{category}</strong>
      </p>

      <DynamicCategoryForm categoryName={category} />
    </div>
  );
};

export default CategoryForm;
