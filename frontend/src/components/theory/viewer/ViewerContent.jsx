import React from "react";
import { parseRawHtml } from "../../../utils/parseHtml";


const ViewerContent = ({ content }) => {

  const processedHtml = parseRawHtml(content);

  return (
    <div className="w-full bg-bg-surface border border-border-default rounded-md p-6 sm:p-8 md:p-10 shadow-card overflow-y-auto mb-6 flex-1 font-sans text-sm">
      {processedHtml.trim() === "" ? (
        <div className="py-20 text-center font-mono text-[15px] text-text-light select-none tracking-wide">
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