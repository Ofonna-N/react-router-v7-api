/**
 * Projects list page.
 * Uses Orval-generated useGetProjects() and usePostProjects() hooks.
 */
import { useState } from "react";
import { Link } from "react-router";
import {
  useGetProjects,
  getGetProjectsQueryKey,
} from "../api/generated/projects/projects";
import { usePostProjects } from "../api/generated/projects/projects";
import type { GetProjects200DataItem } from "../api/generated/schemas";
import { queryClient } from "../lib/query-client";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-600",
};

export default function ProjectsPage() {
  const { data, isLoading, isError, error } = useGetProjects();

  // Runtime: data = { data: Project[] } (the raw JSON body from GET /projects)
  const projects = (data as unknown as { data: GetProjects200DataItem[] })?.data ?? [];

  const createProject = usePostProjects({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetProjectsQueryKey() });
        setName("");
        setDescription("");
      },
    },
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    createProject.mutate({
      data: {
        name: name.trim(),
        description: description.trim() || undefined,
        status: "active",
      },
    });
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Projects</h1>

      {/* Project list */}
      {isLoading && (
        <p className="text-gray-500 mb-6">Loading projects...</p>
      )}

      {isError && (
        <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
          Failed to load projects:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      )}

      {!isLoading && !isError && projects.length === 0 && (
        <p className="text-gray-500 mb-6">No projects yet. Create one below.</p>
      )}

      <div className="space-y-3 mb-10">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-900">{project.name}</span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  statusColors[project.status] ?? "bg-gray-100 text-gray-600"
                }`}
              >
                {project.status}
              </span>
            </div>
            {project.description && (
              <p className="text-sm text-gray-500 mt-1">{project.description}</p>
            )}
          </Link>
        ))}
      </div>

      {/* Create Project form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Create Project
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="proj-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="proj-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My new project"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="proj-description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="proj-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about?"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {createProject.isError && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
              Failed to create project. Please try again.
            </div>
          )}

          <button
            type="submit"
            disabled={createProject.isPending || !name.trim()}
            className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {createProject.isPending ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
}
