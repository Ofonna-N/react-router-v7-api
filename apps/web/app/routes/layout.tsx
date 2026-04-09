import { NavLink, Outlet } from "react-router";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-8">
          <span className="font-semibold text-gray-900 text-lg">Catalyst</span>
          <div className="flex gap-6">
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"
              }
            >
              Projects
            </NavLink>
            <NavLink
              to="/members"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"
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
