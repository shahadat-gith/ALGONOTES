import { useCallback, useEffect, useRef, useState } from "react";

const DELAYS = [5000, 8000, 12000, 18000, 25000];
const MAX_TIMEOUT = 5 * 60 * 1000;

export default function useInterviewPrepPolling({
  enabled = false,
  checkStatus,
  onCompleted,
  onFailed,
}) {
  const [status, setStatus] = useState(null);
  const [failureReason, setFailureReason] = useState("");
  const [isPolling, setIsPolling] = useState(false);

  const timerRef = useRef(null);
  const timeoutRef = useRef(null);
  const attemptRef = useRef(0);
  const stoppedRef = useRef(false);

  // Store callbacks in refs to avoid re-creating poll/startPolling
  // on every parent re-render, which would accidentally trigger the
  // useEffect cleanup and stop polling.
  const checkStatusRef = useRef(checkStatus);
  const onCompletedRef = useRef(onCompleted);
  const onFailedRef = useRef(onFailed);

  useEffect(() => {
    checkStatusRef.current = checkStatus;
    onCompletedRef.current = onCompleted;
    onFailedRef.current = onFailed;
  });

  const stopPolling = useCallback(() => {
    stoppedRef.current = true;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    attemptRef.current = 0;
    setIsPolling(false);
  }, []);

  const poll = useCallback(async () => {
    if (stoppedRef.current) return;

    try {
      const res = await checkStatusRef.current();

      if (!res?.success) {
        throw new Error(res?.message || "Polling failed.");
      }

      const pollData = res.data || res;

      setStatus(pollData.status);
      setFailureReason(pollData.failureReason || "");

      if (pollData.status === "completed") {
        stopPolling();
        onCompletedRef.current?.(pollData);
        return;
      }

      if (pollData.status === "failed") {
        stopPolling();
        onFailedRef.current?.(pollData);
        return;
      }

      const delay = DELAYS[Math.min(attemptRef.current, DELAYS.length - 1)];

      attemptRef.current++;

      timerRef.current = setTimeout(poll, delay);
    } catch (error) {
      stopPolling();

      onFailedRef.current?.({
        status: "failed",
        failureReason: error.message,
      });
    }
  }, [stopPolling]);

  const startPolling = useCallback(() => {
    stopPolling();

    stoppedRef.current = false;
    attemptRef.current = 0;

    setStatus("processing");
    setFailureReason("");
    setIsPolling(true);

    poll();

    timeoutRef.current = setTimeout(() => {
      stopPolling();

      onFailedRef.current?.({
        status: "failed",
        failureReason: "The request timed out. Please try again.",
      });
    }, MAX_TIMEOUT);
  }, [poll, stopPolling]);

  useEffect(() => {
    if (enabled) {
      startPolling();
    }

    return stopPolling;
  }, [enabled]);

  return {
    status,
    failureReason,
    isPolling,
    startPolling,
    stopPolling,
  };
}
