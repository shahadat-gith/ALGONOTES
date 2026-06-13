 import { LayoutDashboard,FolderCode, StickyNote, Settings, } from "lucide-react";
 
 
 export const dropdownItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      activeColor: "group-hover:text-[var(--primary)]"
    },
    {
      to: "/problems",
      label: "Problem Workspace",
      icon: FolderCode,
      activeColor: "group-hover:text-[var(--primary)]"
    },
    {
      to: "/notes",
      label: "Your Generated Notes",
      icon: StickyNote,
      activeColor: "group-hover:text-[var(--success)]"
    },
    // {
    //   to: "/settings",
    //   label: "Account Settings",
    //   icon: Settings,
    //   activeColor: "group-hover:text-[var(--text-main)]"
    // }
  ];