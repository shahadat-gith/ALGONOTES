import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTheoryNote, updateTheoryNote, uploadTheoryImage } from "../../api/theoryApi";

import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import { Eye, Code, Save, ArrowLeft, BookMarked, UploadCloud, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

// Markdown Parser Components
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const TheoryEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState("Loading Topic...");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState(null); 
  const [apiError, setApiError] = useState("");
  const [activeTab, setActiveTab] = useState("preview"); // Default to pristine "Read" parsed layout view

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
        setApiError("Could not load the requested study note content.");
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
        toast.success("Changes saved successfully!");
        setActiveTab("preview"); // Flip cleanly back to the optimized reading view on completion
      }
    } catch (err) {
      toast.error("Failed to save your changes.");
    } finally {
      setSaving(false);
    }
  };

  const handlePlaceholderImageUpload = async (placeholderKey, file) => {
    if (!file) return;
    setUploadingKey(placeholderKey);
    const toastId = toast.loading("Uploading image...");

    try {
      const res = await uploadTheoryImage(id, file);
      if (res?.success && res.imageUrl) {
        const updatedContent = content.replace(placeholderKey, res.imageUrl);
        setContent(updatedContent);
        toast.success("Image added to your note!", { id: toastId });
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Failed to upload the image. Please try again.", { id: toastId });
    } finally {
      setUploadingKey(null);
    }
  };

  const markdownComponents = {
    img: ({ src, alt }) => {
      if (src && src.startsWith("ai-placeholder")) {
        return (
          <div className="my-6 border border-dashed border-primary/30 bg-primary-soft/5 rounded-md p-5 text-center animate-fade-in max-w-2xl mx-auto select-none">
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 rounded-xs bg-primary/10 text-primary">
                <ImageIcon size={18} />
              </div>
              <p className="text-[11px] font-mono text-primary font-bold uppercase tracking-widest">
                Diagram Placeholder
              </p>
              <p className="text-xs text-text-muted max-w-md leading-relaxed font-normal mb-3">
                {alt || "An illustrative chart or diagram goes here."}
              </p>
              
              <label className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-[11px] font-mono font-bold uppercase tracking-wider border cursor-pointer select-none transition-colors ${
                uploadingKey === src 
                  ? "bg-bg-soft border-border-default text-text-light pointer-events-none" 
                  : "bg-bg-base border-border-strong text-text-main hover:bg-bg-soft hover:border-primary/40"
              }`}>
                <UploadCloud size={12} />
                <span>{uploadingKey === src ? "Uploading..." : "Upload Image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingKey !== null}
                  onChange={(e) => handlePlaceholderImageUpload(src, e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        );
      }

      return (
        <div className="my-6 flex flex-col items-center gap-2 animate-fade-in select-none">
          <img 
            src={src} 
            alt={alt} 
            className="rounded-sm border border-border-default max-h-[500px] object-contain shadow-card w-full lg:max-w-4xl" 
          />
          {alt && <span className="text-[11px] font-mono text-text-light tracking-wide">{alt}</span>}
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-mono text-xs text-text-muted select-none">
        <span className="animate-pulse">Loading your study note material...</span>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6">
        <Alert title="Loading Error" message={apiError} variant="danger" />
      </div>
    );
  }

  return (
    /* Increased layout view parameter bounds directly to max-w-1400px with native auto-height execution rules */
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-6 flex flex-col min-h-screen animate-fade-in">
      
      {/* Dynamic Header Toolbar Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default pb-4 mb-6 font-mono select-none">
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
              <span>Workspace Note</span>
            </div>
            <h1 className="text-base font-bold text-text-main tracking-wide truncate">
              {topic}
            </h1>
          </div>
        </div>

        {/* View Layout Controls Toggle Panel */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center rounded-sm bg-bg-soft border border-border-default p-0.5 text-[11px] font-semibold">
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs transition-all cursor-pointer ${
                activeTab === "preview" ? "bg-bg-surface text-primary border border-border-default shadow-xs" : "text-text-muted hover:text-text-main"
              }`}
            >
              <Eye size={13} />
              <span>Read</span>
            </button>
            <button
              onClick={() => setActiveTab("edit")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs transition-all cursor-pointer ${
                activeTab === "edit" ? "bg-bg-surface text-primary border border-border-default shadow-xs" : "text-text-muted hover:text-text-main"
              }`}
            >
              <Code size={13} />
              <span>Write</span>
            </button>
          </div>

          {activeTab === "edit" && (
            <Button
              variant="primary"
              size="sm"
              loading={saving}
              onClick={handleSaveChanges}
              className="font-semibold text-xs tracking-widest uppercase h-8 px-4 bg-primary hover:bg-primary-hover text-white cursor-pointer"
            >
              <Save size={13} />
              <span>Save Changes</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Container Section (Expands natively with document sizing context, zero inner-scroll limits) */}
      <div className="w-full flex-1">
        
        {/* Full-Width Auto-Sizing Plaintext Textarea Workspace */}
        {activeTab === "edit" && (
          <div className="w-full rounded-md border border-border-default bg-bg-surface overflow-hidden">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              /* Removed fixed h-full boundaries, set raw row dimensions or min-h rules for uninhibited fluid expansions */
              className="w-full min-h-[600px] p-6 bg-bg-base font-mono text-[14px] leading-6 text-text-main placeholder-text-light/30 resize-y outline-hidden"
              placeholder="# Use standard text formatting patterns to frame your note topics..."
            />
          </div>
        )}

        {/* Full-Width Rendered HTML Document Output Canvas */}
        {activeTab === "preview" && (
          <div className="w-full bg-bg-surface border border-border-default rounded-md p-6 sm:p-8 md:p-10 shadow-card">
            {content.trim() === "" ? (
              <div className="py-20 text-center font-mono text-xs text-text-light select-none">
                This note is empty. Click "Write" above to add some content.
              </div>
            ) : (
              <article className="prose prose-invert max-w-none text-[15px] leading-7 text-text-muted font-normal tracking-wide selection:bg-primary/20 break-words
                prose-headings:text-text-main prose-headings:font-bold prose-headings:tracking-wide prose-headings:mt-6 prose-headings:mb-3
                prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
                prose-code:text-primary prose-code:bg-bg-soft prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-xs prose-code:text-xs prose-code:font-mono
                prose-pre:bg-bg-base prose-pre:border prose-pre:border-border-default prose-pre:p-4 prose-pre:rounded-md
                prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5 prose-li:my-1
                prose-table:w-full prose-table:border-collapse prose-th:border-b prose-th:border-border-strong prose-th:pb-2 prose-th:text-text-main prose-td:border-b prose-td:border-border-default prose-td:py-2">
                
                <ReactMarkdown 
                  rehypePlugins={[rehypeRaw]} 
                  components={markdownComponents}
                >
                  {content}
                </ReactMarkdown>
                
              </article>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default TheoryEditor;