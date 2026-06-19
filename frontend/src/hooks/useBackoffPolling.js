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
        
        // If API responds cleanly but success flag is false, treat it as an explicit termination failure
        if (check && check.success === false) {
          stopPolling();
          onFailure(check.message || "Request validation failed.");
          return;
        }

        if (!check) return;

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

        // 4. Calculate Backoff intervals dynamically
        let nextInterval = 2000; 

        if (callCount > 15) {
          nextInterval = 15000;  
        } else if (callCount > 10) {
          nextInterval = 10000;  
        } else if (callCount > 5) {
          nextInterval = 5000;   
        }

        console.log(`[Polling Log] Request #${callCount} completed. Next lookup frame scheduled in ${nextInterval / 1000}s`);
        pollTimeoutRef.current = setTimeout(executePoll, nextInterval);

      } catch (error) {
        console.error("Polled transaction channel error:", error);
        
        // Check if the error is a 404 (indicating the backend purged a failed note)
        const is404 = error?.response?.status === 404 || error?.status === 404;
        
        if (is404) {
          stopPolling();
          onFailure("The processing workspace could not be found or was removed.");
          return;
        }

        // For structural network timeouts/intermittent drops, retry after 5s up to a maximum threshold
        if (callCount > 25) {
          stopPolling();
          onFailure("Connection lost. Please refresh your browser or try again.");
          return;
        }

        pollTimeoutRef.current = setTimeout(executePoll, 5000);
      }
    };

  
    pollTimeoutRef.current = setTimeout(executePoll, 3000);
  }, [stopPolling]);

  return { startPolling, stopPolling };
};