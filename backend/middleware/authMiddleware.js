import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

// protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;
  // read the jwt from the cookie
  token = req.cookies.jwt;
  if (token) {
    try {
      // get the user id from the created token (decoded.userId)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //   await User.findById(decoded.userId) // this will return all the fields but we dont want the password
      req.user = await User.findById(decoded.userId).select('-password');
      // this user will be in the req object in all our routes

      next(); // = always move on the the next piece of middleware
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error('Not authorised, token exists but failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorised, no token');
  }
});

// admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorised as admin');
  }
};

export { protect, admin };
