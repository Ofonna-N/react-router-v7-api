/**
 * Single project view.
 * The clientLoader extracts the URL param. Data fetching uses
 * the Orval-generated useGetProjectById() hook.
 */
import { useParams, Link } from "react-router";

export default function ProjectPage() {
  const { id } = useParams();

  return (
    <div>
      <Link to="/projects" className="text-blue-600 hover:underline text-sm mb-4 block">
        ← Back to projects
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Project {id}</h1>
      <Link
        to={`/projects/${id}/tasks`}
        className="text-blue-600 hover:underline text-sm"
      >
        View tasks →
      </Link>
    </div>
  );
}
