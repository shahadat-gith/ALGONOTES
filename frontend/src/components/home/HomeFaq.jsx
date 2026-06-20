import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, HelpCircle, ArrowRight, Sparkles, MessageCircle } from "lucide-react";

const faqItems = [
  {
    q: "What is ALGONOTES?",
    a: "ALGONOTES is an AI-powered study platform that helps developers create structured notes from coding problems and CS theory topics. It generates detailed explanations, complexity analyses, and approach breakdowns so you can focus on learning, not formatting.",
  },
  {
    q: "Is ALGONOTES free to use?",
    a: "Yes, ALGONOTES offers a generous free tier that includes AI-powered note generation, unlimited note storage, and full access to all features. There are no hidden charges or credit cards required to get started.",
  },
  {
    q: "How does the AI note generation work?",
    a: "For DSA notes, the AI analyzes your problem link and solution code to generate intuition, multiple approaches (brute force to optimal), complexity analysis, dry-run traces, and edge cases. For theory notes, it uses your topic and instructions to create comprehensive study material — all within 1-2 minutes.",
  },
  {
    q: "Can I edit my notes after generation?",
    a: "Absolutely. Both DSA and theory notes are fully editable. You can modify the content, add custom sections, update code blocks, or change the formatting. Changes are saved in real-time.",
  },
  {
    q: "Which programming languages are supported?",
    a: "DSA notes support C++, Java, Python, JavaScript, TypeScript, Go, and more. Theory notes allow you to embed code examples in any language. The AI adapts explanations to your chosen language.",
  },
];

const HomeFaq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="w-full rounded-[2rem] border border-border-default bg-bg-surface/60 p-6 sm:p-10 shadow-card relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-[-20%] right-[-10%] h-[18rem] w-[24rem] rounded-full bg-primary/8 blur-[120px] pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <HelpCircle size={12} className="stroke-[2.2]" />
            <span>FAQ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-main">
            Common questions
          </h2>
          <p className="text-sm text-text-light max-w-lg mx-auto">
            Quick answers to the most common questions. Can&apos;t find what you need? Visit the full FAQ.
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-2xl mx-auto space-y-2">
          {faqItems.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-xl border transition-all duration-200 ${
                  isOpen
                    ? "border-primary/30 bg-bg-surface shadow-sm"
                    : "border-border-default bg-bg-surface/40 hover:border-border-strong/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer transition-colors hover:bg-bg-soft/20 rounded-xl"
                >
                  <span className="text-sm font-semibold text-text-main pr-4">{item.q}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-text-light transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isOpen
                      ? "max-h-[2000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-5 pb-4 pt-1 text-xs leading-6 text-text-light">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* View all CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-all shadow-[0_0_22px_rgba(138,121,255,0.34)] active:scale-[0.98]"
          >
            <MessageCircle size={14} />
            <span>View All FAQs</span>
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border-default bg-bg-surface text-text-main text-sm font-semibold hover:border-primary/30 hover:text-primary transition-all active:scale-[0.98]"
          >
            <Sparkles size={14} />
            <span>Still have questions?</span>
            <ArrowRight size={14} className="stroke-[2]" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeFaq;
