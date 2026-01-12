import React, { useState } from "react";
import { useSelector } from "react-redux";
import Notification from "../Components/Notification";

const Support = () => {
  const [supportType, setSupportType] = useState("");
  const [detail, setDetail] = useState("");
  const [notification, setNotification] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const user = useSelector((state) => state.auth.user);
  const studentName = user?.fullName;
  const email = user?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentName || !email) {
      setNotification({
        isOpen: true,
        title: "Error",
        message: "User details not found. Please login again.",
        type: "error",
      });
      return;
    }

    const payload = { studentName, email, supportType, detail };

    try {
      const res = await fetch(
        "https://medlogbook-website.onrender.com/api/support/submit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        setNotification({
          isOpen: true,
          title: "Success",
          message: "Support request submitted successfully!",
          type: "success",
        });
        setSupportType("");
        setDetail("");
      } else {
        throw new Error();
      }
    } catch {
      setNotification({
        isOpen: true,
        title: "Error",
        message: "Failed to submit support request",
        type: "error",
      });
    }
  };

  return (
    <div
      className="
        min-h-screen
        flex
        items-start
        justify-center
        px-4
        pt-20
        pb-8
        sm:pt-8
        bg-gradient-to-b
        from-slate-50
        to-slate-100
        text-black
      "
    >
      {/* CARD */}
      <div className="w-full max-w-md sm:max-w-xl bg-white border border-slate-200 rounded-2xl shadow-lg p-5 sm:p-8">
        {/* HEADER */}
        <div className="mb-6 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Request Support
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            Tell us what you need help with and our support team will respond as
            soon as possible.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* SUPPORT TYPE */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Support Type <span className="text-red-500">*</span>
            </label>
            <select
              value={supportType}
              onChange={(e) => setSupportType(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select an option</option>
              <option value="additional logbook category">
                Additional logbook category
              </option>
              <option value="bug report">Bug report</option>
              <option value="data protection report">
                Data protection report
              </option>
              <option value="email verification">Email verification</option>
              <option value="feedback">Feedback</option>
              <option value="general support">General support</option>
              <option value="hospital request">Hospital request</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* DETAILS */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Details <span className="text-red-500">*</span>
            </label>
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              required
              rows={5}
              placeholder="Describe the issue clearly with relevant details…"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm resize-none
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700
                       text-white text-sm font-semibold shadow-sm transition
                       active:scale-[0.98]"
          >
            Submit Request
          </button>
        </form>

        {/* NOTIFICATION */}
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

export default Support;
