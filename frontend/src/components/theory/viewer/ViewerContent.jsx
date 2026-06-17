import React from "react";

const ViewerContent = ({ content }) => {
  return (
    <div className="w-full bg-bg-surface border border-border-default rounded-md p-6 sm:p-8 md:p-10 shadow-card overflow-y-auto mb-6 flex-1">
      {!content || content.trim() === "" ? (
        <div className="py-20 text-center font-mono text-sm text-text-light select-none tracking-wide">
          This masterclass study note is currently empty.
        </div>
      ) : (
        <div 
          className="algonotes-article mx-auto"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
};

export default ViewerContent;