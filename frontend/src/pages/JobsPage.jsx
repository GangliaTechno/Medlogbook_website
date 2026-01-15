import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import studentPanelBg from "../assets/studentPanelBg.png";

const JobsPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);
  const email = user?.email;

  useEffect(() => {
    if (!user || !email) {
      navigate("/");
      return;
    }

    const fetchJobsFromBackend = async () => {
      try {
        const response = await axios.get(
          `https://medlogbook-website.onrender.com/api/auth/userDetails/${email}`
        );

        const { selectedTrainingYear, selectedSpecialty } = response.data;
        if (!selectedTrainingYear || !selectedSpecialty) return;

        const todayDate = new Date().toLocaleDateString("en-GB");

        setJobs([
          {
            id: 1,
            trainingYear: selectedTrainingYear,
            specialty: selectedSpecialty,
            startDate: todayDate,
            endDate: todayDate,
            isPrimary: true,
          },
        ]);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobsFromBackend();
  }, [user, email, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen pt-20 px-4 pb-10 sm:pt-8 sm:px-6 lg:px-10"
      style={{
        backgroundImage: `url(${studentPanelBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Page Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
          Assignment History
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-8 max-w-3xl">
          Manage your training posts, specialties, and access logbook entries
          associated with your current or previous jobs.
        </p>

        {/* Section Title */}
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">
          Primary Job
        </h3>

        {jobs.map((job) => (
          <div
            key={job.id}
            className="
              bg-white
              border
              border-slate-300
              rounded-2xl
              p-5 sm:p-6
              mb-6
              flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between
              shadow-[0_4px_12px_rgba(0,0,0,0.1)]
              hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]
              transition-all
              duration-300
              hover:-translate-y-1
            "
          >
            {/* Left Content */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-xl shrink-0">
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"
                  alt="India"
                  className="w-8 h-auto rounded shadow-sm"
                />
              </div>

              <div>
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {job.specialty}
                </p>
                <p className="text-sm sm:text-base text-blue-700 font-medium">
                  {job.trainingYear}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <span>📅</span> {job.startDate} – {job.endDate}
                </p>
              </div>
            </div>

            {/* Action */}
            <button
              onClick={() => navigate("/view-entries")}
              className="
                w-full
                sm:w-auto
                px-6
                py-2.5
                text-sm
                font-semibold
                text-white
                rounded-xl
                bg-gradient-to-r from-blue-600 to-blue-700
                hover:from-blue-700 hover:to-blue-800
                shadow-md
                hover:shadow-lg
                active:scale-95
                transition-all
                duration-200
              "
            >
              View Logbook Entries
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsPage;
