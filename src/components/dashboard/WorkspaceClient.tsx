"use client";

import React, { useEffect, useState } from "react";
import SecondarySidebar from "./SecondarySidebar";
import { NavigationWorkspace } from "@/types";
import { createSpace } from "../../../lib/actions/createSpace";
import { createFolder } from "../../../lib/actions/createFolder";
import { createPage } from "../../../lib/actions/createPage";
import { deleteSpace } from "../../../lib/actions/deleteSpace";
import Header from "../ui/Header";

type WorkspaceClientProps = {
  workspace: NavigationWorkspace;
};

export default function WorkspaceClient({ workspace }: WorkspaceClientProps) {
  const [workspaceData, setWorkspaceData] = useState(workspace);
  // ----------------------------------------------------
  // NAVIGATION STATE
  // ----------------------------------------------------
  const [selectedSpaceId, setSelectedSpaceId] = useState(
    workspace.spaces?.[0]?.id ?? "",
  );

  const [activeFolderId, setActiveFolderId] = useState("");
  const [activePageId, setActivePageId] = useState("");
  const [activeHeaderTab, setActiveHeaderTab] = useState("Overview");

  // ----------------------------------------------------
  // UI STATE (EXPANSION)
  // ----------------------------------------------------
  const [expandedSpaces, setExpandedSpaces] = useState({});
  const [expandedFolders, setExpandedFolders] = useState({});

  const [addingSpace, setAddingSpace] = useState<boolean>(false);
  const [newSpaceName, setNewSpaceName] = useState<string>("");
  const [addingFolderToSpace, setAddingFolderToSpace] = useState<string | null>(
    null,
  );
  const [newFolderName, setNewFolderName] = useState<string>("");

  const [addingPageToFolder, setAddingPageToFolder] = useState<string | null>(
    null,
  );

  const [newPageName, setNewPageName] = useState("");

  const [toastMessage, setToastMessage] = useState<string>("");

  // ----------------------------------------------------
  // Toast notifications helpers
  // ----------------------------------------------------
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // ----------------------------------------------------
  // DB ACTIONS (PLACEHOLDERS → replace with Server Actions later)
  // ----------------------------------------------------

  const onAddSpace = async (name: string) => {
    const newSpace = await createSpace(workspaceData.id, name);

    setWorkspaceData((prev) => ({
      ...prev,
      spaces: [...prev.spaces, newSpace],
    }));
  };

  const onAddFolder = async (spaceId: string, name: string) => {
    const folder = await createFolder(spaceId, name);

    setWorkspaceData((prev) => ({
      ...prev,
      spaces: prev.spaces.map((space) =>
        space.id === spaceId
          ? {
              ...space,
              folders: [...space.folders, folder],
            }
          : space,
      ),
    }));
  };

  const onAddPage = async (folderId: string, name: string) => {
    const page = await createPage(folderId, name);

    setWorkspaceData((prev) => ({
      ...prev,
      spaces: prev.spaces.map((space) => ({
        ...space,

        folders: space.folders.map((folder) =>
          folder.id === folderId
            ? {
                ...folder,
                pages: [...folder.pages, page],
              }
            : folder,
        ),
      })),
    }));
  };
  const onDeleteSpace = async (spaceId: string) => {
    if (workspaceData.spaces.length === 1) {
      return;
    }

    await deleteSpace(spaceId);

    setWorkspaceData((prev) => ({
      ...prev,
      spaces: prev.spaces.filter((space) => space.id !== spaceId),
    }));
  };

  const handleActionClick = () => {
    triggerToast(
      "Direct download link generated for Safaricom SLA configuration profiles.",
    );
  };

  return (
    <div className="cont p-2 w-full h-full">
      <div
        id="application-container"
        className="w-full h-full transition-colors left-[72px] grid grid-cols-5 duration-200  shadow-custom rounded-sm "
      >
        {" "}
        {/* SIDEBAR */}
        <SecondarySidebar
          workspace={workspaceData}
          selectedSpaceId={selectedSpaceId}
          setSelectedSpaceId={setSelectedSpaceId}
          activeFolderId={activeFolderId}
          setActiveFolderId={setActiveFolderId}
          activePageId={activePageId}
          setActivePageId={setActivePageId}
          activeHeaderTab={activeHeaderTab}
          setActiveHeaderTab={setActiveHeaderTab}
          expandedSpaces={expandedSpaces}
          setExpandedSpaces={setExpandedSpaces}
          expandedFolders={expandedFolders}
          setExpandedFolders={setExpandedFolders}
          onAddSpace={onAddSpace}
          onAddFolder={onAddFolder}
          onAddPage={onAddPage}
          addingSpace={addingSpace}
          setAddingSpace={setAddingSpace}
          newSpaceName={newSpaceName}
          setNewSpaceName={setNewSpaceName}
          setAddingFolderToSpace={setAddingFolderToSpace}
          addingFolderToSpace={addingFolderToSpace}
          newFolderName={newFolderName}
          setNewFolderName={setNewFolderName}
          newPageName={newPageName}
          setNewPageName={setNewPageName}
          addingPageToFolder={addingPageToFolder}
          setAddingPageToFolder={setAddingPageToFolder}
          onDeleteSpace={onDeleteSpace}
        />
        {/* 3. Main Stage container (Compensate sidebar width [352px] and header height [16px/64px]) */}
        <main
          id="main-frame-stage"
          className="col-span-4 flex min-w-0 flex-col w-full  "
        >
          {/* 2. Top Header Toolbar */}
          <Header
            spaces={workspaceData.spaces}
            workspaseName={workspaceData.name}
            selectedSpaceId={selectedSpaceId}
            onActionClick={handleActionClick}
            activeHeaderTab={activeHeaderTab}
            setActiveHeaderTab={setActiveHeaderTab}
          />
        </main>
      </div>
    </div>
  );
}
