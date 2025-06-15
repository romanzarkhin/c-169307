
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, Monitor, FileText, Calendar, Bot, Settings, NetworkIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/monitoring", label: "Monitoring", icon: Monitor },
  { href: "/wiki", label: "WIKI", icon: FileText },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/agent", label: "Agent", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
         <div className="flex items-center gap-2">
          <NetworkIcon className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">ComplianceApp</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.href}
              >
                <Link to={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

