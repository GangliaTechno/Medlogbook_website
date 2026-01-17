const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Adjust the path

// Routes for signup and login
router.post('/signup', authController.signup);
router.post('/login', authController.login);
// Add this route to fetch all users
// router.get('/users', authController.getAllUsers);
router.get("/users/student", authController.getUsersByRole);
router.get('/users', authController.getAllUsers);
router.get("/user/:email", authController.getUserByEmail);
router.put("/user/update", authController.updateUser);
router.put("/user/update-status", authController.updateUserStatus);
router.delete("/user/delete/:email", authController.deleteUser);

router.get('/userDetails/:email', authController.getUserDetailsByEmail);
router.get('/users/all', authController.getAllRegisteredUsers);
router.put('/user/update-role', authController.updateUserRole);



// router.get('/api/auth/userDetails', authController.getUserDetails);

router.post('/verify-otp', authController.verifyOTP);
router.post('/forgot-password', authController.forgotPassword);
router.post("/reset-password/:id/:token", authController.resetPassword);
router.get('/pending-users', authController.getPendingUsers);
router.post("/approve-pending-user", authController.approvePendingUser);
router.get('/pending-users/all', authController.getAllPendingUsers);

// Google OAuth routes
const passport = require('passport');

// Initiate Google OAuth
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login` }),
    (req, res) => {
        // Successful authentication
        const token = require('jsonwebtoken').sign(
            { id: req.user._id, email: req.user.email, role: req.user.role },
            process.env.JWT_SECRET || 'your-jwt-secret',
            { expiresIn: '7d' }
        );

        // Redirect to frontend with token and user data
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${token}&role=${req.user.role}`);
    }
);
module.exports = router;
