/**
 * Projects list page.
 * Data fetching will use the Orval-generated useGetProjects() hook once
 * `pnpm generate` has been run against the API spec.
 */
export default function ProjectsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Projects</h1>
      <p className="text-gray-500">
        Run <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">pnpm generate</code> to
        generate the API hooks, then come back and wire them up here.
      </p>
    </div>
  );
}
