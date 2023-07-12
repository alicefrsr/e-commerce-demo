import express from 'express';
const router = express.Router();
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

router
  .route('/') // (= '/api/users')
  .post(registerUser) // route is NOT '/api/users/register'
  .get(protect, admin, getUsers); // add middleware to protect route but also so only admin gets users

router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

router.route('/:id').get(protect, admin, getUserById).put(protect, admin, updateUser).delete(protect, admin, deleteUser);

export default router;
