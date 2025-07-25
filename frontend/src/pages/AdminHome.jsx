import React from "react";

const AdminHome = () => {
  return (

    <div className="min-h-screen flex items-center justify-center p-4 mb-50">
      <div className="bg-white text-white p-6 rounded-lg shadow-lg max-w-2xl w-full text-center font-sans mb-50">
       
        <h2 className="text-2xl font-bold text-blue-600 mb-6"
      style={{
    textAlign: "center",
    fontWeight: 900,
    fontSize: "30px",
    color: "rgb(16, 137, 211)"
  }}>Welcome, Admin!</h2>
        <p className="mb-4 text-lg !text-black">
          Manage your users and system efficiently.
        </p>
        <p className="text-lg text-black">
          Navigate to <strong className="text-black">View Users</strong> to approve or reject the registered users or log out when you're done.
          <br />
          Thank you!!
        </p>

      </div>
    </div>
  );
};

export default AdminHome;
