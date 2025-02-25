
import { SidebarProvider } from "@/components/ui/sidebar";
import { NetworkSidebar } from "./NetworkSidebar";
import { MobileNavigation } from "./MobileNavigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background w-full flex flex-col md:flex-row">
        <NetworkSidebar />
        <MobileNavigation />
        {children}
      </div>
    </SidebarProvider>
  );
};
