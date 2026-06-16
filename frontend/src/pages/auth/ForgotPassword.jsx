import React, { useState } from "react";
import { forgotPassword } from "../../api/authApi";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { KeyRound, Mail, Lock, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";

const ForgotPassword = () => {
  // Navigation & Form State
  const [step, setStep] = useState("send-otp"); // 'send-otp' | 'verify-otp' | 'reset-password' | 'complete'
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
    if (e) e.preventDefault();
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
    <div className="flex min-h-screen items-center justify-center bg-bg-base px-4 py-12 relative overflow-hidden selection:bg-primary/20">
      {/* Visual background gradient circle overlay decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="w-full max-w-[420px] bg-bg-surface border border-border-default rounded-md shadow-card p-8 relative z-10 select-none transition-all">
        
       

        {/* Global Alert Notification banners */}
        {error && (
          <div className="mb-5 p-3.5 rounded-sm bg-danger-soft border border-danger/10 text-xs font-medium text-danger">
            {error}
          </div>
        )}
        
        {successMessage && step !== "complete" && (
          <div className="mb-5 p-3.5 rounded-sm bg-success-soft border border-success/10 text-xs font-medium text-success">
            {successMessage}
          </div>
        )}

        {/* ==========================================================
            SCREEN 1: ENTER EMAIL STRING FOR INITIAL OTP CAPTURE
           ========================================================== */}
        {step === "send-otp" && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="text-center md:text-left space-y-1.5">
              <div className="h-10 w-10 mx-auto md:mx-0 rounded-sm bg-primary-soft border border-primary/10 flex items-center justify-center text-primary mb-2 shadow-xs">
                <KeyRound size={18} className="stroke-[1.75]" />
              </div>
              <h2 className="text-xl font-bold tracking-wide text-text-main">Forgot Password?</h2>
              <p className="text-xs text-text-muted leading-normal">
                No worries! Enter your email and we'll send over a secure confirmation code.
              </p>
            </div>

            <div className="relative">
              <div className="absolute top-[34px] left-3.5 z-10 text-text-light pointer-events-none flex items-center">
                <Mail size={14} className="stroke-[1.75]" />
              </div>
              <Input
                label="Email Address"
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="pl-10 text-sm h-10 bg-bg-base rounded-md"
              />
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2" size="md">
              Send Verification Code
            </Button>
          </form>
        )}

        {/* ==========================================================
            SCREEN 2: SUBMIT CODE STRING SENT BY BACKEND INBOX
           ========================================================== */}
        {step === "verify-otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="text-center md:text-left space-y-1.5">
              <div className="h-10 w-10 mx-auto md:mx-0 rounded-sm bg-primary-soft border border-primary/10 flex items-center justify-center text-primary mb-2 shadow-xs">
                <Mail size={18} className="stroke-[1.75]" />
              </div>
              <h2 className="text-xl font-bold tracking-wide text-text-main">Check Your Inbox</h2>
              <p className="text-xs text-text-muted leading-normal">
                We dispatched a secure 6-digit confirmation code to <span className="font-semibold text-text-main font-mono">{email}</span>.
              </p>
            </div>

            <div className="relative">
              <Input
                label="6-Digit Code"
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
                disabled={loading}
                className="text-center font-mono text-lg tracking-[0.4em] pl-4 font-bold h-11 bg-bg-base rounded-md focus:placeholder:opacity-0"
              />
              {loading && (
                <div className="absolute top-[34px] right-4 flex items-center text-primary">
                  <Loader2 className="animate-spin" size={15} />
                </div>
              )}
            </div>

            <Button type="submit" loading={loading} className="w-full" size="md">
              Verify Secure Code
            </Button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => handleSendOtp(null)}
                disabled={loading}
                className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors disabled:opacity-40 cursor-pointer"
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
            <div className="text-center md:text-left space-y-1.5">
              <div className="h-10 w-10 mx-auto md:mx-0 rounded-sm bg-primary-soft border border-primary/10 flex items-center justify-center text-primary mb-2 shadow-xs">
                <Lock size={18} className="stroke-[1.75]" />
              </div>
              <h2 className="text-xl font-bold tracking-wide text-text-main">Set New Password</h2>
              <p className="text-xs text-text-muted leading-normal">
                Secure your profile. Pick a brand-new alphanumeric string configuration.
              </p>
            </div>

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
              className="text-sm h-10 bg-bg-base rounded-md"
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              className="text-sm h-10 bg-bg-base rounded-md"
            />

            <Button type="submit" loading={loading} className="w-full mt-2" size="md">
              Update Password
            </Button>
          </form>
        )}

        {/* ==========================================================
            SCREEN 4: TRANSACTION TERMINATION AND COMPLETION CANVAS
           ========================================================== */}
        {step === "complete" && (
          <div className="text-center py-2 space-y-5 flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-success-soft border border-success/10 flex items-center justify-center text-success animate-pulse shadow-xs">
              <ShieldCheck size={24} className="stroke-[2]" />
            </div>
            
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold tracking-wide text-text-main">Password Reset!</h2>
              <p className="text-xs text-text-muted leading-normal max-w-xs mx-auto">
                Your credential layout configurations have been cleanly overwritten. You can now access your account workspace.
              </p>
            </div>

            <a href="/login" className="block w-full">
              <Button type="button" className="w-full" size="md">
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