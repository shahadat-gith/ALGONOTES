import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getTheoryNote, updateTheoryNote, deleteTheoryImage } from "../api/theoryApi";
import toast from "react-hot-toast";

export const useTheoryEditor = (id) => {
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const [topic, setTopic] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  const [initialContent, setInitialContent] = useState("");
  const [activePlaceholderKey, setActivePlaceholderKey] = useState(null);

  // 1. Fetch note configuration from DB
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
        if (isMounted) setApiError("Could not load your study note content.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTheoryData();
    return () => { isMounted = false; };
  }, [id]);

  // 2. Synchronize memory buffer with contentEditable section
  useEffect(() => {
    if (!loading && editorRef.current && initialContent) {
      editorRef.current.innerHTML = initialContent;
      setupImagePlaceholders();
      attachImageHoverControls();
    }
  }, [loading, initialContent]);

  // 3. Render interactive placeholder layout cards
  const setupImagePlaceholders = () => {
    if (!editorRef.current) return;
    const images = editorRef.current.querySelectorAll('img[src*="placeholder"]');
    images.forEach((img) => {
      const placeholderKey = img.getAttribute("src");
      const imageDescription = img.getAttribute("alt") || "Image diagram description.";
      createPlaceholderCard(img, placeholderKey, imageDescription);
    });
  };

  const createPlaceholderCard = (targetElement, key, description) => {
    const cardContainer = document.createElement("div");
    cardContainer.className = "algonotes-editor-placeholder-card";
    cardContainer.setAttribute("data-placeholder-target", key);

    cardContainer.innerHTML = `
      <div class="placeholder-icon-wrap" contenteditable="false">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
      </div>
      <div class="placeholder-title-row" contenteditable="false">
        <p class="placeholder-title">Image Slot: ${key}</p>
      </div>
      <p class="placeholder-desc">${description}</p>
      <button type="button" class="placeholder-action-btn" contenteditable="false">Add Image / Link</button>
    `;

    cardContainer.querySelector(".placeholder-action-btn").addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      setActivePlaceholderKey(key);
      document.getElementById("algonotes-asset-modal-trigger").click();
    });

    if (targetElement.parentNode) {
      targetElement.parentNode.replaceChild(cardContainer, targetElement);
    }
  };

  // 4. Inject hover wrappers & contextual branching cloud cleanups
  const attachImageHoverControls = () => {
    if (!editorRef.current) return;
    const activeImages = editorRef.current.querySelectorAll('img.algonotes-img:not([src*="placeholder"])');

    activeImages.forEach((img) => {
      if (img.parentNode && img.parentNode.classList.contains("algonotes-image-edit-wrapper")) return;

      const wrapper = document.createElement("div");
      wrapper.className = "algonotes-image-edit-wrapper";
      wrapper.setAttribute("contenteditable", "false");

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "algonotes-image-delete-btn";
      deleteBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
      `;

      deleteBtn.addEventListener("click", async (e) => {
        e.preventDefault(); e.stopPropagation();
        const imageUrl = img.getAttribute("src");
        const isCloudinary = imageUrl?.includes("cloudinary.com");

        if (isCloudinary) {
          try {
            await deleteTheoryImage(id, imageUrl);
          } catch (err) {
            console.error("Cloudinary asset cleanup failed.");
          }
        }

        // Pull the descriptor text straight from the image's native alt attribute data
        const originalAlt = img.getAttribute("alt") || "Image diagram description.";
        const originalKey = `image-placeholder-${Date.now().toString().slice(-4)}`;

        createPlaceholderCard(wrapper, originalKey, originalAlt);
        toast.success(isCloudinary ? "Image deleted from cloud and note." : "External image link removed.");
      });

      if (img.parentNode) {
        img.parentNode.replaceChild(wrapper, img);
        wrapper.appendChild(img);
        wrapper.appendChild(deleteBtn);
      }
    });
  };

  // 5. Clean layout nodes and compile HTML for storage updates
  const handleSaveChanges = async () => {
    if (!editorRef.current) return;
    setSaving(true);
    
    const clone = editorRef.current.cloneNode(true);

    clone.querySelectorAll(".algonotes-image-edit-wrapper").forEach((wrapper) => {
      const internalImg = wrapper.querySelector("img");
      if (internalImg && wrapper.parentNode) {
        const deleteBtn = wrapper.querySelector(".algonotes-image-delete-btn");
        if (deleteBtn) deleteBtn.remove();
        wrapper.parentNode.replaceChild(internalImg, wrapper);
      }
    });

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
      const res = await updateTheoryNote(id, { content: clone.innerHTML, status: "final" });
      if (res?.success) {
         toast.success("Changes saved successfully!");
         navigate("/theory", { replace: true });
      }
    } catch (err) {
      toast.error("Could not save your changes.");
    } finally {
      setSaving(false);
    }
  };

  const executeFormattingCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) editorRef.current.focus();
  };

  const handleAssetResolved = (resolvedImageUrl) => {
    if (!editorRef.current || !activePlaceholderKey) return;

    const targetWidget = editorRef.current.querySelector(`[data-placeholder-target="${activePlaceholderKey}"]`);
    if (targetWidget && targetWidget.parentNode) {
      const parent = targetWidget.parentNode;
      const descriptionText = targetWidget.querySelector(".placeholder-desc").innerText;

      const finalizedImg = document.createElement("img");
      finalizedImg.className = "algonotes-img";
      finalizedImg.setAttribute("src", resolvedImageUrl);
      finalizedImg.setAttribute("alt", descriptionText);

      // Directly substitute card container element with the naked image tag wrapper node
      parent.replaceChild(finalizedImg, targetWidget);
      
      setActivePlaceholderKey(null);
      document.getElementById("algonotes-asset-modal-close").click();

      setTimeout(() => { attachImageHoverControls(); }, 50);
    }
  };

  return {
    editorRef,
    topic,
    loading,
    saving,
    apiError,
    activePlaceholderKey,
    handleSaveChanges,
    executeFormattingCommand,
    handleAssetResolved,
  };
};