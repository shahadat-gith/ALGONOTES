import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  FileText,
  BookmarkCheck,
} from "lucide-react";

export const quicklinks = [
  {
    to: "/dashboard",
    label: "Overview",
    description: "Check your recent activity, saved notes, and overall study progress in one place.",
    icon: LayoutDashboard,
    activeColor: "group-hover:text-primary",
  },
  {
    to: "/notes/generate",
    label: "Create Coding Notes",
    description: "Turn a solved coding problem into structured notes with explanation, flow, and key takeaways.",
    icon: Sparkles,
    activeColor: "group-hover:text-primary",
  },
  {
    to: "/notes",
    label: "Coding Notes Library",
    description: "Browse your saved problem notes and reopen them whenever you want to revise.",
    icon: FileText,
    activeColor: "group-hover:text-success",
  },
  {
    to: "/theory/generate",
    label: "Create Theory Notes",
    description: "Build clean concept notes for theory topics such as DBMS, operating systems, or networks.",
    icon: BookOpen,
    activeColor: "group-hover:text-primary", 
  },
  {
    to: "/theory",
    label: "Theory Notes Library",
    description: "Open your saved concept notes and continue revising important subjects with ease.",
    icon: BookmarkCheck,
    activeColor: "group-hover:text-warning",
  },
];