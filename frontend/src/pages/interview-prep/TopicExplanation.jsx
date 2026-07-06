import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  getTopic,
  requestExplanation,
  getExplanationStatus,
} from "../../api/interviewPrepApi.js";

import useInterviewPrepPolling from "../../hooks/useInterviewPrepPolling";

import EmptyState from "../../components/common/EmptyState";

import ProcessingModal from "../../components/interview-prep/ProcessingModal";
import ErrorModal from "../../components/interview-prep/ErrorModal";
import LanguageSelectModal from "../../components/interview-prep/LanguageSelectModal";

import TopicExplanationLayout from "../../components/interview-prep/TopicExplanationLayout";

import TopicExplanationSkeleton from "../../components/skeletons/TopicExplanationSkeleton";
import ExplanationSection from "../../components/interview-prep/ExplanationSection";

const TopicExplanation = () => {
  const { applicationId, topicId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [status, setStatus] = useState("unrequested");

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Derive sections from explanation
  const sections = useMemo(
    () => explanation?.sections ?? [],
    [explanation],
  );

  // Current section index derived from URL search param
  const currentSectionIndex = useMemo(() => {
    const sectionId = searchParams.get("section");
    if (!sectionId || !sections.length) return 0;
    const idx = sections.findIndex((s) => s.id === sectionId);
    return idx >= 0 ? idx : 0;
  }, [searchParams, sections]);

  const currentSection = sections[currentSectionIndex];

  // Navigate to a specific section by ID
  const goToSection = useCallback(
    (sectionId) => {
      setSearchParams({ section: sectionId }, { replace: true });
      // Scroll the main content area to top
      const mainEl = document.querySelector(
        ".topic-explanation-main",
      );
      if (mainEl) {
        mainEl.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [setSearchParams],
  );

  const goToPrevious = useCallback(() => {
    if (currentSectionIndex > 0) {
      goToSection(sections[currentSectionIndex - 1].id);
    }
  }, [currentSectionIndex, sections, goToSection]);

  const goToNext = useCallback(() => {
    if (currentSectionIndex < sections.length - 1) {
      goToSection(sections[currentSectionIndex + 1].id);
    }
  }, [currentSectionIndex, sections, goToSection]);

  const fetchTopic = useCallback(
    async (showLoader = true) => {
      if (showLoader) {
        setLoading(true);
      }

      try {
        const res = await getTopic(topicId);

        if (!res?.success) {
          throw new Error("Topic not found.");
        }

        const { topic, explanation } = res.data;

        setTopic(topic);
        setExplanation(explanation ?? null);

        // Always derive the actual view status from the backend's active entry
        setStatus(explanation?.status ?? "unrequested");
      } catch (err) {
        setError(err.message || "Failed to load topic.");
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    },
    [topicId],
  );

  const { startPolling, stopPolling } = useInterviewPrepPolling({
    enabled: false,
    checkStatus: () => getExplanationStatus(topicId),

    onCompleted: async () => {
      setGenerating(false);
      // Fetch the latest updated entry from the database
      await fetchTopic(false);
    },

    onFailed: async (data) => {
      setGenerating(false);
      setError(data.failureReason || "Explanation generation failed.");
      // Ensure local component status mirrors the new failure state
      setStatus("failed");
      await fetchTopic(false);
    },
  });

  useEffect(() => {
    fetchTopic();

    return stopPolling;
  }, [fetchTopic, stopPolling]);

  useEffect(() => {
    if (status === "processing") {
      startPolling();
    } else {
      stopPolling();
    }
  }, [status, startPolling, stopPolling]);

  const handleGenerateClick = () => {
    setShowLanguageModal(true);
  };

  const handleLanguageSelect = async (codeLanguage) => {
    setShowLanguageModal(false);

    if (generating || status === "processing") return;

    try {
      setGenerating(true);
      setError(""); // Clear historical failed run outputs

      const res = await requestExplanation(topicId, codeLanguage);

      if (!res?.success) {
        throw new Error(
          res?.message || "Failed to start explanation generation.",
        );
      }

      // Explicitly shift status to processing to kick off useInterviewPrepPolling
      setStatus("processing");
    } catch (err) {
      setGenerating(false);
      setStatus("failed");
      setError(err.message || "Could not generate explanation.");
    }
  };

  const isProcessing = generating || status === "processing";

  const hasExplanation =
    status === "completed" &&
    sections.length > 0 &&
    sections.some((s) => s.blocks?.length > 0);

  if (loading) {
    return <TopicExplanationSkeleton />;
  }

  if (!topic && !loading) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4 py-10 min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
          <p className="text-sm text-text-muted">Topic not found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <TopicExplanationLayout
        toc={explanation?.tableOfContents || []}
        activeSection={currentSection?.id ?? ""}
        onNavigate={goToSection}
      >
        {hasExplanation ? (
          <article className="explanation-article">
            <header className="explanation-article-header">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-text-main">
                    {topic.title}
                  </h1>
                </div>
              </div>

              {topic.reason && (
                <p className="mt-4 text-sm leading-7 text-text-light">
                  {topic.reason}
                </p>
              )}

              {/* Section progress indicator */}
              <p className="mt-4 text-xs text-text-muted">
                Section {currentSectionIndex + 1} of {sections.length}
              </p>
            </header>

            {currentSection && (
              <ExplanationSection key={currentSection.id} section={currentSection} />
            )}

            {/* Previous / Next Navigation */}
            <nav className="explanation-nav">
              <button
                type="button"
                onClick={goToPrevious}
                disabled={currentSectionIndex === 0}
                className="explanation-nav-btn"
              >
                <ChevronLeft size={16} className="stroke-[2]" />
                <span className="flex flex-col items-start">
                  <span className="text-[10px] uppercase tracking-wider text-text-muted">
                    Previous
                  </span>
                  <span className="text-sm font-medium">
                    {currentSectionIndex > 0
                      ? sections[currentSectionIndex - 1].title
                      : ""}
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={goToNext}
                disabled={currentSectionIndex === sections.length - 1}
                className="explanation-nav-btn ml-auto text-right"
              >
                <span className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-wider text-text-muted">
                    Next
                  </span>
                  <span className="text-sm font-medium">
                    {currentSectionIndex < sections.length - 1
                      ? sections[currentSectionIndex + 1].title
                      : ""}
                  </span>
                </span>
                <ChevronRight size={16} className="stroke-[2]" />
              </button>
            </nav>
          </article>
        ) : (
          <EmptyState
            title={
              status === "failed"
                ? "Generation Failed"
                : "No explanation generated yet"
            }
            description={
              status === "failed"
                ? "There was an error generating this guide. Click below to retry."
                : "Generate a comprehensive interview guide tailored to this topic."
            }
            actionText={
              status === "failed" ? "Retry Generation" : "Generate Explanation"
            }
            onAction={handleGenerateClick}
          />
        )}
      </TopicExplanationLayout>

      {showLanguageModal && (
        <LanguageSelectModal
          onSelect={handleLanguageSelect}
          onClose={() => setShowLanguageModal(false)}
        />
      )}

      {error && (
        <ErrorModal
          type="explanation"
          resourceId={topicId}
          title="Explanation Generation Failed"
          error={error}
          onClose={() => {
            setError("");
            fetchTopic(false);
          }}
        />
      )}

      {isProcessing && (
        <ProcessingModal
          title="Generating Explanation"
          subtitle="We're preparing a detailed interview guide with concepts, examples, best practices and interview questions."
        />
      )}
    </>
  );
};

export default TopicExplanation;