
import { Card } from "@/components/ui/card";
import { ReactFlowProvider } from "@xyflow/react";
import NetworkGraph from "@/components/NetworkGraph";
import { NetworkDataSidebar } from "@/components/NetworkDataSidebar";
import { NetworkFilter } from "@/components/NetworkFilter";
import { NetworkLayoutControls, LayoutType } from "@/components/NetworkLayoutControls";
import { NetworkPersistenceControls } from "@/components/NetworkPersistenceControls";
import { CustomNode } from "@/types/network";
import { Connection, Edge, NodeMouseHandler, EdgeChange } from "@xyflow/react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NodeDetailPanel } from "@/components/NodeDetailPanel";

interface NetworkViewProps {
  nodes: CustomNode[];
  edges: Edge[];
  filteredNodes: CustomNode[];
  selectedCommunities: number[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterChange: (selectedCommunities: number[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection | Edge) => void;
  onAddNode: (nodeData: { name: string; type: string; community: number }) => void;
  onUpdateNode: (nodeId: string, updates: { name: string; type: string; community: number }) => void;
  onDeleteNode: (nodeId: string) => void;
  onCreateEdge: (sourceId: string, targetId: string, edgeType: string) => void;
  onApplyLayout: (type: LayoutType, options: any) => void;
  onLoadNetwork: (nodes: CustomNode[], edges: Edge[]) => void;
  selectedNode: CustomNode | null;
  onNodeClick: NodeMouseHandler<CustomNode>;
  onCloseNodeDetail: () => void;
  onEditSelectedNode: () => void;
  onDeleteSelectedNode: () => void;
}

export const NetworkView = ({ 
  nodes, 
  edges, 
  filteredNodes,
  selectedCommunities,
  onFilterChange,
  onEdgesChange, 
  onConnect,
  onApplyLayout,
  onLoadNetwork,
  selectedNode,
  onNodeClick,
  onCloseNodeDetail,
  onEditSelectedNode,
  onDeleteSelectedNode
}: NetworkViewProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (selectedNode) {
      setActiveTab("details");
    } else if (activeTab === "details") {
      setActiveTab("overview");
    }
  }, [selectedNode, activeTab]);

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="border-b px-4 md:px-6 py-3 flex justify-between items-center">
        <h2 className="text-lg font-medium">Network Visualization</h2>
        <NetworkFilter 
          selectedCommunities={selectedCommunities}
          onFilterChange={onFilterChange}
        />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        <div className="flex-1 p-4 md:p-6">
          <Card className="h-full">
            <ReactFlowProvider>
              <NetworkGraph 
                nodes={filteredNodes}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
              />
            </ReactFlowProvider>
          </Card>
        </div>

        <div className="border-t lg:border-t-0 lg:border-l w-full lg:w-80 p-4 overflow-y-auto bg-background">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
              <TabsTrigger value="tools" className="flex-1">Tools</TabsTrigger>
              {selectedNode && (
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
              )}
            </TabsList>
            
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="overview">
                <NetworkDataSidebar nodes={nodes} edges={edges} />
              </TabsContent>
              
              <TabsContent value="tools" className="space-y-6">
                <NetworkLayoutControls onApplyLayout={onApplyLayout} />
                <NetworkPersistenceControls
                  nodes={nodes}
                  edges={edges}
                  onLoadNetwork={onLoadNetwork}
                />
              </TabsContent>
              
              <TabsContent value="details">
                {selectedNode && (
                  <NodeDetailPanel 
                    node={selectedNode} 
                    onClose={onCloseNodeDetail}
                    onEdit={onEditSelectedNode}
                    onDelete={onDeleteSelectedNode}
                  />
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
