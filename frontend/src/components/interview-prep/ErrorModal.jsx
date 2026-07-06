import React, { useState } from "react";
import { Loader2, Clock, XCircle } from "lucide-react";

import {
  deleteApplication,
  deleteExplanation,
} from "../../api/interviewPrepApi.js";

const ErrorModal = ({ title, error, type, resourceId, onClose, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);

    try {
      if (onDelete) {
        await onDelete();
      } else if (resourceId) {
        if (type === "application") {
          await deleteApplication(resourceId);
        } else if (type === "explanation") {
          await deleteExplanation(resourceId);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      onClose?.();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl border border-danger/20 bg-bg-surface p-6 shadow-card">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
            <XCircle size={28} className="stroke-[2]" />
          </div>

          <h2 className="text-lg font-semibold text-text-main">{title}</h2>

          <p className="mt-3 text-sm leading-6 text-text-light">{error}</p>
        </div>

        <button
          onClick={handleAction}
          disabled={loading}
          className="mt-8 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-danger text-sm font-semibold text-white transition hover:bg-danger/90 disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Cleaning up...
            </>
          ) : (
            <>
              <Clock size={16} />
              Try Later
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
