import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Plus,
  List as ListIcon,
  X,
  Trash2,
} from "lucide-react";

import { NavigationWorkspace } from "@/types";

interface SidebarProps {
  workspace: NavigationWorkspace;

  selectedSpaceId: string;
  setSelectedSpaceId: (id: string) => void;

  activeFolderId: string;
  setActiveFolderId: (id: string) => void;

  activePageId: string;
  setActivePageId: (id: string) => void;

  activeHeaderTab: string;
  setActiveHeaderTab: (tab: string) => void;

  expandedSpaces: Record<string, boolean>;
  setExpandedSpaces: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;

  expandedFolders: Record<string, boolean>;
  setExpandedFolders: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;

  // DB actions (from WorkspaceClient)
  onAddSpace: (name: string) => Promise<void>;
  onAddFolder: (spaceId: string, name: string) => Promise<void>;
  onAddPage: (folderId: string, name: string) => Promise<void>;
  addingSpace: boolean;

  setAddingSpace: React.Dispatch<React.SetStateAction<boolean>>;

  newSpaceName: string;

  setNewSpaceName: React.Dispatch<React.SetStateAction<string>>;

  setAddingFolderToSpace: React.Dispatch<React.SetStateAction<string | null>>;
  addingFolderToSpace: string | null;

  setNewFolderName: React.Dispatch<React.SetStateAction<string>>;
  newFolderName: string;

  setAddingPageToFolder: React.Dispatch<React.SetStateAction<string | null>>;
  addingPageToFolder: string | null;

  setNewPageName: React.Dispatch<React.SetStateAction<string>>;
  newPageName: string;

  onDeleteSpace: (spaceId: string) => Promise<void>;
}

export default function SecondarySidebar({
  onDeleteSpace,
  workspace,
  selectedSpaceId,
  setSelectedSpaceId,
  activeFolderId,
  setActiveFolderId,
  activePageId,
  setActivePageId,
  activeHeaderTab,
  setActiveHeaderTab,
  expandedSpaces,
  setExpandedSpaces,
  expandedFolders,
  setExpandedFolders,
  onAddSpace,
  onAddFolder,
  onAddPage,
  addingSpace,
  setAddingSpace,
  newSpaceName,
  setNewSpaceName,
  addingFolderToSpace,
  setAddingFolderToSpace,
  newFolderName,
  setNewFolderName,
  setNewPageName,
  newPageName,
  addingPageToFolder,
  setAddingPageToFolder,
}: SidebarProps) {
  // ----------------------------------------------------
  // TOGGLES
  // ----------------------------------------------------
  const toggleSpace = (spaceId: string) => {
    setExpandedSpaces((prev) => ({
      ...prev,
      [spaceId]: !prev[spaceId],
    }));
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const handleCreateSpace = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newSpaceName.trim()) return;

    await onAddSpace(newSpaceName.trim());

    setNewSpaceName("");
    setAddingSpace(false);
  };

  const handleAddFolderToSpace = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!newFolderName.trim()) return;
    if (!addingFolderToSpace) return;

    await onAddFolder(addingFolderToSpace, newFolderName.trim());

    setNewFolderName("");
    setAddingFolderToSpace(null);
  };

  const handleAddPageToFolder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newPageName.trim()) return;
    if (!addingPageToFolder) return;

    await onAddPage(addingPageToFolder, newPageName.trim());

    setNewPageName("");
    setAddingPageToFolder(null);
  };
  return (
    <aside className="top-0 h-full overflow-y-auto col-span-1 z-40 bg-surface-tertiary border-border border-r shadow-custom-shadow flex flex-col px-5 py-6">
      {/* ----------------------------------------------------
          WORKSPACE HEADER
      ---------------------------------------------------- */}
      <div className="mb-4 text-primary-custom">
        <h2 className="text-sm font-bold tracking-tight">{workspace.name}</h2>
      </div>

      {/* ----------------------------------------------------
          SPACES HEADER
      ---------------------------------------------------- */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-bold text-tertiary-custom">
          Spaces
        </span>
      </div>

      {/* ----------------------------------------------------
          SPACES TREE
      ---------------------------------------------------- */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {workspace.spaces.map((space) => {
          const isSpaceOpen = expandedSpaces[space.id];
          const isSelected = selectedSpaceId === space.id;

          return (
            <div key={space.id} className="space-y-1">
              {/* SPACE ROW */}
              <div
                className={`flex items-center justify-between py-2 px-2 rounded-lg cursor-pointer ${
                  isSelected
                    ? "bg-primary-custom/10 text-primary-custom"
                    : "hover:bg-primary-custom/5"
                }`}
                onClick={() => {
                  setSelectedSpaceId(space.id);
                  toggleSpace(space.id);
                }}
              >
                <div className="flex items-center gap-2">
                  {isSpaceOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}

                  <span className="text-sm">{space.name}</span>
                </div>
                {isSelected && (
                    <X
                      className="w-3.5 h-3.5 text-primary-custom   transition-opacity "
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSpace(space.id);
                      }}
                    />
                  )}
              </div>

              {/* ----------------------------------------------------
                  FOLDERS
              ---------------------------------------------------- */}
              {isSpaceOpen && (
                <div className="ml-6 border-l pl-2 space-y-1">
                  {space.folders.map((folder) => {
                    const isFolderOpen = expandedFolders[folder.id];
                    const isFolderActive = activeFolderId === folder.id;

                    return (
                      <div key={folder.id} className="space-y-1">
                        {/* FOLDER */}
                        <div
                          className={`flex items-center justify-between gap-2 px-2 py-1 rounded cursor-pointer text-xs ${
                            isFolderActive
                              ? "text-primary-custom font-semibold"
                              : "text-tertiary-custom"
                          }`}
                          onClick={() => {
                            setActiveFolderId(folder.id);
                            toggleFolder(folder.id);
                          }}
                        >
                          <div className="flex items-center gap-2  ">
                            {isFolderOpen ? (
                              <FolderOpen className="w-4 h-4" />
                            ) : (
                              <Folder className="w-4 h-4" />
                            )}

                            <span>{folder.name}</span>
                          </div>
                          {isFolderActive && (
                            <Trash2
                              className="w-3.5 h-3.5 text-primary-custom   transition-opacity "
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            />
                          )}
                        </div>

                        {/* ----------------------------------------------------
                            PAGES (was LISTS)
                        ---------------------------------------------------- */}
                        {isFolderOpen && (
                          <div className="ml-4 border-l pl-2 space-y-1">
                            {folder.pages.map((page) => {
                              const isActive = activePageId === page.id;

                              return (
                                <div
                                  key={page.id}
                                  className={`flex items-center gap-2 text-xs px-2 py-1 rounded cursor-pointer ${
                                    isActive
                                      ? "font-semibold text-primary-custom"
                                      : "text-tertiary-custom"
                                  }`}
                                  onClick={() => {
                                    setActiveFolderId(folder.id);
                                    setActivePageId(page.id);
                                    setActiveHeaderTab("List View");
                                  }}
                                >
                                  <ListIcon className="w-4 h-4" />
                                  <span>{page.name}</span>
                                </div>
                              );
                            })}

                            {/* Add Page inline trigger */}
                            {addingPageToFolder === folder.id ? (
                              <form
                                onSubmit={handleAddPageToFolder}
                                className="flex items-center gap-1 px-2 pt-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="text"
                                  placeholder="Page name..."
                                  className="w-full text-xs px-1 py-0.5 border-b border-tertiary-custom outline-none"
                                  value={newPageName}
                                  onChange={(e) =>
                                    setNewPageName(e.target.value)
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
                                  onClick={() => setAddingPageToFolder(null)}
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
                                  setAddingPageToFolder(folder.id);
                                }}
                              >
                                <Plus className="w-3 h-3" />
                                <span>New Page</span>
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
                      onSubmit={handleAddFolderToSpace}
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
    </aside>
  );
}
