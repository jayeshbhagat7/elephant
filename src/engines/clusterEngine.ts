import type { Thought, Connection, Cluster, Tag } from '../types/elephant'

class UnionFind {
  private parent: Map<string, string> = new Map()

  find(x: string): string {
    if (!this.parent.has(x)) this.parent.set(x, x)
    const p = this.parent.get(x)!
    if (p !== x) this.parent.set(x, this.find(p))
    return this.parent.get(x)!
  }

  union(x: string, y: string) {
    const px = this.find(x)
    const py = this.find(y)
    if (px !== py) this.parent.set(px, py)
  }
}

function dominantTag(thoughts: Thought[]): Tag {
  const counts = new Map<Tag, number>()
  for (const t of thoughts) {
    for (const tag of t.tags) {
      if (tag !== 'Uncategorized') {
        counts.set(tag, (counts.get(tag) ?? 0) + 1)
      }
    }
  }
  if (counts.size === 0) return 'Uncategorized'
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0]
}

export function deriveClusters(
  thoughts: Thought[],
  connections: Connection[]
): Cluster[] {
  const uf = new UnionFind()

  for (const c of connections) {
    uf.union(c.sourceId, c.targetId)
  }

  const groups = new Map<string, string[]>()
  for (const t of thoughts) {
    const root = uf.find(t.id)
    if (!groups.has(root)) groups.set(root, [])
    groups.get(root)!.push(t.id)
  }

  const thoughtMap = new Map(thoughts.map(t => [t.id, t]))
  const clusters: Cluster[] = []

  for (const [root, ids] of groups) {
    if (ids.length < 2) continue  // singletons skip
    const clusterThoughts = ids.map(id => thoughtMap.get(id)!).filter(Boolean)
    clusters.push({
      id: `cluster::${root}`,
      tagLabel: dominantTag(clusterThoughts),
      thoughtIds: ids,
    })
  }

  return clusters
}
