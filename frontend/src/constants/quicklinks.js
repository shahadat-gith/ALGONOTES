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
    label: "Dashboard",
    description: "See your recent activity, study statistics, and overall progress at a glance.",
    icon: LayoutDashboard,
    activeColor: "group-hover:text-primary",
  },
  {
    to: "/notes/generate",
    label: "Create DSA Note",
    description: "Generate a new study note with code and explanations for coding problems.",
    icon: Sparkles,
    activeColor: "group-hover:text-primary",
  },
  {
    to: "/notes",
    label: "My DSA Notes",
    description: "View and open all your generated coding notes and solutions.",
    icon: FileText,
    activeColor: "group-hover:text-success",
  },
  {
    to: "/theory/generate",
    label: "Create Theory Note",
    description: "Generate a new study note for subjects like DBMS, OS, or networking.",
    icon: BookOpen,
    activeColor: "group-hover:text-primary", 
  },
  {
    to: "/theory",
    label: "My Theory Notes",
    description: "Look through all your generated notes for general college and school subjects.",
    icon: BookmarkCheck,
    activeColor: "group-hover:text-warning",
  },
];