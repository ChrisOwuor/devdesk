/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  ChevronRight,
  Bell,
  HelpCircle,
  Share2,
  Settings,
  Folder,
  LayoutDashboard,
  List,
  Layers,
  GitMerge,
  Filter,
  ArrowUpDown,
  Search,
  SlidersHorizontal,
  EyeOff,
} from "lucide-react";
import { Space } from "../../types";

interface HeaderProps {
  spaces: {
    id: string;
    name: string;

    folders: {
      id: string;
      name: string;

      pages: {
        id: string;
        name: string;
      }[];
    }[];
  }[];
  selectedSpaceId: string;
  onActionClick: () => void;
  activeHeaderTab: string;
  setActiveHeaderTab: (activeHeaderTab: string) => void;
  workspaseName: string;
}

export default function Header({
  spaces,
  selectedSpaceId,
  onActionClick,
  activeHeaderTab,
  setActiveHeaderTab,
  workspaseName,
}: HeaderProps) {
  const selectedSpace =
    spaces.find((s) => s.id === selectedSpaceId) || spaces[0];

  // Component state mockups for ClickUp toolbar interactions
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header
      id="main-app-header"
      className="w-full bg-background pt-2 flex flex-col select-none"
    >
      {/* 1. TOP ROW: Breadcrumbs & Global Actions */}
      <div className="flex items-center justify-between h-11 px-4">
        {/* Left: Breadcrumbs */}
        <div
          id="header-breadcrumbs"
          className="flex items-center gap-1.5 text-sm"
        >
          <div className="flex items-center gap-1 text-tertiary-custom  cursor-pointer transition-colors">
            <Folder className="w-4 h-4 " />
            <span>{workspaseName}</span>
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />

          <div className="flex items-center font-semibold text-primary-custom">
            <span className="w-2.5 h-2.5 rounded-full " />
            <span>
              {selectedSpace.id === "space-eng"
                ? "Safaricom CRM"
                : `${selectedSpace.name} Dashboard`}
            </span>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE ROW: Navigation Views/Tabs */}
      <div className="px-4 border-b pb-2 border-border">
        <div
          id="tab-controls-navigation"
          className="flex items-center gap-1 h-9 -mb-[1px]"
        >
          {[
            {
              name: "Overview",
              icon: <LayoutDashboard className="w-3.5 h-3.5" />,
            },
            { name: "List View", icon: <List className="w-3.5 h-3.5" /> },
          ].map((tab) => {
            const isActive = activeHeaderTab === tab.name;
            return (
              <button
                key={tab.name}
                id={`tab-select-${tab.name.toLowerCase()}`}
                onClick={() => setActiveHeaderTab(tab.name)}
                className={`flex items-center gap-1.5 mr-3 h-full  text-xs  transition-all cursor-pointer ${
                  isActive
                    ? "text-tertiary-custom font-bold border-b-2 border-tertiary-custom"
                    : "text-tertiary-custom"
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. NEW BOTTOM ROW: ClickUp Filtering & Grouping Toolbar */}
      <div
        id="view-filter-toolbar"
        className="flex items-center justify-between h-9 px-4  text-tertiary-custom"
      >
        {/* Left Side: Arrangement Controls */}
        <div className="flex items-center gap-1.5">
          {/* Grouping Button */}
          <button className="flex items-center gap-1 px-2 py-1  rounded transition-colors border border-transparent text-[12px]">
            <Layers className="w-3.5 h-3.5" />
            <span>Group: Status</span>
          </button>

          {/* Subtasks Treatment */}
          <button className="flex items-center gap-1 px-2 py-1  rounded transition-colors border border-transparent text-[12px]">
            <GitMerge className="w-3.5 h-3.5 rotate-90" />
            <span>Subtasks: Collapse all</span>
          </button>

          <div className="h-3.5 w-[1px] bg-gray-200 dark:bg-[#2a2a2b] mx-0.5" />

          {/* Filters Activator */}
          <button className="flex items-center gap-1 px-2 py-1  rounded transition-colors border border-transparent text-[12px]">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>

          {/* Sort Activator */}
          <button className="flex items-center gap-1 px-2 py-1  rounded transition-colors border border-transparent text-[12px]">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort</span>
          </button>
        </div>

        {/* Right Side: View Customization & Search */}
        <div className="flex items-center gap-2">
          {/* Inline Search Bar */}
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-all border ${
              searchOpen || searchQuery
                ? "bg-white dark:bg-[#2a2a2b] w-48 border-gray-300 dark:border-neutral-700"
                : "w-20 bg-transparent border-transparent hover:bg-gray-100 dark:hover:bg-[#2a2a2b] cursor-pointer"
            }`}
            onClick={() => setSearchOpen(true)}
            onBlur={() => !searchQuery && setSearchOpen(false)}
          >
            <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-xs text-gray-700 dark:text-gray-200 placeholder-gray-400"
            />
          </div>

          {/* Hidden Fields / Show button */}
          <button className="flex items-center gap-1 px-2 py-1  rounded transition-colors border border-transparent text-[12px]">
            <EyeOff className="w-3.5 h-3.5" />
            <span>Show</span>
          </button>

          {/* Column configs */}
          <button className="flex items-center gap-1 px-2 py-1  rounded transition-colors border border-transparent text-[12px]">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Columns</span>
          </button>
        </div>
      </div>
    </header>
  );
}
