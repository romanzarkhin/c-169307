
import { Card } from "@/components/ui/card";
import { ReactFlowProvider } from "@xyflow/react";
import NetworkGraph from "@/components/NetworkGraph";
import { NetworkDataSidebar } from "@/components/NetworkDataSidebar";
import { NetworkFilter } from "@/components/NetworkFilter";
import { CustomNode } from "@/types/network";
import { Connection, Edge } from "@xyflow/react";

interface NetworkViewProps {
  nodes: CustomNode[];
  edges: Edge[];
  filteredNodes: CustomNode[];
  selectedCommunities: number[];
  onFilterChange: (selectedCommunities: number[]) => void;
  onEdgesChange: (edges: Edge[]) => void;
  onConnect: (connection: Connection | Edge) => void;
}

export const NetworkView = ({ 
  nodes, 
  edges, 
  filteredNodes,
  selectedCommunities,
  onFilterChange,
  onEdgesChange, 
  onConnect 
}: NetworkViewProps) => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Top Bar */}
      <div className="border-b px-4 md:px-6 py-3 flex justify-between items-center">
        <h2 className="text-lg font-medium">Network Visualization</h2>
        <NetworkFilter 
          selectedCommunities={selectedCommunities}
          onFilterChange={onFilterChange}
        />
      </div>

      {/* Graph Area */}
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 p-4 md:p-6">
          <Card className="h-full">
            <ReactFlowProvider>
              <NetworkGraph 
                nodes={filteredNodes}
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
