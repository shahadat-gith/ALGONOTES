import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../api/userApi";
import AnimatedModal from "../common/AnimatedModal";
import Button from "../common/Button";
import Input from "../common/Input";
import { User as UserIcon, AtSign, Upload, Save, X } from "lucide-react";
import toast from "react-hot-toast";

const EditProfileModal = ({ isOpen, onClose }) => {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);

  // Form Field States
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  // Local object URL pointer used to draw the binary thumbnail selection instantly
  const [previewUrl, setPreviewUrl] = useState("");
  const [updating, setUpdating] = useState(false);

  // Sync existing database information inside state parameters whenever modal opens
  useEffect(() => {
    if (user && isOpen) {
      setName(user.name || "");
      setUsername(user.username || "");
      setPreviewUrl(user.avatar?.url || "");
      setAvatarFile(null); // Reset file buffer on open
    }
  }, [user, isOpen]);

  // Handle local image file selection streams
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please pick a valid image file (PNG/JPG).");
    }
    if (file.size > 3 * 1024 * 1024) {
      return toast.error("Image size must be smaller than 3MB.");
    }

    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return toast.error("Name field cannot be left blank.");
    }

    setUpdating(true);
    try {
      // Package payload fields onto native multipart FormData for Multer/Cloudinary backend parsers
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("username", username.trim());

      if (avatarFile) {
        formData.append("file", avatarFile);
      }

      const response = await updateProfile(formData);

      if (response.success) {
        toast.success("Profile updated successfully!");

        if (setUser) {
          setUser(response.user);
        }
        onClose(); // Shut the modal frame cleanly upon database commit response
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Something went wrong while saving changes.";
      toast.error(errorMsg);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      /* Centering: max-w-md keeps it clean, mx-auto centers horizontally if needed, shadow blocks elevate it */
      className="max-w-md w-full bg-white p-6 rounded-2xl relative space-y-5 shadow-2xl"
    >
      <div>
        {/* Upper Modal Window Actions Bar */}
        <div className="flex items-center justify-between border-b border-[var(--border-default)]/60 pb-3 select-none">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-main)] tracking-tight">
              Edit Profile
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Modify credentials and update account images.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-light)] hover:text-[var(--text-main)] hover:bg-[var(--bg-soft)] transition-colors"
            disabled={updating}
          >
            <X size={16} />
          </button>
        </div>

        {/* Dynamic Image Upload Zone Thumbnail Circle */}
        <div className="flex flex-col items-center justify-center text-center py-4">
          <div
            onClick={() => !updating && fileInputRef.current?.click()}
            className="h-20 w-20 rounded-full border-2 border-dashed border-[var(--primary)]/40 hover:border-[var(--primary)] bg-[var(--primary-soft)]/20 text-[var(--primary)] flex items-center justify-center overflow-hidden shadow-inner cursor-pointer group relative transition-all duration-300"
            title="Click to pick a photo"
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Avatar preview thumbnail"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <span className="text-xl font-black">
                {name?.charAt(0).toUpperCase() || "A"}
              </span>
            )}

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-150">
              <Upload size={14} className="animate-pulse" />
              <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">
                Change
              </span>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            disabled={updating}
          />
        </div>

        {/* Input Parameters Fields Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Full Name field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">
              Full Name
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--text-light)]">
                <UserIcon size={16} />
              </div>
              <Input
                type="text"
                placeholder="Your display name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-11 h-11 text-sm"
                disabled={updating}
                required
              />
            </div>
          </div>

          {/* Unique Username field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">
              Unique Username
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--text-light)]">
                <AtSign size={16} />
              </div>
              <Input
                type="text"
                placeholder="Your unique handle identifier"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))
                }
                className="pl-11 h-11 font-mono text-sm"
                disabled={updating}
              />
            </div>
          </div>

          {/* Lower Actions Operation Control Deck Toolbar */}
          <div className="pt-4 border-t border-[var(--border-default)]/60 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updating}
              className="text-xs h-9 font-bold bg-white"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              loading={updating}
              className="text-xs h-9 font-bold shadow-none"
            >
              <Save size={13} />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </AnimatedModal>
  );
};

export default EditProfileModal;
