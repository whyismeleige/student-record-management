// models/user.model.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false, // Don't return password by default in queries
  },
  role: {
    type: String,
    enum: ["faculty", "admin"],
    default: "faculty",
  },
  avatar: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function () {
  // Only hash the password if it has been modified (or is new)
  if (this.isModified("password")) {    
    this.password = await bcrypt.hash(this.password, 12);
  }
  
});

// Method to compare password for login
userSchema.methods.passwordsMatch = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create index for email
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);