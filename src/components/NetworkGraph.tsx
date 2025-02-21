import { useState, useCallback, useLayoutEffect } from "react";
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
import "@xyflow/react/dist/style.css";

// Define interfaces for our custom node data
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

// Generate nodes with improved force-directed positioning
const generateNodes = () => {
  const nodes: CustomNode[] = [];
  let nodeId = 1;

  // Calculate positions using an improved circular layout with community clustering
  communities.forEach((community, communityIndex) => {
    const angleStep = (2 * Math.PI) / communities.length;
    const communityAngle = angleStep * communityIndex;
    const communityRadius = 400;
    const centerX = 500 + communityRadius * Math.cos(communityAngle);
    const centerY = 400 + communityRadius * Math.sin(communityAngle);

    // Add central community node
    const centralNodeSize = 60;
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
        width: centralNodeSize,
        height: centralNodeSize,
        borderRadius: '50%',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        opacity: 0.9,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    });
    nodeId++;

    // Add satellite nodes
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

// Generate edges with improved community-based connections
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
    <div className="flex flex-col w-full h-full gap-4">
      <div className="flex flex-wrap gap-2 p-4">
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
  );
};

export default NetworkGraph;
