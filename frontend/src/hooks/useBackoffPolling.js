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
        if (check.status === "draft" || check.status === "final" || check.status === "completed") {
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

        // 3. Trigger visual step index incrementer cycles
        if (callCount % 2 === 0 && onStepTick) {
          onStepTick();
        }

        // 4. Calculate Backoff intervals dynamically based on call range brackets
        let nextInterval = 2000; // Default: 1st to 5th call = 2 seconds (2000ms)

        if (callCount > 15) {
          nextInterval = 15000;  // 16th call and onwards = 15 seconds (15000ms)
        } else if (callCount > 10) {
          nextInterval = 10000;  // 11th to 15th call = 10 seconds (10000ms)
        } else if (callCount > 5) {
          nextInterval = 5000;   // 6th to 10th call = 5 seconds (5000ms)
        }

        console.log(`[Polling Log] Request #${callCount} completed. Next lookup frame scheduled in ${nextInterval / 1000}s`);
        pollTimeoutRef.current = setTimeout(executePoll, nextInterval);

      } catch (error) {
        console.error("Polled transaction channel error:", error);
        // Fallback retry buffer window to preserve engine responsiveness during connectivity drops
        pollTimeoutRef.current = setTimeout(executePoll, 5000);
      }
    };

    pollTimeoutRef.current = setTimeout(executePoll, 2000);
  }, [stopPolling]);

  return { startPolling, stopPolling };
};