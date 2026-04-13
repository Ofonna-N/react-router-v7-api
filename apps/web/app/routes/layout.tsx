import { Link, NavLink, Outlet } from "react-router";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center gap-8">
          <Link
            to="/"
            className="font-bold text-gray-900 text-base tracking-tight hover:text-blue-600 transition-colors"
          >
            Catalyst
          </Link>
          <div className="flex gap-6 text-sm">
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-medium"
                  : "text-gray-500 hover:text-gray-900 transition-colors"
              }
            >
              Projects
            </NavLink>
            <NavLink
              to="/members"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-medium"
                  : "text-gray-500 hover:text-gray-900 transition-colors"
              }
            >
              Members
            </NavLink>
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
