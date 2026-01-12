import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      <p className="text-center text-base text-gray-700 mt-20 font-['Inter'] font-medium">
        Loading jobs…
      </p>
    );
  }

  return (
    <div
      className="
        font-['Inter']
        text-gray-900
        max-w-7xl
        mx-auto

        /* 🔑 IMPORTANT: mobile hamburger spacing */
        pt-20
        pl-16
        px-4
        py-8

        sm:pt-8
        sm:pl-6
        sm:px-6

        lg:px-10
      "
    >
      {/* Page Heading */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-2">
        Assignment History
      </h1>

      {/* Description */}
      <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-8 max-w-4xl">
        Manage your training posts, specialties, and access logbook entries
        associated with your current or previous jobs.
      </p>

      {/* Section Title */}
      <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">
        Primary Job
      </h3>

      {jobs.map((job) => (
        <div
          key={job.id}
          className="
            bg-white
            border
            border-gray-800
            rounded-xl

            p-5
            sm:p-6

            mb-6

            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-center
            sm:justify-between

            shadow-[0_8px_24px_rgba(0,0,0,0.15)]
            ring-1
            ring-black/30
            ring-inset

            transition-all
            duration-200
            hover:-translate-y-[2px]
            hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)]
          "
        >
          {/* Left Content */}
          <div className="flex items-start gap-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"
              alt="India"
              className="w-9 h-6 mt-1 shrink-0"
            />

            <div>
              <p className="text-base sm:text-lg font-bold text-gray-900">
                {job.trainingYear} — {job.specialty}
              </p>

              <p className="text-sm font-medium text-gray-700 mt-1">
                {job.startDate} – {job.endDate}
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
              py-3

              text-sm
              sm:text-base
              font-semibold

              text-white
              rounded-lg

              bg-blue-600
              hover:bg-blue-700

              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:ring-offset-2

              transition
            "
          >
            View logbook entries
          </button>
        </div>
      ))}
    </div>
  );
};

export default JobsPage;
