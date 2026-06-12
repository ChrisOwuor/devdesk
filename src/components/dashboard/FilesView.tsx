/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import {
  FileText,
  Image,
  FileSpreadsheet,
  FileCode,
  File,
  Trash2,
  Search,
  UploadCloud,
  ExternalLink,
  FolderMinus,
  CheckCircle2,
} from "lucide-react";
import { ProjectFile } from "../../types";

interface FilesViewProps {
  files: ProjectFile[];
  onUploadFile: (name: string, size: string, type: string) => void;
  onDeleteFile: (id: string) => void;
}

export default function FilesView({
  files,
  onUploadFile,
  onDeleteFile,
}: FilesViewProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFiles = files.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getFileIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("pdf") || t.includes("doc"))
      return <FileText className="w-8 h-8 text-red-500" />;
    if (
      t.includes("png") ||
      t.includes("jpg") ||
      t.includes("jpeg") ||
      t.includes("svg")
    )
      return <Image className="w-8 h-8 text-blue-500" />;
    if (t.includes("xls") || t.includes("csv") || t.includes("sheet"))
      return <FileSpreadsheet className="w-8 h-8 text-emerald-500" />;
    if (
      t.includes("json") ||
      t.includes("ts") ||
      t.includes("js") ||
      t.includes("html")
    )
      return <FileCode className="w-8 h-8 text-amber-500" />;
    return <File className="w-8 h-8 text-slate-405" />;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const sizeStr = (droppedFile.size / (1024 * 1024)).toFixed(2) + " MB";
      onUploadFile(
        droppedFile.name,
        sizeStr,
        droppedFile.type || "Binary Files",
      );
      setUploadSuccess(`Succesfully uploaded: ${droppedFile.name}`);
      setTimeout(() => setUploadSuccess(""), 3000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const sizeStr = (selectedFile.size / (1024 * 1024)).toFixed(2) + " MB";
      onUploadFile(
        selectedFile.name,
        sizeStr,
        selectedFile.type || "Document System",
      );
      setUploadSuccess(`Succesfully uploaded: ${selectedFile.name}`);
      setTimeout(() => setUploadSuccess(""), 3000);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div id="files-tab-canvas" className="space-y-6 select-none">
      {/* Upload area */}
      <div
        id="drag-drop-zone-deck"
        className="grid grid-cols-1 md:grid-cols-12 gap-6"
      >
        <div
          className={`col-span-12 md:col-span-12 border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer bg-surface-card border-border ${
            dragActive
              ? "border-primary-custom bg-primary-custom/5"
              : "hover:border-primary-custom/60"
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          <UploadCloud className="w-12 h-12 text-slate-400 dark:text-slate-600 animate-pulse mb-3" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Drag & Drop workspace documents
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Drag PDF schemas, PNG wireframes, JSON deployment environments logs
            here, or{" "}
            <span className="text-primary-custom font-semibold">
              browse files
            </span>{" "}
            from your local disk.
          </p>

          {uploadSuccess && (
            <div className="mt-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/45 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="w-4.5 h-4.5" /> {uploadSuccess}
            </div>
          )}
        </div>
      </div>

      {/* Files List search & Grid */}
      <div
        id="drive-list-card"
        className="bg-surface-card border border-border rounded-2xl p-6 space-y-4"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-850 dark:text-slate-100 tracking-wide uppercase">
              Workspace Cloud Storage
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Asset sheets, network diagrams and contracts files.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search driving files..."
              className="w-full text-xs font-semibold pl-9 pr-3 py-2 border border-border bg-background-custom text-slate-800 dark:text-slate-100 rounded-xl outline-none focus:border-primary-custom"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Files tabular structure */}
        <div id="drive-table-view" className="overflow-x-auto pt-2">
          {filteredFiles.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <FolderMinus className="w-10 h-10 text-slate-200 dark:text-slate-850 mx-auto mb-3" />
              <p className="font-semibold text-slate-505">
                No storage records matching search parameters.
              </p>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-[11px] font-bold text-slate-400 bg-background-custom border-b border-border uppercase tracking-wider">
                  <th className="px-6 py-3">Asset</th>
                  <th className="px-6 py-3">Format Type</th>
                  <th className="px-6 py-3">Capacity Size</th>
                  <th className="px-6 py-3">Uploaded On</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {filteredFiles.map((file) => (
                  <tr
                    key={file.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.name)}
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary-custom truncate max-w-xs">
                            {file.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                      {file.type}
                    </td>

                    <td className="px-6 py-4 text-xs font-bold text-slate-800 dark:text-slate-350">
                      {file.size}
                    </td>

                    <td className="px-6 py-4 text-xs font-medium text-slate-400 dark:text-slate-500">
                      {file.uploadDate}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() =>
                            alert(
                              `Opening or downloading secure asset file: ${file.name}`,
                            )
                          }
                          className="p-1 text-slate-400 hover:text-primary-custom transition-all cursor-pointer"
                          title="Open/Download secure link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDeleteFile(file.id)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                          title="Delete file permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
