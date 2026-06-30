import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Glow from "../../components/common/Glow";
import adminApi from "../../api/adminApi";
import { useAdmin } from "../../context/AdminContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAdmin();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password) {
      toast.error("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const data = await adminApi.login(formData.email, formData.password);
      if (data.success) {
        adminLogin(data.token);
        toast.success(data.message || "Admin login successful.");
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.detail || error.response?.data?.message || "Invalid admin credentials.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base px-4 py-12 relative overflow-hidden">
      <Glow preset="auth" />
      <Glow preset="topRight" />

      <div className="w-full max-w-[420px] rounded-xl border border-border-default bg-bg-surface/80 backdrop-blur-xl p-8 shadow-card relative z-10 select-none">
        <div className="mb-8 text-center space-y-3">
          <div className="mx-auto mb-3 flex items-center justify-center group transition-transform duration-300 hover:rotate-6">
            <img src="/logo.png" className="h-14 w-14 rounded-full border border-white/15" alt="ALGONOTES logo" />
          </div>
          <h1 className="text-xl font-bold text-text-main tracking-wide">
            Admin <span className="text-primary">Portal</span>
          </h1>
          <p className="text-xs text-text-muted tracking-wide leading-none">
            Authenticate to access administrative controls.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <div className="absolute top-[34px] left-3.5 z-10 text-text-light pointer-events-none flex items-center">
              <Mail size={14} className="stroke-[1.75]" />
            </div>
            <Input
              label="Admin Email"
              name="email"
              type="email"
              placeholder="admin@algonotes.in"
              value={formData.email}
              onChange={handleChange}
              className="pl-10 text-sm h-10 bg-bg-base rounded-lg"
              disabled={loading}
            />
          </div>

          <div className="relative">
            <div className="absolute top-[34px] left-3.5 z-10 text-text-light pointer-events-none flex items-center">
              <Lock size={14} className="stroke-[1.75]" />
            </div>
            <Input
              label="Admin Password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="pl-10 pr-12 text-sm h-10 bg-bg-base rounded-lg font-mono"
              disabled={loading}
            />
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
            {loading ? "Authenticating..." : "Login to Admin"}
            {!loading && <ArrowRight size={14} className="ml-1" />}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-text-muted">
          <Link to="/" className="font-semibold text-primary hover:text-primary-hover transition-colors">
            &larr; Back to ALGONOTES
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
