/**
 * Tasks list page for a project.
 * Uses Orval-generated useGetProjectsProjectIdTasks() and usePostProjectsProjectIdTasks() hooks.
 */
import { useState } from "react";
import { useParams, Link } from "react-router";
import {
  useGetProjectsProjectIdTasks,
  getGetProjectsProjectIdTasksQueryKey,
  usePostProjectsProjectIdTasks,
} from "../api/generated/tasks/tasks";
import type { GetProjectsProjectIdTasks200DataItem } from "../api/generated/schemas";
import {
  PostProjectsProjectIdTasksBodyPriority,
  PostProjectsProjectIdTasksBodyStatus,
} from "../api/generated/schemas";
import { queryClient } from "../lib/query-client";

const taskStatusColors: Record<string, string> = {
  todo: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  done: "bg-green-100 text-green-800",
};

const taskStatusLabels: Record<string, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-orange-100 text-orange-700",
  high: "bg-red-100 text-red-700",
};

export default function ProjectTasksPage() {
  const { id: projectId } = useParams<{ id: string }>();

  const { data, isLoading, isError, error } = useGetProjectsProjectIdTasks(
    projectId ?? ""
  );

  // Runtime: data = { data: Task[], meta: {...} } (raw JSON body from GET /projects/:id/tasks)
  const tasks = (
    data as unknown as { data: GetProjectsProjectIdTasks200DataItem[] }
  )?.data ?? [];

  const createTask = usePostProjectsProjectIdTasks({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetProjectsProjectIdTasksQueryKey(projectId),
        });
        setTitle("");
        setPriority("medium");
      },
    },
  });

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<
    (typeof PostProjectsProjectIdTasksBodyPriority)[keyof typeof PostProjectsProjectIdTasksBodyPriority]
  >("medium");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !projectId) return;
    createTask.mutate({
      projectId,
      data: {
        title: title.trim(),
        status: PostProjectsProjectIdTasksBodyStatus.todo,
        priority,
      },
    });
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Link
        to={`/projects/${projectId}`}
        className="text-blue-600 hover:underline text-sm mb-6 block"
      >
        &larr; Back to project
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tasks</h1>

      {/* Task list */}
      {isLoading && <p className="text-gray-500 mb-6">Loading tasks...</p>}

      {isError && (
        <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
          Failed to load tasks:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      )}

      {!isLoading && !isError && tasks.length === 0 && (
        <p className="text-gray-500 mb-6">
          No tasks yet for this project. Create one below.
        </p>
      )}

      <div className="space-y-3 mb-10">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-gray-900">{task.title}</span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    priorityColors[task.priority] ??
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  {task.priority}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    taskStatusColors[task.status] ??
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  {taskStatusLabels[task.status] ?? task.status}
                </span>
              </div>
            </div>
            {task.assigneeId && (
              <p className="text-xs text-gray-400 mt-1">
                Assignee: {task.assigneeId}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Create Task form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Create Task
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="task-title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Fix the login bug"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="task-priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Priority
            </label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) =>
                setPriority(
                  e.target.value as typeof priority
                )
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {createTask.isError && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
              Failed to create task. Please try again.
            </div>
          )}

          <button
            type="submit"
            disabled={createTask.isPending || !title.trim()}
            className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {createTask.isPending ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
}
