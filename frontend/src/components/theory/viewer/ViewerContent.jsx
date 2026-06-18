import React from "react";

const ViewerContent = ({ content }) => {
  // Cleans the HTML by stripping out unuploaded image slots and their descriptions
  const cleanContent = (rawHtml) => {
    if (!rawHtml || rawHtml.trim() === "") return "";

    // Create a temporary document parser memory buffer
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, "text/html");

    // 1. Target any live editor placeholder widgets left behind
    doc.querySelectorAll(".algonotes-editor-placeholder-card").forEach((widget) => {
      widget.remove();
    });

    // 2. Target raw fallback <img> tags matching your "placeholder" naming pattern
    doc.querySelectorAll('img[src*="placeholder"]').forEach((img) => {
      // Find its accompanying caption paragraph sitting directly next to it
      const nextNode = img.nextElementSibling;
      if (nextNode && nextNode.classList.contains("algonotes-image-description")) {
        nextNode.remove();
      }
      img.remove();
    });

    return doc.body.innerHTML;
  };

  const processedHtml = cleanContent(content);

  return (
    <div className="w-full bg-bg-surface border border-border-default rounded-md p-6 sm:p-8 md:p-10 shadow-card overflow-y-auto mb-6 flex-1 font-sans text-sm">
      {processedHtml.trim() === "" ? (
        <div className="py-20 text-center font-mono text-xs text-text-light select-none tracking-wide">
          This study note does not contain any content yet.
        </div>
      ) : (
        <div 
          className="algonotes-article mx-auto"
          dangerouslySetInnerHTML={{ __html: processedHtml }}
        />
      )}
    </div>
  );
};

export default ViewerContent;