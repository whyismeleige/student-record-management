const jwt = require("jsonwebtoken");

const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

const sanitizeUser = (user) => {
  return {
    _id: user._id,
    email: user.email,
    name: user.name,
    avatar: user.avatar, 
  };
};

module.exports = {
  createToken,
  verifyToken,
  sanitizeUser,
};