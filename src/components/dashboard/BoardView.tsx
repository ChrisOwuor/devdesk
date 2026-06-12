/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Plus,
  Calendar,
  User,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileEdit,
  Trash2,
} from "lucide-react";
import { Space, Task } from "../../types";

interface BoardViewProps {
  spaces: Space[];
  selectedSpaceId: string;
  activeFolderId: string;
  activeListId: string;
  onAddTask: (
    spaceId: string,
    folderId: string,
    listId: string,
    task: Omit<Task, "id">,
  ) => void;
  onUpdateTaskStatus: (
    spaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
    newStatus: Task["status"],
  ) => void;
  onDeleteTask: (
    spaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
  ) => void;
}

export default function BoardView({
  spaces,
  selectedSpaceId,
  activeFolderId,
  activeListId,
  onAddTask,
  onUpdateTaskStatus,
  onDeleteTask,
}: BoardViewProps) {
  const [addingToCol, setAddingToCol] = useState<Task["status"] | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newAssignee, setNewAssignee] = useState<string>("John Doe");

  const selectedSpace =
    spaces.find((s) => s.id === selectedSpaceId) || spaces[0];
  const activeFolder =
    selectedSpace.folders.find((f) => f.id === activeFolderId) ||
    selectedSpace.folders[0];
  const activeList =
    activeFolder?.lists.find((l) => l.id === activeListId) ||
    activeFolder?.lists[0];

  if (!activeList) {
    return (
      <div className="bg-surface-card border border-border rounded-2xl p-12 text-center text-slate-400">
        <p>No list selection detected for board views.</p>
      </div>
    );
  }

  const columns: {
    label: string;
    status: Task["status"];
    color: string;
    bg: string;
  }[] = [
    {
      label: "Backlog",
      status: "Backlog",
      color: "border-t-slate-400 text-slate-500",
      bg: "bg-slate-100/50 dark:bg-slate-900/10",
    },
    {
      label: "To Do",
      status: "Todo",
      color: "border-t-blue-500 text-blue-500",
      bg: "bg-blue-50/20 dark:bg-blue-950/5",
    },
    {
      label: "In Progress",
      status: "In Progress",
      color: "border-t-amber-500 text-amber-600",
      bg: "bg-amber-50/20 dark:bg-amber-950/5",
    },
    {
      label: "In Review",
      status: "Review",
      color: "border-t-purple-500 text-purple-600",
      bg: "bg-purple-50/20 dark:bg-purple-950/5",
    },
    {
      label: "Completed",
      status: "Done",
      color: "border-t-emerald-500 text-emerald-600",
      bg: "bg-emerald-50/20 dark:bg-emerald-950/5",
    },
  ];

  // Helper column tasks filter
  const tasksByCol: Record<Task["status"], Task[]> = {
    Backlog: [],
    Todo: [],
    "In Progress": [],
    Review: [],
    Done: [],
  };

  (activeList.tasks || []).forEach((task) => {
    if (tasksByCol[task.status]) {
      tasksByCol[task.status].push(task);
    } else {
      tasksByCol["Todo"].push(task);
    }
  });

  const handleCreateCardInLane = (status: Task["status"]) => {
    if (!newTitle.trim()) return;
    onAddTask(selectedSpaceId, activeFolder.id, activeList.id, {
      title: newTitle.trim(),
      status: status,
      priority: "Medium",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 5 days from now
      assignee: newAssignee.trim(),
    });
    setNewTitle("");
    setAddingToCol(null);
  };

  const shiftTaskPosition = (task: Task, direction: "left" | "right") => {
    const statusMap: Task["status"][] = [
      "Backlog",
      "Todo",
      "In Progress",
      "Review",
      "Done",
    ];
    const currIndex = statusMap.indexOf(task.status);
    let nextIndex = currIndex + (direction === "right" ? 1 : -1);

    if (nextIndex >= 0 && nextIndex < statusMap.length) {
      onUpdateTaskStatus(
        selectedSpaceId,
        activeFolder.id,
        activeList.id,
        task.id,
        statusMap[nextIndex],
      );
    }
  };

  const getPriorityBadgeColor = (p: Task["priority"]) => {
    switch (p) {
      case "High":
        return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
      case "Medium":
        return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
      case "Low":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";
    }
  };

  return (
    <div id="board-tab-canvas" className="space-y-6">
      <div
        id="board-header-row"
        className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800/50"
      >
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Sprint Board
          </h2>
          <p className="text-xs text-slate-500">
            Visual lane dispatcher for task progress.
          </p>
        </div>
        <span className="text-xs text-slate-400 font-mono select-none">
          {activeList.tasks?.length || 0} Task Cards
        </span>
      </div>

      {/* Board Layout Grid */}
      <div
        id="board-columns-deck"
        className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4 select-none"
      >
        {columns.map((col) => {
          const colTasks = tasksByCol[col.status] || [];
          const isAdding = addingToCol === col.status;

          return (
            <div
              key={col.status}
              id={`lane-${col.status}`}
              className={`rounded-2xl p-3 border border-border flex flex-col min-h-[500px] h-full ${col.bg} shrink-0 w-72 md:w-auto`}
            >
              <div className="flex items-center justify-between mb-3.5 px-1">
                <span className="text-xs font-extrabold tracking-wide uppercase text-slate-850 dark:text-slate-100">
                  {col.label}
                </span>
                <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-350 rounded-full text-[10px] font-bold">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div
                id={`lane-tasks-${col.status}`}
                className="space-y-3 flex-1 overflow-y-auto custom-scrollbar"
              >
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    id={`task-card-${task.id}`}
                    className="bg-surface-card rounded-xl border border-border p-3.5 transition-all group relative"
                  >
                    {/* Priority label */}
                    <div className="flex items-center justify-between gap-2.5 mb-2.5">
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${getPriorityBadgeColor(task.priority)}`}
                      >
                        {task.priority}
                      </span>

                      {/* Direction Shift icons */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => shiftTaskPosition(task, "left")}
                          disabled={col.status === "Backlog"}
                          className="p-0.5 bg-slate-100 dark:bg-slate-800 rounded hover:text-primary-custom disabled:opacity-40 select-none cursor-pointer"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => shiftTaskPosition(task, "right")}
                          disabled={col.status === "Done"}
                          className="p-0.5 bg-slate-100 dark:bg-slate-800 rounded hover:text-primary-custom disabled:opacity-40 select-none cursor-pointer"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug mb-3">
                      {task.title}
                    </h4>

                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-2.5 mt-2.5 text-[10px]">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="font-semibold">{task.dueDate}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-205 font-bold">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{task.assignee}</span>
                      </div>

                      {/* Explicit delete */}
                      <button
                        onClick={() =>
                          onDeleteTask(
                            selectedSpaceId,
                            activeFolder.id,
                            activeList.id,
                            task.id,
                          )
                        }
                        className="opacity-0 group-hover:opacity-100 transition-all text-red-500 hover:scale-105 p-0.5 absolute bottom-3 right-3 cursor-pointer bg-white dark:bg-[#121626]"
                        title="Delete card"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Inline form card trigger */}
                {isAdding ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCreateCardInLane(col.status);
                    }}
                    className="bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 space-y-2.5"
                  >
                    <textarea
                      placeholder="Title of new card..."
                      className="w-full text-xs box-border p-2 bg-white dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-705 outline-none font-semibold text-slate-800 dark:text-slate-100"
                      rows={2}
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                      autoFocus
                    />

                    <input
                      type="text"
                      placeholder="Assignee name..."
                      className="w-full text-[10px] font-semibold px-2 py-1 bg-white dark:bg-slate-850 rounded border border-slate-300 dark:border-slate-705 outline-none"
                      value={newAssignee}
                      onChange={(e) => setNewAssignee(e.target.value)}
                    />

                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setAddingToCol(null)}
                        className="px-2 py-1 text-[10px] bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-2 py-1 text-[10px] bg-primary-custom text-white rounded font-bold"
                      >
                        Add Card
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setAddingToCol(col.status)}
                    className="w-full py-2 border border-dashed border-slate-300 dark:border-slate-800 select-none text-slate-500 dark:text-slate-400 hover:text-primary-custom hover:border-primary-custom hover:bg-slate-100/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 bg-transparent transition-all cursor-pointer group"
                  >
                    <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span>Card</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
