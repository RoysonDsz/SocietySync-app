import bcrypt from 'bcrypt';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import signupModel from '../models/signup.model.js';

const secretKey = process.env.JWT_SECRET;

const signup = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new signupModel({ name, role : 'resident', email, password: hashedPassword, phoneNumber });
    await user.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await signupModel.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: '24h' });
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const allUsers = async (req, res) => {
  try {
    const users = await signupModel.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await signupModel.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const userProfile = async (req, res) => {
  try {
    const user = await signupModel.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const user = await signupModel.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    updates.forEach(update => user[update] = req.body[update]);
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await signupModel.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid old password' });
    }
    
    // Check new password is different
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).send({ error: 'New password must be different' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).send({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await signupModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: 'User not found with this email' });
    }
    
    const otp = generateOTP();
    
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15);
    
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiry = otpExpiry;
    await user.save();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <h1>Password Reset Request</h1>
        <p>Your OTP for password reset is: <strong>${otp}</strong></p>
        <p>This OTP is valid for 15 minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
      `
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    res.status(200).send({ message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const user = await signupModel.findOne({ 
      email,
      resetPasswordOTP: otp,
      resetPasswordOTPExpiry: { $gt: new Date() } 
    });
    
    if (!user) {
      return res.status(400).send({ error: 'Invalid or expired OTP' });
    }
    
    user.resetPasswordVerified = true;
    await user.save();
    
    res.status(200).send({ message: 'OTP verified successfully', email });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    const user = await signupModel.findOne({ 
      email,
      resetPasswordVerified: true 
    });
    
    if (!user) {
      return res.status(400).send({ error: 'Unauthorized password reset request' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;
    user.resetPasswordVerified = undefined;
    
    await user.save();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Successful',
      html: `
        <h1>Password Reset Successful</h1>
        <p>Your password has been reset successfully.</p>
        <p>If you did not request this change, please contact support immediately.</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    res.status(200).send({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};


export { allUsers, changePassword, forgotPassword, getUserById, login, resetPassword, signup, updateProfile, userProfile, verifyOTP };

