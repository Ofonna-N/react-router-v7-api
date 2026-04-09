/**
 * Single project detail page.
 * Uses Orval-generated useGetProjectsId() and usePatchProjectsId() hooks.
 */
import { useParams, Link } from "react-router";
import {
  useGetProjectsId,
  usePatchProjectsId,
  getGetProjectsIdQueryKey,
} from "../api/generated/projects/projects";
import type { GetProjectsId200 } from "../api/generated/schemas";
import { queryClient } from "../lib/query-client";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-600",
};

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, error } = useGetProjectsId(id ?? "");

  // Runtime: data = Project (raw JSON body from GET /projects/:id)
  const project = data as unknown as GetProjectsId200 | undefined;

  const updateProject = usePatchProjectsId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetProjectsIdQueryKey(id),
        });
      },
    },
  });

  function handleToggleStatus() {
    if (!project || !id) return;
    const newStatus = project.status === "active" ? "archived" : "active";
    updateProject.mutate({ id, data: { status: newStatus } });
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <p className="text-gray-500">Loading project...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Link
          to="/projects"
          className="text-blue-600 hover:underline text-sm mb-4 block"
        >
          &larr; Back to projects
        </Link>
        <div className="rounded-md bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
          Failed to load project:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Link
          to="/projects"
          className="text-blue-600 hover:underline text-sm mb-4 block"
        >
          &larr; Back to projects
        </Link>
        <p className="text-gray-500">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Link
        to="/projects"
        className="text-blue-600 hover:underline text-sm mb-6 block"
      >
        &larr; Back to projects
      </Link>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full mt-1 ${
              statusColors[project.status] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {project.status}
          </span>
        </div>

        {project.description ? (
          <p className="text-gray-600 mb-6">{project.description}</p>
        ) : (
          <p className="text-gray-400 italic mb-6">No description provided.</p>
        )}

        <div className="flex items-center gap-4 mb-6 text-xs text-gray-400">
          <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
          <span>Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleStatus}
            disabled={updateProject.isPending}
            className="inline-flex items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {updateProject.isPending
              ? "Updating..."
              : project.status === "active"
              ? "Archive project"
              : "Restore to active"}
          </button>

          <Link
            to={`/projects/${id}/tasks`}
            className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            View tasks &rarr;
          </Link>
        </div>

        {updateProject.isError && (
          <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
            Failed to update project status. Please try again.
          </div>
        )}
      </div>
    </div>
  );
}
