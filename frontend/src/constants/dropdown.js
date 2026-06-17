import {
  Sparkles,
  StickyNote,
  Settings,
  BookOpen,
  BookMarked,
} from "lucide-react";

export const dropdownItems = [
  {
    to: "/notes/generate",
    label: "Generate Notes",
    icon: Sparkles,
    activeColor: "group-hover:text-[var(--warning)]",
  },
  {
    to: "/notes",
    label: "My Notes",
    icon: StickyNote,
    activeColor: "group-hover:text-[var(--success)]",
  },
  {
    to: "/theory/generate",
    label: "Generate Theory Notes",
    icon: BookOpen,
    activeColor: "group-hover:text-primary", 
  },
  {
    to: "/theory",
    label: "My Theory Notes",
    icon: BookMarked,
    activeColor: "group-hover:text-[var(--warning)]",
  },
  {
    to: "/settings",
    label: "Account Settings",
    icon: Settings,
    activeColor: "group-hover:text-[var(--text-main)]",
  }
];