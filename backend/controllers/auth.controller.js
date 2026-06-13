import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { generateOtp } from "../utils/generateOtp.js";
import sendEmail from "../services/email.service.js";
import bcryptService from "../services/bcrypt.service.js";

/**
 * @desc    Register a new user & Send Verification Link
 * @route   POST /api/v1/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if all required fields are provided
    if (!name || !email || !password) {
      const error = new Error("Please provide name, email, and password.");
      error.statusCode = 400;
      return next(error);
    }

    // 2. Hash the password
    const hashedPassword = await bcryptService.hashPassword(password);

    // 3. Create user with pending status
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationOptions: {
        status: "pending",
      },
    });

    // 4. Verification link points to your frontend landing page
    const verificationUrl = `${process.env.FRONTEND_URL}/verify?email=${encodeURIComponent(newUser.email)}`;

    // 5. Clean HTML template welcoming them and providing the link
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 600px; margin: 0 auto; border: 1px solid #eef2f6; border-radius: 8px;">
        <h2 style="color: #1e1b4b; margin-bottom: 10px;">Welcome to AlgoNotes!</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.5;">Thank you for signing up. Please click the button below to complete your email verification:</p>
        
        <a href="${verificationUrl}" target="_blank" style="display: inline-block; background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 6px; font-size: 14px; margin: 20px 0;">Verify Account</a>
        
        <p style="color: #94a3b8; font-size: 12px;">If the button isn't working, copy and paste this link into your browser:<br />
        <a href="${verificationUrl}" style="color: #4f46e5; word-break: break-all;">${verificationUrl}</a></p>
      </div>
    `;

    // Fire-and-forget email delivery (Fixed the variable lookup context here to use newUser.email)
    sendEmail({
      to: newUser.email,
      subject: "Welcome to ALGONOTES",
      html: emailHtml,
    }).catch((err) =>
      console.error(
        `Background Email Error for ${newUser.email}:`,
        err.message,
      ),
    );

    res.status(201).json({
      success: true,
      message: "Registration successful!",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log in user & Issue JWT Access Token
 * @route   POST /api/v1/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("Please provide email and password.");
      error.statusCode = 400;
      return next(error);
    }

    // 1. Fetch user including internal security fields for comparison checks
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Invalid email or password.");
      error.statusCode = 401;
      return next(error);
    }

    // 2. Validate Password
    const isMatch = await bcryptService.comparePassword(
      password,
      user.password,
    );
    if (!isMatch) {
      const error = new Error("Invalid email or password.");
      error.statusCode = 401;
      return next(error);
    }

    // 3. Issue Authentication Token Session
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    // 4. Pull proper sanitized user format matching verification & update pipelines
    const sanitizedUser = await User.findById(user._id).select(
      "-password -verificationOptions.otp -verificationOptions.otpExpiry -forgotPasswordOptions"
    );

    // 5. Return standardized structured payload dictionary
    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: sanitizedUser,
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Unified Verification Handler (Handles sending OTP and verifying OTP)
 * @route   POST /api/v1/auth/verify
 */
export const verifyUser = async (req, res, next) => {
  try {
    const { email, otp, step } = req.body;

    // 1. Basic Validation
    if (!email) {
      const error = new Error("Email parameter is required.");
      error.statusCode = 400;
      return next(error);
    }

    if (!step || !["send-otp", "otp-verification"].includes(step)) {
      const error = new Error("Invalid or missing verification step.");
      error.statusCode = 400;
      return next(error);
    }

    // 2. Fetch User
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User account not found.");
      error.statusCode = 404;
      return next(error);
    }

    if (user.verificationOptions.status === "verified") {
      const error = new Error("Account is already verified. You can log in.");
      error.statusCode = 400;
      return next(error);
    }

    // ==========================================
    // STEP 1: Generate & Send OTP
    // ==========================================
    if (step === "send-otp") {
      const freshOtp = generateOtp();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

      user.verificationOptions.otp = freshOtp;
      user.verificationOptions.otpExpiry = otpExpiry;
      await user.save();

      const otpEmailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 600px; margin: 0 auto; border: 1px solid #eef2f6; border-radius: 8px;">
          <h2 style="color: #1e1b4b; margin-bottom: 10px;">Your Verification Code</h2>
          <p style="color: #475569; font-size: 16px;">Enter this 6-digit OTP code on your screen to activate your account:</p>
          
          <div style="background-color: #f8fafc; border-radius: 6px; padding: 15px 25px; margin: 20px 0; display: inline-block;">
            <h1 style="color: #4f46e5; letter-spacing: 4px; margin: 0; font-size: 32px;">${freshOtp}</h1>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">This code is valid for 10 minutes.</p>
        </div>
      `;

      sendEmail({
        to: user.email,
        subject: "ALGONOTES Verification Code",
        html: otpEmailHtml,
      }).catch((err) =>
        console.error(
          `Background OTP Email Error for ${user.email}:`,
          err.message,
        ),
      );

      return res.status(200).json({
        success: true,
        message: "A fresh verification code has been dispatched to your email inbox.",
      });
    }

    // ==========================================
    // STEP 2: Verify the Provided OTP
    // ==========================================
    if (step === "otp-verification") {
      if (!otp) {
        const error = new Error("Please provide the 6-digit OTP code to verify.");
        error.statusCode = 400;
        return next(error);
      }

      const isOtpValid = user.verificationOptions.otp === otp;
      const isOtpExpired = new Date() > user.verificationOptions.otpExpiry;

      if (!user.verificationOptions.otp || !isOtpValid || isOtpExpired) {
        const error = new Error("Invalid or expired OTP code. Please request a new code.");
        error.statusCode = 400;
        return next(error);
      }

      // Update values upon verification validation match pass
      user.verificationOptions.status = "verified";
      user.verificationOptions.otp = undefined;
      user.verificationOptions.otpExpiry = undefined;
      await user.save();

      // Fetch the freshly verified user data shell, explicitly sanitizing out internal system details
      const sanitizedUser = await User.findById(user._id).select(
        "-password -verificationOptions.otp -verificationOptions.otpExpiry -forgotPasswordOptions"
      );

      return res.status(200).json({
        success: true,
        message: "Account verified successfully! Welcome to AlgoNotes.",
        user: sanitizedUser, 
      });
    }
  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Unified Forgot Password Handler (Send OTP -> Verify OTP -> Reset Password)
 * @route   POST /api/v1/auth/forgot-password
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword, step } = req.body;

    // 1. Basic validation required for all steps
    if (!email) {
      const error = new Error("Email is required.");
      error.statusCode = 400;
      return next(error);
    }

    const validSteps = ["send-otp", "verify-otp", "reset-password"];
    if (!step || !validSteps.includes(step)) {
      const error = new Error("Invalid or missing password reset step.");
      error.statusCode = 400;
      return next(error);
    }

    // 2. Locate user document
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User account with this email does not exist.");
      error.statusCode = 404;
      return next(error);
    }

    // =========================================================================
    // STEP 1: Send Password Reset OTP
    // =========================================================================
    if (step === "send-otp") {
      const resetOtp = generateOtp();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      user.forgotPasswordOptions.otp = resetOtp;
      user.forgotPasswordOptions.otpExpiry = otpExpiry;
      user.forgotPasswordOptions.otpVerified = false;
      await user.save();

      const resetEmailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 600px; margin: 0 auto; border: 1px solid #eef2f6; border-radius: 8px;">
          <h2 style="color: #1e1b4b; margin-bottom: 10px;">Password Reset Request</h2>
          <p style="color: #475569; font-size: 16px;">We received a request to reset your password. Use the code below to complete the process:</p>
          
          <div style="background-color: #f8fafc; border-radius: 6px; padding: 15px 25px; margin: 20px 0; display: inline-block;">
            <h1 style="color: #ef4444; letter-spacing: 4px; margin: 0; font-size: 32px;">${resetOtp}</h1>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">This code is highly sensitive and will expire in 10 minutes.</p>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">If you did not request this, please ignore this email or secure your account.</p>
        </div>
      `;

      sendEmail({
        to: user.email,
        subject: "Reset your ALGONOTES Password",
        html: resetEmailHtml,
      }).catch((err) =>
        console.error(
          `Forgot Password Email Error for ${user.email}:`,
          err.message,
        ),
      );

      return res.status(200).json({
        success: true,
        message:
          "A secure password reset OTP has been dispatched to your email inbox.",
      });
    }

    // =========================================================================
    // STEP 2: Verify the Provided OTP
    // =========================================================================
    if (step === "verify-otp") {
      if (!otp) {
        const error = new Error(
          "Please provide the 6-digit verification code.",
        );
        error.statusCode = 400;
        return next(error);
      }

      const isOtpValid = user.forgotPasswordOptions.otp === otp;
      const isOtpExpired = new Date() > user.forgotPasswordOptions.otpExpiry;

      if (!user.forgotPasswordOptions.otp || !isOtpValid || isOtpExpired) {
        const error = new Error(
          "Invalid or expired code. Please request a new code.",
        );
        error.statusCode = 400;
        return next(error);
      }

      user.forgotPasswordOptions.otpVerified = true;
      await user.save();

      return res.status(200).json({
        success: true,
        message:
          "OTP verified successfully. You can now change your new password.",
      });
    }

    // =========================================================================
    // STEP 3: Update Account Password
    // =========================================================================
    if (step === "reset-password") {
      if (!newPassword) {
        const error = new Error("Please provide your new password.");
        error.statusCode = 400;
        return next(error);
      }

      // Explicit target state check to completely prevent raw API parameter substitution manipulation
      if (!user.forgotPasswordOptions.otpVerified) {
        const error = new Error(
          "Unauthorized access request. Please verify your OTP code first.",
        );
        error.statusCode = 403;
        return next(error);
      }

      // Hash the newly requested password string
      const hashedNewPassword = await bcryptService.hashPassword(newPassword);

      user.password = hashedNewPassword;
      user.forgotPasswordOptions.otp = undefined;
      user.forgotPasswordOptions.otpExpiry = undefined;
      user.forgotPasswordOptions.otpVerified = false;
      await user.save();

      return res.status(200).json({
        success: true,
        message:
          "Your account password has been updated successfully. Proceed to login.",
      });
    }
  } catch (error) {
    next(error);
  }
};
