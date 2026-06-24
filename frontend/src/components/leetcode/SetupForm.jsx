import { useState, useEffect } from "react";
import { AlertTriangle, UserX, ArrowRight } from "lucide-react";
import { updateProfile } from "../../api/userApi";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const SetupForm = ({ currentUsername, error, onSuccess }) => {
  const [username, setUsername] = useState("");
  const [updating, setUpdating] = useState(false);

  const { setUser } = useAuth()

  useEffect(() => {
    setUsername(currentUsername || "");
  }, [currentUsername]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || updating) return;

    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("leetcode_username", username.trim());
      const data = await updateProfile(formData);
      if (data.success) {
        setUser(data.user)
        onSuccess();
      }
    } catch (err) {
      toast.error("Failed to update username. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-bg-surface border border-border-default rounded-xl p-6 md:p-8 shadow-card space-y-6 animate-fade-in">
      <div className="flex items-center gap-3.5">
        <div
          className={`p-3 rounded-lg ${error ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"}`}
        >
          {error ? <AlertTriangle size={24} /> : <UserX size={24} />}
        </div>
        <div>
          <h2 className="text-lg font-bold text-text-main">
            {error ? "Invalid Username" : "Link LeetCode Account"}
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            {error
              ? "The provided handle doesn't map to an active profile."
              : "Connect your LeetCode profile to pull coding tracking metrics."}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 text-xs font-medium rounded-lg bg-red-500/5 border border-red-500/20 text-red-400 leading-relaxed">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            LeetCode Username
          </label>
          <input
            type="text"
            placeholder="e.g., john_doe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={updating}
            className="w-full px-4 py-2.5 rounded-lg border border-border-default bg-bg-main text-text-main text-sm outline-none focus:border-primary transition-all disabled:opacity-60"
          />
        </div>
        <button
          type="submit"
          disabled={updating || !username.trim()}
          className="w-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updating
            ? "Saving changes..."
            : currentUsername
              ? "Update Handle"
              : "Connect Account"}
          {!updating && <ArrowRight size={16} />}
        </button>
      </form>
    </div>
  );
};

export default SetupForm;