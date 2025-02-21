import { useState, useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
} from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import "@xyflow/react/dist/style.css";

interface NodeData extends Record<string, unknown> {
  label: string;
  community: number;
  influence?: number;
  isCentral?: boolean;
}

type CustomNode = Node<NodeData>;

const communities = [
  { color: "#E41A1C", count: 25, name: "Community A" },
  { color: "#377EB8", count: 30, name: "Community B" },
  { color: "#4DAF4A", count: 20, name: "Community C" },
  { color: "#984EA3", count: 22, name: "Community D" },
  { color: "#FF7F00", count: 28, name: "Community E" },
  { color: "#FFFF33", count: 15, name: "Community F" },
];

const generateNodes = () => {
  const nodes: CustomNode[] = [];
  let nodeId = 1;

  communities.forEach((community, communityIndex) => {
    const angleStep = (2 * Math.PI) / communities.length;
    const communityAngle = angleStep * communityIndex;
    const communityRadius = 400;
    const centerX = 500 + communityRadius * Math.cos(communityAngle);
    const centerY = 400 + communityRadius * Math.sin(communityAngle);

    nodes.push({
      id: `${nodeId}`,
      data: { 
        label: community.name,
        community: communityIndex,
        isCentral: true,
      },
      position: { x: centerX, y: centerY },
      style: {
        background: community.color,
        width: 60,
        height: 60,
        borderRadius: '50%',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        opacity: 0.9,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    });
    nodeId++;

    for (let i = 0; i < community.count; i++) {
      const angle = (2 * Math.PI * i) / community.count;
      const radius = 120 + Math.random() * 80;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      const nodeSize = Math.random() * 15 + 20;
      const influence = Math.random();

      nodes.push({
        id: `${nodeId}`,
        data: { 
          label: `Node ${nodeId}`,
          community: communityIndex,
          influence,
        },
        position: { x, y },
        style: {
          background: community.color,
          width: nodeSize,
          height: nodeSize,
          borderRadius: '50%',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          opacity: 0.7 + (influence * 0.3),
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        },
      });
      nodeId++;
    }
  });

  return nodes;
};

const generateEdges = (nodes: CustomNode[]) => {
  const edges: Edge[] = [];
  let edgeId = 1;

  nodes.forEach((source) => {
    nodes.forEach((target) => {
      if (source.id !== target.id) {
        const sourceCommunity = source.data.community;
        const targetCommunity = target.data.community;
        
        let probability = sourceCommunity === targetCommunity ? 0.35 : 0.03;
        if (source.data.isCentral || target.data.isCentral) {
          probability *= 1.5;
        }
        
        if (Math.random() < probability) {
          const isCrossConnection = sourceCommunity !== targetCommunity;
          const sourceInfluence = source.data.influence || 0.5;
          const targetInfluence = target.data.influence || 0.5;
          const edgeStrength = (sourceInfluence + targetInfluence) / 2;
          
          edges.push({
            id: `e${edgeId}`,
            source: source.id,
            target: target.id,
            style: { 
              stroke: isCrossConnection ? '#rgba(160, 160, 160, 0.2)' : source.style?.background as string,
              opacity: isCrossConnection ? 0.15 : 0.25,
              strokeWidth: 1 + edgeStrength * 2,
            },
          });
          edgeId++;
        }
      }
    });
  });

  return edges;
};

const initialNodes = generateNodes();
const initialEdges = generateEdges(initialNodes);

const NetworkDataSidebar = ({ nodes, edges }: { nodes: CustomNode[], edges: Edge[] }) => {
  const communityStats = communities.map((community, index) => {
    const communityNodes = nodes.filter(node => node.data.community === index);
    const communityEdges = edges.filter(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      return sourceNode && sourceNode.data.community === index;
    });

    return {
      name: community.name,
      color: community.color,
      nodeCount: communityNodes.length,
      edgeCount: communityEdges.length,
      centralNode: communityNodes.find(node => node.data.isCentral)?.data.label,
    };
  });

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-lg font-semibold px-4 py-2">Network Data</h2>
      </SidebarHeader>
      <SidebarContent>
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Overview</h3>
            <Card className="p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total Nodes</span>
                <span className="font-medium">{nodes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Edges</span>
                <span className="font-medium">{edges.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Communities</span>
                <span className="font-medium">{communities.length}</span>
              </div>
            </Card>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Communities</h3>
            <div className="space-y-2">
              {communityStats.map((stat, index) => (
                <Card key={index} className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stat.color }}
                    />
                    <span className="font-medium">{stat.name}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Nodes</span>
                      <span>{stat.nodeCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Edges</span>
                      <span>{stat.edgeCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Central Node</span>
                      <span>{stat.centralNode}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

const NetworkGraph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedCommunities, setSelectedCommunities] = useState<Set<number>>(new Set());

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const toggleCommunity = (communityIndex: number) => {
    setSelectedCommunities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(communityIndex)) {
        newSet.delete(communityIndex);
      } else {
        newSet.add(communityIndex);
      }
      return newSet;
    });

    setNodes(currentNodes => 
      currentNodes.map(node => ({
        ...node,
        hidden: selectedCommunities.size > 0 && !selectedCommunities.has(node.data.community)
      }))
    );
  };

  return (
    <SidebarProvider>
      <div className="flex w-full h-full">
        <NetworkDataSidebar nodes={nodes} edges={edges} />
        <div className="flex-1 flex flex-col">
          <div className="flex flex-wrap gap-2 p-4">
            <SidebarTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Toggle Data Panel
              </Button>
            </SidebarTrigger>
            {communities.map((community, index) => (
              <Button
                key={index}
                onClick={() => toggleCommunity(index)}
                variant={selectedCommunities.has(index) ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: community.color }}
                />
                {community.name}
              </Button>
            ))}
          </div>
          <div className="flex-1">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              className="bg-background"
              minZoom={0.2}
              maxZoom={4}
              defaultEdgeOptions={{
                type: 'default',
                animated: false,
              }}
              nodesDraggable={true}
              nodesConnectable={true}
            >
              <Controls />
              <MiniMap 
                nodeColor={(node) => {
                  return node.style?.background as string || '#eee';
                }}
                nodeStrokeWidth={3}
                zoomable
                pannable
              />
              <Background gap={12} size={1} />
            </ReactFlow>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default NetworkGraph;
