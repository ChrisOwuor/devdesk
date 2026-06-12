"use client";
import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, BellRing } from "lucide-react";

import Sidebar from "./dashboard/Sidebar";
import Header from "./ui/Header";
import DashboardOverview from "./dashboard/DashboardOverview";
import ListViews from "./dashboard/ListViews";

import { Space, TeamMember, Task } from "../types";

export default function App() {
  // ----------------------------------------------------
  // Initial Seed Data Sets
  // ----------------------------------------------------
  const initialSpaces: Space[] = [
    {
      id: "space-eng",
      name: "Engineering",
      initial: "E",
      colorClass: "bg-primary-custom",
      textClass: "text-primary-custom",
      folders: [
        {
          id: "folder-safaricom-crm",
          name: "Safaricom CRM",
          isExpanded: true,
          lists: [
            {
              id: "list-backlog",
              name: "Backlog",
              tasks: [
                {
                  id: "t-1",
                  title: "Route transit gateway and configure NAT schemas",
                  status: "Backlog",
                  priority: "High",
                  dueDate: "2026-06-12",
                  assignee: "Alice Murray",
                },
                {
                  id: "t-2",
                  title: "Audit database replication locks & pool sizes",
                  status: "Backlog",
                  priority: "Medium",
                  dueDate: "2026-06-14",
                  assignee: "John Doe",
                },
                {
                  id: "t-3",
                  title: "Prepare documentation on SMS gateway webhook alerts",
                  status: "Backlog",
                  priority: "Low",
                  dueDate: "2026-06-18",
                  assignee: "Kevin Lee",
                },
              ],
            },
          ],
        },
        {
          id: "folder-mobile-app",
          name: "Mobile App",
          isExpanded: false,
          lists: [
            {
              id: "list-mob-back",
              name: "Backlog",
              tasks: [
                {
                  id: "t-8",
                  title: "In-app biometric authentication flow",
                  status: "Backlog",
                  priority: "High",
                  dueDate: "2026-06-25",
                  assignee: "Kevin Lee",
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  // ----------------------------------------------------
  // Application Dynamic States
  // ----------------------------------------------------
  const [spaces, setSpaces] = useState<Space[]>(initialSpaces);

  const [budgetConsumed, setBudgetConsumed] = useState<number>(12345);

  // Navigation states
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>("space-eng");
  const [activeFolderId, setActiveFolderId] = useState<string>(
    "folder-safaricom-crm",
  );
  const [activeListId, setActiveListId] = useState<string>("list-sprint1");
  const [activeHeaderTab, setActiveHeaderTab] = useState<string>("Overview");

  // Modal Dialog states

  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);

  const [showChatDrawer, setShowChatDrawer] = useState<boolean>(false);

  const [showPlannerModal, setShowPlannerModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  // ----------------------------------------------------
  // Toast notifications helpers
  // ----------------------------------------------------
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // ----------------------------------------------------
  // State Mutators
  // ----------------------------------------------------
  const handleAddSpace = (
    name: string,
    initial: string,
    colorClass: string,
  ) => {
    const newSpace: Space = {
      id: `space-${Date.now()}`,
      name,
      initial,
      colorClass,
      textClass: colorClass.replace("bg-", "text-"),
      folders: [],
    };
    setSpaces((prev) => [...prev, newSpace]);
    setSelectedSpaceId(newSpace.id);
    triggerToast(`Created space "${name}" successfully.`);
  };

  const handleAddFolder = (spaceId: string, name: string) => {
    setSpaces((prev) =>
      prev.map((space) => {
        if (space.id !== spaceId) return space;
        return {
          ...space,
          folders: [
            ...space.folders,
            {
              id: `folder-${Date.now()}`,
              name,
              lists: [],
            },
          ],
        };
      }),
    );
    triggerToast(`Added folder "${name}" to work group.`);
  };

  const handleAddList = (spaceId: string, folderId: string, name: string) => {
    setSpaces((prev) =>
      prev.map((space) => {
        if (space.id !== spaceId) return space;
        return {
          ...space,
          folders: space.folders.map((folder) => {
            if (folder.id !== folderId) return folder;
            return {
              ...folder,
              lists: [
                ...folder.lists,
                {
                  id: `list-${Date.now()}`,
                  name,
                  tasks: [],
                },
              ],
            };
          }),
        };
      }),
    );
    triggerToast(`Created new Sprint tracker "${name}".`);
  };

  const handleAddTask = (
    spaceId: string,
    folderId: string,
    listId: string,
    taskItem: Omit<Task, "id">,
  ) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      ...taskItem,
    };

    setSpaces((prev) =>
      prev.map((space) => {
        if (space.id !== spaceId) return space;
        return {
          ...space,
          folders: space.folders.map((folder) => {
            if (folder.id !== folderId) return folder;
            return {
              ...folder,
              lists: folder.lists.map((list) => {
                if (list.id !== listId) return list;
                return {
                  ...list,
                  tasks: [...(list.tasks || []), newTask],
                };
              }),
            };
          }),
        };
      }),
    );
    triggerToast(`Task added successfully.`);
  };

  const handleUpdateTaskStatus = (
    spaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
    newStatus: Task["status"],
  ) => {
    setSpaces((prev) =>
      prev.map((space) => {
        if (space.id !== spaceId) return space;
        return {
          ...space,
          folders: space.folders.map((folder) => {
            if (folder.id !== folderId) return folder;
            return {
              ...folder,
              lists: folder.lists.map((list) => {
                if (list.id !== listId) return list;
                return {
                  ...list,
                  tasks: (list.tasks || []).map((task) => {
                    if (task.id !== taskId) return task;
                    return { ...task, status: newStatus };
                  }),
                };
              }),
            };
          }),
        };
      }),
    );
  };

  const handleDeleteTask = (
    spaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
  ) => {
    setSpaces((prev) =>
      prev.map((space) => {
        if (space.id !== spaceId) return space;
        return {
          ...space,
          folders: space.folders.map((folder) => {
            if (folder.id !== folderId) return folder;
            return {
              ...folder,
              lists: folder.lists.map((list) => {
                if (list.id !== listId) return list;
                return {
                  ...list,
                  tasks: (list.tasks || []).filter((t) => t.id !== taskId),
                };
              }),
            };
          }),
        };
      }),
    );
    triggerToast("Task deleted.");
  };

  const handleActionClick = () => {
    triggerToast(
      "Direct download link generated for Safaricom SLA configuration profiles.",
    );
  };

  return (
    <div className="cont p-2 w-full">
      <div
        id="application-container"
        className="w-full h-full transition-colors left-[72px] grid grid-cols-5 duration-200  shadow-custom rounded-sm "
      >
        {/* 1. App Double Sidebar system */}
        <Sidebar
          spaces={spaces}
          selectedSpaceId={selectedSpaceId}
          setSelectedSpaceId={setSelectedSpaceId}
          activeFolderId={activeFolderId}
          setActiveFolderId={setActiveFolderId}
          activeListId={activeListId}
          setActiveListId={setActiveListId}
          activeHeaderTab={activeHeaderTab}
          setActiveHeaderTab={setActiveHeaderTab}
          onAddSpace={handleAddSpace}
          onAddFolder={handleAddFolder}
          onAddList={handleAddList}
          toggleSearch={() => setShowSearchModal(true)}
          toggleChat={() => setShowChatDrawer(true)}
          togglePlanner={() => setShowPlannerModal(true)}
        />

        {/* 3. Main Stage container (Compensate sidebar width [352px] and header height [16px/64px]) */}
        <main
          id="main-frame-stage"
          className="col-span-4 flex min-w-0 flex-col w-full  "
        >
          {/* 2. Top Header Toolbar */}
          <Header
            spaces={spaces}
            selectedSpaceId={selectedSpaceId}
            onActionClick={handleActionClick}
            activeHeaderTab={activeHeaderTab}
            setActiveHeaderTab={setActiveHeaderTab}
          />

          {/* 4. Active Tab Router Canvas */}
          <div
            id="active-tab-canvas-wrapper"
            className="animate-fade-in duration-300 w-full flex-1 h-full  bg-surface-tertiary"
          >
            {activeHeaderTab === "Overview" && (
              <DashboardOverview
                budgetConsumed={budgetConsumed}
                budgetTotal={250000}
                setBudgetConsumed={setBudgetConsumed}
              />
            )}

            {activeHeaderTab === "List View" && (
              <ListViews
                spaces={spaces}
                selectedSpaceId={selectedSpaceId}
                activeFolderId={activeFolderId}
                activeListId={activeListId}
                onAddTask={handleAddTask}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onDeleteTask={handleDeleteTask}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
