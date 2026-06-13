import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingBag,
  Users,
  Ticket,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Shirt,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../store/authStore.js";
import { useTheme } from "../context/ThemeContext.jsx";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const links = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/categories", label: "Categories", icon: Tag },
    { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { to: "/admin/customers", label: "Customers", icon: Users },
    { to: "/admin/coupons", label: "Coupons", icon: Ticket },
    { to: "/admin/reviews", label: "Reviews", icon: MessageSquare },
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/40 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={
          "fixed lg:sticky top-0 left-0 h-screen w-64 bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl z-40 border-r border-gray-200/50 dark:border-gray-800/50 transition-all duration-300 ease-in-out " +
          (sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")
        }
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Shirt size={20} />
              </div>
              <div>
                <h1 className="text-lg font-display font-bold text-gray-900 dark:text-white">
                  Handmate
                </h1>
                <p className="text-[9px] text-gray-400 dark:text-gray-500 tracking-[0.2em] uppercase font-medium">
                  Fashion Admin
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group " +
                  (isActive
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/20"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/70 hover:text-gray-700 dark:hover:text-gray-200")
                }
              >
                {({ isActive }) => (
                  <>
                    <link.icon
                      size={18}
                      className={
                        isActive
                          ? ""
                          : "group-hover:scale-110 transition-transform"
                      }
                    />
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User footer */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/50">
            <div className="flex items-center gap-3 mb-3 px-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 rounded-xl transition-all duration-200 border border-transparent hover:border-red-200 dark:hover:border-red-800/30"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl sticky top-0 z-20 border-b border-gray-200/60 dark:border-gray-800/60">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200"
                aria-label="Open sidebar"
              >
                <Menu size={20} />
              </button>
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 lg:hidden" />
              <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white">
                Admin Panel
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <a
                href="/"
                className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline underline-offset-4 transition-all"
              >
                View Store →
              </a>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
