// components/common/BottomSheet.jsx
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const BottomSheet = ({
  isOpen,
  onClose,
  children,
  initialHeight = "58vh",
  expandedHeight = "90vh",
  expanded = false,
  setExpanded,
}) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.08}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80) {
                onClose();
              }

              if (info.offset.y < -60 && setExpanded) {
                setExpanded(true);
              }
            }}
            initial={{ y: "100%", height: initialHeight }}
            animate={{
              y: 0,
              height: expanded ? expandedHeight : initialHeight,
            }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 28,
            }}
            className="absolute bottom-0 left-0 right-0 flex flex-col rounded-t-3xl border-t border-[var(--border-default)] bg-white p-5 shadow-2xl"
          >
            <button
              onClick={() => setExpanded?.((prev) => !prev)}
              className="mx-auto mb-4 flex h-6 w-full items-center justify-center"
              aria-label="Expand Bottom Sheet"
            >
              <span className="h-1 w-12 rounded-full bg-[var(--border-strong)]" />
            </button>

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;