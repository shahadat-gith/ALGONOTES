import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  FileText,
  BookmarkCheck,
  Code2,
  Award,
} from "lucide-react";

export const quicklinks = [
  {
    to: "/dashboard",
    label: "Dashboard",
    description:
      "Check your recent activity, saved notes, and overall study progress in one place.",
    icon: LayoutDashboard,
    activeColor: "group-hover:text-primary",
  },
  {
    to: "/interview-prep/dashboard",
    label: "Preparation Workspace",
    description:
      "Browse all your resume and job preparations.",
    icon: Code2,
    activeColor: "group-hover:text-primary",
  },
  {
    to: "/notes/generate",
    label: "Generate DSA Notes",
    description:
      "Turn a solved coding problem into structured notes with explanation, flow, and key takeaways.",
    icon: Sparkles,
    activeColor: "group-hover:text-primary",
  },
  {
    to: "/notes",
    label: "Your DSA Notes",
    description:
      "Browse your saved problem notes and reopen them whenever you want to revise.",
    icon: FileText,
    activeColor: "group-hover:text-success",
  },
  {
    to: "/theory/generate",
    label: "Generate Theory Notes",
    description:
      "Build clean concept notes for theory topics such as DBMS, operating systems, or networks.",
    icon: BookOpen,
    activeColor: "group-hover:text-primary",
  },
  {
    to: "/theory",
    label: "Your Theory Notes",
    description:
      "Open your saved concept notes and continue revising important subjects with ease.",
    icon: BookmarkCheck,
    activeColor: "group-hover:text-warning",
  },
  {
    to: "/leetcode",
    label: "LeetCode Profile",
    description:
      "View your linked LeetCode stats — problems solved, contest ranking, badges and more.",
    icon: Award,
    activeColor: "group-hover:text-primary",
  },
];