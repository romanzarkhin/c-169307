
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
  Edge,
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
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import "@xyflow/react/dist/style.css";
import { toast } from "sonner";
import { CustomNode } from "@/types/network";

interface NetworkGraphProps {
  nodes: CustomNode[];
  edges: Edge[];
  onEdgesChange: (edges: Edge[]) => void;
  onConnect: (connection: Connection) => void;
}

const NetworkGraph = ({ nodes, edges, onEdgesChange, onConnect }: NetworkGraphProps) => {
  const [zoomLevel, setZoomLevel] = useState<number[]>([1]);
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const handleConnect = useCallback(
    (params: Connection) => {
      onConnect(params);
      toast.success("Connection created successfully");
    },
    [onConnect]
  );

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onConnect={handleConnect}
            fitView
            className="bg-background"
            minZoom={0.2}
            maxZoom={4}
            defaultEdgeOptions={{
              type: "smoothstep",
              style: { stroke: "#999", strokeWidth: 2 },
              animated: true,
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
                  onValueChange={setZoomLevel}
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
