
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { ReactFlowProvider } from "@xyflow/react";
import NetworkGraph from "@/components/NetworkGraph";
import { NetworkDataSidebar } from "@/components/NetworkDataSidebar";
import { CustomNode } from "@/types/network";
import { Connection, Edge } from "@xyflow/react";

interface NetworkViewProps {
  nodes: CustomNode[];
  edges: Edge[];
  onEdgesChange: (edges: Edge[]) => void;
  onConnect: (connection: Connection) => void;
}

export const NetworkView = ({ nodes, edges, onEdgesChange, onConnect }: NetworkViewProps) => {
  return (
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
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
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
  );
};
