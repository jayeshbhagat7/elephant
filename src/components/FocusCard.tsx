import { useElephantStore, useFocusThought, useClusters, useGraph } from '../store/elephantStore'
import { TAG_COLORS } from '../utils/tagColors'
import { TagPill } from './TagPill'

export function FocusCard() {
  const focusThought = useFocusThought()
  const clusters = useClusters()
  const graph = useGraph()
  const pinThought = useElephantStore(s => s.pinThought)
  const pinnedFocusId = useElephantStore(s => s.pinnedFocusId)

  if (!focusThought) return null

  // Count connections for this thought
  const connectionCount = graph.connections.filter(
    c => c.sourceId === focusThought.id || c.targetId === focusThought.id
  ).length

  // Which clusters does this thought belong to?
  const myCluster = clusters.find(c => c.thoughtIds.includes(focusThought.id))

  // Cluster thoughts (excluding the focus itself)
  const clusterThoughts = myCluster
    ? graph.thoughts.filter(
        t => myCluster.thoughtIds.includes(t.id) && t.id !== focusThought.id
      )
    : []

  const isPinned = pinnedFocusId === focusThought.id
  const primaryTag = focusThought.tags[0]
  const { bg, border } = TAG_COLORS[primaryTag]

  return (
    <div className={`rounded-2xl border-2 p-5 ${bg} ${border} transition-all`}>
      {/* Label */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
          {isPinned ? '📌 pinned focus' : '✦ suggested focus'}
        </span>
        <div className="flex items-center gap-2">
          {connectionCount > 0 && (
            <span className="text-[10px] font-mono text-stone-400">
              {connectionCount} connection{connectionCount !== 1 ? 's' : ''}
            </span>
          )}
          {isPinned && (
            <button
              onClick={() => pinThought(null)}
              className="text-[10px] text-stone-400 hover:text-stone-600 font-mono"
            >
              unpin
            </button>
          )}
        </div>
      </div>

      {/* Focus thought text */}
      <p className="font-serif text-lg text-stone-800 leading-snug mb-3">
        {focusThought.text}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {focusThought.tags.map(tag => (
          <TagPill key={tag} tag={tag} />
        ))}
      </div>

      {/* Cluster related thoughts */}
      {clusterThoughts.length > 0 && (
        <div className="mt-3 pt-3 border-t border-stone-200/60">
          <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest mb-2">
            related · {myCluster?.tagLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {clusterThoughts.slice(0, 4).map(t => (
              <button
                key={t.id}
                onClick={() => pinThought(t.id)}
                className="text-xs text-stone-600 bg-white/70 hover:bg-white
                  border border-stone-200 rounded-lg px-2.5 py-1
                  transition-all text-left font-sans truncate max-w-[200px]"
                title={t.text}
              >
                {t.text.length > 32 ? t.text.slice(0, 32) + '…' : t.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
