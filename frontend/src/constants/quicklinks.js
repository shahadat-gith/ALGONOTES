import {
  Sparkles,
  StickyNote,
  Settings,
  BookOpen,
  BookMarked,
} from "lucide-react";

export const quicklinks = [
  {
    to: "/notes/generate",
    label: "Generate DSA Notes",
    icon: Sparkles,
    activeColor: "group-hover:text-[var(--warning)]",
  },
  {
    to: "/notes",
    label: "My DSA Notes",
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
];