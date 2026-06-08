import { nanoid } from 'nanoid'
import { inferTags } from './labelEngine'
import { deriveConnections } from './connectionEngine'
import { deriveClusters } from './clusterEngine'
import type { ElephantGraph, Thought } from '../types/elephant'

export function buildGraph(dumpText: string, sessionId: string): ElephantGraph {
  const lines = dumpText
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)

  const thoughts: Thought[] = lines.map((text, idx) => ({
    id: nanoid(10),
    text,
    tags: inferTags(text),
    createdAt: Date.now() + idx,
    sessionId,
  }))

  return assembleGraph(thoughts)
}

export function assembleGraph(thoughts: Thought[]): ElephantGraph {
  const connections = deriveConnections(thoughts)
  const clusters = deriveClusters(thoughts, connections)

  // Count edges per thought
  const edgeCount = new Map<string, number>()
  for (const t of thoughts) edgeCount.set(t.id, 0)
  for (const c of connections) {
    edgeCount.set(c.sourceId, (edgeCount.get(c.sourceId) ?? 0) + 1)
    edgeCount.set(c.targetId, (edgeCount.get(c.targetId) ?? 0) + 1)
  }

  // Focus = most connected thought (non-uncategorized preferred)
  let focusThoughtId: string | null = null
  let maxEdges = 0
  for (const t of thoughts) {
    const count = edgeCount.get(t.id) ?? 0
    if (count > maxEdges && t.tags[0] !== 'Uncategorized') {
      maxEdges = count
      focusThoughtId = t.id
    }
  }

  return { thoughts, connections, clusters, focusThoughtId }
}

export function parseThoughtsFromText(
  dumpText: string,
  sessionId: string,
  baseTime: number = Date.now()
): Thought[] {
  return dumpText
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .map((text, idx) => ({
      id: nanoid(10),
      text,
      tags: inferTags(text),
      createdAt: baseTime + idx,
      sessionId,
    }))
}
