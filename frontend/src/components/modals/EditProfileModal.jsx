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
        onClose(); 
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
      className="max-w-md w-full bg-bg-surface p-6 rounded-md border border-border-default space-y-6 shadow-card"
    >
      <div className="space-y-6">
        {/* Upper Modal Window Actions Bar */}
        <div className="flex items-start justify-between border-b border-border-default pb-4 select-none">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-text-main tracking-wide">
              Edit Profile
            </h2>
            <p className="text-xs text-text-muted leading-none">
              Modify credentials and update account images.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-sm text-text-light hover:text-text-main hover:bg-bg-soft transition-colors cursor-pointer"
            disabled={updating}
          >
            <X size={15} />
          </button>
        </div>

        {/* Dynamic Image Upload Zone Thumbnail Circle */}
        <div className="flex flex-col items-center justify-center text-center pt-2 pb-4">
          <div
            onClick={() => !updating && fileInputRef.current?.click()}
            className="h-20 w-20 rounded-full border border-dashed border-primary/40 hover:border-primary bg-bg-soft text-primary flex items-center justify-center overflow-hidden shadow-inner cursor-pointer group relative transition-all duration-200 ring-4 ring-transparent hover:ring-primary-soft"
            title="Click to pick a photo"
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Avatar preview thumbnail"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <span className="text-lg font-bold text-text-main select-none">
                {name?.charAt(0).toUpperCase() || "A"}
              </span>
            )}

            <div className="absolute inset-0 bg-bg-base/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-text-main transition-opacity duration-200">
              <Upload size={13} className="text-primary stroke-[2.2]" />
              <span className="text-[9px] font-semibold mt-1 uppercase tracking-wider text-text-muted">
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
        <form onSubmit={handleFormSubmit} className="space-y-5">
          
          {/* Full Name field */}
          <div className="space-y-1.5 relative">
            <div className="absolute top-[34px] left-3.5 z-10 text-text-light pointer-events-none flex items-center">
              <UserIcon size={14} className="stroke-[1.75]" />
            </div>
            <Input
              label="Full Name"
              type="text"
              placeholder="Your display name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 text-sm h-10 bg-bg-base"
              disabled={updating}
              required
            />
          </div>

          {/* Unique Username field */}
          <div className="space-y-1.5 relative">
            <div className="absolute top-[34px] left-3.5 z-10 text-text-light pointer-events-none flex items-center">
              <AtSign size={14} className="stroke-[1.75]" />
            </div>
            <Input
              label="Unique Username"
              type="text"
              placeholder="Your unique handle identifier"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))
              }
              className="pl-10 text-sm h-10 font-mono bg-bg-base"
              disabled={updating}
            />
          </div>

          {/* Lower Actions Operation Control Deck Toolbar */}
          <div className="pt-5 border-t border-border-default flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updating}
              size="sm"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              loading={updating}
              size="sm"
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