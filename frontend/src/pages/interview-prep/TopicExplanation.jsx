import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getTopic,
  requestExplanation,
  getExplanationStatus,
} from "../../api/interviewPrepApi.js";

import useInterviewPrepPolling from "../../hooks/useInterviewPrepPolling";

import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";

import ProcessingModal from "../../components/interview-prep/ProcessingModal";
import ErrorModal from "../../components/interview-prep/ErrorModal";
import LanguageSelectModal from "../../components/interview-prep/LanguageSelectModal";

import TopicExplanationLayout from "../../components/interview-prep/TopicExplanationLayout";
import BlockRenderer from "../../components/interview-prep/BlockRenderer";

import TopicExplanationSkeleton from "../../components/skeletons/TopicExplanationSkeleton";

const TopicExplanation = () => {
  const { applicationId, topicId } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(null);
  const [explanation, setExplanation] = useState(null);

  const [status, setStatus] = useState("unrequested");

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const [showLanguageModal, setShowLanguageModal] = useState(false);

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
      await fetchTopic(false);
    },

    onFailed: async (data) => {
      setGenerating(false);

      setError(data.failureReason || "Explanation generation failed.");

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
    }
  }, [status, startPolling]);

  const handleGenerateClick = () => {
    setShowLanguageModal(true);
  };

  const handleLanguageSelect = async (codeLanguage) => {
    setShowLanguageModal(false);

    if (generating) return;

    try {
      setGenerating(true);
      setError("");

      const res = await requestExplanation(topicId, codeLanguage);

      if (!res?.success) {
        throw new Error(
          res?.message || "Failed to start explanation generation.",
        );
      }

      setStatus("processing");
    } catch (err) {
      setGenerating(false);

      setError(err.message || "Could not generate explanation.");
    }
  };

  const isProcessing = generating || status === "processing";

  const hasExplanation =
    explanation?.sections?.length > 0 &&
    explanation.sections.some((s) => s.blocks?.length > 0);

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
      <TopicExplanationLayout toc={explanation?.tableOfContents || []}>
        {hasExplanation ? (
          <div className="w-full rounded-2xl border border-border-default bg-bg-surface p-6 shadow-card space-y-10 sm:p-8">
            <div className="border-b border-border-default/40 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <span className="text-sm font-bold">
                    {String(topic.order).padStart(2, "0")}
                  </span>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-text-muted">
                    Interview Topic
                  </p>

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
            </div>

            {explanation.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-8">
                <h2 className="mb-5 border-l-2 border-primary/40 pl-3 text-lg font-semibold tracking-tight text-text-main">
                  {section.title}
                </h2>

                <div className="animate-fade-in space-y-2">
                  {section.blocks.map((block) => (
                    <BlockRenderer key={block.id} block={block} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No explanation generated yet"
            description="Generate a comprehensive interview guide tailored to this topic."
            actionText="Generate Explanation"
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
