import {
  LayoutDashboard,
  Sparkles,
  StickyNote,
  Settings,
} from "lucide-react";

export const dropdownItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    activeColor: "group-hover:text-[var(--primary)]",
  },
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
    to: "/settings",
    label: "Account Settings",
    icon: Settings,
    activeColor: "group-hover:text-[var(--text-main)]"
  }
];