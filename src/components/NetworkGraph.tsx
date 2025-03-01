
import { useState, useCallback, useEffect, useMemo } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useReactFlow,
  Edge,
  Panel,
  Connection,
  NodeMouseHandler,
} from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import CustomEdge from "./CustomEdge";
import "@xyflow/react/dist/style.css";
import { toast } from "sonner";
import { CustomNode } from "@/types/network";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NetworkGraphProps {
  nodes: CustomNode[];
  edges: Edge[];
  onEdgesChange: (edges: Edge[]) => void;
  onConnect: (connection: Connection) => void;
  onNodeClick?: NodeMouseHandler<CustomNode>;
}

// Define the edge types
const edgeTypes = {
  custom: CustomEdge,
};

const NetworkGraph = ({ 
  nodes, 
  edges, 
  onEdgesChange, 
  onConnect,
  onNodeClick 
}: NetworkGraphProps) => {
  const [zoomLevel, setZoomLevel] = useState<number[]>([1]);
  const [edgeType, setEdgeType] = useState<'default' | 'strong' | 'dashed'>('default');
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  // When filtered nodes change, adjust the view to fit them
  useEffect(() => {
    // Only fitView when there are nodes to display
    if (nodes.length > 0) {
      // Small delay to ensure the graph has been rendered
      const timeout = setTimeout(() => {
        fitView({ padding: 0.2, includeHiddenNodes: false });
      }, 100);
      
      return () => clearTimeout(timeout);
    }
  }, [nodes, fitView]);

  const handleConnect = useCallback(
    (params: Connection) => {
      // Create a new edge with the selected type
      const newEdge: Edge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: 'custom',
        data: {
          type: edgeType,
          label: `${edgeType} connection`,
        },
        animated: edgeType === 'strong',
      };
      
      onConnect(newEdge);
      toast.success(`${edgeType.charAt(0).toUpperCase() + edgeType.slice(1)} connection created`);
    },
    [onConnect, edgeType]
  );

  // Handle node click to select a node
  const handleNodeClick: NodeMouseHandler<CustomNode> = useCallback(
    (event, node) => {
      if (onNodeClick) {
        onNodeClick(event, node);
      }
    },
    [onNodeClick]
  );

  // Render edges with the custom edge type
  const customizedEdges = useMemo(() => {
    return edges.map(edge => {
      if (!edge.type) {
        return {
          ...edge,
          type: 'custom',
          data: {
            ...edge.data,
            type: 'default',
          }
        };
      }
      return edge;
    });
  }, [edges]);

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={customizedEdges}
            edgeTypes={edgeTypes}
            onConnect={handleConnect}
            onNodeClick={handleNodeClick}
            fitView
            className="bg-background"
            minZoom={0.2}
            maxZoom={4}
            defaultEdgeOptions={{
              type: 'custom',
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
            <Panel position="top-left" className="bg-background/80 p-2 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">Edge Type:</span>
                <Select
                  value={edgeType}
                  onValueChange={(value) => setEdgeType(value as 'default' | 'strong' | 'dashed')}
                >
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue placeholder="Edge Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="strong">Strong</SelectItem>
                    <SelectItem value="dashed">Dashed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
