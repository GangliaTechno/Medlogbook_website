import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

const DoctorHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 mb-10">
      {/* Welcome Card */}
      <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-2xl w-full text-center font-sans">
        <h2
          className="text-2xl font-bold mb-6"
          style={{
            textAlign: "center",
            fontWeight: 900,
            fontSize: "30px",
            color: "rgb(16, 137, 211)",
          }}
        >
          Welcome, Doctor!
        </h2>

        <p className="mb-4 text-lg">
          As a doctor, your expertise and guidance help shape the future of
          medicine. This logbook allows you to monitor students’ progress,
          review their entries, and provide feedback to enhance their learning
          experience.
        </p>

        <p className="text-lg">
          Navigate to{" "}
          <strong className="text-[#00d9c0]">View Students</strong> to manage
          student logbook entries.
        </p>
      </div>

      {/* ONLY ONE BUTTON */}
      <div className="mt-10">
        <button
          onClick={() => navigate("/doctor/categories")}
          className="flex items-center gap-2 px-6 py-3 text-white rounded-[20px] font-semibold shadow-md transition-transform duration-200"
          style={{
            background:
              "linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)",
            boxShadow: "rgba(133, 189, 215, 0.88) 0px 10px 15px -10px",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.03)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        >
          <FaChevronRight />
          Manage Logbook Categories
        </button>
      </div>
    </div>
  );
};

export default DoctorHome;
