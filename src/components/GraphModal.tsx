import { useMemo, useCallback } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  MarkerType,
  ReactFlowProvider,
  type Node,
  type Edge,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useGraph, useIsGraphOpen, useElephantStore, useFocusThought } from '../store/elephantStore'
import { TAG_NODE_COLOR } from '../utils/tagColors'

function GraphContent() {
  const graph = useGraph()
  const focusThought = useFocusThought()
  const pinThought = useElephantStore(s => s.pinThought)

  const nodes: Node[] = useMemo(() => {
    const count = graph.thoughts.length
    return graph.thoughts.map((t, i) => {
      const angle = (2 * Math.PI * i) / count
      const radius = Math.max(180, count * 28)
      const isFocus = t.id === focusThought?.id
      const primaryTag = t.tags[0]

      return {
        id: t.id,
        position: {
          x: 400 + radius * Math.cos(angle),
          y: 300 + radius * Math.sin(angle),
        },
        data: { label: t.text.length > 40 ? t.text.slice(0, 40) + '…' : t.text },
        style: {
          background: isFocus ? '#1c1917' : TAG_NODE_COLOR[primaryTag],
          color: isFocus ? '#fafaf9' : '#292524',
          border: isFocus ? '2px solid #1c1917' : '1.5px solid #d6d3d1',
          borderRadius: '12px',
          padding: '8px 12px',
          fontSize: '12px',
          fontFamily: '"DM Sans", sans-serif',
          maxWidth: '180px',
          cursor: 'pointer',
          fontWeight: isFocus ? 600 : 400,
          boxShadow: isFocus ? '0 4px 20px rgba(0,0,0,0.15)' : '0 1px 4px rgba(0,0,0,0.06)',
        },
        draggable: true,
      }
    })
  }, [graph.thoughts, focusThought])

  const edges: Edge[] = useMemo(() =>
    graph.connections.map(c => ({
      id: c.id,
      source: c.sourceId,
      target: c.targetId,
      type: 'default',
      animated: false,
      style: {
        stroke: c.reason === 'shared-tag' ? '#a8a29e' : '#d6d3d1',
        strokeWidth: c.weight >= 3 ? 2.5 : 1.5,
        strokeDasharray: c.reason === 'time-proximity' ? '4 4' : undefined,
      },
      markerEnd: {
        type: MarkerType.Arrow,
        color: '#a8a29e',
        width: 12,
        height: 12,
      },
    })),
    [graph.connections]
  )

  const onNodeClick = useCallback((_: unknown, node: Node) => {
    pinThought(node.id)
  }, [pinThought])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodeClick={onNodeClick}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.3}
      maxZoom={2}
      attributionPosition="bottom-left"
    >
      <Background color="#e7e5e4" gap={20} size={1} />
      <Controls showInteractive={false} />
      <MiniMap
        nodeColor={n => {
          const t = graph.thoughts.find(th => th.id === n.id)
          return t ? TAG_NODE_COLOR[t.tags[0]] : '#f5f5f4'
        }}
        maskColor="rgba(245,245,244,0.8)"
      />
    </ReactFlow>
  )
}

export function GraphModal() {
  const isOpen = useIsGraphOpen()
  const graph = useGraph()
  const setGraphOpen = useElephantStore(s => s.setGraphOpen)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
        onClick={() => setGraphOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl h-[75vh] bg-white rounded-2xl
        shadow-2xl overflow-hidden border border-stone-200">

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between
          px-5 py-3.5 bg-white/90 backdrop-blur-sm border-b border-stone-100">
          <div>
            <span className="font-serif text-stone-800 text-sm">Thought Graph</span>
            <span className="text-[10px] font-mono text-stone-400 ml-3">
              {graph.thoughts.length} thoughts · {graph.connections.length} connections · {graph.clusters.length} clusters
            </span>
          </div>
          <button
            onClick={() => setGraphOpen(false)}
            className="text-stone-400 hover:text-stone-700 text-xl leading-none font-light"
          >
            ×
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 z-10 bg-white/80 backdrop-blur-sm
          rounded-xl border border-stone-100 px-3 py-2 text-[10px] font-mono text-stone-500 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-stone-400" /> shared tag
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-stone-300" style={{ borderTop: '1.5px dashed #d6d3d1', height: 0 }} />
            time proximity
          </div>
        </div>

        {/* React Flow */}
        <div className="w-full h-full pt-12">
          <ReactFlowProvider>
            <GraphContent />
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  )
}
