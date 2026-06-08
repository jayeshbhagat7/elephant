import { useThoughts, useElephantStore, useGraph } from '../store/elephantStore'
import { TagPill } from './TagPill'

export function ThoughtList() {
  const thoughts = useThoughts()
  const graph = useGraph()
  const pinThought = useElephantStore(s => s.pinThought)
  const pinnedFocusId = useElephantStore(s => s.pinnedFocusId)

  if (thoughts.length === 0) return null

  return (
    <div>
      <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest mb-3">
        all thoughts
      </p>
      <div className="space-y-1">
        {thoughts.map((t, idx) => {
          const edgeCount = graph.connections.filter(
            c => c.sourceId === t.id || c.targetId === t.id
          ).length
          const isPinned = pinnedFocusId === t.id

          return (
            <button
              key={t.id}
              onClick={() => pinThought(t.id)}
              className={`w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-xl
                transition-all group font-sans
                ${isPinned
                  ? 'bg-stone-100 border border-stone-200'
                  : 'hover:bg-stone-50 border border-transparent'
                }`}
            >
              {/* Index */}
              <span className="text-[10px] font-mono text-stone-300 mt-1 w-4 shrink-0 text-right">
                {idx + 1}
              </span>

              {/* Text */}
              <span className={`flex-1 text-sm leading-snug
                ${isPinned ? 'text-stone-700' : 'text-stone-600 group-hover:text-stone-800'}`}
              >
                {t.text}
              </span>

              {/* Tags + connections */}
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {t.tags.slice(0, 2).map(tag => (
                  <TagPill key={tag} tag={tag} size="xs" />
                ))}
                {edgeCount > 0 && (
                  <span className="text-[10px] font-mono text-stone-300">
                    {edgeCount}↔
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
