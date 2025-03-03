
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { NetworkSidebar } from "@/components/layout/NetworkSidebar";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex">
        <NetworkSidebar 
          onAddNode={() => {}} 
          onCreateEdge={() => {}} 
          onEditNode={() => {}} 
          onDeleteSelection={() => {}}
          searchQuery=""
          onSearchChange={() => {}}
        />
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
      <MobileNavigation />
    </div>
  );
};
