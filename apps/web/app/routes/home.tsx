import { Link } from "react-router";

export default function Home() {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Catalyst</h1>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        A type-safe project management system — built with Hono, Orval, and TanStack Query.
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          to="/projects"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 font-medium"
        >
          View Projects
        </Link>
        <Link
          to="/members"
          className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 font-medium"
        >
          View Members
        </Link>
      </div>
    </div>
  );
}
