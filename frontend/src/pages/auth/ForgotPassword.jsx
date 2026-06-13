import React, { useState } from "react";
import { forgotPassword } from "../../api/authApi";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { KeyRound, Mail, Lock, ShieldCheck, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  // Navigation & Form State
  const [step, setStep] = useState("send-otp"); // 'send-otp' | 'verify-otp' | 'reset-password'
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI Status State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Step 1: Dispatch Reset OTP Code
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return setError("Please enter your email address.");

    setLoading(true);
    setError("");
    try {
      const response = await forgotPassword({ email, step: "send-otp" });
      if (response.success) {
        setSuccessMessage(response.message);
        setStep("verify-otp");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Validate the OTP Token
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return setError("Please enter a valid 6-digit verification code.");

    setLoading(true);
    setError("");
    try {
      const response = await forgotPassword({ email, otp, step: "verify-otp" });
      if (response.success) {
        setSuccessMessage(response.message);
        setStep("reset-password");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired token code.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Commit the New Password Mutation
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword) return setError("Please enter a new password.");
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");

    setLoading(true);
    setError("");
    try {
      const response = await forgotPassword({ email, newPassword, step: "reset-password" });
      if (response.success) {
        setSuccessMessage(response.message);
        setStep("complete");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update your password credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] px-4 py-12 selection:bg-[var(--primary-soft)]">
      <div className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] p-8 md:p-10 transition-all">
        
        {/* Back navigation handle link */}
        {step !== "complete" && (
          <a 
            href="/login" 
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] mb-6 transition-colors group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
            Back to Sign In
          </a>
        )}

        {/* Global Alert Notification banners */}
        {error && (
          <div className="mb-6 p-4 rounded-[var(--radius-md)] bg-[var(--danger-soft)] border border-[var(--danger)]/10 text-sm font-medium text-[var(--danger)]">
            {error}
          </div>
        )}
        
        {successMessage && step !== "complete" && (
          <div className="mb-6 p-4 rounded-[var(--radius-md)] bg-[var(--success-soft)] border border-[var(--success)]/10 text-sm font-medium text-[var(--success)]">
            {successMessage}
          </div>
        )}

        {/* ==========================================================
            SCREEN 1: ENTER EMAIL STRING FOR INITIAL OTP CAPTURE
           ========================================================== */}
        {step === "send-otp" && (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="text-center md:text-left">
              <div className="h-12 w-12 mx-auto md:mx-0 rounded-[var(--radius-md)] bg-[var(--primary-soft)] flex items-center justify-center text-[var(--primary)] mb-4">
                <KeyRound size={24} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">Forgot Password?</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1.5"> No worries! Enter your email and we'll send over a secure confirmation code. </p>
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="pl-4"
            />

            <Button type="submit" loading={loading} className="w-full">
              Send Verification Code
            </Button>
          </form>
        )}

        {/* ==========================================================
            SCREEN 2: SUBMIT CODE STRING SENT BY BACKEND INBOX
           ========================================================== */}
        {step === "verify-otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center md:text-left">
              <div className="h-12 w-12 mx-auto md:mx-0 rounded-[var(--radius-md)] bg-[var(--primary-soft)] flex items-center justify-center text-[var(--primary)] mb-4">
                <Mail size={24} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">Check Your Inbox</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1.5"> We dispatched a secure 6-digit confirmation code to <span className="font-semibold text-[var(--text-main)]">{email}</span>. </p>
            </div>

            <Input
              label="6-Digit Code"
              type="text"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Numbers only sanity pattern filter
              required
              disabled={loading}
              className="text-center font-mono text-lg tracking-[0.5em] focus:placeholder:opacity-0"
            />

            <Button type="submit" loading={loading} className="w-full">
              Verify Secure Code
            </Button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] underline transition-colors disabled:opacity-50"
              >
                Resend Code
              </button>
            </div>
          </form>
        )}

        {/* ==========================================================
            SCREEN 3: WRITE AND COMPILE REPLACEMENT PASSWORD MUTATION
           ========================================================== */}
        {step === "reset-password" && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="text-center md:text-left">
              <div className="h-12 w-12 mx-auto md:mx-0 rounded-[var(--radius-md)] bg-[var(--primary-soft)] flex items-center justify-center text-[var(--primary)] mb-4">
                <Lock size={24} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">Set New Password</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1.5"> Secure your profile. Pick a brand-new alphanumeric string configuration. </p>
            </div>

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />

            <Button type="submit" loading={loading} className="w-full mt-2">
              Update Password
            </Button>
          </form>
        )}

        {/* ==========================================================
            SCREEN 4: TRANSACTION TERMINATION AND COMPLETION CANVAS
           ========================================================== */}
        {step === "complete" && (
          <div className="text-center py-4 space-y-6">
            <div className="h-16 w-16 mx-auto rounded-full bg-[var(--success-soft)] flex items-center justify-center text-[var(--success)] animate-bounce">
              <ShieldCheck size={36} />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">Password Reset!</h2>
              <p className="text-sm text-[var(--text-muted)] mt-2 px-2"> Your credential layout configurations have been cleanly overwritten. You can now access your account workspace. </p>
            </div>

            <a href="/login" className="block w-full">
              <Button type="button" className="w-full">
                Sign In to Workspace
              </Button>
            </a>
          </div>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;