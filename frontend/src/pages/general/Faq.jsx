import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, HelpCircle, Mail, MessageSquare, Search, Sparkles } from "lucide-react";
import Glow from "../../components/common/Glow";

const faqData = [
  {
    category: "Getting Started",
    items: [
      {
        q: "What is ALGONOTES?",
        a: "ALGONOTES is an AI-powered study platform that helps developers create structured notes from coding problems and CS theory topics. It generates detailed explanations, complexity analyses, and approach breakdowns so you can focus on learning, not formatting.",
      },
      {
        q: "How do I create my first note?",
        a: "Sign up for a free account, navigate to the Notes or Theory section, and click 'Generate'. For DSA notes, paste a problem link and your solution code. For theory notes, enter a topic and optional instructions. The AI will generate a structured note within 1-2 minutes.",
      },
      {
        q: "Is ALGONOTES free to use?",
        a: "Yes, ALGONOTES offers a generous free tier that includes AI-powered note generation, unlimited note storage, and full access to all features. There are no hidden charges or credit cards required to get started.",
      },
    ],
  },
  {
    category: "Features & Usage",
    items: [
      {
        q: "What types of notes can I create?",
        a: "You can create two types of notes: DSA Coding Notes (problem-based with intuition, approaches, complexity analysis, dry-runs, and edge cases) and Theory Study Notes (topic-based with rich text editing, code blocks, and image support).",
      },
      {
        q: "Can I edit my notes after generation?",
        a: "Absolutely. Both DSA and theory notes are fully editable. You can modify the content, add custom sections, update code blocks, or change the formatting. Changes are saved in real-time.",
      },
      {
        q: "How does the AI note generation work?",
        a: "For DSA notes, the AI analyzes your problem link and solution code to generate intuition, multiple approaches (brute force to optimal), complexity analysis, dry-run traces, and edge cases. For theory notes, it uses your topic and instructions to create comprehensive study material.",
      },
    ],
  },
  {
    category: "Account & Data",
    items: [
      {
        q: "Is my data secure?",
        a: "Yes. All data is encrypted in transit using SSL/TLS and stored securely. Your notes are private to your account. We do not share your data with third parties, and you can delete your account and all associated data at any time.",
      },
      {
        q: "Can I export my notes?",
        a: "Notes can be copied, shared, or exported as needed. The theory editor supports rich text formatting that can be copied to other document tools. We are working on additional export formats for future releases.",
      },
      {
        q: "How do I delete my account?",
        a: "You can request account deletion from your dashboard settings. All your notes, data, and personal information will be permanently removed from our systems within 72 hours.",
      },
    ],
  },
  {
    category: "Technical",
    items: [
      {
        q: "Which programming languages are supported?",
        a: "DSA notes support C++, Java, Python, JavaScript, TypeScript, Go, and more. Theory notes allow you to embed code examples in any language. The AI adapts explanations to your chosen language.",
      },
      {
        q: "How long does note generation take?",
        a: "Most notes are generated within 1-2 minutes. Complex problems or broad theory topics may take slightly longer. You can leave the page and return later — your note will be ready.",
      },
      {
        q: "Can I use ALGONOTES on mobile?",
        a: "Yes, ALGONOTES is fully responsive and works on mobile devices, tablets, and desktops. You can create, edit, and review notes from any device with a modern browser.",
      },
    ],
  },
];

const Faq = () => {
  const [openItems, setOpenItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const toggleItem = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const filteredData = faqData
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0 || searchQuery === "");

  return (
    <div className="w-full min-h-screen text-text-main relative overflow-hidden pb-20">
      <Glow preset="hero" />
      <Glow preset="heroSecondary" />
      <Glow preset="bottomLeft" />

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10 sm:pt-12 space-y-10">
        {/* Hero Header */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <HelpCircle size={12} className="stroke-[2.2]" />
            <span>FAQ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-main leading-tight">
            Frequently asked questions
          </h1>
          <p className="text-sm sm:text-base leading-7 text-text-light max-w-2xl mx-auto">
            Everything you need to know about ALGONOTES. Can&apos;t find what you&apos;re looking for?{" "}
            <Link to="/contact" className="text-primary hover:text-primary-hover font-semibold">
              Contact us
            </Link>.
          </p>
        </section>

        {/* Search */}
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-2 rounded-xl border border-border-default bg-bg-surface px-4 py-3 transition-all duration-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30">
            <Search size={16} className="text-text-light shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs..."
              className="flex-1 bg-transparent text-sm text-text-main placeholder:text-text-light outline-none"
            />
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-8">
          {filteredData.map((category, catIdx) => (
            <div key={catIdx}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
                <span className="w-6 h-px bg-border-default" />
                <span>{category.category}</span>
                <span className="flex-1 h-px bg-border-default" />
              </h2>
              <div className="space-y-2">
                {category.items.map((item, itemIdx) => {
                  const key = `${catIdx}-${itemIdx}`;
                  const isOpen = openItems[key];
                  return (
                    <div
                      key={itemIdx}
                      className="rounded-xl border border-border-default bg-bg-surface overflow-hidden transition-all duration-200 hover:border-border-strong/60"
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(catIdx, itemIdx)}
                        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer transition-colors hover:bg-bg-soft/30"
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
                          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="px-5 pb-4 text-xs leading-6 text-text-light border-t border-border-default/40 pt-3">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {searchQuery && filteredData.length === 0 && (
            <div className="text-center py-12 space-y-3">
              <Search size={32} className="mx-auto text-text-light/40" />
              <p className="text-sm text-text-muted font-medium">No results found for &ldquo;{searchQuery}&rdquo;</p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Still have questions? */}
        <section className="rounded-2xl border border-border-default bg-gradient-to-br from-bg-surface via-bg-surface to-primary/5 p-8 sm:p-10 shadow-card text-center space-y-5 max-w-3xl mx-auto">
          <MessageSquare size={24} className="mx-auto text-primary/60" />
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-text-main">Still have questions?</h2>
            <p className="text-sm text-text-light max-w-md mx-auto">
              Can&apos;t find the answer you&apos;re looking for? Reach out to us directly.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-all shadow-[0_0_22px_rgba(138,121,255,0.34)] active:scale-[0.98]"
            >
              <Mail size={14} />
              <span>Contact Us</span>
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border-default bg-bg-surface text-text-main text-sm font-semibold hover:border-primary/30 hover:text-primary transition-all active:scale-[0.98]"
            >
              <Sparkles size={14} />
              <span>Get Started</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Faq;
