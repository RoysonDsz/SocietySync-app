import express from 'express';
import { allUsers, changePassword, getOwnProfile, forgotPassword, getUserById, login, resetPassword, signup, updateProfile, userProfile, verifyOTP } from '../controllers/signup.controllers.js';
import authMiddleware from '../middleware/auth.middleware.js';

const signupRouter = express.Router();

signupRouter.post('/signup', signup);
signupRouter.post('/login', login);
signupRouter.get('/users', allUsers);
signupRouter.get('/users/:id', getUserById);
signupRouter.get('/profile', userProfile);
signupRouter.put('/profile',  updateProfile);
signupRouter.get('/ownProfile', getOwnProfile);
signupRouter.put('/change-password', changePassword);
signupRouter.post('/forgot-password', forgotPassword);
signupRouter.post('/verify-otp', verifyOTP);
signupRouter.post('/reset-password', resetPassword);

export default signupRouter;