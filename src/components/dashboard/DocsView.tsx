"use client"

import React, { useState } from "react";
import {
  FileText,
  BookOpen,
  Save,
  Plus,
  Trash2,
  User,
  Clock,
  CheckCircle,
  FileEdit,
} from "lucide-react";
import { ProjectDoc } from "@/types";


interface DocsViewProps {
  docs: ProjectDoc[];
  onAddDoc: (title: string, content: string) => void;
  onUpdateDoc: (id: string, title: string, content: string) => void;
  onDeleteDoc: (id: string) => void;
}

export default function DocsView({
  docs,
  onAddDoc,
  onUpdateDoc,
  onDeleteDoc,
}: DocsViewProps) {
  const [selectedDocId, setSelectedDocId] = useState<string>(docs[0]?.id || "");
  const [editing, setEditing] = useState<boolean>(false);
  const [addingNew, setAddingNew] = useState<boolean>(false);

  // Form states
  const [titleInput, setTitleInput] = useState<string>("");
  const [contentInput, setContentInput] = useState<string>("");
  const [savedMessage, setSavedMessage] = useState<string>("");

  const selectedDoc = docs.find((d) => d.id === selectedDocId) || docs[0];

  const handleSelectDoc = (id: string) => {
    setSelectedDocId(id);
    setEditing(false);
    setAddingNew(false);
    setSavedMessage("");
  };

  const startEdit = () => {
    if (!selectedDoc) return;
    setTitleInput(selectedDoc.title);
    setContentInput(selectedDoc.content);
    setEditing(true);
    setAddingNew(false);
  };

  const handleUpdateSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;
    onUpdateDoc(selectedDocId, titleInput.trim(), contentInput);
    setEditing(false);
    setSavedMessage("Document saved successfully!");
    setTimeout(() => setSavedMessage(""), 2500);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;
    onAddDoc(titleInput.trim(), contentInput);
    setTitleInput("");
    setContentInput("");
    setAddingNew(false);
    setSavedMessage("New document created!");
    setTimeout(() => setSavedMessage(""), 2500);
  };

  return (
    <div id="docs-tab-root" className="grid grid-cols-12 gap-6 select-none">
      {/* List section of documents */}
      <div
        id="docs-sidebar-section"
        className="col-span-12 md:col-span-4 bg-surface-card border border-border rounded-2xl p-4.5 space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <h3 className="text-sm font-extrabold text-slate-850 dark:text-slate-100 tracking-wide uppercase">
              Project Notes
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Specifications and document guidelines.
            </p>
          </div>
          <button
            onClick={() => {
              setTitleInput("");
              setContentInput("");
              setAddingNew(true);
              setEditing(false);
              setSavedMessage("");
            }}
            className="p-1.5 bg-primary-custom hover:bg-primary-hover text-white rounded-lg transition-colors cursor-pointer shadow-xs"
            title="Create brand new document"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Doc nodes list */}
        <div
          id="docs-index-list"
          className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar"
        >
          {docs.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">
              No documentation entries created.
            </p>
          ) : (
            docs.map((doc) => {
              const isActive = doc.id === selectedDocId && !addingNew;
              return (
                <div
                  key={doc.id}
                  id={`doc-node-${doc.id}`}
                  onClick={() => handleSelectDoc(doc.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer group transition-all border ${
                    isActive
                      ? "bg-primary-custom/5 border-primary-custom/25 text-primary-custom font-semibold"
                      : "border-transparent text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-900/60"
                  }`}
                >
                  <FileText className="w-5 h-5 text-slate-400 shrink-0 mt-0.5 group-hover:text-primary-custom" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold truncate text-slate-800 dark:text-slate-150 group-hover:text-primary-custom">
                      {doc.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                      {doc.content}
                    </p>
                    <div className="flex items-center gap-2 text-[9px] text-slate-400 mt-1.5 font-medium">
                      <span className="flex items-center gap-0.5">
                        <User className="w-2.5 h-2.5" /> {doc.author}
                      </span>
                      <span>•</span>
                      <span>{doc.date}</span>
                    </div>
                  </div>

                  {/* Trash support */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDoc(doc.id);
                      if (selectedDocId === doc.id) {
                        setSelectedDocId(docs[0]?.id || "");
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-0.5 transition-opacity cursor-pointer flex shrink-0"
                    title="Delete document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Editor Content viewing zone */}
      <div
        id="docs-editor-section"
        className="col-span-12 md:col-span-8 bg-surface-card border border-border rounded-2xl p-6 flex flex-col justify-between h-full min-h-[500px]"
      >
        {savedMessage && (
          <div className="mb-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" /> {savedMessage}
          </div>
        )}

        {addingNew ? (
          /* Creating brand new doc */
          <form
            onSubmit={handleCreateNew}
            className="space-y-4 flex-1 flex flex-col"
          >
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold text-primary-custom uppercase tracking-wider">
                CREATING NEW SPEC
              </span>
              <input
                type="text"
                placeholder="Enter Document Title (e.g. AWS Multi-AZ failovers)..."
                className="w-full text-md font-extrabold text-slate-900 dark:text-white outline-none bg-transparent pt-1 placeholder:text-slate-400"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                required
                autoFocus
              />
            </div>

            <textarea
              placeholder="Write detailed technical specifications, project objectives, mapping guidelines here..."
              className="w-full flex-1 min-h-[300px] outline-none bg-transparent text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans placeholder:text-slate-400 resize-none font-semibold"
              value={contentInput}
              onChange={(e) => setContentInput(e.target.value)}
              required
            />

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setAddingNew(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:hover:bg-slate-700 rounded-xl"
              >
                Discard
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-primary-custom hover:bg-primary-hover rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save Document
              </button>
            </div>
          </form>
        ) : editing ? (
          /* Editing existing doc */
          <form
            onSubmit={handleUpdateSave}
            className="space-y-4 flex-1 flex flex-col"
          >
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold text-primary-custom uppercase tracking-wider">
                EDITING REPOSITORY
              </span>
              <input
                type="text"
                placeholder="Title..."
                className="w-full text-md font-extrabold text-slate-900 dark:text-white outline-none bg-transparent pt-1"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                required
              />
            </div>

            <textarea
              className="w-full flex-1 min-h-[300px] outline-none bg-transparent text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans resize-none font-semibold"
              value={contentInput}
              onChange={(e) => setContentInput(e.target.value)}
              required
            />

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-primary-custom hover:bg-primary-hover rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </form>
        ) : selectedDoc ? (
          /* Viewing selected doc */
          <div className="space-y-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-md font-extrabold text-slate-900 dark:text-white">
                    {selectedDoc.title}
                  </h2>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1.5 font-semibold leading-none">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" /> Author: {selectedDoc.author}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Updated: {selectedDoc.date}
                    </span>
                  </div>
                </div>

                <button
                  onClick={startEdit}
                  className="px-3.5 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FileEdit className="w-3.5 h-3.5" /> Edit Doc
                </button>
              </div>

              {/* Body */}
              <div
                id="selected-doc-content-body"
                className="py-4 text-xs text-slate-650 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-semibold"
              >
                {selectedDoc.content}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-150 dark:border-slate-850/30 text-[10px] text-slate-400 font-medium">
              You are accessing Safaricom Ltd strategic enterprise guidelines.
              This documentation is persistently tracked and encrypted.
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">
            <BookOpen className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-3" />
            <p>No document selected inside the workspace registry.</p>
            <p className="text-xs mt-1">
              Select an item from the left Index or create a fresh file sheet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
