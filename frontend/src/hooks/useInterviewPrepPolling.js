import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useInterviewPrepPolling
 *
 * Polls a status endpoint with exponential backoff until the resource
 * reaches a terminal state ("completed" or "failed") or times out.
 *
 * Usage:
 *   const { startPolling, stopPolling, isPolling } = useInterviewPrepPolling({
 *     checkStatus: async () => api.getStatus(id),
 *     onCompleted: (data) => { ... },
 *     onFailed:    (data) => { ... },
 *     enabled: false,           // set true to auto-start on mount
 *   });
 */

const BACKOFF = [3000, 5000, 8000, 12000, 18000, 25000];
const MAX_WAIT = 5 * 60 * 1000; // 5 minutes

export default function useInterviewPrepPolling({
  enabled = false,
  checkStatus,
  onCompleted,
  onFailed,
}) {
  const [isPolling, setIsPolling] = useState(false);

  // Refs keep timers and latest callbacks without re-render churn
  const pollTimer    = useRef(null);
  const timeoutTimer = useRef(null);
  const attempt      = useRef(0);
  const dead         = useRef(true);      // true = "do nothing"

  const checkRef  = useRef(checkStatus);
  const doneRef   = useRef(onCompleted);
  const failRef   = useRef(onFailed);
  useEffect(() => { checkRef.current = checkStatus; });
  useEffect(() => { doneRef.current  = onCompleted; });
  useEffect(() => { failRef.current  = onFailed; });

  /** Cancel any scheduled polls and reset. Stable – only uses refs. */
  const stop = useCallback(() => {
    dead.current = true;
    clearTimeout(pollTimer.current);
    clearTimeout(timeoutTimer.current);
    pollTimer.current = null;
    timeoutTimer.current = null;
    attempt.current = 0;
    setIsPolling(false);
  }, []);

  /** Start polling (or restart if already running). Stable – depends only on `stop`. */
  const start = useCallback(() => {
    stop();            // ditch any previous run
    dead.current = false;
    attempt.current = 0;
    setIsPolling(true);

    // Recursive check loop with backoff
    const poll = async () => {
      if (dead.current) return;

      try {
        const res = await checkRef.current();
        if (!res?.success) throw new Error(res?.message || "Polling failed.");

        const d = res.data || res;

        if (d.status === "completed") {
          stop();
          doneRef.current?.(d);
          return;
        }

        if (d.status === "failed") {
          stop();
          failRef.current?.(d);
          return;
        }

        // Schedule next attempt with backoff
        const idx = Math.min(attempt.current, BACKOFF.length - 1);
        attempt.current += 1;
        pollTimer.current = setTimeout(poll, BACKOFF[idx]);
      } catch (err) {
        stop();
        failRef.current?.({ status: "failed", failureReason: err.message });
      }
    };

    poll();

    // Hard timeout – give up if we've been polling too long
    timeoutTimer.current = setTimeout(() => {
      stop();
      failRef.current?.({
        status: "failed",
        failureReason: "The request timed out. Please try again.",
      });
    }, MAX_WAIT);
  }, [stop]);

  // Auto-start when `enabled` toggles
  useEffect(() => {
    if (enabled) start();
    return stop;
  }, [enabled, start, stop]);

  return { isPolling, startPolling: start, stopPolling: stop };
}
