import React from "react";
import ReactDOM from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

const AnimatedModal = ({ isOpen, onClose, children, className = "" }) => {
  // Let AnimatePresence handle the mounting/unmounting natively
  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
          
          {/* 1. Backdrop Overlay with theme-matched blurring */}
          <motion.div
            className="fixed inset-0 bg-text-main/30 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* 2. Content Box styled to match design system tokens */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 28,
            }}
            onClick={(e) => e.stopPropagation()}
            className={`relative z-10 w-full bg-bg-surface rounded-lg shadow-hover border border-border-default md:max-w-lg overflow-hidden ${className}`}
          >
            {children}
          </motion.div>

        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AnimatedModal;