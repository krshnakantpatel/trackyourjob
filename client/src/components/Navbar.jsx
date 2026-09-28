import React from "react";
import { useSelector } from "react-redux";
import { useLocation} from "react-router";
import { useAuth } from "../hooks/authHooks";

const Navbar = () => {
  const { navigate } = useAuth();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  const { logoutUser } = useAuth();

  const navItems = [
    {
      label: "Home",
      path: "/home",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M3 10.5L12 3l9 7.5M5 9.5V21h14V9.5M9 21v-6h6v6"
          />
        </svg>
      ),
    },
    {
      label: "Applications",
      path: "/applications",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M9 5h6M9 3h6a2 2 0 012 2v1h2a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h2V5a2 2 0 012-2zM8 12h8M8 16h5"
          />
        </svg>
      ),
    },
    {
      label: "Interview Notes",
      path: "/notes",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M6 3h9l4 4v14H6a2 2 0 01-2-2V5a2 2 0 012-2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M14 3v5h5M8 12h8M8 16h6"
          />
        </svg>
      ),
    },
  ];

  const isActive = (path) => {
    if (path === "/home") {
      return location.pathname === "/home" || location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-8">

          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-sm group-hover:bg-blue-700 transition-colors">
              TJ
            </div>

            <span className="text-lg font-bold tracking-tight text-slate-900">
              Track<span className="text-blue-600">YourJob</span>
            </span>
          </button>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.path);

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`
                    flex items-center gap-2 px-3.5 py-2 rounded-lg
                    text-sm font-medium transition-all duration-150 cursor-pointer
                    ${
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }
                  `}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* User */}
          {user && (
            <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  user.name || user.email || "User"
                )}`}
                alt="Profile Avatar"
                className="w-8 h-8 rounded-full bg-blue-100 border border-slate-200 object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/public/avatars/01.png";
                }}
              />

              <div className="hidden sm:block max-w-[150px]">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {user.name || user.email?.split("@")[0]}
                </p>

                <p className="text-xs text-slate-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          {/* Logout */}
          <button
            type="button"
            onClick={logoutUser}
            className="
              flex items-center gap-1.5 px-3 py-2
              text-sm font-medium text-slate-600
              hover:text-red-600 hover:bg-red-50
              border border-slate-200 hover:border-red-200
              rounded-lg transition-all duration-150 cursor-pointer
            "
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>

            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;