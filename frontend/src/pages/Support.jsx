import React, { useState } from 'react';
import { useSelector } from "react-redux";
import Notification from "../Components/Notification";

const Support = () => {
  const [supportType, setSupportType] = useState('');
  const [detail, setDetail] = useState('');
  const [notification, setNotification] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "info",
      });

  // ✅ Get logged-in user data from Redux
  const user = useSelector((state) => state.auth.user);
  const studentName = user?.fullName;
  const email = user?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Guard against missing user
    if (!studentName || !email) {
      setNotification({
        isOpen: true,
        title: "Error",
        message: "User details not found. Please login again.",
        type: "error",
      });
      return;
    }

    const payload = {
      studentName,
      email,
      supportType,
      detail,
    };

    try {
      const res = await fetch('http://localhost:5000/api/support/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setNotification({
        isOpen: true,
        title: "Success",
        message: "Support request submitted successfully!",
        type: "success",
      });
        setSupportType('');
        setDetail('');
      } else {
        setNotification({
        isOpen: true,
        title: "Error",
        message: "Failed to submit support request",
        type: "error",
      });
      }
    } catch (err) {
      console.error(err);
      setNotification({
        isOpen: true,
        title: "Error",
        message: "Something went wrong",
        type: "error",
      });
    }
  };

  return (
    <div className="support-container text-black">
     
      <h2 className="text-2xl font-bold text-blue-600 mb-6"
      style={{
    textAlign: "center",
    fontWeight: 900,
    fontSize: "30px",
    color: "rgb(16, 137, 211)"
  }}>Request support</h2>
      <p className='text-center text-teal-500'>Please fill in the details below to submit a support request. We will be in contact as soon as possible to resolve your issue.</p>
      <form 
        onSubmit={handleSubmit} 
        className='gap-4 [&>div]:flex [&>div]:flex-col [&_label]:mb-1.5 [&_label]:font-bold [&_textarea]:p-3 [&_textarea]:mb-4 [&_textarea]:rounded-md [&_textarea]:border-0 [&_textarea]:bg-white/20 [&_textarea]:placeholder:text-gray-300 [&_select]:p-3 [&_select]:rounded-md [&_select]:border [&_select]:border-gray-300 [&_select]:text-gray-300 [&_select]:bg-white/20 [&_select]:mb-4 [&_option]:white'
      >
        <div>
          <label htmlFor="support-type">Support type *</label>
          <select
            id="support-type"
            value={supportType}
            onChange={(e) => setSupportType(e.target.value)}
            required
            style={{
    width: "100%",
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

          >
            <option value="">Select an option</option>
            <option value="additional logbook category">Additional logbook category</option>
            <option value="bug report">Bug report</option>
            <option value="data protection report">Data protection report</option>
            <option value="email verification">Email verification</option>
            <option value="feedback">Feedback</option>
            <option value="general support">General support</option>
            <option value="hospital request">Hospital request</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="detail">Detail *</label>
          <textarea
            id="detail"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            required
            style={{
    width: "100%",
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
          />
        </div>
        <button type="submit" className='bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 text-white px-6 py-2 rounded-full text-sm shadow-md hover:shadow-lg transition duration-300 mx-auto block'
        style={{
    background: "linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)",
    boxShadow: "rgba(133, 189, 215, 0.88) 0px 10px 15px -10px",
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>Submit</button>
      </form>
      {/* Notification Modal */}
        <Notification
          isOpen={notification.isOpen}
          onRequestClose={() => setNotification({ ...notification, isOpen: false })}
          title={notification.title}
          message={notification.message}
          type={notification.type}
        />
    </div>
  );
};

export default Support;

