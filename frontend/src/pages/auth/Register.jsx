import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { registerUser } from "../../api/authApi";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = await registerUser(formData);

      if (data.success) {
        toast.success(data.message || "Registration successful! Please verify your account.");
        // Redirect directly to verification layout to enter the newly generated email OTP
        navigate(`/verify?email=${encodeURIComponent(formData.email.toLowerCase().trim())}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base px-4 py-12 relative overflow-hidden">
      {/* Structural Ambient Glow Backdrop Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="w-full max-w-[420px] rounded-md border border-border-default bg-bg-surface p-8 shadow-card relative z-10 select-none">
        {/* Upper Header Branding Column */}
        <div className="mb-8 text-center space-y-2">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center text-primary group transition-transform duration-300 hover:rotate-6">
            <img src="/logo.png" className="h-10 w-10 rounded-full" alt="ALGONOTES logo" />
          </div>

          <h1 className="text-xl font-bold text-text-main tracking-wide">
            Create Account
          </h1>

          <p className="text-xs text-text-muted tracking-wide leading-none">
            Start building your personal DSA notes library.
          </p>
        </div>

        {/* Dynamic Registration Input Form Rows */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <div className="absolute top-[34px] left-3.5 z-10 text-text-light pointer-events-none flex items-center">
              <User size={14} className="stroke-[1.75]" />
            </div>
            <Input
              label="Full Name"
              name="name"
              type="text"
              placeholder="Alex Fischer"
              value={formData.name}
              onChange={handleChange}
              className="pl-10 text-sm h-10 bg-bg-base rounded-md"
              disabled={loading}
            />
          </div>

          <div className="relative">
            <div className="absolute top-[34px] left-3.5 z-10 text-text-light pointer-events-none flex items-center">
              <Mail size={14} className="stroke-[1.75]" />
            </div>
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="name@domain.com"
              value={formData.email}
              onChange={handleChange}
              className="pl-10 text-sm h-10 bg-bg-base rounded-md"
              disabled={loading}
            />
          </div>

          <div className="relative">
            <div className="absolute top-[34px] left-3.5 z-10 text-text-light pointer-events-none flex items-center">
              <Lock size={14} className="stroke-[1.75]" />
            </div>
            <Input
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="pl-10 pr-12 text-sm h-10 bg-bg-base rounded-md font-mono"
              disabled={loading}
            />

            {/* Micro Toggle Visibility Trigger Box */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[32px] p-1 rounded-sm text-text-light hover:text-text-muted transition-colors cursor-pointer"
              disabled={loading}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full mt-2"
            size="md"
            variant="primary"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        {/* Redirect Route Footer Element */}
        <p className="mt-6 text-center text-xs text-text-muted tracking-wide">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary hover:text-primary-hover transition-colors ml-1"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;