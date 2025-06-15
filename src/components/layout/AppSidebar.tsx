
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NetworkIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { menuItems } from "@/config/nav";

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar variant="floating">
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
