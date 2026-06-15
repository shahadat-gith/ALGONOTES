import React from "react";

const MinimalistLogo = ({ className = "h-8 w-8" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={className}
    >
      {/* Document block wrapper */}
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="4"
        stroke="var(--text-main)"
        strokeWidth="2"
      />
      
      {/* Terminal active prompt notation cursor symbol */}
      <path
        d="M7 8l3 3-3 3"
        stroke="var(--primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Horizontal document code execution layout tracking lines */}
      <line
        x1="13"
        y1="11"
        x2="17"
        y2="11"
        stroke="var(--border-strong)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="13"
        y1="15"
        x2="17"
        y2="15"
        stroke="var(--border-strong)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default MinimalistLogo;