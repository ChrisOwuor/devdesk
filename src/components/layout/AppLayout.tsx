"use client";

import React, { ReactNode } from "react";

interface AppLayoutProps {
  primarySidebar: ReactNode;
  secondarySidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

export default function AppLayout({
  primarySidebar,
  secondarySidebar,
  header,
  children,
}: AppLayoutProps) {
  return (
    <div id="app-layout-root" className="h-screen w-screen flex flex-col bg-background overflow-hidden">
      {/* Secondary Sidebar (contains primary sidebar) + Header + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Container */}
        <div id="sidebar-container" className="relative">
          {secondarySidebar}
        </div>

        {/* Header + Main Content Column */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <div id="header-container" className="shrink-0">
            {header}
          </div>

          {/* Main Content Area */}
          <main
            id="main-content-area"
            className="flex-1 overflow-auto bg-background"
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

