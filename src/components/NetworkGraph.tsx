
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
import "@xyflow/react/dist/style.css";

// Generate a collection of nodes representing different communities
const generateNodes = () => {
  const communities = [
    { color: "#ff69b4", count: 15, centerX: 250, centerY: 250 }, // Pink community
    { color: "#4da6ff", count: 12, centerX: 500, centerY: 200 }, // Blue community
    { color: "#32cd32", count: 10, centerX: 300, centerY: 400 }, // Green community
    { color: "#ffa500", count: 8, centerX: 600, centerY: 400 }, // Orange community
    { color: "#9370db", count: 10, centerX: 150, centerY: 150 }, // Purple community
  ];

  const nodes: Node[] = [];
  let nodeId = 1;

  communities.forEach((community, communityIndex) => {
    // Create central node for the community
    const centralNode = {
      id: `${nodeId}`,
      data: { 
        label: `Community ${communityIndex + 1}`,
      },
      position: { x: community.centerX, y: community.centerY },
      style: {
        background: community.color,
        width: 80,
        height: 80,
        borderRadius: '50%',
        border: 'none',
        opacity: 0.9,
      },
    };
    nodes.push(centralNode);
    nodeId++;

    // Create satellite nodes
    for (let i = 0; i < community.count; i++) {
      const angle = (2 * Math.PI * i) / community.count;
      const radius = 100;
      const x = community.centerX + radius * Math.cos(angle);
      const y = community.centerY + radius * Math.sin(angle);

      nodes.push({
        id: `${nodeId}`,
        data: { 
          label: `Node ${nodeId}`,
        },
        position: { x, y },
        style: {
          background: community.color,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: 'none',
          opacity: 0.7,
        },
      });
      nodeId++;
    }
  });

  return nodes;
};

// Generate edges between nodes
const generateEdges = (nodes: Node[]) => {
  const edges: Edge[] = [];
  let edgeId = 1;

  nodes.forEach((source, sourceIndex) => {
    // Connect to nodes in the same community
    const communitySize = sourceIndex % 5 === 0 ? 15 : 5;
    for (let i = sourceIndex + 1; i < sourceIndex + communitySize && i < nodes.length; i++) {
      if (Math.random() > 0.3) { // 70% chance to create an edge
        edges.push({
          id: `e${edgeId}`,
          source: source.id,
          target: nodes[i].id,
          style: { 
            stroke: source.style?.background as string,
            opacity: 0.3,
          },
        });
        edgeId++;
      }
    }
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
          type: 'smoothstep',
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
