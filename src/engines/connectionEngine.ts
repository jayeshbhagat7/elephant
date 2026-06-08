import type { Thought, Connection, Tag } from '../types/elephant'

const MIN_WEIGHT = 2  // only show connections with weight >= 2 (tag match required)

function stableId(a: string, b: string): string {
  return a < b ? `conn::${a}::${b}` : `conn::${b}::${a}`
}

function sharedRealTags(a: Thought, b: Thought): Tag[] {
  return a.tags.filter(
    t => t !== 'Uncategorized' && b.tags.includes(t)
  )
}

export function deriveConnections(thoughts: Thought[]): Connection[] {
  const map = new Map<string, Connection>()

  for (let i = 0; i < thoughts.length; i++) {
    for (let j = i + 1; j < thoughts.length; j++) {
      const a = thoughts[i]
      const b = thoughts[j]

      const shared = sharedRealTags(a, b)
      if (shared.length === 0) continue  // no tag match = no connection

      const id = stableId(a.id, b.id)
      const weight = shared.length >= 2 ? 3 : 2

      if (weight >= MIN_WEIGHT) {
        map.set(id, {
          id,
          sourceId: a.id,
          targetId: b.id,
          reason: 'shared-tag',
          weight,
        })
      }
    }
  }

  return Array.from(map.values())
}
