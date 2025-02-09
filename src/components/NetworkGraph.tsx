
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
import "@xyflow/react/dist/style.css";

// Generate nodes with force-directed positioning
const generateNodes = () => {
  const communities = [
    { color: "#E41A1C", count: 20 }, // Red community
    { color: "#377EB8", count: 25 }, // Blue community
    { color: "#4DAF4A", count: 15 }, // Green community
    { color: "#984EA3", count: 18 }, // Purple community
    { color: "#FF7F00", count: 22 }, // Orange community
  ];

  const nodes: Node[] = [];
  let nodeId = 1;

  // Calculate initial positions using a rough circular layout
  communities.forEach((community, communityIndex) => {
    const angleStep = (2 * Math.PI) / communities.length;
    const communityAngle = angleStep * communityIndex;
    const communityRadius = 300;
    const centerX = 400 + communityRadius * Math.cos(communityAngle);
    const centerY = 300 + communityRadius * Math.sin(communityAngle);

    for (let i = 0; i < community.count; i++) {
      const angle = (2 * Math.PI * i) / community.count;
      const radius = 100 + Math.random() * 50;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      const nodeSize = Math.random() * 20 + 20; // Variable node sizes

      nodes.push({
        id: `${nodeId}`,
        data: { 
          label: `Node ${nodeId}`,
          community: communityIndex,
        },
        position: { x, y },
        style: {
          background: community.color,
          width: nodeSize,
          height: nodeSize,
          borderRadius: '50%',
          border: 'none',
          opacity: 0.8,
        },
      });
      nodeId++;
    }
  });

  return nodes;
};

// Generate edges with community-based connections
const generateEdges = (nodes: Node[]) => {
  const edges: Edge[] = [];
  let edgeId = 1;

  // Create community-based connections
  nodes.forEach((source) => {
    nodes.forEach((target) => {
      if (source.id !== target.id) {
        const sourceCommunity = source.data.community;
        const targetCommunity = target.data.community;
        
        // Higher probability for intra-community edges
        const probability = sourceCommunity === targetCommunity ? 0.3 : 0.05;
        
        if (Math.random() < probability) {
          const opacity = sourceCommunity === targetCommunity ? 0.2 : 0.1;
          edges.push({
            id: `e${edgeId}`,
            source: source.id,
            target: target.id,
            style: { 
              stroke: source.style?.background as string,
              opacity,
              strokeWidth: 1,
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
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-full">
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
          type: 'default', // Using straight lines instead of curves
          animated: false,
        }}
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
  );
};

export default NetworkGraph;
