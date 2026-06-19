import User from '../models/user.model.js';
import { hashPassword, verifyPassword } from '../services/bcrypt.js';
import { sendEmail } from '../services/nodemailer.js';
import { generateOtp, createAccessToken } from '../services/jwt.js';
import { welcomeEmailTemplate, otpEmailTemplate } from '../constants/emailTemplates.js';
import { serializeUser } from '../utils/serializeUser.js';
import { AppException } from '../utils/appException.js';




export const register = async (req, res, next) => {
  try {
    const { name, email, username, password } = req.body;

    if (!name || !email || !password) {
      throw new AppException('Name, email, and password are required.', 422);
    }

    const userEmail = email.toLowerCase().strip ? email.toLowerCase().trim() : email.toLowerCase();
    const cleanUsername = username ? (username.toLowerCase().strip ? username.toLowerCase().trim() : username.toLowerCase()) : null;

    const existingUser = await User.findOne({ email: userEmail });
    if (existingUser) {
      throw new AppException('Account already exists.', 400);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      name: name.trim(),
      email: userEmail,
      username: cleanUsername,
      password: hashedPassword,
    });

    await newUser.save();

    const verificationUrl = `https://www.algonotes.in/verify?email=${newUser.email}`;

    // Node handles this asynchronously inside the event loop
    sendEmail(
      newUser.email,
      'Welcome to ALGONOTES',
      welcomeEmailTemplate(verificationUrl)
    ).catch((err) => console.error(`Error sending welcome email: ${err.message}`));

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
    });
  } catch (error) {
    next(error);
  }
};



export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppException('Email and password are required.', 422);
    }

    const userEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      throw new AppException('Incorrect Email address.', 401);
    }

    const isPasswordVerified = await verifyPassword(password, user.password);
    if (!isPasswordVerified) {
      throw new AppException('Incorrect Password.', 401);
    }

    const token = createAccessToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    next(error);
  }
};



export const verifyUser = async (req, res, next) => {
  try {
    const { email, step, otp } = req.body;

    if (!email || !step) {
      throw new AppException('Email and step are required fields.', 422);
    }

    const userEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      throw new AppException('User not found.', 404);
    }

    if (user.verificationOptions.status === 'verified') {
      throw new AppException('User already verified.', 400);
    }

    if (step === 'send-otp') {
      const generatedOtp = generateOtp();
      user.verificationOptions.otp = generatedOtp;
      user.verificationOptions.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // +10 minutes
      await user.save();

      sendEmail(
        user.email,
        'ALGONOTES Verification Code',
        otpEmailTemplate(
          generatedOtp,
          'Verify your email address',
          'Please use the verification code below to activate your ALGONOTES account and complete your sign-up process.'
        )
      ).catch((err) => console.error(`Error sending verification OTP: ${err.message}`));

      return res.status(200).json({
        success: true,
        message: 'OTP sent successfully.',
      });
    }

    if (step === 'otp-verification') {
      if (!otp) {
        throw new AppException('OTP required.', 400);
      }

      const expiry = user.verificationOptions.otpExpiry;
      const isExpired = expiry ? new Date() > new Date(expiry) : true;

      if (user.verificationOptions.otp !== otp || isExpired) {
        throw new AppException('Invalid or expired OTP.', 400);
      }

      user.verificationOptions.status = 'verified';
      user.verificationOptions.otp = null;
      user.verificationOptions.otpExpiry = null;
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Account verified successfully.',
        user: serializeUser(user),
      });
    }

    throw new AppException('Invalid verification step.', 400);
  } catch (error) {
    next(error);
  }
};




export const forgotPassword = async (req, res, next) => {
  try {
    const { email, step, otp, newPassword } = req.body;

    if (!email || !step) {
      throw new AppException('Email and step are required fields.', 422);
    }

    const userEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      throw new AppException('User not found.', 404);
    }

    if (step === 'send-otp') {
      const generatedOtp = generateOtp();
      user.forgotPasswordOptions.otp = generatedOtp;
      user.forgotPasswordOptions.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // +10 minutes
      user.forgotPasswordOptions.otpVerified = false;
      await user.save();

      sendEmail(
        user.email,
        'ALGONOTES Password Reset Code',
        otpEmailTemplate(
          generatedOtp,
          'Reset your password',
          'We received a request to change your password. Use the security code below to securely reset your ALGONOTES account password.'
        )
      ).catch((err) => console.error(`Error sending forgot-password OTP: ${err.message}`));

      return res.status(200).json({
        success: true,
        message: 'OTP sent.',
      });
    }

    if (step === 'verify-otp') {
      if (!otp) {
        throw new AppException('OTP required.', 400);
      }

      const expiry = user.forgotPasswordOptions.otpExpiry;
      const isExpired = expiry ? new Date() > new Date(expiry) : true;

      if (user.forgotPasswordOptions.otp !== otp || isExpired) {
        throw new AppException('Invalid or expired OTP.', 400);
      }

      user.forgotPasswordOptions.otpVerified = true;
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'OTP verified.',
      });
    }

    if (step === 'reset-password') {
      if (!newPassword) {
        throw new AppException('New password required.', 400);
      }

      if (!user.forgotPasswordOptions.otpVerified) {
        throw new AppException('OTP verification required.', 403);
      }

      user.password = await hashPassword(newPassword);
      user.forgotPasswordOptions.otp = null;
      user.forgotPasswordOptions.otpExpiry = null;
      user.forgotPasswordOptions.otpVerified = false;
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Password reset successful.',
      });
    }

    throw new AppException('Invalid request processing step configuration.', 400);
  } catch (error) {
    next(error);
  }
};