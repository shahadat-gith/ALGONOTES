import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  Clock3,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getTopic,
  checkDiscussionStatusForPolling,
  getChatMessages,
  sendChatMessage,
} from "../../api/preparationApi";
import { useBackoffPolling } from "../../hooks/useBackoffPolling";

import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Glow from "../../components/common/Glow";
import Loader from "../../components/common/Loader";

const categoryLabels = {
  dsa: "DSA",
  system_design: "System Design",
  behavioral: "Behavioral",
  domain_knowledge: "Domain Knowledge",
  resume_deep_dive: "Resume Deep Dive",
  company_specific: "Company Specific",
};

const TopicDiscussion = () => {
  const { applicationId, topicId } = useParams();
  const navigate = useNavigate();
  const { startPolling, stopPolling } = useBackoffPolling();

  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Chat state
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  const fetchTopic = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTopic(topicId);
      if (!res?.success) throw new Error("Topic not found");
      setTopic(res.data);

      // If discussion exists but is still processing, poll
      if (
        res.data.discussionStatus === "processing"
      ) {
        startPolling({
          resourceId: topicId,
          checkStatusFn: checkDiscussionStatusForPolling,
          onSuccess: () => {
            fetchTopic();
          },
          onFailure: () => {
            toast.error("Discussion generation failed.");
            fetchTopic();
          },
        });
      }

      // Load chat messages
      try {
        const chatRes = await getChatMessages(topicId);
        if (chatRes?.success) {
          setMessages(chatRes.data || []);
        }
      } catch {
        // Chat might not exist yet - that's fine
      }
    } catch (err) {
      setError("Failed to load topic.");
      toast.error("Could not load topic.");
    } finally {
      setLoading(false);
    }
  }, [topicId, startPolling]);

  useEffect(() => {
    fetchTopic();
  }, [fetchTopic]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || sending) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setSending(true);

    // Optimistically add user message
    const tempUserMsg = {
      _id: `temp-${Date.now()}`,
      role: "user",
      message: userMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await sendChatMessage(topicId, userMessage);
      if (res?.success) {
        // Fetch fresh messages
        const chatRes = await getChatMessages(topicId);
        if (chatRes?.success) {
          setMessages(chatRes.data || []);
        }
      } else if (res?.answer) {
        setMessages((prev) => [
          ...prev,
          {
            _id: `temp-resp-${Date.now()}`,
            role: "assistant",
            message: res.answer,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      toast.error("Failed to send message.");
      setMessages((prev) => prev.filter((m) => m._id !== tempUserMsg._id));
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
        <Loader text="Loading discussion..." />
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <p className="text-text-muted text-sm">{error || "Topic not found."}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/preparation/${applicationId}`)}
          >
            <ArrowLeft size={14} className="stroke-[2]" />
            <span>Back to Preparation</span>
          </Button>
        </div>
      </div>
    );
  }

  const isProcessing = topic.discussionStatus === "processing";
  const hasDiscussion = !!topic.discussion;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen space-y-6 select-none animate-fade-in relative overflow-hidden">
      <Glow preset="subtle" />
      <Glow preset="topRight" />

      {/* Header Navigation */}
      <div className="flex items-center justify-between border-b border-border-default pb-5">
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/preparation/${applicationId}`)}
          className="h-9 text-xs font-semibold px-4 border-border-default hover:bg-bg-soft text-text-main flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft size={14} className="stroke-[2]" />
          <span>Back</span>
        </Button>

        <div className="flex items-center gap-3">
          <Badge variant="default" className="text-[11px] px-2.5 py-0.5">
            {categoryLabels[topic.category] || topic.category}
          </Badge>
          <Badge
            variant={
              topic.priority === "High"
                ? "danger"
                : topic.priority === "Medium"
                ? "warning"
                : "default"
            }
            className="text-[11px] px-2.5 py-0.5"
          >
            {topic.priority}
          </Badge>
        </div>
      </div>

      {/* Topic Title */}
      <div className="w-full rounded-2xl border border-border-default bg-gradient-to-br from-bg-surface via-bg-surface to-primary/5 p-6 shadow-card">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary mb-3">
          <Brain size={12} className="stroke-[2.2]" />
          <span>Study Topic</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-main">
          {topic.title}
        </h1>
        {topic.estimatedTime && (
          <div className="flex items-center gap-1.5 text-xs text-text-muted mt-2">
            <Clock3 size={12} className="stroke-[1.75]" />
            <span>Estimated reading time: ~{topic.estimatedTime} minutes</span>
          </div>
        )}
      </div>

      {/* Discussion Content */}
      <div className="w-full rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 shadow-card min-h-[300px]">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 size={28} className="animate-spin text-primary stroke-[2]" />
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-text-main">Generating discussion...</p>
              <p className="text-xs text-text-muted">
                The AI is preparing a detailed study guide for this topic.
              </p>
            </div>
          </div>
        ) : hasDiscussion ? (
          <div className="prose prose-invert max-w-none">
            <div className="text-sm leading-7 text-text-light whitespace-pre-wrap font-mono">
              {typeof topic.discussion === "object"
                ? topic.discussion.content || JSON.stringify(topic.discussion, null, 2)
                : topic.discussion}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Sparkles size={24} className="text-text-muted stroke-[1.5]" />
            <p className="text-sm text-text-muted">
              Discussion not yet generated. Go back and click "Generate".
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/preparation/${applicationId}`)}
            >
              Back to Topics
            </Button>
          </div>
        )}
      </div>

      {/* Chat Section */}
      {hasDiscussion && !isProcessing && (
        <div className="w-full rounded-2xl border border-border-default bg-bg-surface shadow-card overflow-hidden">
          <div className="border-b border-border-default px-5 py-3 flex items-center gap-2">
            <MessageCircle size={15} className="text-primary stroke-[2]" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
              Ask follow-up questions
            </span>
          </div>

          {/* Messages */}
          <div className="px-5 py-4 max-h-[400px] overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-text-muted">
                  No messages yet. Ask a question about this topic to get started.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex items-start gap-3 ${
                    msg.role === "assistant" ? "" : "flex-row-reverse"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.role === "assistant"
                        ? "bg-primary/10 text-primary"
                        : "bg-bg-soft text-text-light"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <Brain size={14} className="stroke-[2]" />
                    ) : (
                      <User size={14} className="stroke-[2]" />
                    )}
                  </div>
                  <div
                    className={`flex-1 max-w-[80%] ${
                      msg.role === "assistant" ? "" : "flex justify-end"
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                        msg.role === "assistant"
                          ? "bg-bg-base border border-border-default text-text-light"
                          : "bg-primary/10 border border-primary/15 text-text-main"
                      }`}
                    >
                      {msg.message || msg.content}
                    </div>
                    <p className="text-[10px] text-text-muted mt-1 px-1">
                      {msg.role === "assistant" ? "AI Tutor" : "You"}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="border-t border-border-default px-5 py-3">
            <div className="flex items-end gap-3">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a follow-up question..."
                disabled={sending}
                rows={1}
                style={{ fieldSizing: "content" }}
                className="flex-1 min-h-[44px] max-h-[120px] resize-none rounded-xl border border-border-default bg-bg-base px-4 py-3 text-sm text-text-main placeholder:text-text-light outline-hidden focus:border-primary/40 transition-all font-mono"
              />
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || sending}
                className="flex-shrink-0 h-11 w-11 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-hover transition-all cursor-pointer active:scale-[0.97]"
              >
                {sending ? (
                  <Loader2 size={16} className="animate-spin stroke-[2.5]" />
                ) : (
                  <Send size={16} className="stroke-[2]" />
                )}
              </button>
            </div>
            <p className="text-[10px] text-text-muted mt-1.5 px-1">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicDiscussion;
