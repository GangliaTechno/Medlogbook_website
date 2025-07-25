// // import React, { useState, useEffect } from 'react';
// // import { useSelector } from 'react-redux';

// // const GoalProgression = () => {
// //   const student = useSelector((state) => state.auth.user);
// //   const [goals, setGoals] = useState([]);

// // useEffect(() => {
// //   const fetchTasks = async () => {
// //     try {
// //       if (student && student.specialty) {
// //         const response = await fetch(`http://localhost:5000/api/tasks?specialty=${student.specialty}`);
        
// //         if (!response.ok) {
// //           const errorData = await response.json();
// //           console.error("Backend error:", errorData);
// //           return;
// //         }
        
// //         const data = await response.json();
        
// //         // Ensure data is an array
// //         if (Array.isArray(data)) {
// //           const formattedTasks = data.map((task) => ({
// //             title: task.title,
// //             description: task.description,
// //             priority: task.priority,
// //             targetDate: task.targetDate,
// //             department: task.department,
// //           }));

// //           setGoals(formattedTasks);
// //         } else {
// //           console.error("Unexpected response format:", data);
// //         }
// //       }
// //     } catch (error) {
// //       console.error("Error fetching tasks:", error);
// //     }
// //   };

// //   fetchTasks();
// // }, [student]);


// //   return (
// //     <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-10">
// //       <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">Goal Progression</h1>

// //       {/* Add Goal Form */}
// //       <div className="mb-10">
// //         <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">Add New Goal</h2>
// //         <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //           <div>
// //             <label className="block font-medium mb-1">Goal Title</label>
// //             <input type="text" placeholder="e.g., Take 10 patient histories"
// //               className="w-full p-2 border border-gray-300 rounded-xl" />
// //           </div>

// //           <div>
// //             <label className="block font-medium mb-1">Department</label>
// //             <select className="w-full p-2 border border-gray-300 rounded-xl">
// //               <option>Neurology</option>
// //               <option>surgery</option>
// //               <option>Cardiology</option>
// //               <option>Orthopedics</option>
// //               <option>Radiology</option>
// //               <option>Pediatrics</option>
// //             </select>
// //           </div>

// //           <div>
// //             <label className="block font-medium mb-1">Target Date</label>
// //             <input type="date" className="w-full p-2 border border-gray-300 rounded-xl" />
// //           </div>

// //           <div>
// //             <label className="block font-medium mb-1">Priority</label>
// //             <select className="w-full p-2 border border-gray-300 rounded-xl">
// //               <option>High</option>
// //               <option>Medium</option>
// //               <option>Low</option>
// //             </select>
// //           </div>

// //           <div className="md:col-span-2">
// //             <label className="block font-medium mb-1">Description</label>
// //             <textarea rows="3" className="w-full p-2 border border-gray-300 rounded-xl"
// //               placeholder="Optional description..."></textarea>
// //           </div>

// //           <div className="md:col-span-2 text-center">
// //             <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-xl">
// //               Add Goal
// //             </button>
// //           </div>
// //         </form>
// //       </div>

// // {/* Goal Table */}
// // <div className="mb-10">
// //   <h2 className="text-2xl font-semibold text-blue-700 text-center mb-4">Current Goals</h2>
// //   <div className="overflow-x-auto">
// //     <table className="min-w-full text-sm text-center border border-gray-300">
// //       <thead className="bg-blue-700 text-white">
// //         <tr>
// //           <th className="py-2 px-4">Goal Title</th>
// //           <th className="py-2 px-4">Description</th>
// //           <th className="py-2 px-4">Priority</th>
// //           <th className="py-2 px-4">Target Date</th>
// //           <th className="py-2 px-4">Department</th>
// //         </tr>
// //       </thead>
// //       <tbody>
// //         {goals.length > 0 ? (
// //           goals.map((goal, index) => (
// //             <tr key={index} className="border-b">
// //               <td className="py-2 px-4">{goal.title}</td>
// //               <td className="py-2 px-4">{goal.description}</td>
// //               <td className="py-2 px-4">{goal.priority}</td>
// //               <td className="py-2 px-4">{new Date(goal.targetDate).toLocaleDateString()}</td>
// //               <td className="py-2 px-4">{goal.department}</td>
// //             </tr>
// //           ))
// //         ) : (
// //           <tr>
// //             <td colSpan="5" className="py-4 text-gray-500">No goals found for your specialty.</td>
// //           </tr>
// //         )}
// //       </tbody>
// //     </table>
// //   </div>
// // </div>


// //       {/* Weekly Reflection */}
// //       <div>
// //         <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">Weekly Reflection</h2>
// //         <form className="grid gap-4">
// //           <div>
// //             <label className="block font-medium mb-1">Select Week</label>
// //             <select className="w-full p-2 border border-gray-300 rounded-xl">
// //               <option>Week 1</option>
// //               <option>Week 2</option>
// //               <option>Week 3</option>
// //               <option>Week 4</option>
// //             </select>
// //           </div>

// //           <div>
// //             <label className="block font-medium mb-1">Reflection</label>
// //             <textarea rows="4" className="w-full p-2 border border-gray-300 rounded-xl"
// //               placeholder="Write about what you learned or faced this week..."></textarea>
// //           </div>

// //           <div className="text-center">
// //             <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-xl">
// //               Submit Reflection
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default GoalProgression;
// // import React, { useState } from 'react';
// // import axios from 'axios';

// // const specialties = [
// //   "Allergy", "Cardiology", "Dermatology", "Emergency medicine", 
// //   "Oncology", "Pediatrics", "Neurology"
// // ];

// // function GoalProgression() {
// //   const [selectedSpecialty, setSelectedSpecialty] = useState('');
// //   const [resources, setResources] = useState('');
// //   const [loading, setLoading] = useState(false);

// //   const handleSubmit = async () => {
// //     if (!selectedSpecialty) return;
// //     setLoading(true);
// //     try {
// //       // const res = await axios.post('/api/goal/suggest', { speciality: selectedSpecialty });
// //       const res = await axios.post('http://localhost:5000/api/suggest-courses', { specialty: selectedSpecialty });

// //       setResources(res.data.suggestions);
// //     } catch (err) {
// //       console.error(err);
// //       setResources('Failed to fetch suggestions.');
// //     }
// //     setLoading(false);
// //   };

// //   return (
// //     <div style={{ padding: '2rem' }}>
// //       <h2>Goal Progression</h2>
// //       <select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)}>
// //         <option value="">Select a Specialty</option>
// //         {specialties.map((s, i) => <option key={i} value={s}>{s}</option>)}
// //       </select>
// //       <button onClick={handleSubmit} disabled={loading} style={{ marginLeft: '1rem' }}>
// //         {loading ? 'Loading...' : 'Get Suggestions'}
// //       </button>
// // <div style={{ marginTop: '2rem', whiteSpace: 'pre-wrap' }}>
// //   {resources && (
// //     <div>
// //       <h3>Suggested Courses:</h3>
// //       {resources.split('\n').map((line, idx) => (
// //         <p key={idx}>{line}</p>
// //       ))}
// //     </div>
// //   )}
// // </div>

// //     </div>
// //   );
// // }

// // export default GoalProgression;
// import React, { useState } from 'react';
// import axios from 'axios';

// const specialties = [
//   "Allergy", "Cardiology", "Dermatology", "Emergency medicine",
//   "Oncology", "Pediatrics", "Neurology"
// ];

// function GoalProgression() {
//   const [selectedSpecialty, setSelectedSpecialty] = useState('');
//   const [resources, setResources] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     if (!selectedSpecialty) return;
//     setLoading(true);
//     try {
//       const res = await axios.post('http://localhost:5000/api/suggest-courses', {
//         specialty: selectedSpecialty
//       });
//       setResources(res.data.suggestions);
//     } catch (err) {
//       console.error(err);
//       setResources('Failed to fetch suggestions.');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-4 text-white-800">Goal Progression</h2>

//       <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
//         <select
//           className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md shadow-sm"
//           value={selectedSpecialty}
//           onChange={(e) => setSelectedSpecialty(e.target.value)}
//         >
//           <option value="">Select a Specialty</option>
//           {specialties.map((s, i) => (
//             <option key={i} value={s}>
//               {s}
//             </option>
//           ))}
//         </select>

//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           {loading ? 'Loading...' : 'Get Suggestions'}
//         </button>
//       </div>

//       <div className="mt-8">
//         {resources && (
// <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
//   <h2 className="text-2xl font-bold mb-4">Goal Progression</h2>
//   <div className="flex items-center gap-4 mb-4">
//     <select
//       value={selectedSpecialty}
//       onChange={(e) => setSelectedSpecialty(e.target.value)}
//       className="border rounded px-3 py-2 w-full"
//     >
//       <option value="">Select a Specialty</option>
//       {specialties.map((s, i) => (
//         <option key={i} value={s}>{s}</option>
//       ))}
//     </select>
//     <button
//       onClick={handleSubmit}
//       disabled={loading}
//       className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
//     >
//       {loading ? 'Loading...' : 'Get Suggestions'}
//     </button>
//   </div>

//   {resources && (
//     <div className="mt-6">
//       <h3 className="text-xl font-semibold mb-3">Suggested Courses:</h3>
//       {resources.split('\n').map((line, idx) => {
//         const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
//         if (urlMatch) {
//           const url = urlMatch[0];
//           return (
//             <p key={idx} className="mb-2 text-blue-600 underline">
//               <a href={url} target="_blank" rel="noreferrer">{url}</a>
//             </p>
//           );
//         } else {
//           return <p key={idx} className="text-gray-700 mb-2">{line}</p>;
//         }
//       })}
//     </div>
//   )}
// </div>

//     </div>
//   );
// }

// export default GoalProgression;
import React, { useState } from 'react';
import axios from 'axios';

const specialties = [
  "Allergy", "Cardiology", "Dermatology", "Emergency medicine",
  "Oncology", "Pediatrics", "Neurology"
];
function parseBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return <strong key={i}>{boldText}</strong>;
    }
    return part;
  });
}

function GoalProgression() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [resources, setResources] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedSpecialty) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/suggest-courses', {
        specialty: selectedSpecialty
      });
      setResources(res.data.suggestions);
    } catch (err) {
      console.error(err);
      setResources('Failed to fetch suggestions.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white " >
      {/* <h2 className="text-2xl font-bold mb-4 text-gray-800">Goal Progression</h2> */}
      <h2 className="text-2xl font-bold mb-4 text-black">Goal Progression</h2>


      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <select
          style={{
    width: "75%",
    background: "white",
    border: "none",
    padding: "15px 20px",
    borderRadius: "20px",
    marginTop: "15px",
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
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
        >
          <option value="">Select a Specialty</option>
          {specialties.map((s, i) => (
            <option key={i} value={s}>{s}</option>
          ))}
        </select>

       <button
  onClick={handleSubmit}
  disabled={loading}
  className="text-white font-semibold px-6 py-3 rounded-[20px] transition-transform duration-200 disabled:opacity-50"
  style={{
    background: "linear-gradient(45deg, rgb(16, 137, 211), rgb(18, 177, 209))",
    boxShadow: "rgba(133, 189, 215, 0.88) 0px 10px 15px -10px",
  }}
  onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = "scale(1.03)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
>
  {loading ? 'Loading...' : 'Get Suggestions'}
</button>

      </div>

      {resources && (
        <div className="mt-8 p-6 bg-white rounded shadow">
          <h3 className="text-xl font-semibold mb-3">Suggested Courses:</h3>
          {/* {resources.split('\n').map((line, idx) => {
            const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
            if (urlMatch) {
              const url = urlMatch[0];
              return (
                <p key={idx} className="mb-2 text-blue-600 underline">
                  <a href={url} target="_blank" rel="noreferrer">{url}</a>
                </p>
              );
            } else {
              return <p key={idx} className="text-gray-700 mb-2">{line}</p>;
            }
          })} */}
          {resources.split('\n').map((line, idx) => {
  const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
  if (urlMatch) {
    const url = urlMatch[0];
    return (
      <p key={idx} className="mb-2 text-blue-600 underline">
        <a href={url} target="_blank" rel="noreferrer">{url}</a>
      </p>
    );
  } else if (line.trim().endsWith(':') || /^(Course Title|Description|Disclaimer)/i.test(line.trim())) {
    // Treat lines ending with ':' or starting with these keywords as headings, bold them
    return (
      <p key={idx} className="mb-2 font-bold text-gray-800">
        {line.trim()}
      </p>
    );
  } else {
    return (
      <p key={idx} className="text-gray-700 mb-2">
          {parseBold(line)}
      </p>
    );
  }
})}

        </div>
      )}
    </div>
  );
}

export default GoalProgression;
