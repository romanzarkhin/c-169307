
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
  Panel,
  useReactFlow,
} from "@xyflow/react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { communities } from "@/constants/network";
import { generateNodes, generateEdges } from "@/utils/network";
import { CustomNode } from "@/types/network";
import { ZoomIn, ZoomOut, Maximize2, Grid2X2, Filter } from "lucide-react";
import "@xyflow/react/dist/style.css";

const initialNodes = generateNodes();
const initialEdges = generateEdges(initialNodes);

const layouts = {
  horizontal: (nodes: CustomNode[]) => {
    return nodes.map((node) => ({
      ...node,
      position: {
        x: node.position.x * 1.5,
        y: node.position.y,
      },
    }));
  },
  vertical: (nodes: CustomNode[]) => {
    return nodes.map((node) => ({
      ...node,
      position: {
        x: node.position.x,
        y: node.position.y * 1.5,
      },
    }));
  },
  grid: (nodes: CustomNode[]) => {
    const spacing = 150;
    return nodes.map((node, index) => ({
      ...node,
      position: {
        x: (index % 5) * spacing + 100,
        y: Math.floor(index / 5) * spacing + 100,
      },
    }));
  },
};

const NetworkGraph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedCommunities, setSelectedCommunities] = useState<Set<number>>(new Set());
  const [zoomLevel, setZoomLevel] = useState<number[]>([1]);
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleLayoutChange = (layout: keyof typeof layouts) => {
    const layoutFunction = layouts[layout];
    setNodes((nds) => layoutFunction(nds));
    setTimeout(() => fitView(), 50);
  };

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

  const handleZoomChange = (values: number[]) => {
    setZoomLevel(values);
    const flow = document.querySelector('.react-flow__viewport');
    if (flow) {
      flow.style.transform = `scale(${values[0]})`;
    }
  };

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 flex flex-col">
        <div className="flex flex-wrap gap-2 p-4 items-center justify-between border-b">
          <div className="flex flex-wrap gap-2">
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
          <div className="flex items-center gap-4">
            <Select onValueChange={handleLayoutChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="horizontal">Horizontal Layout</SelectItem>
                <SelectItem value="vertical">Vertical Layout</SelectItem>
                <SelectItem value="grid">Grid Layout</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex-1 relative">
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
            <Panel position="top-right" className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => zoomIn()}
                className="bg-background"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => zoomOut()}
                className="bg-background"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => fitView()}
                className="bg-background"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </Panel>
            <Panel position="bottom-center" className="bg-background/80 p-4 rounded-t-lg backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <ZoomOut className="h-4 w-4" />
                <Slider
                  value={zoomLevel}
                  onValueChange={handleZoomChange}
                  max={4}
                  min={0.2}
                  step={0.1}
                  className="w-[200px]"
                />
                <ZoomIn className="h-4 w-4" />
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default NetworkGraph;
