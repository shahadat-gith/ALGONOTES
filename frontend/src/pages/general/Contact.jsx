import React from "react";
import { Link } from "react-router-dom";
import { Mail, MessageSquare, Sparkles, ArrowRight, Send } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Glow from "../../components/common/Glow";

const Contact = () => {
  return (
    <div className="w-full min-h-screen text-text-main relative overflow-hidden pb-20">
      <Glow preset="hero" />
      <Glow preset="heroSecondary" />

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10 sm:pt-12 space-y-12">
        {/* Header */}
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <MessageSquare size={12} className="stroke-[2.2]" />
            <span>Get in Touch</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-main">We&apos;d love to hear from you</h1>
          <p className="text-sm leading-7 text-text-light">Have a question, feature request, or just want to say hi? Reach out and we&apos;ll get back to you.</p>
        </section>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          <a href="mailto:support@algonotes.in" className="group rounded-xl border border-border-default bg-bg-surface p-6 shadow-card hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <Mail size={20} className="stroke-[1.75]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-main">Email Us</h3>
                <p className="text-[11px] text-text-muted font-medium">We reply within 24 hours</p>
              </div>
            </div>
            <p className="text-xs text-text-light font-mono group-hover:text-primary transition-colors">dev.shahadat.offl@gmail.com</p>
          </a>

          <a href="https://github.com/shahadat-gith" target="_blank" rel="noreferrer" className="group rounded-xl border border-border-default bg-bg-surface p-6 shadow-card hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400">
                <FaGithub size={20} className="stroke-[1.75]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-main">GitHub</h3>
                <p className="text-[11px] text-text-muted font-medium">Open source & issues</p>
              </div>
            </div>
            <p className="text-xs text-text-light group-hover:text-sky-400 transition-colors">@shahadat-gith</p>
          </a>
        </div>

        {/* CTA */}
        <section className="rounded-2xl border border-border-default bg-gradient-to-br from-bg-surface via-bg-surface to-primary/5 p-8 sm:p-10 shadow-card text-center space-y-5 max-w-3xl mx-auto">
          <Send size={24} className="mx-auto text-primary/60" />
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-text-main">Ready to start studying?</h2>
            <p className="text-sm text-text-light max-w-md mx-auto">Jump straight into creating your first AI-powered study note.</p>
          </div>
          <Link to="/register" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-all shadow-[0_0_22px_rgba(138,121,255,0.34)] active:scale-[0.98]">
            <Sparkles size={14} />
            <span>Get Started Free</span>
            <ArrowRight size={14} />
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Contact;
