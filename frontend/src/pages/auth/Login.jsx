import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { loginUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import MinimalistLogo from "../../components/logo/MinimalistLogo";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
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
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = await loginUser(formData);

      if (data.success) {
        login(data.token, data.user);
        toast.success(data.message || "Login successful");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base px-4 py-12 relative overflow-hidden">
      {/* Structural Backdrop Radial Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="w-full max-w-[420px] rounded-md border border-border-default bg-bg-surface p-8 shadow-card relative z-10 select-none">
        {/* Upper Identity Branding Row */}
        <div className="mb-8 text-center space-y-2">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center text-primary group transition-transform duration-300 hover:rotate-6">
            <MinimalistLogo className="h-8 w-8" />
          </div>

          <h1 className="text-xl font-bold text-text-main tracking-wide">
            Welcome Back
          </h1>

          <p className="text-xs text-text-muted tracking-wide leading-none">
            Login to continue your DSA preparation.
          </p>
        </div>

        {/* Input Interactive Forms Sheet */}
        <form onSubmit={handleSubmit} className="space-y-5">
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

            {/* Micro Position Toggle Utility Box Button */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[32px] p-1 rounded-sm text-text-light hover:text-text-muted transition-colors cursor-pointer"
              disabled={loading}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {/* Core Operations Deck Options Link */}
          <div className="flex justify-end pt-0.5">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-primary hover:text-primary-hover transition-colors tracking-wide"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full mt-2"
            size="md"
            variant="primary"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Form Footer Redirection Path */}
        <p className="mt-6 text-center text-xs text-text-muted tracking-wide">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-primary hover:text-primary-hover transition-colors ml-1"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;