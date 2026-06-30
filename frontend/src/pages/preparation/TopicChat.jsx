import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  Loader2,
  Send,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getTopic,
  getChatMessages,
  sendChatMessage,
} from "../../api/preparationApi";

import Button from "../../components/common/Button";
import Glow from "../../components/common/Glow";
import Loader from "../../components/common/Loader";

const TopicChat = () => {
  const { applicationId, topicId } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [topicRes, chatRes] = await Promise.all([
        getTopic(topicId),
        getChatMessages(topicId).catch(() => ({ success: false, data: [] })),
      ]);
      if (topicRes?.success) setTopic(topicRes.data);
      if (chatRes?.success) setMessages(chatRes.data || []);
    } catch {
      toast.error("Failed to load chat.");
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || sending) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setSending(true);

    try {
      const res = await sendChatMessage(topicId, userMessage);
      if (res?.success || res?.answer) {
        const chatRes = await getChatMessages(topicId).catch(() => null);
        if (chatRes?.success) {
          setMessages(chatRes.data || []);
        } else if (res?.answer) {
          setMessages((prev) => [
            ...prev,
            { _id: `user-${Date.now()}`, role: "user", message: userMessage },
            { _id: `resp-${Date.now()}`, role: "assistant", message: res.answer },
          ]);
        }
      }
    } catch {
      toast.error("Failed to send message.");
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
        <Loader text="Loading chat..." />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <p className="text-text-muted text-sm">Topic not found.</p>
          <Button variant="outline" size="sm" onClick={() => navigate(`/preparation/${applicationId}`)}>
            <ArrowLeft size={14} className="stroke-[2]" />
            <span>Back</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen flex flex-col relative overflow-hidden">
      <Glow preset="subtle" />
      <Glow preset="topRight" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-default pb-4 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/preparation/${applicationId}/topics/${topicId}`)}
            className="p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-bg-soft transition-all cursor-pointer"
          >
            <ArrowLeft size={16} className="stroke-[2]" />
          </button>
          <div>
            <h1 className="text-sm font-semibold text-text-main tracking-tight line-clamp-1">
              {topic.title}
            </h1>
            <p className="text-[11px] text-text-muted">AI Tutor Chat</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 min-h-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-16 space-y-3">
            <Brain size={32} className="text-text-muted stroke-[1.5]" />
            <p className="text-sm text-text-muted text-center max-w-sm">
              Ask questions about "{topic.title}" and the AI tutor will help you understand it better.
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
              <div className={`flex-1 max-w-[80%] ${msg.role === "assistant" ? "" : "flex justify-end"}`}>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                    msg.role === "assistant"
                      ? "bg-bg-base border border-border-default text-text-light"
                      : "bg-primary/10 border border-primary/15 text-text-main"
                  }`}
                >
                  {msg.message || msg.content}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t border-border-default pt-3 shrink-0">
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
  );
};

export default TopicChat;
