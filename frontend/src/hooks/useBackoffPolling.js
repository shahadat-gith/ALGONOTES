// src/hooks/useBackoffPolling.js

import { useRef, useCallback } from "react";

export const useBackoffPolling = () => {
  const pollTimeoutRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  }, []);

  const startPolling = useCallback(({
    resourceId,
    checkStatusFn,
    onSuccess,
    onFailure,
    onStepTick,
  }) => {
    let callCount = 0;
    stopPolling();

    const executePoll = async () => {
      callCount += 1;

      try {
        const check = await checkStatusFn(resourceId);
        if (!check?.success) return;

        // 1. Check for Complete / Valid states
        if (check.status === "draft" || check.status === "final") {
          stopPolling();
          onSuccess(check);
          return;
        }

        // 2. Check for Fail states
        if (check.status === "failed") {
          stopPolling();
          onFailure(check.message || "AI engine processing failed.");
          return;
        }

        // 3. Trigger visual step step index incrementer cycles
        if (callCount % 2 === 0 && onStepTick) {
          onStepTick();
        }

        // 4. Calculate Backoff intervals dynamically
        let nextInterval = 2000; // First 5 calls: 2 seconds
        if (callCount > 15) {
          nextInterval = 7000;   // Over 15 calls: 7 seconds
        } else if (callCount > 5) {
          nextInterval = 4000;   // 6 to 15 calls: 4 seconds
        }

        pollTimeoutRef.current = setTimeout(executePoll, nextInterval);

      } catch (error) {
        console.error("Polled transaction channel error:", error);
        // Fallback retry block window to preserve engine responsiveness
        pollTimeoutRef.current = setTimeout(executePoll, 4000);
      }
    };

    pollTimeoutRef.current = setTimeout(executePoll, 2000);
  }, [stopPolling]);

  return { startPolling, stopPolling };
};