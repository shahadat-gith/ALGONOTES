import React from "react";
import ReactDOM from "react-dom"; // Needed for React Portal injection
import { AnimatePresence, motion } from "framer-motion";

const AnimatedModal = ({ isOpen, onClose, children, className = "" }) => {
  // Return null immediately if closed to keep the DOM footprint clean
  if (!isOpen) return null;

  const modalRootElement = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
      
      {/* 1. Full Screen Isolated Screen Mask Overlay */}
      <motion.div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* 2. Vertically and Horizontally Centered Content Box */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.95 }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 26,
        }}
        onClick={(e) => e.stopPropagation()} // Keeps internal form clicks safe
        className={`relative z-10 w-full bg-white shadow-2xl rounded-2xl ${className}`}
      >
        {children}
      </motion.div>

    </div>
  );

  // Inject the node structure cleanly directly onto document body space
  return ReactDOM.createPortal(
    <AnimatePresence mode="wait">
      {isOpen && modalRootElement}
    </AnimatePresence>,
    document.body
  );
};

export default AnimatedModal;