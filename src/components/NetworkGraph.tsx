
import { useState, useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { communities } from "@/constants/network";
import { generateNodes, generateEdges } from "@/utils/network";
import { CustomNode } from "@/types/network";
import "@xyflow/react/dist/style.css";

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
    <div className="flex w-full h-full">
      <div className="flex-1 flex flex-col">
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
    </div>
  );
};

export default NetworkGraph;
