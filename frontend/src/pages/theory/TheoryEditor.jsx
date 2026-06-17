import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTheoryNote, updateTheoryNote } from "../../api/theoryApi";

import Alert from "../../components/common/Alert";
import Header from "../../components/theory/editor/Header";
import Toolbar from "../../components/theory/editor/Toolbar";
import AssetModal from "../../components/theory/editor/AssetModal";
import toast from "react-hot-toast";

import "./Theory.css";

const TheoryEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const [topic, setTopic] = useState("Loading Topic...");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  const [initialContent, setInitialContent] = useState("");
  const [activePlaceholderKey, setActivePlaceholderKey] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchTheoryData = async () => {
      try {
        const res = await getTheoryNote(id);
        if (res?.success && isMounted) {
          setTopic(res.theory.topic);
          setInitialContent(res.theory.content || "");
        } else {
          throw new Error();
        }
      } catch (err) {
        if (isMounted) setApiError("Could not load the requested study note content.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTheoryData();
    return () => { isMounted = false; };
  }, [id]);

  useEffect(() => {
    if (!loading && editorRef.current && initialContent) {
      editorRef.current.innerHTML = initialContent;
      attachPlaceholderInterceptors();
    }
  }, [loading, initialContent]);

  const attachPlaceholderInterceptors = () => {
    if (!editorRef.current) return;
    const images = editorRef.current.querySelectorAll('img[src*="ai-placeholder"]');
    
    images.forEach((img) => {
      const placeholderKey = img.getAttribute("src");
      const placeholderAlt = img.getAttribute("alt") || "Illustrative diagram block.";

      const widgetContainer = document.createElement("div");
      widgetContainer.className = "algonotes-editor-placeholder-card";
      widgetContainer.setAttribute("contenteditable", "false"); 
      widgetContainer.setAttribute("data-placeholder-target", placeholderKey);

      widgetContainer.innerHTML = `
        <div class="placeholder-icon-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        </div>
        <div class="placeholder-title-row">
          <p class="placeholder-title">Diagram Reference: ${placeholderKey}</p>
          <button type="button" class="placeholder-copy-btn" title="Copy text description">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          </button>
        </div>
        <p class="placeholder-desc">${placeholderAlt}</p>
        <button type="button" class="placeholder-action-btn">Attach Asset / URL</button>
      `;

      widgetContainer.querySelector(".placeholder-copy-btn").addEventListener("click", (e) => {
        e.preventDefault(); e.stopPropagation();
        navigator.clipboard.writeText(placeholderAlt);
        toast.success("Description copied!");
      });

      widgetContainer.querySelector(".placeholder-action-btn").addEventListener("click", (e) => {
        e.preventDefault(); e.stopPropagation();
        setActivePlaceholderKey(placeholderKey);
        document.getElementById("algonotes-asset-modal-trigger").click();
      });

      if (img.parentNode) img.parentNode.replaceChild(widgetContainer, img);
    });
  };

  const handleSaveChanges = async () => {
    if (!editorRef.current) return;
    setSaving(true);
    
    const clone = editorRef.current.cloneNode(true);

    // Strip out description paragraphs so we only save pure semantic layout data to the DB
    clone.querySelectorAll(".algonotes-image-description").forEach(desc => desc.remove());

    // Revert placeholder widgets back into classic image tags for storage formatting
    clone.querySelectorAll(".algonotes-editor-placeholder-card").forEach((widget) => {
      const originalSrc = widget.getAttribute("data-placeholder-target");
      const originalAlt = widget.querySelector(".placeholder-desc").innerText;

      const originalImg = document.createElement("img");
      originalImg.className = "algonotes-img";
      originalImg.setAttribute("src", originalSrc);
      originalImg.setAttribute("alt", originalAlt);

      if (widget.parentNode) widget.parentNode.replaceChild(originalImg, widget);
    });

    try {
      const res = await updateTheoryNote(id, { content: clone.innerHTML });
      if (res?.success) {
         toast.success("Changes saved successfully!");
         navigate("/theory", {replace:true})
      }
       
    } catch (err) {
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const executeFormattingCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) editorRef.current.focus();
  };

  // Intercepts the resolution callback and couples the new image with a text caption
  const handleAssetResolved = (resolvedImageUrl) => {
    if (!editorRef.current || !activePlaceholderKey) return;

    const targetWidget = editorRef.current.querySelector(`[data-placeholder-target="${activePlaceholderKey}"]`);
    if (targetWidget && targetWidget.parentNode) {
      const parent = targetWidget.parentNode;
      const altText = targetWidget.querySelector(".placeholder-desc").innerText;

      // 1. Generate Image Element
      const finalizedImg = document.createElement("img");
      finalizedImg.className = "algonotes-img";
      finalizedImg.setAttribute("src", resolvedImageUrl);
      finalizedImg.setAttribute("alt", altText);

      // 2. Generate Caption Paragraph Element
      const descriptionParagraph = document.createElement("p");
      descriptionParagraph.className = "algonotes-image-description";
      descriptionParagraph.innerText = altText;

      // Append multi-node layout changes safely using a DocumentFragment
      const fragment = document.createDocumentFragment();
      fragment.appendChild(finalizedImg);
      fragment.appendChild(descriptionParagraph);

      parent.replaceChild(fragment, targetWidget);
      
      setActivePlaceholderKey(null);
      document.getElementById("algonotes-asset-modal-close").click();
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg-base text-text-main selection:bg-primary/20 flex flex-col">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-6 flex flex-col flex-1 h-screen max-h-screen overflow-hidden">
        
        <label id="algonotes-asset-modal-trigger" htmlFor="asset-modal" className="hidden"></label>

        <AssetModal
          id={id}
          activePlaceholderKey={activePlaceholderKey}
          onAssetResolved={handleAssetResolved}
        />

        <Header 
          topic={topic}
          saving={saving}
          onNavigateBack={() => navigate("/dashboard")}
          onSaveChanges={handleSaveChanges}
        />

        <Toolbar onFormatCommand={executeFormattingCommand} />

        <div className="w-full flex-1 rounded-b-md border-x border-b border-border-default bg-bg-surface overflow-hidden shadow-card focus-within:border-primary/20 transition-all duration-300 min-h-0 mb-4 flex flex-col">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="algonotes-article w-full flex-1 p-6 md:p-10 bg-bg-surface outline-hidden overflow-y-auto"
            placeholder="Start drafting masterclass breakdown paths right here..."
          />
        </div>

      </div>
    </div>
  );
};

export default TheoryEditor;