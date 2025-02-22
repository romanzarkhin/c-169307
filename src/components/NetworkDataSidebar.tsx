
import { Edge } from "@xyflow/react";
import { Card } from "@/components/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { communities } from "@/constants/network";
import { CustomNode } from "@/types/network";

interface NetworkDataSidebarProps {
  nodes: CustomNode[];
  edges: Edge[];
}

export function NetworkDataSidebar({ nodes, edges }: NetworkDataSidebarProps) {
  const communityStats = communities.map((community, index) => {
    const communityNodes = nodes.filter(node => node.data.community === index);
    const communityEdges = edges.filter(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      return sourceNode && sourceNode.data.community === index;
    });

    return {
      name: community.name,
      color: community.color,
      nodeCount: communityNodes.length,
      edgeCount: communityEdges.length,
      centralNode: communityNodes.find(node => node.data.isCentral)?.data.label,
    };
  });

  return (
    <Sidebar className="border rounded-lg">
      <SidebarHeader>
        <h2 className="text-lg font-semibold px-4 py-2">Network Data</h2>
      </SidebarHeader>
      <SidebarContent>
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Overview</h3>
            <Card className="p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total Nodes</span>
                <span className="font-medium">{nodes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Edges</span>
                <span className="font-medium">{edges.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Communities</span>
                <span className="font-medium">{communities.length}</span>
              </div>
            </Card>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Communities</h3>
            <div className="space-y-2">
              {communityStats.map((stat, index) => (
                <Card key={index} className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stat.color }}
                    />
                    <span className="font-medium">{stat.name}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Nodes</span>
                      <span>{stat.nodeCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Edges</span>
                      <span>{stat.edgeCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Central Node</span>
                      <span>{stat.centralNode}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
