import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTheoryNote, updateTheoryNote, uploadTheoryImage } from "../../api/theoryApi";

import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import { Eye, Code, Save, ArrowLeft, BookMarked, UploadCloud, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

const TheoryEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState("Loading Concept...");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState(null); // Tracks active placeholder upload state
  const [apiError, setApiError] = useState("");
  const [activeTab, setActiveTab] = useState("edit"); // "edit" | "preview"

  useEffect(() => {
    const fetchTheoryData = async () => {
      try {
        const res = await getTheoryNote(id);
        if (res?.success) {
          setTopic(res.theory.topic);
          setContent(res.theory.content || "");
        } else {
          throw new Error();
        }
      } catch (err) {
        setApiError("Could not retrieve the requested theory masterclass data.");
      } finally {
        setLoading(false);
      }
    };
    fetchTheoryData();
  }, [id]);

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const res = await updateTheoryNote(id, { content });
      if (res?.success) {
        toast.success("Changes committed successfully!");
      }
    } catch (err) {
      toast.error("Failed to commit content modifications.");
    } finally {
      setSaving(false);
    }
  };

  const handlePlaceholderImageUpload = async (placeholderKey, file) => {
    if (!file) return;
    setUploadingKey(placeholderKey);
    const toastId = toast.loading("Uploading image to Cloudinary storage...");

    try {
      const res = await uploadTheoryImage(id, file);
      if (res?.success && res.imageUrl) {
        // Swap out the targeted 'ai-placeholder-X' indicator token with the secure Cloudinary CDN url string match
        const updatedContent = content.replace(placeholderKey, res.imageUrl);
        setContent(updatedContent);
        toast.success("Image injected successfully!", { id: toastId });
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Asset pipeline upload failed. Please try again.", { id: toastId });
    } finally {
      setUploadingKey(null);
    }
  };

  // Helper template renderer to catch AI-placeholders dynamically on client viewport runs
  const renderPreviewWithInteractivePlaceholders = (textString) => {
    if (!textString) return null;

    // Regex to detect markdown image notation layout: ![Alt Text](src_path)
    const markdownImageRegex = /!\[([^\]]*)\]\(([^)]*)\)/g;
    const segments = [];
    let lastIndex = 0;
    let match;

    while ((match = markdownImageRegex.exec(textString)) !== null) {
      const [fullMatch, altText, srcPath] = match;
      const matchIndex = match.index;

      // Push raw text block preceding the matching image boundary context
      if (matchIndex > lastIndex) {
        segments.push(
          <span key={`text-${lastIndex}`} className="whitespace-pre-wrap">
            {textString.substring(lastIndex, matchIndex)}
          </span>
        );
      }

      // Evaluate if target src is an unfulfilled AI layout key
      if (srcPath.startsWith("ai-placeholder")) {
        segments.push(
          <div key={`placeholder-${srcPath}`} className="my-6 border border-dashed border-primary/30 bg-primary-soft/5 rounded-md p-5 text-center animate-fade-in max-w-2xl mx-auto">
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 rounded-xs bg-primary/10 text-primary">
                <ImageIcon size={18} />
              </div>
              <p className="text-[11px] font-mono text-primary font-bold uppercase tracking-widest">
                Visual Concept Diagram Needed
              </p>
              <p className="text-xs text-text-muted max-w-md leading-relaxed font-normal mb-3">
                {altText || "An illustrative diagram is required here."}
              </p>
              
              <label className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-[11px] font-mono font-bold uppercase tracking-wider border cursor-pointer select-none transition-colors ${
                uploadingKey === srcPath 
                  ? "bg-bg-soft border-border-default text-text-light pointer-events-none" 
                  : "bg-bg-base border-border-strong text-text-main hover:bg-bg-soft hover:border-primary/40"
              }`}>
                <UploadCloud size={12} />
                <span>{uploadingKey === srcPath ? "Uploading..." : "Upload Asset"}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingKey !== null}
                  onChange={(e) => handlePlaceholderImageUpload(srcPath, e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        );
      } else {
        // If it's a real CDN URL, render it cleanly inside our standard responsive design viewport image block
        segments.push(
          <div key={`img-${srcPath}`} className="my-6 flex flex-col items-center gap-2 animate-fade-in">
            <img 
              src={srcPath} 
              alt={altText} 
              className="rounded-sm border border-border-default max-h-[450px] object-contain shadow-card w-full lg:max-w-3xl" 
            />
            {altText && <span className="text-[11px] font-mono text-text-light tracking-wide">{altText}</span>}
          </div>
        );
      }

      lastIndex = markdownImageRegex.lastIndex;
    }

    // Append any trailing remaining blocks safely
    if (lastIndex < textString.length) {
      segments.push(
        <span key={`text-${lastIndex}`} className="whitespace-pre-wrap">
          {textString.substring(lastIndex)}
        </span>
      );
    }

    return segments;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-mono text-xs text-text-muted select-none">
        <span className="animate-pulse">Loading core concept masterclass blueprints...</span>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6">
        <Alert title="Data Hydration Error" message={apiError} variant="danger" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col h-[calc(100vh-6rem)] max-h-[calc(100vh-6rem)] overflow-hidden animate-fade-in select-none">
      
      {/* Editor Control Sticky Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default pb-4 mb-6 shrink-0 font-mono">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-1.5 rounded-sm border border-border-default bg-bg-surface text-text-light hover:text-text-main hover:bg-bg-soft transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-primary">
              <BookMarked size={11} />
              <span>CS Theory Workspace</span>
            </div>
            <h1 className="text-base font-bold text-text-main tracking-wide truncate">
              {topic}
            </h1>
          </div>
        </div>

        {/* Workspace Tab Triggers Cluster */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center rounded-sm bg-bg-soft border border-border-default p-0.5 text-[11px] font-semibold">
            <button
              onClick={() => setActiveTab("edit")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs transition-all cursor-pointer ${
                activeTab === "edit" ? "bg-bg-surface text-primary border border-border-default shadow-xs" : "text-text-muted hover:text-text-main"
              }`}
            >
              <Code size={13} />
              <span>Editor</span>
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs transition-all cursor-pointer ${
                activeTab === "preview" ? "bg-bg-surface text-primary border border-border-default shadow-xs" : "text-text-muted hover:text-text-main"
              }`}
            >
              <Eye size={13} />
              <span>Preview</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            loading={saving}
            onClick={handleSaveChanges}
            className="font-semibold text-xs tracking-widest uppercase h-8 px-4 bg-primary hover:bg-primary-hover text-white cursor-pointer"
          >
            <Save size={13} />
            <span>Save</span>
          </Button>
        </div>
      </div>

      {/* Main Multi-Track Editor Split Grid Workspace */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-6 h-full items-stretch">
        
        {/* Left Side Content Textarea Markdown Editor Container */}
        <div className={`h-full flex flex-col min-h-0 ${activeTab === "edit" ? "block" : "hidden lg:flex"}`}>
          <div className="flex-1 min-h-0 rounded-md border border-border-default relative bg-bg-surface overflow-hidden">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full p-5 bg-bg-base font-mono text-[14px] leading-6 text-text-main placeholder-text-light/30 resize-none outline-hidden custom-scrollbar"
              placeholder="# Enter deep markdown documentation structure strings..."
            />
          </div>
        </div>

        {/* Right Side Adaptive Content View Preview Panel */}
        <div className={`h-full flex flex-col min-h-0 bg-bg-surface border border-border-default rounded-md p-6 overflow-y-auto custom-scrollbar shadow-card ${
          activeTab === "preview" ? "block" : "hidden lg:block"
        }`}>
          {content.trim() === "" ? (
            <div className="h-full flex items-center justify-center font-mono text-xs text-text-light">
              No markdown data logs written yet.
            </div>
          ) : (
            <article className="text-[14px] md:text-[16px] leading-7 text-text-muted font-normal tracking-wide selection:bg-primary/20">
              {renderPreviewWithInteractivePlaceholders(content)}
            </article>
          )}
        </div>

      </div>
    </div>
  );
};

export default TheoryEditor;