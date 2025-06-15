
import { useState, useCallback, useMemo } from "react";
import { NetworkView } from "@/components/NetworkView";
import { generateNodes, generateEdges } from "@/utils/network";
import { toast } from "sonner";
import { CustomNode } from "@/types/network";
import { Connection, Edge, EdgeChange, NodeMouseHandler } from "@xyflow/react";
import { communities } from "@/constants/network";
import { LayoutType, applyLayout } from "@/utils/layouts";
import { NetworkSidebar } from "@/components/layout/NetworkSidebar";
import { EditNodeDialog } from "@/components/EditNodeDialog";
import { CreateEdgeDialog } from "@/components/CreateEdgeDialog";

const initialNodes = generateNodes();
const initialEdges = generateEdges(initialNodes);

const MonitoringPage = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedCommunities, setSelectedCommunities] = useState<number[]>(
    communities.map((_, index) => index)
  );
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateEdgeDialogOpen, setIsCreateEdgeDialogOpen] = useState(false);

  const filteredNodes = useMemo(() => {
    let filtered = nodes;
    if (selectedCommunities.length < communities.length) {
      filtered = filtered.filter(node => selectedCommunities.includes(node.data.community));
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(node => 
        node.data.label.toLowerCase().includes(query) || 
        (node.data.type && node.data.type.toString().toLowerCase().includes(query))
      );
    }
    return filtered;
  }, [nodes, selectedCommunities, searchQuery]);

  const filteredEdges = useMemo(() => {
    const visibleNodeIds = new Set(filteredNodes.map(node => node.id));
    return edges.filter(edge => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target));
  }, [edges, filteredNodes]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleAddNode = (nodeData: { name: string; type: string; community: number }) => {
    const newNode: CustomNode = {
      id: `node-${nodes.length + 1}`,
      type: "default",
      data: { label: nodeData.name, type: nodeData.type, community: nodeData.community },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      style: { background: communities[nodeData.community].color, width: 30, height: 30, borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.15)', opacity: 0.8 }
    };
    setNodes([...nodes, newNode]);
    toast.success("Node added successfully");
  };

  const handleUpdateNode = useCallback((nodeId: string, updates: { name: string; type: string; community: number }) => {
    setNodes(prevNodes => prevNodes.map(node => {
      if (node.id === nodeId) {
        return { ...node, data: { ...node.data, label: updates.name, type: updates.type, community: updates.community }, style: { ...node.style, background: communities[updates.community].color } };
      }
      return node;
    }));
    toast.success("Node updated successfully");
  }, []);

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
    setEdges(prevEdges => prevEdges.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
    toast.success("Node deleted successfully");
  }, []);

  const handleCreateEdge = useCallback((sourceId: string, targetId: string, edgeType: string) => {
    const edgeExists = edges.some(edge => edge.source === sourceId && edge.target === targetId);
    if (edgeExists) {
      toast.error("This connection already exists");
      return;
    }
    const sourceNode = nodes.find(node => node.id === sourceId);
    if (!sourceNode) return;
    const isCrossConnection = sourceNode.data.community !== nodes.find(n => n.id === targetId)?.data.community;
    const newEdge: Edge = {
      id: `edge-${Date.now()}`,
      source: sourceId,
      target: targetId,
      type: 'custom',
      data: { type: edgeType, label: isCrossConnection ? 'Cross-community' : undefined },
      style: { stroke: isCrossConnection ? '#rgba(160, 160, 160, 0.2)' : sourceNode.style?.background as string, opacity: isCrossConnection ? 0.15 : 0.25, strokeWidth: 1 + (edgeType === 'strong' ? 2 : 0) },
      animated: edgeType === 'strong',
    };
    setEdges(prevEdges => [...prevEdges, newEdge]);
    toast.success("Link created successfully");
  }, [edges, nodes]);

  const handleFilterChange = useCallback((newSelectedCommunities: number[]) => {
    setSelectedCommunities(newSelectedCommunities);
  }, []);

  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => {
      const edgesToRemove = changes.filter(c => c.type === 'remove').map(c => c.id);
      return edgesToRemove.length ? eds.filter(edge => !edgesToRemove.includes(edge.id)) : eds;
    });
  }, []);

  const handleConnect = useCallback((connection: Connection | Edge) => {
    const newEdge: Edge = 'id' in connection ? connection : { ...connection, id: `edge-${Date.now()}`, type: 'custom', data: { type: 'default' } };
    setEdges((eds) => [...eds, newEdge as Edge]);
  }, []);

  const handleApplyLayout = useCallback((layoutType: LayoutType, options: any) => {
    setNodes(prevNodes => {
      const newNodes = applyLayout([...prevNodes], layoutType, options);
      toast.success(`Applied ${layoutType} layout`);
      return newNodes;
    });
  }, []);

  const handleLoadNetwork = useCallback((newNodes: CustomNode[], newEdges: Edge[]) => {
    setNodes(newNodes);
    setEdges(newEdges);
  }, []);

  const handleNodeClick: NodeMouseHandler<CustomNode> = (_, node) => {
    setSelectedNode(node);
  };

  const handleEditNode = () => {
    if (selectedNode) setIsEditDialogOpen(true);
    else toast.info("Please select a node to edit");
  };
  
  const handleDeleteSelection = () => {
    if (selectedNode) {
      handleDeleteNode(selectedNode.id);
      setSelectedNode(null);
    } else {
      toast.info("Please select a node to delete");
    }
  };

  return (
    <div className="flex h-[calc(100vh-theme(space.14))]">
      <NetworkSidebar 
        onAddNode={handleAddNode}
        onCreateEdge={() => setIsCreateEdgeDialogOpen(true)}
        onEditNode={handleEditNode}
        onDeleteSelection={handleDeleteSelection}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      <div className="flex-1 flex flex-col relative">
        <NetworkView
          nodes={nodes}
          edges={filteredEdges}
          filteredNodes={filteredNodes}
          selectedCommunities={selectedCommunities}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          onEdgesChange={handleEdgesChange}
          onConnect={handleConnect}
          onAddNode={handleAddNode}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleDeleteNode}
          onCreateEdge={handleCreateEdge}
          onApplyLayout={handleApplyLayout}
          onLoadNetwork={handleLoadNetwork}
          selectedNode={selectedNode}
          onNodeClick={handleNodeClick}
          onCloseNodeDetail={() => setSelectedNode(null)}
          onEditSelectedNode={handleEditNode}
          onDeleteSelectedNode={handleDeleteSelection}
        />
        <EditNodeDialog 
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          node={selectedNode}
          onUpdateNode={handleUpdateNode}
        />
        <CreateEdgeDialog
          open={isCreateEdgeDialogOpen}
          onOpenChange={setIsCreateEdgeDialogOpen}
          nodes={nodes}
          onCreateEdge={handleCreateEdge}
        />
      </div>
    </div>
  );
};

export default MonitoringPage;

