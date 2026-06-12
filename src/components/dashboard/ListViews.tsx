/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Search,
  Filter,
  CheckSquare,
  Calendar,
  User,
  Square,
  CircleDot,
  ChevronDown,
  Flag,
  MoreHorizontal,
} from "lucide-react";
import { Space, Task } from "../../types";

interface ListViewsProps {
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

export default function ListViews({
  spaces,
  selectedSpaceId,
  activeFolderId,
  activeListId,
  onAddTask,
  onUpdateTaskStatus,
  onDeleteTask,
}: ListViewsProps) {
  const [searchQuery, setSearchQuery] = useState<string>(" ");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [activeInputGroup, setActiveInputGroup] = useState<string | null>(null);

  // New task inputs
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskPriority, setTaskPriority] = useState<Task["priority"]>("Medium");
  const [taskDueDate, setTaskDueDate] = useState<string>("2026-06-15");
  const [taskAssignee, setTaskAssignee] = useState<string>("Alice Murray");

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
        <p className="font-medium text-slate-500">
          No list select context found.
        </p>
        <p className="text-xs mt-1">
          Select an active checklist or folder list on the left navigation
          sidebar.
        </p>
      </div>
    );
  }

  // Define ClickUp's native available task group styles
  const statusGroups = [
    { name: "Backlog" as const, color: "bg-slate-400 dark:bg-slate-500" },
    { name: "Todo" as const, color: "bg-gray-500" },
    { name: "In Progress" as const, color: "bg-blue-500" },
    { name: "Review" as const, color: "bg-amber-500" },
    { name: "Done" as const, color: "bg-green-500" },
  ];

  // Handle baseline data sorting
  const filteredTasks = (activeList.tasks || []).filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const handleInlineSubmit = (e: React.FormEvent, status: Task["status"]) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    onAddTask(selectedSpaceId, activeFolder.id, activeList.id, {
      title: taskTitle.trim(),
      status: status,
      priority: taskPriority,
      dueDate: taskDueDate,
      assignee: taskAssignee,
    });

    setTaskTitle("");
    setActiveInputGroup(null);
  };

  const getPriorityColor = (p: Task["priority"]) => {
    switch (p) {
      case "High":
        return "text-red-500";
      case "Medium":
        return "text-amber-500";
      case "Low":
        return "text-blue-500";
      default:
        return "text-gray-300";
    }
  };

  return (
    <div id="list-tab-root" className="w-full  p-4  gap-4 select-none">
      {/* 2. DYNAMIC GROUP LISTINGS CONTAINER */}
      {filteredTasks.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <CircleDot className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
          <p className="font-semibold text-sm">
            No active tasks match current filters.
          </p>
          <button
            onClick={() => setActiveInputGroup("Todo")}
            className="mt-2 text-xs text-purple-600 font-medium hover:underline"
          >
            Create a task to get started
          </button>
        </div>
      ) : (
        <div id="tasks-table-card" className="flex flex-col gap-6 mt-2">
          {statusGroups.map((group) => {
            const groupTasks = filteredTasks.filter(
              (t) => t.status === group.name,
            );

            // Render columns only if there are tasks or if the inline input box is active for that group
            if (groupTasks.length === 0 && activeInputGroup !== group.name)
              return null;

            return (
              <div key={group.name} className="flex flex-col">
                {/* Status Block Title */}
                <div className="flex items-center gap-2 mb-1.5  cursor-pointer">
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover/header:text-gray-600 transition-colors" />
                  <div
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-white tracking-wide uppercase shadow-sm ${group.color}`}
                  >
                    {group.name}
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    {groupTasks.length}
                  </span>
                </div>

                {/* Structured Data Columns */}
                <div className="grid grid-cols-[40px_1fr_120px_110px_100px_50px] text-tertiary-custom border-border items-center px-3 py-1.5 border-b text-[14px] font-semibold">
                  <span className="text-center"></span>
                  <span>Task Name</span>
                  <span>Assignee</span>
                  <span>Due Date</span>
                  <span>Priority</span>
                  <span className="text-right"></span>
                </div>

                {/* Group Rows List */}
                <div className="flex flex-col border-border border-b">
                  {groupTasks.map((task) => {
                    const isDone = task.status === "Done";
                    return (
                      <div
                        key={task.id}
                        className={`grid grid-cols-[40px_1fr_120px_110px_100px_50px] items-center px-3 py-2 border-b border-border last:border-b-0   transition-colors ${
                          isDone
                            ? "bg-gray-50/30 dark:bg-transparent opacity-60"
                            : ""
                        }`}
                      >
                        {/* Toggle Checkbox Button */}
                        <div className="flex justify-center">
                          <button
                            onClick={() =>
                              onUpdateTaskStatus(
                                selectedSpaceId,
                                activeFolder.id,
                                activeList.id,
                                task.id,
                                isDone ? "Todo" : "Done",
                              )
                            }
                            className="text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                          >
                            {isDone ? (
                              <CheckSquare className="w-4 h-4 text-green-500" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Title Display */}
                        <div className="pr-4 truncate">
                          <span
                            className={`text-xs font-medium text-tertiary-custom ${isDone ? "line-through text-gray-400" : ""}`}
                          >
                            {task.title}
                          </span>
                        </div>

                        {/* Assignee Panel */}
                        <div className="flex items-center gap-1.5 text-xs text-tertiary-custom font-medium">
                          <span className="truncate max-w-[85px]">
                            {task.assignee}
                          </span>
                        </div>

                        {/* Due Date Indicator */}
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-300 shrink-0" />
                          <span>{task.dueDate}</span>
                        </div>

                        {/* Priority Badge */}
                        <div className="flex items-center gap-1">
                          <Flag
                            className={`w-3 h-3 fill-current ${getPriorityColor(task.priority)}`}
                          />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {task.priority}
                          </span>
                        </div>

                        {/* Operations Control Panel */}
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              onDeleteTask(
                                selectedSpaceId,
                                activeFolder.id,
                                activeList.id,
                                task.id,
                              )
                            }
                            className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                            title="Delete Task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button className="text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 p-0.5 rounded">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* 3. INLINE CREATOR SUB-ROW */}
                  <div className="px-3 py-1.5 bg-white dark:bg-transparent">
                    {activeInputGroup === group.name ? (
                      <form
                        onSubmit={(e) => handleInlineSubmit(e, group.name)}
                        className="flex flex-col sm:flex-row items-center gap-2 bg-white dark:bg-[#2a2a2b] p-1.5 border border-purple-400 rounded shadow-sm"
                      >
                        <input
                          autoFocus
                          type="text"
                          placeholder="Task name..."
                          className="flex-1 bg-transparent border-none outline-none text-xs text-gray-700 dark:text-gray-200 px-1.5 py-0.5"
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                          required
                        />

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          {/* Priority Selector Context */}
                          <select
                            className="text-[11px] font-medium border border-gray-200 dark:border-neutral-700 rounded px-1.5 py-0.5 bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 outline-none"
                            value={taskPriority}
                            onChange={(e) =>
                              setTaskPriority(
                                e.target.value as Task["priority"],
                              )
                            }
                          >
                            <option value="Low">Low Priority</option>
                            <option value="Medium">Medium Priority</option>
                            <option value="High">High Priority</option>
                          </select>

                          {/* Target Calendar Deadline */}
                          <input
                            type="date"
                            className="text-[11px] font-medium border border-gray-200 dark:border-neutral-700 rounded px-1 py-0.5 bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 outline-none"
                            value={taskDueDate}
                            onChange={(e) => setTaskDueDate(e.target.value)}
                          />

                          {/* Form Control Triggers */}
                          <button
                            type="submit"
                            className="px-2.5 py-0.5 bg-purple-600 text-white text-[11px] font-semibold rounded hover:bg-purple-700"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveInputGroup(null)}
                            className="px-1.5 py-0.5 text-[11px] text-gray-400 hover:text-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        onClick={() => {
                          setTaskTitle("");
                          setActiveInputGroup(group.name);
                        }}
                        className="flex items-center gap-1.5 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors py-0.5 group/btn"
                      >
                        <Plus className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                        <span className="text-xs font-medium">Add Task</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
