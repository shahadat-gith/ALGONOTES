import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { forgotPassword } from "../../api/authApi";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { Mail, Lock, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { getSafeNextPath } from "../../utils/authRedirect";

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const nextPath = getSafeNextPath(searchParams.get("next"), "/");

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
    if (!email || !email.trim()) return setError("Please enter your email address.");

    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      const response = await forgotPassword({ email: email.toLowerCase().trim(), step: "send-otp" });
      if (response.success) {
        setSuccessMessage(response.message || "Verification code dispatched successfully.");
        setStep("verify-otp");
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.message || "Something went wrong. Please try again.");
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
    setSuccessMessage(""); // Clear old message before transition
    try {
      const response = await forgotPassword({ email: email.toLowerCase().trim(), otp, step: "verify-otp" });
      if (response.success) {
        setSuccessMessage(response.message || "Code verified successfully.");
        setStep("reset-password");
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.message || "Invalid or expired token code.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Commit the New Password Mutation
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword) return setError("Please enter a new password.");
    if (newPassword.length < 6) return setError("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");

    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      const response = await forgotPassword({ 
        email: email.toLowerCase().trim(), 
        newPassword, 
        step: "reset-password" 
      });
      if (response.success) {
        setSuccessMessage(response.message || "Password updated successfully.");
        setStep("complete");
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.message || "Failed to update your password credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base px-4 py-12 relative overflow-hidden selection:bg-primary/20">
      {/* Premium Ambient Background Blur Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="w-full max-w-[420px] bg-bg-surface border border-border-default rounded-lg shadow-card p-8 relative z-10 transition-all duration-300 hover:border-border-strong">
        
        {/* Universal Brand Identity Header Layer */}
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/logo.png" 
            alt="ALGONOTES Logo" 
            className="h-10 w-auto object-contain mb-2 select-none pointer-events-none rounded-full"
            onError={(e) => {
              e.target.style.display = 'none'; 
            }}
          />
          <span className="text-xs uppercase font-semibold tracking-[0.2em] text-primary">ALGONOTES</span>
        </div>

        {/* Global Alert Notification Banners */}
        {error && (
          <div className="mb-5 p-3.5 rounded-sm bg-danger-soft border border-danger/10 text-xs font-medium text-danger animate-in fade-in slide-in-from-top-2 duration-200">
            {error}
          </div>
        )}
        
        {successMessage && step !== "complete" && (
          <div className="mb-5 p-3.5 rounded-sm bg-success-soft border border-success/10 text-xs font-medium text-success animate-in fade-in slide-in-from-top-2 duration-200">
            {successMessage}
          </div>
        )}

        {/* Back Arrow Controls for Mid-Flow Resets */}
        {step !== "send-otp" && step !== "complete" && (
          <button
            type="button"
            onClick={() => {
              setError("");
              setSuccessMessage("");
              setStep(step === "verify-otp" ? "send-otp" : "verify-otp");
            }}
            className="absolute top-6 left-6 text-text-muted hover:text-text-main transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            <ArrowLeft size={14} /> Back
          </button>
        )}

        {/* SCREEN 1: ENTER EMAIL STRING FOR INITIAL OTP CAPTURE */}
        {step === "send-otp" && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="text-center space-y-1.5">
              <h2 className="text-xl font-bold tracking-wide text-text-main">Forgot Password?</h2>
              <p className="text-xs text-text-muted leading-normal max-w-[280px] mx-auto">
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
                className="pl-10 text-sm h-10 bg-bg-base rounded-md focus:border-primary/50 transition-colors"
              />
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2" size="md">
              Send Verification Code
            </Button>

            <div className="text-center pt-2">
              <Link 
                to={`/login?next=${encodeURIComponent(nextPath)}`} 
                className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-main transition-colors font-medium"
              >
                <ArrowLeft size={12} /> Return to Sign In
              </Link>
            </div>
          </form>
        )}

        {/* SCREEN 2: SUBMIT CODE STRING SENT BY BACKEND INBOX */}
        {step === "verify-otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="text-center space-y-1.5">
              <div className="h-10 w-10 mx-auto rounded-sm bg-primary-soft border border-primary/10 flex items-center justify-center text-primary mb-2 shadow-xs">
                <Mail size={18} className="stroke-[1.75]" />
              </div>
              <h2 className="text-xl font-bold tracking-wide text-text-main">Check Your Inbox</h2>
              <p className="text-xs text-text-muted leading-normal max-w-[300px] mx-auto">
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
                className="text-center font-mono text-lg tracking-[0.4em] pl-4 font-bold h-11 bg-bg-base rounded-md focus:placeholder:opacity-0 focus:border-primary/50 transition-all"
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

        {/* SCREEN 3: WRITE AND COMPILE REPLACEMENT PASSWORD MUTATION */}
        {step === "reset-password" && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="text-center space-y-1.5">
              <h2 className="text-xl font-bold tracking-wide text-text-main">Set New Password</h2>
              <p className="text-xs text-text-muted leading-normal max-w-[280px] mx-auto">
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
              className="text-sm h-10 bg-bg-base rounded-md focus:border-primary/50 transition-colors"
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              className="text-sm h-10 bg-bg-base rounded-md focus:border-primary/50 transition-colors"
            />

            <Button type="submit" loading={loading} className="w-full mt-2" size="md">
              Update Password
            </Button>
          </form>
        )}

        {/* SCREEN 4: TRANSACTION TERMINATION AND COMPLETION CANVAS */}
        {step === "complete" && (
          <div className="text-center py-2 space-y-5 flex flex-col items-center animate-in zoom-in-95 duration-300">
            <div className="h-12 w-12 rounded-full bg-success-soft border border-success/10 flex items-center justify-center text-success shadow-xs">
              <ShieldCheck size={24} className="stroke-[2]" />
            </div>
            
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold tracking-wide text-text-main">Password Reset!</h2>
              <p className="text-xs text-text-muted leading-normal max-w-xs mx-auto">
                Your credential layout configurations have been cleanly overwritten. You can now access your account workspace.
              </p>
            </div>

            <Link to={`/login?next=${encodeURIComponent(nextPath)}`} className="block w-full">
              <Button type="button" className="w-full" size="md">
                Sign In
              </Button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;