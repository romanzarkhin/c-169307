
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

// Generate nodes with improved force-directed positioning
const generateNodes = () => {
  const communities = [
    { color: "#E41A1C", count: 25, name: "Community A" }, // Red community
    { color: "#377EB8", count: 30, name: "Community B" }, // Blue community
    { color: "#4DAF4A", count: 20, name: "Community C" }, // Green community
    { color: "#984EA3", count: 22, name: "Community D" }, // Purple community
    { color: "#FF7F00", count: 28, name: "Community E" }, // Orange community
    { color: "#FFFF33", count: 15, name: "Community F" }, // Yellow community
  ];

  const nodes: Node[] = [];
  let nodeId = 1;

  // Calculate positions using an improved circular layout with community clustering
  communities.forEach((community, communityIndex) => {
    const angleStep = (2 * Math.PI) / communities.length;
    const communityAngle = angleStep * communityIndex;
    const communityRadius = 400; // Increased spacing between communities
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
      const radius = 120 + Math.random() * 80; // Variable distance from center
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      const nodeSize = Math.random() * 15 + 20; // Variable node sizes
      const influence = Math.random(); // Node influence factor

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
          opacity: 0.7 + (influence * 0.3), // Opacity based on influence
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        },
      });
      nodeId++;
    }
  });

  return nodes;
};

// Generate edges with improved community-based connections
const generateEdges = (nodes: Node[]) => {
  const edges: Edge[] = [];
  let edgeId = 1;

  nodes.forEach((source) => {
    nodes.forEach((target) => {
      if (source.id !== target.id) {
        const sourceCommunity = source.data.community;
        const targetCommunity = target.data.community;
        
        // Higher probability for intra-community edges and connections to central nodes
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
  );
};

export default NetworkGraph;
