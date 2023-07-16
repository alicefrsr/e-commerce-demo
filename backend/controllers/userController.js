import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';
// import jwt from 'jsonwebtoken'; // dont need it here anymore
import generateToken from '../utils/generateToken.js';

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res, next) => {
  //   console.log(req.body);
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // // moved to utils/generateToken fn
    // // define the token
    // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // // set JWT as HTTP-Only cookie
    // res.cookie('jwt', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV !== 'development',
    //   sameSite: 'strict',
    //   maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
    // });

    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401); // unauthorised
    throw new Error('Invalid email or password');
  }
});

// @desc Register user
// @route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res, next) => {
  //   res.send('register user');
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email }); // email is the only unique value
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const user = await User.create({ name, email, password });

  if (user) {
    // generate token here
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc Logout user / clear the http-only cookie
// @route POST /api/users/logout
// @access Private
const logoutUser = asyncHandler(async (req, res, next) => {
  //   res.send('logout user');
  // get rid of the jwt cookie
  // set JWT as HTTP-Only cookie
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res, next) => {
  //   res.send('get user profile');
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res, next) => {
  //   res.send('update user profile');
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    // because pw is hashed
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Get all users
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res, next) => {
  // res.send('get users');
  const users = await User.find({});
  res.status(200).json(users);
});

// @desc Get user by id
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async (req, res, next) => {
  // res.send('get user by id');
  const user = await User.findById(req.params.id).select('-password'); // we don't want the password
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Update user by id
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res, next) => {
  // res.send('update user');
  // const { name, email, isAdmin } = req.body;
  const user = await User.findById(req.params.id); // why not .select('-password')?
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();
    // res.status(200).json(updatedUser); // check if it works the same
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Delete user by id
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res, next) => {
  // res.send('delete user');
  const user = await User.findById(req.params.id).select('-password'); // we don't want the password

  if (user) {
    // make it so we can't delete a user if it's an admin
    if (user.isAdmin) {
      console.log('Cannot delete an admin user');
      res.status(400);
      throw new Error('Cannot delete an admin user');
    }

    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: 'User deleted successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
export { loginUser, registerUser, logoutUser, getUserProfile, updateUserProfile, getUsers, getUserById, updateUser, deleteUser };
