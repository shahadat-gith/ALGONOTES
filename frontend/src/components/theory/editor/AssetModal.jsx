import React, { useState, useEffect } from "react";
import { Link2, UploadCloud, Trash2, ImagePlus } from "lucide-react";
import { uploadTheoryImage } from "../../../api/theoryApi";
import toast from "react-hot-toast";

const AssetModal = ({
  id,
  activePlaceholderKey,
  onAssetResolved
}) => {
  const [stagedFile, setStagedFile] = useState(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setStagedFile(null);
    setImageUrlInput("");
  }, [activePlaceholderKey]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setStagedFile(file);
    setImageUrlInput(""); 
    toast.success(`Selected: ${file.name}`);
  };

  const handleRemoveStagedFile = () => {
    setStagedFile(null);
    document.getElementById("algonotes-hidden-file-input").value = "";
    toast.success("Image removed.");
  };

  const handleProcessAssetInsertion = async () => {
    if (imageUrlInput.trim() !== "") {
      onAssetResolved(imageUrlInput.trim());
      return;
    }

    if (stagedFile) {
      setIsUploading(true);
      const toastId = toast.loading("Saving image...");
      try {
        const res = await uploadTheoryImage(id, stagedFile);
        if (res?.success && res.imageUrl) {
          onAssetResolved(res.imageUrl);
          toast.success("Image added to note!", { id: toastId });
        } else {
          throw new Error();
        }
      } catch (err) {
        toast.error("Could not upload the image. Please try again.", { id: toastId });
      } finally {
        setIsUploading(false);
      }
      return;
    }

    toast.error("Please paste a link or choose an image file from your computer.");
  };

  return (
    <>
      <input 
        id="algonotes-hidden-file-input" 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        className="hidden" 
      />
      <input type="checkbox" id="asset-modal" className="modal-toggle hidden" />
      
      <div className="modal fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center pointer-events-none opacity-0 transition-opacity peer-checked:opacity-100 peer-checked:pointer-events-auto [input:checked~&]:pointer-events-auto [input:checked~&]:opacity-100">
        <div className="bg-bg-surface border border-border-default max-w-md w-full p-6 rounded-md shadow-card font-sans text-xs flex flex-col gap-4">
          
          <div className="flex items-center justify-between border-b border-border-default pb-2">
            <span className="font-bold text-primary uppercase tracking-wider text-[13px]">
              Add Image or Diagram
            </span>
            <label
              id="algonotes-asset-modal-close"
              htmlFor="asset-modal"
              className="cursor-pointer p-1 text-text-muted hover:text-text-main"
            >
              ✕
            </label>
          </div>

          <p className="text-text-muted text-[12px] leading-relaxed">
            Replacing placeholder: <span className="text-white font-bold">{activePlaceholderKey}</span>
          </p>

          {/* Option A: Paste Link */}
          <div className="flex flex-col gap-1.5">
            <label className="text-text-light font-bold text-[10px] uppercase tracking-wide">Option 1: Paste an Image Link</label>
            <div className="flex items-center border border-border-default rounded-sm bg-bg-base focus-within:border-primary/40 px-2.5">
              <Link2 size={13} className="text-text-light" />
              <input
                type="text"
                value={imageUrlInput}
                disabled={isUploading || !!stagedFile}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://example.com/your-image.png"
                className="bg-transparent w-full p-2 outline-none text-text-main h-8 font-sans disabled:opacity-40"
              />
            </div>
          </div>

          <div className="text-center text-text-light font-bold my-1 text-[10px]">— OR —</div>

          {/* Option B: Choose File */}
          <div className="flex flex-col gap-1.5">
            <label className="text-text-light font-bold text-[10px] uppercase tracking-wide">Option 2: Upload a File from Computer</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isUploading || !!imageUrlInput.trim()}
                onClick={() => document.getElementById("algonotes-hidden-file-input").click()}
                className="px-3 h-8 rounded-sm bg-bg-soft border border-border-strong hover:text-primary transition-all cursor-pointer font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 disabled:opacity-40"
              >
                <ImagePlus size={12} />
                <span>{stagedFile ? "Change File" : "Choose File"}</span>
              </button>

              {stagedFile && (
                <button
                  type="button"
                  onClick={handleRemoveStagedFile}
                  className="p-2 bg-danger-soft text-danger hover:bg-danger hover:text-white rounded-sm transition-all cursor-pointer"
                  title="Remove chosen file"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
            
            {stagedFile && (
              <span className="text-text-muted truncate max-w-full block text-[11px] mt-1">
                Selected: <span className="text-text-main font-semibold">{stagedFile.name}</span>
              </span>
            )}
          </div>

          {/* Footer controls */}
          <div className="flex items-center justify-end gap-2 border-t border-border-default pt-3 mt-2">
            <label
              htmlFor="asset-modal"
              className="px-3 h-8 bg-transparent text-text-muted hover:text-text-main rounded-sm flex items-center justify-center cursor-pointer font-bold uppercase tracking-wider text-[11px]"
            >
              Cancel
            </label>
            <button
              type="button"
              onClick={handleProcessAssetInsertion}
              disabled={isUploading}
              className="px-4 h-8 bg-primary hover:bg-primary-hover text-white font-bold rounded-sm uppercase tracking-wider text-[11px] cursor-pointer flex items-center gap-1.5"
            >
              <UploadCloud size={12} />
              <span>Insert Image</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default AssetModal;