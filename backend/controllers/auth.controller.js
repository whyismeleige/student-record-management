// auth.controller.js
const mongoose = require("mongoose");
const db = require("../models");
const asyncHandler = require("../middleware/asyncHandler");

const {
  ValidationError,
  AuthenticationError,
} = require("../utils/error.utils");

const { createToken, sanitizeUser } = require("../utils/auth.utils");
const { NotFoundError } = require("../utils/error.utils");

const User = db.user;

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

exports.getProfile = asyncHandler(async (req, res) => {
  res.status(200).send({
    user: sanitizeUser(req.user),
    message: "User Profile Sent",
    type: "success",
  });
});

exports.register = asyncHandler(async (req, res) => {
  // 1. Accept 'role' from the request body
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new ValidationError("Enter Valid Input");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new NotFoundError("User already exists");
  }

  // 2. Pass 'role' to User.create. 
  // If no role is sent, the model defaults to "faculty" automatically.
  const newUser = await User.create({
    email,
    name,
    password,
    role: role || "faculty", 
  });

  const token = createToken({
    id: newUser._id,
  });

  res.cookie("token", token, getCookieOptions());

  res.status(200).send({
    message: "User registered successfully",
    type: "success",
    user: sanitizeUser(newUser),
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError("Enter Valid Input");
  }

  const userExists = await User.findOne({ email }).select("+password");

  if (!userExists) {
    throw new NotFoundError("User does not exist. Please Register");
  }

  const passwordsMatch = await userExists.passwordsMatch(password);

  if (!passwordsMatch) {
    throw new AuthenticationError("Passwords do not match");
  }

  const token = createToken({
    id: userExists._id,
  });

  res.cookie("token", token, getCookieOptions());

  res.status(200).send({
    message: "User Logged In Successfully",
    type: "success",
    user: sanitizeUser(userExists),
  });
});

exports.logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).send({
    message: "Logged Out Successfully",
    type: "success",
  });
};