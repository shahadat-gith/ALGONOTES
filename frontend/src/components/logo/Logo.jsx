import React from "react";

const Logo = ({ className = "h-8 w-8" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={className}
    >
      {/* Outer modern bracket layout frame representing code boundaries */}
      <path
        d="M6 3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2"
        stroke="var(--primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 3h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2"
        stroke="var(--primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Central data structure nodes layer */}
      <circle cx="8" cy="12" r="2" fill="var(--primary)" />
      <circle cx="16" cy="8" r="2" fill="var(--border-strong)" />
      <circle cx="16" cy="16" r="2" fill="var(--border-strong)" />
      
      {/* Interconnecting directional data pointer paths */}
      <line x1="10" y1="11" x2="14" y2="9" stroke="var(--primary)" strokeWidth="2" />
      <line x1="10" y1="13" x2="14" y2="15" stroke="var(--primary)" strokeWidth="2" />
    </svg>
  );
};

export default Logo;