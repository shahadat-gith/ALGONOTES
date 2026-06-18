import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Navigate } from "react-router-dom";
import { verifyUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { Mail, RefreshCw, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const VerifyUser = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Extract user parameters and session triggers from context safely
  const { user, setUser, isAuthenticated, login } = useAuth();
  
  // Extract email parameter safely from URL queries
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
    triggerSendOtp(true);
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
      const errorMsg = err.response?.data?.detail || err.response?.data?.message || "Failed to deliver verification code.";
      toast.error(errorMsg);
    } finally {
      setSendingOtp(false);
    }
  };

  // Submission handler mapping verification transitions
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
        
        // Synchronize state containers globally across components
        if (response.user) {
          if (setUser) {
            setUser(response.user);
          }
          // If the server passes back an upgraded session authorization token on verification
          if (response.token) {
            login(response.token, response.user);
          }
          navigate("/"); 
        } else {
          navigate("/login"); 
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.response?.data?.message || "Invalid code entry. Please try again.";
      toast.error(errorMsg);
    } finally {
      setVerifying(false);
    }
  };

  if (user?.verificationOptions?.status === "verified") {
    return isAuthenticated ? (
      <Navigate to="/" replace />
    ) : (
      <Navigate to="/login" replace />
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-bg-base relative overflow-hidden">
      {/* Structural Ambient Glow Backdrop Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="w-full max-w-[420px] p-8 bg-bg-surface border border-border-default rounded-md shadow-card space-y-6 relative z-10 select-none">
        
        {/* Brand Icon Block */}
        <div className="text-center space-y-3">
          <div className="h-11 w-11 rounded-sm bg-primary-soft text-primary flex items-center justify-center mx-auto border border-primary/10 shadow-xs">
            <img src="/logo.png" className="h-10 w-10 rounded-full" alt="ALGONOTES logo" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-text-main tracking-wide">
              Verify Your Account
            </h1>
            <p className="text-xs text-text-muted max-w-xs mx-auto leading-normal">
              We need to confirm your identity before activating your ALGONOTES workspace.
            </p>
          </div>
        </div>

        {/* Destination Target Info Board */}
        <div className="p-3.5 bg-bg-soft border border-border-default rounded-sm flex items-center gap-3.5">
          <div className="p-2 bg-bg-base border border-border-default text-text-muted rounded-sm shrink-0">
            <Mail size={14} className="stroke-[1.75]" />
          </div>
          <div className="overflow-hidden flex flex-col gap-0.5">
            <p className="text-[10px] text-text-light font-bold uppercase tracking-widest leading-none">Code sent to</p>
            <p className="text-xs font-medium text-text-main truncate font-mono tracking-wide">{email}</p>
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
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} 
              className="text-center font-mono text-lg tracking-[0.25em] pl-4 font-bold h-11 bg-bg-base rounded-md"
              disabled={verifying || sendingOtp}
              required
            />
            {sendingOtp && (
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-primary">
                <Loader2 className="animate-spin" size={15} />
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full h-11 text-xs"
            loading={verifying}
            disabled={sendingOtp}
          >
            <span>Activate Account</span>
            <ArrowRight size={14} className="ml-1 stroke-[2]" />
          </Button>
        </form>

        {/* Resend Actions Line Divider Tray footer block */}
        <div className="pt-5 border-t border-border-default flex items-center justify-between text-xs">
          <span className="text-text-light font-medium">Didn't receive a code?</span>
          <button
            type="button"
            onClick={() => triggerSendOtp(false)}
            disabled={sendingOtp || verifying}
            className="inline-flex items-center gap-1.5 font-semibold text-primary hover:text-primary-hover transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            <RefreshCw size={12} className={`stroke-[2] ${sendingOtp ? "animate-spin" : ""}`} />
            <span>Resend Code</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default VerifyUser;