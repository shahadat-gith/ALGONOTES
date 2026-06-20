import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, BookOpen, Code2, ShieldCheck, Zap, Users, ArrowRight, Quote } from "lucide-react";
import Glow from "../../components/common/Glow";


const values = [
  {
    icon: BookOpen,
    title: "Knowledge First",
    description: "Every feature is built to help you truly understand and retain concepts — not just memorize solutions.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Code2,
    title: "Developer-Centric",
    description: "Designed by developers, for developers. Clean workflows, keyboard-friendly interfaces, and markdown support throughout.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Your Data, Your Control",
    description: "Your notes belong to you. We prioritize data sovereignty with encrypted storage and full account deletion capabilities.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Zap,
    title: "Speed & Reliability",
    description: "Fast search, quick note generation, and a responsive interface that stays out of your way while you study.",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
  },
];

const About = () => {
  return (
    <div className="w-full min-h-screen text-text-main relative overflow-hidden pb-20">
      <Glow preset="hero" />
      <Glow preset="heroSecondary" />
      <Glow preset="heroTertiary" />
      <Glow preset="bottomLeft" />

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10 sm:pt-12 space-y-16 sm:space-y-20">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Sparkles size={12} className="stroke-[2.2]" />
            <span>About ALGONOTES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-main leading-tight">
            Smarter notes for <span className="text-primary">coding and theory</span>
          </h1>
          <p className="text-sm sm:text-base leading-7 text-text-light max-w-2xl mx-auto">
            ALGONOTES is a modern study platform that transforms how to prepare for technical interviews and master computer science concepts. We combine AI-powered note generation with a clean, distraction-free workspace.
          </p>
        </section>

        {/* Mission Statement */}
        <section className="relative rounded-2xl border border-border-default bg-gradient-to-br from-bg-surface via-bg-surface to-primary/5 p-8 sm:p-10 shadow-card">
          <Quote size={24} className="text-primary/20 absolute top-6 left-6" />
          <div className="max-w-3xl mx-auto text-center space-y-4 relative">
            <p className="text-base sm:text-lg leading-relaxed text-text-main font-medium italic">
              &ldquo;We believe the best way to learn is to teach. ALGONOTES helps you document what you&apos;ve solved, organize what you&apos;ve learned, and revisit it whenever you need — turning every problem into a permanent asset.&rdquo;
            </p>
            <div className="flex items-center justify-center gap-3 text-sm text-text-muted">
              <div className="w-8 h-px bg-border-default" />
              <span className="font-semibold tracking-wide">The ALGONOTES Team</span>
              <div className="w-8 h-px bg-border-default" />
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-text-main">What we offer</h2>
            <p className="text-sm text-text-light max-w-xl mx-auto">Two powerful note systems designed to cover every aspect of your computer science study journey.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="group rounded-xl border border-border-default bg-bg-surface p-6 shadow-card hover:border-primary/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                  <Code2 size={20} className="stroke-[1.75]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-main">DSA Coding Notes</h3>
                  <p className="text-[11px] text-text-muted font-medium">Problem-based study system</p>
                </div>
              </div>
              <p className="text-sm leading-6 text-text-light">Generate structured notes from any coding problem. Get detailed intuition, multiple approach analyses, complexity breakdowns, dry-run traces, and edge case coverage.</p>
              <Link to="/notes/generate" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover transition-colors group/link">
                <span>Try it now</span>
                <ArrowRight size={12} className="transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </div>
            <div className="group rounded-xl border border-border-default bg-bg-surface p-6 shadow-card hover:border-primary/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <BookOpen size={20} className="stroke-[1.75]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-main">Theory Study Notes</h3>
                  <p className="text-[11px] text-text-muted font-medium">Topic-based learning</p>
                </div>
              </div>
              <p className="text-sm leading-6 text-text-light">Create comprehensive theory notes on any CS topic. Rich text editing with image support, code blocks, and AI-powered content generation to accelerate your learning.</p>
              <Link to="/theory/generate" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors group/link">
                <span>Try it now</span>
                <ArrowRight size={12} className="transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-text-main">Our core values</h2>
            <p className="text-sm text-text-light max-w-xl mx-auto">The principles that guide every decision we make.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="rounded-xl border border-border-default bg-bg-surface p-5 shadow-card hover:border-border-strong/60 transition-all duration-300 group">
                  <div className={`p-2.5 rounded-lg ${value.bg} ${value.color} mb-3 w-fit transition-transform duration-300 group-hover:scale-105`}>
                    <Icon size={18} className="stroke-[1.75]" />
                  </div>
                  <h3 className="text-sm font-bold text-text-main mb-1.5">{value.title}</h3>
                  <p className="text-xs leading-5 text-text-light">{value.description}</p>
                </div>
              );
            })}
          </div>
        </section>

       

        {/* CTA Section */}
        <section className="rounded-2xl border border-border-default bg-gradient-to-br from-bg-surface via-bg-surface to-primary/5 p-8 sm:p-10 shadow-card text-center space-y-5">
          <Users size={28} className="mx-auto text-primary/60" />
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-main">Ready to transform your study workflow?</h2>
            <p className="text-sm text-text-light max-w-lg mx-auto">Join developers who use ALGONOTES to organize their learning and ace their technical interviews.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/register" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-all shadow-[0_0_22px_rgba(138,121,255,0.34)] active:scale-[0.98]">
              <Sparkles size={14} />
              <span>Get Started Free</span>
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border-default bg-bg-surface text-text-main text-sm font-semibold hover:border-primary/30 hover:text-primary transition-all active:scale-[0.98]">
              <span>Learn More</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
