"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Plus,
  Layers,
  X,
  List as ListIcon,
} from "lucide-react";
import { Space, Folder as FolderType, List } from "@/types";
import PrimarySidebar from "../ui/PrimarySidebar";
import { useTheme } from "next-themes";

interface SidebarProps {
  spaces: Space[];
  selectedSpaceId: string;
  setSelectedSpaceId: (id: string) => void;
  activeFolderId: string;
  setActiveFolderId: (id: string) => void;
  activeListId: string;
  setActiveListId: (id: string) => void;
  activeHeaderTab: string;
  setActiveHeaderTab: (tab: string) => void;
  onAddSpace: (name: string, initial: string, colorClass: string) => void;
  onAddFolder: (spaceId: string, name: string) => void;
  onAddList: (spaceId: string, folderId: string, name: string) => void;
  // Trigger system overlays
  toggleSearch: () => void;
  toggleChat: () => void;
  togglePlanner: () => void;
}

export default function Sidebar({
  spaces,
  selectedSpaceId,
  setSelectedSpaceId,
  activeFolderId,
  setActiveFolderId,
  activeListId,
  setActiveListId,
  activeHeaderTab,
  setActiveHeaderTab,
  onAddSpace,
  onAddFolder,
  onAddList,
  toggleSearch,
  toggleChat,
  togglePlanner,
}: SidebarProps) {
  const [addingSpace, setAddingSpace] = useState<boolean>(false);
  const [newSpaceName, setNewSpaceName] = useState<string>("");
  const [newSpaceColor, setNewSpaceColor] =
    useState<string>("bg-primary-custom");

  // Folders toggles state
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({
    "folder-safaricom-crm": true, // Start with CRM open
  });

  // Folders inline additions
  const [addingFolderToSpace, setAddingFolderToSpace] = useState<string | null>(
    null,
  );
  const [newFolderName, setNewFolderName] = useState<string>("");

  // Lists inline additions
  const [addingListToFolder, setAddingListToFolder] = useState<string | null>(
    null,
  );
  const [newListName, setNewListName] = useState<string>("");

  // Space expand state
  const [expandedSpaces, setExpandedSpaces] = useState<Record<string, boolean>>(
    {
      "space-eng": true,
    },
  );

  const selectedSpace =
    spaces.find((s) => s.id === selectedSpaceId) || spaces[0];

  const handleCreateSpace = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newSpaceName.trim()) return;
    const initial = newSpaceName.trim().substring(0, 1).toUpperCase();
    onAddSpace(newSpaceName.trim(), initial, newSpaceColor);
    setNewSpaceName("");
    setAddingSpace(false);
  };

  const handleCreateFolder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newFolderName.trim() || !addingFolderToSpace) return;
    onAddFolder(addingFolderToSpace, newFolderName.trim());
    setNewFolderName("");
    setAddingFolderToSpace(null);
  };

  const handleCreateList = (
    e: React.FormEvent<HTMLFormElement>,
    folderId: string,
  ) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    onAddList(selectedSpaceId, folderId, newListName.trim());
    setNewListName("");
    setAddingListToFolder(null);
  };

  const toggleFolderExpand = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const toggleSpaceExpand = (spaceId: string) => {
    setExpandedSpaces((prev) => ({
      ...prev,
      [spaceId]: !prev[spaceId],
    }));
  };


  return (
    <>
      {/* 2. Contextual Sidebar (280px wide) */}
      <aside
        id="contextual-sidebar"
        className=" top-0 h-full overflow-y-auto col-span-1 z-40 bg-surface-tertiary  border-border border-r shadow-custom-shadow flex flex-col px-5 py-6"
      >
        {/* Workspace Title Card */}
        <div
          id="workspace-header-brand"
          className=" mb-6 text-primary-custom"
        >
          <h2 className="text-xl font-bold tracking-tight">Workspace</h2>
          <p className="text-xs font-medium text-secondary-custom">
            {selectedSpace.name} Team
          </p>
        </div>

        {/* Navigation Core */}
        <div
          id="sidebar-scrollable-tree"
          className="flex-1 overflow-y-auto custom-scrollbar  space-y-1"
        >
          <div id="spaces-section" className="mt-6 ">
            <div
              id="spaces-section-header"
              className=" mb-2 flex items-center justify-between"
            >
              <span className="text-[12px] font-bold text-tertiary-custom cursor-pointer ">
                Spaces
              </span>
              <Plus className="w-4 h-4 text-tertiary-custom cursor-pointer transition-colors" />
            </div>

            {/* Space Tree Nodes */}
            <div id="spaces-nodes-list" className="space-y-2">
              {spaces.map((space) => {
                const isSelected = space.id === selectedSpaceId;
                const isSpaceExpanded = expandedSpaces[space.id];

                return (
                  <div key={space.id} className="space-y-1">
                    {/* Space Item */}
                    <div
                      id={`space-${space.id}`}
                      className={`flex items-center justify-between py-1.5 rounded-lg transition-all cursor-pointer group text-tertiary-custom hover:bg-primary-custom/10 hover:text-primary-custom ${
                        isSelected ? " pl-[10px]" : " pl-3"
                      }`}
                      onClick={() => {
                        setSelectedSpaceId(space.id);
                        toggleSpaceExpand(space.id);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {isSpaceExpanded ? (
                          <ChevronDown className="w-4 h-4 :" />
                        ) : (
                          <ChevronRight className="w-4 h-4 " />
                        )}

                        <span className="">{space.name}</span>
                      </div>
                    </div>

                    {/* Folders & Lists underneath space (only show if space is expanded) */}
                    {isSpaceExpanded && (
                      <div className="ml-7 space-y-1 border-l border-primary-border pl-2">
                        {space.folders.map((folder: FolderType) => {
                          const isFolderExpanded = expandedFolders[folder.id];

                          return (
                            <div key={folder.id} className="space-y-1">
                              {/* Folder node */}
                              <div
                                id={`folder-${folder.id}`}
                                className="flex items-center justify-between px-2 py-1.5 rounded text-tertiary-custom cursor-pointer text-xs hover:bg-primary-custom/10 hover:text-primary-custom"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFolderExpand(folder.id);
                                  setActiveFolderId(folder.id);
                                }}
                              >
                                <div className="flex items-center gap-1.5 truncate">
                                  {isFolderExpanded ? (
                                    <FolderOpen className="w-3.5 h-3.5 text-tertiary-custom" />
                                  ) : (
                                    <Folder className="w-3.5 h-3.5 text-tertiary-custom group-hover:text-amber-500" />
                                  )}
                                  <span className="truncate font-medium">
                                    {folder.name}
                                  </span>
                                </div>
                              </div>

                              {/* Lists within folder (only show if folder is expanded) */}
                              {isFolderExpanded && (
                                <div className="ml-3 pl-1 border-l border-primary-border space-y-1">
                                  {folder.lists.map((list) => {
                                    const isListActive =
                                      activeListId === list.id;
                                    return (
                                      <div
                                        id={`list-${list.id}`}
                                        key={list.id}
                                        className={`flex items-center gap-2 py-1.5 px-1 rounded cursor-pointer transition-all text-xs hover:bg-primary-custom/10 hover:text-primary-custom ${
                                          isListActive
                                            ? " font-semibold"
                                            : "text-tertiary-custom "
                                        }`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setActiveFolderId(folder.id);
                                          setActiveListId(list.id);
                                          setActiveHeaderTab("List View");
                                        }}
                                      >
                                        <ListIcon className="w-3.5 h-3.5 text-tertiary-custom" />
                                        <span className="truncate">
                                          {list.name}
                                        </span>
                                      </div>
                                    );
                                  })}

                                  {/* Add List inline trigger */}
                                  {addingListToFolder === folder.id ? (
                                    <form
                                      onSubmit={(e) =>
                                        handleCreateList(e, folder.id)
                                      }
                                      className="flex items-center gap-1 px-2 pt-1"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <input
                                        type="text"
                                        placeholder="List name..."
                                        className="w-full text-xs px-1 py-0.5 border-b border-tertiary-custom    outline-none"
                                        value={newListName}
                                        onChange={(e) =>
                                          setNewListName(e.target.value)
                                        }
                                        autoFocus
                                      />
                                      <button
                                        type="submit"
                                        className="text-primary-custom"
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setAddingListToFolder(null)
                                        }
                                        className="text-slate-400"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </form>
                                  ) : (
                                    <div
                                      className="flex items-center gap-1.5 pl-3 py-1 text-tertiary-custom cursor-pointer text-[11px] italic transition-colors font-medium opacity-80"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setAddingListToFolder(folder.id);
                                      }}
                                    >
                                      <Plus className="w-3 h-3" />
                                      <span>New List</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Folder Addition Control for this Space */}
                        {addingFolderToSpace === space.id ? (
                          <form
                            onSubmit={handleCreateFolder}
                            className="flex items-center gap-1.5 px-2 py-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="text"
                              placeholder="Folder name..."
                              className="w-full text-xs px-1 py-0.5 border-b border-tertiary-custom    outline-none"
                              value={newFolderName}
                              onChange={(e) => setNewFolderName(e.target.value)}
                              autoFocus
                            />
                            <button
                              type="submit"
                              className="text-primary-custom hover:scale-105"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setAddingFolderToSpace(null)}
                              className="text-slate-400"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </form>
                        ) : (
                          <div
                            className="flex items-center gap-2 pl-2 pr-3 py-1.5 text-primary-custom/75 hover:text-primary-custom transition-colors cursor-pointer text-xs font-semibold"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAddingFolderToSpace(space.id);
                            }}
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>New Folder</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Add Space Control */}
              {addingSpace ? (
                <form
                  onSubmit={handleCreateSpace}
                  className="flex items-center gap-1.5 px-2 py-1"
                >
                  <input
                    type="text"
                    placeholder="Space Name (e.g., Marketing)"
                    className="w-full text-xs px-1 py-0.5 border-b border-tertiary-custom    outline-none"
                    value={newSpaceName}
                    onChange={(e) => setNewSpaceName(e.target.value)}
                    required
                    autoFocus
                  />

                  <button
                    type="button"
                    onClick={() => setAddingSpace(false)}
                    className="px-2 py-1 text-[10px] text-tertiary-custom"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    type="submit"
                    className="px-2 py-1 text-[10px]  text-tertiary-custom rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div
                  id="add-space-btn"
                  className="flex items-center gap-3 px-3 py-2 text-tertiary-custom transition-colors cursor-pointer group mt-2"
                  onClick={() => setAddingSpace(true)}
                >
                  <Plus className="w-4 h-4 text-tertiary-custom" />
                  <span className="text-sm font-semibold">New Space</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
