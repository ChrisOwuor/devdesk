"use client";

import {
  Calendar,
  Home,
  MessageSquare,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import ThemeToggle from "./ToggleButton";
import Link from "next/link";
import { useState } from "react";


export default function PrimarySidebar() {
  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      title: "Overview Dashboard",
      isActive: true,
      href: "/",
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: Calendar,
      title: "Planner / Calendar",
      isActive: false,
      href: "calender",
    },
    {
      id: "chat",
      label: "Chat",
      icon: MessageSquare,
      title: "Workspace Chat",
      isActive: false,
      href: "chat",
    },
  ];

  const [activeId, setActiveId] = useState(navItems[0].id);

  return (
    <nav
      id="global-rail"
      className="relative h-full py-2 rounded-sm shadow-custom left-0 top-0 w-14 z-50 bg-surface flex flex-col items-center  gap-8 select-none"
    >
      {/* Primary Navigation Items */}
      <div
        id="rail-actions-list"
        className="flex flex-col gap-4 w-full items-center"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;

          return (
            <div key={item.id} className="flex flex-col items-center">
              <Link
                id={`rail-btn-${item.id}`}
                href={item.href}
                title={item.title}
                onClick={() => setActiveId(item.id)}
                className={`
            w-10 h-10 flex items-center justify-center rounded-xl
            transition-all
            hover:bg-tertiary-custom/10
            group

            ${
              isActive
                ? "bg-primary-custom/10 text-primary-custom shadow-[0_0_12px_rgba(0,0,0,0.08)]"
                : "text-primary-custom/70 hover:text-primary-custom"
            }
          `}
              >
                <Icon className="w-5 h-5 " />
              </Link>

              <span
                className={`
            text-[9px] font-medium whitespace-nowrap transition-colors
            ${isActive ? "text-primary-custom font-bold" : "text-primary-custom/60"}
          `}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom Utility Controls */}
      <div
        id="rail-bottom-utilities"
        className="mt-auto flex flex-col gap-4 items-center"
      >
        <ThemeToggle />

        <div className="flex flex-col items-center gap-1.5 group">
          <button
            id="rail-btn-profile"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary-custom/10 text-primary-custom hover:bg-primary-custom hover:text-white transition-all"
            title="Profile"
          >
            <User className="w-5 h-5" />
          </button>
          <span className="text-[9px] font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors whitespace-nowrap">
            Profile
          </span>
        </div>
      </div>
    </nav>
  );
}
