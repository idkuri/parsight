import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  Handle,
  Position,
  StepEdge, 
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Plus, 
  Play, 
  Save, 
  Download, 
  Upload, 
  Database, 
  FileText, 
  Zap, 
  Target, 
  Settings,
  Trash2 
} from 'lucide-react';

// Custom Node Component
const CustomNode = ({ data, selected }) => {
  const { label, color, icon: Icon, inputs, outputs, onDelete, config } = data;
  
  return (
    <div className={`rounded-xl border-2 border-blue-900 shadow-lg transition-all duration-200 ${
      selected ? "bg-card" : "bg-primary"
    }`} style={{ width: '200px', minHeight: '100px' }}>
      {/* Handle for inputs */}
      {inputs > 0 && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-4 h-4 bg-blue-500 border-2"
        />
      )}
      
      {/* Node Header */}
      <div className={`w-full h-10 bg-gradient-to-r ${color} rounded-t-xl flex items-center px-3`}>
        <Icon size={16} className="text-white mr-2" />
        <span className="font-medium text-sm text-white flex-1">{label}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-white/70 hover:text-white hover:bg-primary/10 rounded p-1 transition-colors"
        >
          <Trash2 size={12} />
        </button>
      </div>
      
      {/* Node Content */}
      <div className="p-3">
        <div className="text-xs text-gray-600 mb-2 ">
          {config.name || data.type}
        </div>
        <div className="text-xs text-gray-500">
          {data.type === 'source' && `Type: ${config.type}`}
          {data.type === 'chunking' && `Size: ${config.chunkSize}`}
          {data.type === 'partitioning' && `Strategy: ${config.strategy}`}
          {data.type === 'embedder' && `Model: ${config.model.split('-').pop()}`}
          {data.type === 'output' && `Format: ${config.format}`}
        </div>
      </div>
      
      {/* Handle for outputs */}
      {outputs > 0 && (
        <Handle
          type="source"
          position={Position.Right}
          className="w-4 h-4 bg-green-500 border-2"
        />
      )}
    </div>
  );
};

const nodeTypes = {
  customNode: CustomNode,
};

const WorkflowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [isRunning, setIsRunning] = useState(false);

  const nodeConfigs = {
    source: {
      label: 'Data Source',
      color: 'from-blue-900 to-blue-600',
      icon: Database,
      inputs: 0,
      outputs: 1,
      config: { url: '', type: 'csv', name: 'data_source' }
    },
    chunking: {
      label: 'Chunking',
      color: 'from-green-900 to-green-600',
      icon: FileText,
      inputs: 1,
      outputs: 1,
      config: { chunkSize: 1000, overlap: 200, strategy: 'fixed', name: 'chunking' }
    },
    partitioning: {
      label: 'Partitioning',
      color: 'from-yellow-600 to-yellow-700',
      icon: Zap,
      inputs: 1,
      outputs: 1,
      config: { strategy: 'auto', maxSize: 10000, name: 'partitioning' }
    },
    embedder: {
      label: 'Embedder',
      color: 'from-purple-600 to-purple-700',
      icon: Zap,
      inputs: 1,
      outputs: 1,
      config: { model: 'text-embedding-ada-002', dimensions: 1536, name: 'embedder' }
    },
    output: {
      label: 'Output',
      color: 'from-red-600 to-red-700',
      icon: Target,
      inputs: 1,
      outputs: 0,
      config: { format: 'json', destination: 'file', name: 'output' }
    }
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = (type) => {
    const config = nodeConfigs[type];
    const newNode = {
      id: Date.now().toString(),
      type: 'customNode',
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 300 + 100 
      },
      data: {
        ...config,
        type,
        config: { ...config.config },
        onDelete: () => deleteNode(Date.now().toString()),
      },
    };
    
    // Update the onDelete function with the correct id
    newNode.data.onDelete = () => deleteNode(newNode.id);
    
    setNodes((nds) => nds.concat(newNode));
  };

  const deleteNode = (nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const updateNodeConfig = (nodeId, configUpdate) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              config: { ...node.data.config, ...configUpdate },
            },
          };
        }
        return node;
      })
    );
  };

  const runWorkflow = async () => {
    const sourceNodes = nodes.filter(n => n.data.type === 'source');
    const outputNodes = nodes.filter(n => n.data.type === 'output');
    
    if (sourceNodes.length === 0) {
      alert('Add at least one source node to run the workflow');
      return;
    }
    
    if (outputNodes.length === 0) {
      alert('Add at least one output node to run the workflow');
      return;
    }
    
    setIsRunning(true);
    
    try {
      // Simulate workflow execution
      await new Promise(resolve => setTimeout(resolve, 3000));
      alert('Workflow executed successfully!');
    } catch (error) {
      alert('Workflow execution failed: ' + error.message);
    } finally {
      setIsRunning(false);
    }
  };

  const saveWorkflow = () => {
    const workflowData = {
      name: workflowName,
      nodes,
      edges,
      createdAt: new Date().toISOString()
    };
    
    console.log('Saving workflow:', workflowData);
    alert('Workflow saved successfully!');
  };

  const exportWorkflow = () => {
    const workflowData = {
      name: workflowName,
      nodes,
      edges,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(workflowData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowName.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importWorkflow = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workflowData = JSON.parse(e.target.result);
        setWorkflowName(workflowData.name || 'Imported Workflow');
        
        // Update nodes with proper onDelete functions
        const importedNodes = workflowData.nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            onDelete: () => deleteNode(node.id),
          }
        }));
        
        setNodes(importedNodes);
        setEdges(workflowData.edges || []);
        setSelectedNode(null);
        alert('Workflow imported successfully!');
      } catch (error) {
        alert('Error importing workflow: Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  const clearWorkflow = () => {
    if (window.confirm('Are you sure you want to clear the workflow? This cannot be undone.')) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
      setWorkflowName('Untitled Workflow');
    }
  };

  const renderConfigPanel = () => {
    if (!selectedNode) {
      return (
        <div className="w-80 bg-primary border-l border-gray-200 flex items-center justify-center">
          <div className="text-center text-gray-500 px-6">
            <Settings size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg mb-2">No node selected</p>
            <p className="text-sm">Click on a node to configure its settings</p>
          </div>
        </div>
      );
    }
    
    const nodeType = selectedNode.data;
    const Icon = nodeType.icon;
    
    return (
      <div className="w-80 bg-black border-l border-gray-200 h-full overflow-y-auto">
        <div className="p-6">
          <h3 className="font-semibold text-xl mb-6 flex items-center gap-3">
            <div className={`p-2 bg-gradient-to-br ${nodeType.color} rounded-lg`}>
              <Icon size={24} className="text-black" />
            </div>
            {nodeType.label}
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Node Name</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                value={selectedNode.data.config.name || ''}
                onChange={(e) => updateNodeConfig(selectedNode.id, { name: e.target.value })}
                placeholder={`${nodeType.label} name`}
              />
            </div>

            {selectedNode.data.type === 'source' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Data URL</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none transition-colors"
                    value={selectedNode.data.config.url}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { url: e.target.value })}
                    placeholder="https://example.com/data.csv"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Data Type</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none bg-primary focus:border-blue-500 transition-colors"
                    value={selectedNode.data.config.type}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { type: e.target.value })}
                  >
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                    <option value="xml">XML</option>
                    <option value="parquet">Parquet</option>
                  </select>
                </div>
              </>
            )}
            
            {selectedNode.data.type === 'chunking' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Chunk Size</label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    value={selectedNode.data.config.chunkSize}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { chunkSize: parseInt(e.target.value) })}
                    min="100"
                    max="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Overlap</label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    value={selectedNode.data.config.overlap}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { overlap: parseInt(e.target.value) })}
                    min="0"
                    max="1000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 ">Strategy</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg bg-primary focus:outline-none focus:border-blue-500 transition-colors"
                    value={selectedNode.data.config.strategy}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { strategy: e.target.value })}
                  >
                    <option value="fixed">Fixed Size</option>
                    <option value="sentence">Sentence Boundary</option>
                    <option value="paragraph">Paragraph Boundary</option>
                  </select>
                </div>
              </>
            )}
            
            {selectedNode.data.type === 'partitioning' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Strategy</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    value={selectedNode.data.config.strategy}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { strategy: e.target.value })}
                  >
                    <option value="auto">Auto Detect</option>
                    <option value="fixed">Fixed Size</option>
                    <option value="semantic">Semantic</option>
                    <option value="hierarchical">Hierarchical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Max Size (bytes)</label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    value={selectedNode.data.config.maxSize}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { maxSize: parseInt(e.target.value) })}
                    min="1000"
                    max="100000"
                  />
                </div>
              </>
            )}
            
            {selectedNode.data.type === 'embedder' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Model</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg bg-primary focus:outline-none focus:border-blue-500 transition-colors"
                    value={selectedNode.data.config.model}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { model: e.target.value })}
                  >
                    <option value="text-embedding-ada-002">text-embedding-ada-002</option>
                    <option value="text-embedding-3-small">text-embedding-3-small</option>
                    <option value="text-embedding-3-large">text-embedding-3-large</option>
                    <option value="sentence-transformers">Sentence Transformers</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Dimensions</label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    value={selectedNode.data.config.dimensions}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { dimensions: parseInt(e.target.value) })}
                    min="128"
                    max="4096"
                  />
                </div>
              </>
            )}
            
            {selectedNode.data.type === 'output' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 bg-primary text-gray-700">Output Format</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg bg-primary focus:outline-none focus:border-blue-500 transition-colors"
                    value={selectedNode.data.config.format}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { format: e.target.value })}
                  >
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                    <option value="parquet">Parquet</option>
                    <option value="jsonl">JSON Lines</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Destination</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg bg-primary focus:outline-none focus:border-blue-500 transition-colors"
                    value={selectedNode.data.config.destination}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { destination: e.target.value })}
                  >
                    <option value="file">File</option>
                    <option value="database">Database</option>
                    <option value="api">API Endpoint</option>
                    <option value="storage">Cloud Storage</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-primary">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-primary border-b bg-primary border-gray-200 shadow-sm">
        {/* <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
              <Settings size={24} className="text-white" />
            </div>
            <div>
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="text-2xl font-bold bg-transparent border-none outline-none focus:border-b-2 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500">
                {nodes.length} nodes • {edges.length} connections
              </p>
            </div>
          </div>
        </div> */}

        <div className="flex items-center gap-3">
          {/* <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            <Upload size={16} />
            Import
            <input
              type="file"
              accept=".json"
              onChange={importWorkflow}
              className="hidden"
            />
          </label> */}
          
          {/* <button
            onClick={exportWorkflow}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Download size={16} />
            Export
          </button>

          <button
            onClick={saveWorkflow}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save size={16} />
            Save
          </button> */}

          <button
            onClick={runWorkflow}
            disabled={isRunning}
            className={`flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg transition-colors ${
              isRunning 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-purple-700'
            }`}
          >
            <Play size={16} className={isRunning ? 'animate-spin' : ''} />
            {isRunning ? 'Running...' : 'Run Workflow'}
          </button>
        </div>
      </div>

      {/* Node Toolbar */}
      <div className="flex items-center gap-4 p-4 bg-primary border-b border-gray-200">
        <span className="font-medium text-gray-700">Add Node:</span>
        <div className="flex gap-2">
          {Object.entries(nodeConfigs).map(([type, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={type}
                onClick={() => addNode(type)}
                className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${config.color} text-white rounded-lg hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-lg`}
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{config.label}</span>
              </button>
            );
          })}
        </div>
        
        {nodes.length > 0 && (
          <button
            onClick={clearWorkflow}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Trash2 size={16} />
            Clear All
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* React Flow Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            edgeTypes={{step: StepEdge}} 
            defaultEdgeOptions={{ type: 'step' }}
            fitView
            className="bg-gray-50 bg-primary"
          >
            {/* <Controls /> */}
            {/* <MiniMap /> */}
            <Background color="#aaa" gap={16} />
            <Panel position="top-left">
              {nodes.length === 0 && (
                <div className="bg-primary p-4 rounded-lg shadow-lg">
                  <p className="text-gray-600 text-sm">
                    Start building your workflow by adding nodes from the toolbar above
                  </p>
                </div>
              )}
            </Panel>
          </ReactFlow>
        </div>

        {/* Configuration Panel */}
        {renderConfigPanel()}
      </div>
    </div>
  );
};

export default WorkflowBuilder;