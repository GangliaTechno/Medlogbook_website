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
      navigate("/"); // ✅ correct login route
      return;
    }

    const fetchJobsFromBackend = async () => {
      try {
        const response = await axios.get(
          `https://medlogbook-website.onrender.com/api/auth/userDetails/${email}`
        );

        const { selectedTrainingYear, selectedSpecialty } = response.data;

        if (!selectedTrainingYear || !selectedSpecialty) {
          console.error("❌ Missing trainingYear or specialty in user data.");
          return;
        }

        const todayDate = new Date().toLocaleDateString("en-GB");

        const userJobs = [
          {
            id: 1,
            trainingYear: selectedTrainingYear,
            specialty: selectedSpecialty,
            startDate: todayDate,
            endDate: todayDate,
            isPrimary: true,
          },
          {
            id: 2,
            trainingYear: selectedTrainingYear,
            specialty: selectedSpecialty,
            startDate: todayDate,
            endDate: todayDate,
            isPrimary: false,
          },
        ];

        setJobs(userJobs);
      } catch (error) {
        console.error("❌ Error fetching user job data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobsFromBackend();
  }, [user, email, navigate]);

  if (loading) {
    return <p className="text-center text-black mt-10">Loading jobs...</p>;
  }

  return (
    <div className="p-5 text-black">
      <p className="text-center text-black font-normal">
        You can tell Logitbox about new jobs, and change the hospitals and specialties associated
        with existing jobs in your account. You can also access logbook entries associated with old
        jobs. Click on job names to edit job properties.
      </p>

      {jobs.length > 0 ? (
        <div className="mt-5">
          <h3 className="mb-4 font-bold">
            Primary job - (you see this job's logbook entries when you log in)
          </h3>

          {jobs
            .filter((job) => job.isPrimary)
            .map((job) => (
              <div
                key={job.id}
                className="flex flex-col md:flex-row gap-2 justify-between items-center bg-[#717c9350] p-4 rounded-lg mb-2 shadow"
              >
                <div className="flex items-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"
                    alt="flag"
                    className="w-[35px] h-[22px] mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">
                      {job.trainingYear} {job.specialty}
                    </h4>
                    <p className="text-black">
                      {job.startDate} - {job.endDate}
                    </p>
                  </div>
                </div>

                <button
                  className="px-5 py-3 text-white rounded-[20px] transition-transform duration-200 shadow-md"
                  style={{
                    background: "linear-gradient(45deg, rgb(16, 137, 211), rgb(18, 177, 209))",
                  }}
                  onClick={() => navigate("/view-entries")}
                >
                  View entries
                </button>
              </div>
            ))}
        </div>
      ) : (
        <p>No jobs found.</p>
      )}
    </div>
  );
};

export default JobsPage;
