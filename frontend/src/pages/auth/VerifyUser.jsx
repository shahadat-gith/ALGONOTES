import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { ShieldCheck, Mail, RefreshCw, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const VerifyUser = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Extract user session parameters and state sync hooks from context
  const { user, setUser, isAuthenticated } = useAuth();
  
  // Extract email parameter safely from /verify?email=xyz
  const email = searchParams.get("email") || "";

  // UI Processing States
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Auto-trigger OTP generation on component initialization
  useEffect(() => {
    if (!email) {
      toast.error("Missing email parameter. Redirecting to login...");
      navigate("/login");
      return;
    }
    triggerSendOtp(true); // Run initial silent dispatch
  }, [email]);

  // Core controller function to manage backend OTP generation
  const triggerSendOtp = async (isInitialLoad = false) => {
    setSendingOtp(true);
    try {
      const response = await verifyUser({
        email,
        step: "send-otp"
      });
      
      if (response.success) {
        setOtpSent(true);
        toast.success(
          isInitialLoad 
            ? "We sent a 6-digit verification code to your email." 
            : "A fresh code has been sent to your inbox!"
        );
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to deliver verification code.";
      toast.error(errorMsg);
    } finally {
      setSendingOtp(false);
    }
  };

// Submission handler
  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length < 6) {
      return toast.error("Please enter the complete 6-digit verification code.");
    }

    setVerifying(true);
    try {
      const response = await verifyUser({
        email,
        otp,
        step: "otp-verification"
      });

      if (response.success) {
        toast.success("Account successfully verified!");
        
        if (user) {
          // Only update context if the user is already logged in (e.g., verified via modal/banner)
          if (setUser && response.user) {
            setUser(response.user);
          }
          navigate("/"); // Take active user straight to home workspace panel
        } else {
          // If no user is logged in, skip setUser and head to the login screen
          navigate("/login"); 
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Invalid code entry. Please try again.";
      toast.error(errorMsg);
    } finally {
      setVerifying(false);
    }
  };


  if (user?.isVerified) {
    return isAuthenticated ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <Navigate to="/login" replace />
    );
  }



  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[var(--bg-base)] animate-fade-in">
      <div className="w-full max-w-md p-8 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Visual background gradient circle overlay decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary-soft)]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Icon Block */}
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center mx-auto shadow-sm shadow-[var(--primary)]/5">
            <ShieldCheck size={24} className="stroke-[2.2]" />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-main)] tracking-tight">
            Verify Your Account
          </h1>
          <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto leading-relaxed">
            We need to confirm your identity before activating your ALGONOTES workspace.
          </p>
        </div>

        {/* Destination Target Info Board */}
        <div className="p-3.5 bg-[var(--bg-soft)]/60 border border-[var(--border-default)]/60 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-white border border-[var(--border-default)]/40 text-[var(--text-muted)] rounded-lg shrink-0 shadow-sm">
            <Mail size={15} />
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] text-[var(--text-light)] font-bold uppercase tracking-wider">Code sent to</p>
            <p className="text-xs font-semibold text-[var(--text-main)] truncate font-mono">{email}</p>
          </div>
        </div>

        {/* Interactive Entry Submission Form Container */}
        <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              maxLength="6"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Force numeric inputs only
              className="text-center font-mono text-lg tracking-[0.25em] pl-4 font-bold h-12"
              disabled={verifying || sendingOtp}
              required
            />
            {sendingOtp && (
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[var(--primary)]">
                <Loader2 className="animate-spin" size={16} />
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full justify-center h-11 text-sm font-semibold shadow-md shadow-[var(--primary)]/10 transition-all active:scale-[0.99]"
            loading={verifying}
            disabled={sendingOtp}
          >
            Activate Account
            <ArrowRight size={15} className="ml-1" />
          </Button>
        </form>

        {/* Resend Actions Line Divider Tray footer block */}
        <div className="pt-4 border-t border-[var(--border-default)]/60 flex items-center justify-between text-xs">
          <span className="text-[var(--text-light)] font-medium">Didn't receive a code?</span>
          <button
            type="button"
            onClick={() => triggerSendOtp(false)}
            disabled={sendingOtp || verifying}
            className="inline-flex items-center gap-1 font-bold text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            <RefreshCw size={12} className={sendingOtp ? "animate-spin" : ""} />
            Resend Code
          </button>
        </div>

      </div>
    </div>
  );
};

export default VerifyUser;