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
        min-h-full
        w-full
        bg-gradient-to-br from-blue-50 via-white to-blue-50
        flex
        items-start
        justify-center
        pt-10
        pb-20
        px-4
        sm:px-6
      "
    >
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">
            Support Center
          </h1>
          <p className="text-slate-500">
            Need help? Submit a request and we'll get back to you.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-xl overflow-hidden">
          {/* Accent Line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 to-indigo-500"></div>

          <div className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Type Selection */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                  How can we help? <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={supportType}
                    onChange={(e) => setSupportType(e.target.value)}
                    required
                    className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow cursor-pointer placeholder-slate-400"
                  >
                    <option value="">Select a category...</option>
                    <option value="additional logbook category">Request New Logbook Category</option>
                    <option value="bug report">Report a Bug</option>
                    <option value="data protection report">Data Privacy Issue</option>
                    <option value="email verification">Email Verification</option>
                    <option value="feedback">General Feedback</option>
                    <option value="hospital request">Request New Hospital</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {/* Details Textarea */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                  Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  required
                  rows={6}
                  placeholder="Please describe your issue or request in detail. The more info, the faster we can help..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-slate-400 mt-8 font-medium">
          We usually respond within 24 hours.
        </p>

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
    </div >
  );
};

export default Support;
