
import React, { useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  useReactFlow,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { CustomNode } from '@/types/network';

interface NetworkGraphProps {
  nodes: CustomNode[];
  edges: Edge[];
  onEdgesChange: (edges: Edge[]) => void;
  onConnect: (connection: Connection | Edge) => void;
  onNodeClick?: (event: React.MouseEvent<Element, MouseEvent>, node: Node) => void;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ 
  nodes, 
  edges, 
  onEdgesChange, 
  onConnect,
  onNodeClick,
}) => {
  const { setViewport } = useReactFlow();

  const onConnectCallback = useCallback(
    (params: Edge | Connection) => {
      onConnect(params);
    },
    [onConnect]
  );

  const onNodeClickHandler = (event: React.MouseEvent<Element, MouseEvent>, node: Node) => {
    if (onNodeClick) {
      onNodeClick(event, node);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnectCallback}
        onNodeClick={onNodeClickHandler}
        fitView
        onLoad={(instance) => {
          instance.fitView({ padding: 0.1 });
        }}
      />
    </div>
  );
};

export default NetworkGraph;
