export type Tag =
  | 'Finance'
  | 'Work'
  | 'Health'
  | 'Learning'
  | 'Personal'
  | 'Urgent'
  | 'Project'
  | 'People'
  | 'Uncategorized'

export interface Thought {
  id: string
  text: string
  tags: Tag[]
  createdAt: number  // epoch ms
  sessionId: string
}

export interface Connection {
  id: string         // stable: "conn::smallerId::largerId"
  sourceId: string
  targetId: string
  reason: 'shared-tag' | 'time-proximity'
  weight: number     // 1 = time, 2 = tag, 3 = both
}

export interface Cluster {
  id: string
  tagLabel: string   // dominant tag name
  thoughtIds: string[]
}

export interface ElephantGraph {
  thoughts: Thought[]
  connections: Connection[]
  clusters: Cluster[]
  focusThoughtId: string | null
}

export interface PersistedSession {
  id: string
  device_id: string
  dump_text: string
  created_at: string
  updated_at: string
}
