
import { useState, useCallback } from "react";
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
  Link as LinkIcon,
  Settings,
  Trash2,
  Menu,
} from "lucide-react";
import NetworkGraph from "@/components/NetworkGraph";
import { communities } from "@/constants/network";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar";
import { NetworkDataSidebar } from "@/components/NetworkDataSidebar";
import { generateNodes, generateEdges } from "@/utils/network";
import { ReactFlowProvider } from "@xyflow/react";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AddNodeDialog } from "@/components/AddNodeDialog";
import { toast } from "sonner";
import { CustomNode } from "@/types/network";
import { Connection, Edge } from "@xyflow/react";

const initialNodes = generateNodes();
const initialEdges = generateEdges(initialNodes);

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const handleAddNode = (nodeData: { name: string; type: string; community: number }) => {
    const newNode: CustomNode = {
      id: `node-${nodes.length + 1}`,
      type: "default",
      data: {
        label: nodeData.name,
        type: nodeData.type,
        community: nodeData.community,
      },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      style: {
        background: communities[nodeData.community].color,
        width: 30,
        height: 30,
        borderRadius: '50%',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        opacity: 0.8,
      }
    };
    
    setNodes([...nodes, newNode]);
    toast.success("Node added successfully");
  };

  const handleEdgesChange = useCallback((newEdges: Edge[]) => {
    setEdges(newEdges);
  }, []);

  const handleConnect = useCallback((params: Connection) => {
    const newEdge: Edge = {
      id: `edge-${edges.length + 1}`,
      source: params.source || "",
      target: params.target || "",
      type: "smoothstep",
      animated: true,
      style: { stroke: "#999", strokeWidth: 2 },
    };
    setEdges((eds) => [...eds, newEdge]);
  }, [edges.length]);

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background w-full flex flex-col md:flex-row">
        {/* Left Sidebar - Network Controls */}
        <Sidebar variant="sidebar" className="hidden md:flex w-64 border-r">
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
                  placeholder="Search nodes..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Separator />
            
            {/* Network Controls */}
            <div className="px-4 py-4 space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Network Controls</h3>
              <AddNodeDialog onAddNode={handleAddNode} />
              <Button variant="outline" className="w-full justify-start" size="sm">
                <LinkIcon className="mr-2 h-4 w-4" />
                Create Link
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Edit Node
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selection
              </Button>
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

        {/* Mobile Navigation */}
        <Sheet>
          <div className="flex md:hidden items-center justify-between border-b px-4 py-2">
            <div className="flex items-center gap-2">
              <NetworkIcon className="h-6 w-6 text-primary" />
              <span className="font-semibold">CollabGraph</span>
            </div>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </div>
          <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
            <div className="h-full flex flex-col">
              <div className="border-b px-6 py-3">
                <div className="flex items-center gap-2">
                  <NetworkIcon className="h-6 w-6 text-primary" />
                  <h1 className="text-xl font-semibold">CollabGraph</h1>
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                {/* Mobile Search */}
                <div className="px-4 py-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search nodes..."
                      className="pl-8 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                {/* Mobile Network Controls */}
                <div className="px-4 py-4 space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Network Controls</h3>
                  <AddNodeDialog onAddNode={handleAddNode} />
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Create Link
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Node
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selection
                  </Button>
                </div>
                
                <Separator />
                
                {/* Mobile Quick Actions */}
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
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="border-b px-4 md:px-6 py-3 flex justify-between items-center">
            <h2 className="text-lg font-medium">Network Visualization</h2>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter View
            </Button>
          </div>

          {/* Graph Area */}
          <div className="flex-1 flex flex-col lg:flex-row">
            <div className="flex-1 p-4 md:p-6">
              <Card className="h-full">
                <ReactFlowProvider>
                  <NetworkGraph 
                    nodes={nodes}
                    edges={edges}
                    onEdgesChange={handleEdgesChange}
                    onConnect={handleConnect}
                  />
                </ReactFlowProvider>
              </Card>
            </div>

            {/* Right Sidebar - Network Data */}
            <div className="border-t lg:border-t-0 lg:border-l w-full lg:w-80 p-4 overflow-y-auto">
              <NetworkDataSidebar nodes={nodes} edges={edges} />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
