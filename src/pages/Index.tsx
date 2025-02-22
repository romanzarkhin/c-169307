
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Users,
  Filter,
  NetworkIcon,
  Calendar,
  MessageCircle,
} from "lucide-react";
import NetworkGraph from "@/components/NetworkGraph";
import { communities } from "@/constants/network";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { NetworkDataSidebar } from "@/components/NetworkDataSidebar";
import { generateNodes, generateEdges } from "@/utils/network";
import { ReactFlowProvider } from "@xyflow/react";
import { Separator } from "@/components/ui/separator";

const initialNodes = generateNodes();
const initialEdges = generateEdges(initialNodes);

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background w-full flex">
        {/* Left Sidebar - Network Data & Controls */}
        <Sidebar variant="static" className="w-80 border-r">
          <SidebarHeader className="border-b px-6 py-3">
            <div className="flex items-center gap-2">
              <NetworkIcon className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">CollabGraph</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            {/* Search Bar */}
            <div className="px-4 py-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search stakeholders..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Separator />
            
            {/* Network Data Section */}
            <div className="px-4 py-2">
              <NetworkDataSidebar nodes={initialNodes} edges={initialEdges} />
            </div>
            
            <Separator />
            
            {/* Quick Actions */}
            <div className="px-4 py-4 space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</h3>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Users className="mr-2 h-4 w-4" />
                All Stakeholders
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Recent Activity
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <MessageCircle className="mr-2 h-4 w-4" />
                Engagements
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="border-b px-6 py-3 flex justify-between items-center">
            <h2 className="text-lg font-medium">Network Visualization</h2>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter View
            </Button>
          </div>

          {/* Graph Area */}
          <div className="flex-1 p-6">
            <Card className="h-full">
              <ReactFlowProvider>
                <NetworkGraph />
              </ReactFlowProvider>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
