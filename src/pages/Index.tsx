
import { useState, useCallback, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { NetworkView } from "@/components/NetworkView";
import { generateNodes, generateEdges } from "@/utils/network";
import { toast } from "sonner";
import { CustomNode } from "@/types/network";
import { Connection, Edge, EdgeChange } from "@xyflow/react";
import { communities } from "@/constants/network";

const initialNodes = generateNodes();
const initialEdges = generateEdges(initialNodes);

const Index = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedCommunities, setSelectedCommunities] = useState<number[]>(
    communities.map((_, index) => index)
  );

  // Filter nodes based on selected communities
  const filteredNodes = useMemo(() => {
    if (selectedCommunities.length === communities.length) {
      return nodes; // Return all nodes when all communities are selected
    }
    
    return nodes.filter(node => 
      selectedCommunities.includes(node.data.community)
    );
  }, [nodes, selectedCommunities]);

  // Filter edges to only include connections between visible nodes
  const filteredEdges = useMemo(() => {
    const visibleNodeIds = new Set(filteredNodes.map(node => node.id));
    
    return edges.filter(edge => 
      visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );
  }, [edges, filteredNodes]);

  const handleAddNode = (nodeData: { name: string; type: string; community: number }) => {
    const newNode: CustomNode = {
      id: `node-${nodes.length + 1}`,
      type: "default",
      data: {
        label: nodeData.name,
        type: nodeData.type,
        community: nodeData.community,
      },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      style: {
        background: communities[nodeData.community].color,
        width: 30,
        height: 30,
        borderRadius: '50%',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        opacity: 0.8,
      }
    };
    
    setNodes([...nodes, newNode]);
    toast.success("Node added successfully");
  };

  const handleFilterChange = useCallback((newSelectedCommunities: number[]) => {
    setSelectedCommunities(newSelectedCommunities);
  }, []);

  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => {
      // For EdgeRemove changes we need to remove the edge
      const edgesToRemove = changes
        .filter(change => change.type === 'remove')
        .map(change => change.id);
      
      if (edgesToRemove.length) {
        return eds.filter(edge => !edgesToRemove.includes(edge.id));
      }
      
      // For other changes, just return the current edges
      return eds;
    });
  }, []);

  const handleConnect = useCallback((connection: Connection | Edge) => {
    // If connection is already an Edge (from our custom implementation), use it directly
    if ('id' in connection && connection.id) {
      setEdges((eds) => [...eds, connection as Edge]);
    } else {
      // Otherwise, create a basic edge from the connection
      const params = connection as Connection;
      const newEdge: Edge = {
        id: `edge-${Date.now()}`,
        source: params.source || "",
        target: params.target || "",
        type: 'custom',
        data: {
          type: 'default',
        },
      };
      setEdges((eds) => [...eds, newEdge]);
    }
  }, []);

  return (
    <MainLayout>
      <NetworkView
        nodes={nodes}
        edges={filteredEdges}
        filteredNodes={filteredNodes}
        selectedCommunities={selectedCommunities}
        onFilterChange={handleFilterChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
      />
    </MainLayout>
  );
};

export default Index;
