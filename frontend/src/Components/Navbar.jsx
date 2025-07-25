// import React from "react";
// import { useNavigate } from "react-router-dom";  // Import useNavigate
// // import "../styles/Navbar.css";
// import { FiDownload } from "react-icons/fi";
// import { FaRegUserCircle } from "react-icons/fa";
// import { IoLogOutOutline } from "react-icons/io5";

// const Navbar = () => {
//   const navigate = useNavigate(); // Initialize navigation

//   const handleLogout = () => {
//     // Remove authentication token from localStorage or sessionStorage
//     localStorage.removeItem("userDetails"); // Adjust based on your implementation

//     // Redirect to login page
//     navigate("/");
//   };

//   return (
//     <div className="navbar">
//       <div className="navbar-left">
//         <h2 className="logo-text">Medical Logbook</h2>
//       </div>

//       <div className="navbar-right">
//         <span className="user-email">suchithabolarganglia@gmail.com</span>
//         <FaRegUserCircle className="icon profile-icon" />
//         <IoLogOutOutline className="icon logout-icon" onClick={handleLogout} />
//       </div>
//     </div>
//   );
// };

// export default Navbar;


import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // Store user email
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

  useEffect(() => {
    // Fetch email from localStorage
    const storedUser = JSON.parse(localStorage.getItem("userDetails")) || {};
    if (storedUser.email) {
      setEmail(storedUser.email);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/account"); // Navigate to AccountPage if logged in
    } else {
      toast.info("Not logged in", { position: "top-center", autoClose: 2000 });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userDetails");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center px-5 py-2 text-lg bg-teal-500 shadow-md">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold">Medical Logbook</h2>
      </div>
      <ToastContainer />

      <div className="navbar-right">
        {isLoggedIn ? (
          <>
            <span className="user-email">
              <Link to="/account">{email}</Link>
            </span>
            <FaRegUserCircle className="icon profile-icon" onClick={handleProfileClick} />
          </>
        ) : (
          <FaRegUserCircle className="icon profile-icon" onClick={handleProfileClick} />
        )}

        {isLoggedIn && <IoLogOutOutline className="icon logout-icon" onClick={handleLogout} />}
      </div>
    </div>
  );
};

export default Navbar;

