import React from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import "../styles.css"; // Ensure this file is present

Modal.setAppElement("#root");

const Notification = ({ isOpen, onRequestClose, title = "Notification", message = "An error occurred!", type = "info" }) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={title}
      style={{
        overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
          width: "400px",
          padding: "20px",
          borderRadius: "8px",
          textAlign: "center",
        },
      }}
    >
      <h4 className={`font-xl font-bold p-1 mt-2 ${type=="success"?"text-[#155724] bg-[#d4edda] border-l-4 border-[#28a745]":type=="error"?"text-[#721c24] bg-[#f8d7da] border-l-4 border-[#dc3545]":"text-[#0c5460] bg-[#d1ecf1] border-l-4 border-[#17a2b8]"}`}>{title}</h4>
      <div className="notification-message p-3 rounded-md uppercase">{message}</div>
      <button onClick={onRequestClose} className="bg-[#00796b] text-white py-3 px-5 cursor-pointer rounded-md transition duration-300 w-full hover:bg-[#004d40]">Close</button>
    </Modal>
  );
};

Notification.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.oneOf(["success", "error", "info"]),
};

export default Notification;
