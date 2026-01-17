// models/User.js

const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema({

  fullName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,  // Ensures email is unique
  },

  password: {
    type: String,
<<<<<<< HEAD
    required: true,
  },

  country: { type: String, required: function() { return this.role === 'student'; } },
  trainingYear: { type: String, required: function() { return this.role === 'student'; } },
  hospital: { type: String, required: function() { return this.role === 'student'; } },
  
=======
    required: function () {
      // Password is only required for local auth (non-Google users)
      return !this.googleId;
    },
  },

  googleId: {
    type: String,
    sparse: true,  // Allows multiple null values but unique non-null values
  },

  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },

  country: { type: String, required: function () { return this.role === 'student'; } },
  trainingYear: { type: String, required: function () { return this.role === 'student'; } },
  hospital: { type: String, required: function () { return this.role === 'student'; } },

>>>>>>> 4a23658e2cbf9b45119c6f89b840bf3f7f97b845
  specialty: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'doctor'], // Role should be either student or doctor
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
<<<<<<< HEAD
  
=======

>>>>>>> 4a23658e2cbf9b45119c6f89b840bf3f7f97b845
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
