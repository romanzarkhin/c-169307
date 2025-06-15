import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  FaUserCircle,
  FaHome,
  FaCalendarAlt,
  FaCogs,
  FaBrain,
  FaChartLine,
  FaBook,
} from "react-icons/fa";

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", icon: <FaHome />, label: "Home" },
    { path: "/monitoring", icon: <FaChartLine />, label: "Monitoring" },
    { path: "/wiki", icon: <FaBook />, label: "Wiki" },
    { path: "/calendar", icon: <FaCalendarAlt />, label: "Calendar" },
    { path: "/agent", icon: <FaBrain />, label: "Agent" },
    { path: "/settings", icon: <FaCogs />, label: "Settings" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b bg-background shadow-sm">
        {/* Left: App icon + name */}
        <div className="flex items-center gap-2 text-lg font-semibold">
          <FaUserCircle className="text-xl text-blue-600" />
          <span>ComplianceApp</span>
        </div>

        {/* Center: Nav Icons */}
        <nav className="flex gap-6 text-lg">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-1 transition-colors ${
                isActive(item.path)
                  ? "text-blue-600 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={item.label}
            >
              {item.icon}
            </Link>
          ))}
        </nav>

        {/* Right: Dark mode toggle + User dropdown */}
        <div className="flex items-center gap-4">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src="" alt="user" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => alert("Navigate to account")}>
                My Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("Logging out...")}>
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
