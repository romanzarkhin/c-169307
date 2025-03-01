
import { Card } from "@/components/ui/card";
import { ReactFlowProvider } from "@xyflow/react";
import NetworkGraph from "@/components/NetworkGraph";
import { NetworkDataSidebar } from "@/components/NetworkDataSidebar";
import { NetworkFilter } from "@/components/NetworkFilter";
import { CustomNode } from "@/types/network";
import { Connection, Edge } from "@xyflow/react";
import { useState } from "react";

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
  const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);

  const handleNodeClick = (node: CustomNode) => {
    setSelectedNode(node);
  };

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
                onNodeClick={handleNodeClick}
              />
            </ReactFlowProvider>
          </Card>
        </div>

        {/* Right Sidebar - Network Data and Node Details */}
        <div className="border-t lg:border-t-0 lg:border-l w-full lg:w-80 p-4 overflow-y-auto">
          {selectedNode ? (
            <NodeDetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
          ) : (
            <NetworkDataSidebar nodes={nodes} edges={edges} />
          )}
        </div>
      </div>
    </div>
  );
};

// Node Detail Panel Component
interface NodeDetailPanelProps {
  node: CustomNode;
  onClose: () => void;
}

const NodeDetailPanel = ({ node, onClose }: NodeDetailPanelProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Node Details</h3>
        <button 
          onClick={onClose} 
          className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
        >
          ×
        </button>
      </div>
      
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-full" 
          style={{ backgroundColor: node.style?.background as string }}
        ></div>
        <div>
          <h4 className="font-medium">{node.data.label}</h4>
          <span className="text-sm text-muted-foreground">ID: {node.id}</span>
        </div>
      </div>
      
      <div className="space-y-2 pt-2">
        <DetailItem label="Community" value={`Community ${node.data.community}`} />
        <DetailItem label="Type" value={node.data.type || "Default"} />
        {node.data.influence !== undefined && (
          <DetailItem label="Influence" value={node.data.influence.toString()} />
        )}
        {node.data.isCentral !== undefined && (
          <DetailItem label="Central Node" value={node.data.isCentral ? "Yes" : "No"} />
        )}
        <DetailItem 
          label="Position" 
          value={`X: ${Math.round(node.position.x)}, Y: ${Math.round(node.position.y)}`}
        />
      </div>
      
      <div className="border-t pt-4 mt-4">
        <h4 className="font-medium mb-2">Connected Nodes</h4>
        <div className="text-sm text-muted-foreground">
          Click on the graph to see connected nodes
        </div>
      </div>
    </div>
  );
};

interface DetailItemProps {
  label: string;
  value: string;
}

const DetailItem = ({ label, value }: DetailItemProps) => (
  <div className="flex justify-between">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);
