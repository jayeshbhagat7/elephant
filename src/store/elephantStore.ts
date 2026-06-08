import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import { supabase } from '../lib/supabase'
import { parseThoughtsFromText, assembleGraph } from '../engines/graphOrchestrator'
import type { ElephantGraph, Thought } from '../types/elephant'

// ── Device ID (persisted in localStorage) ──────────────────────────────────
function getDeviceId(): string {
  let id = localStorage.getItem('elephant_device_id')
  if (!id) {
    id = nanoid(12)
    localStorage.setItem('elephant_device_id', id)
  }
  return id
}

const DEVICE_ID = getDeviceId()

// ── Debounce ───────────────────────────────────────────────────────────────
function debounce(fn: (sessionId: string, text: string) => void, ms: number) {
  let timer: ReturnType<typeof setTimeout>
  return (sessionId: string, text: string) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(sessionId, text), ms)
  }
}

// ── Store Types ────────────────────────────────────────────────────────────
type SyncStatus = 'idle' | 'saving' | 'saved' | 'error' | 'loading'

interface ElephantState {
  // Raw text from textarea
  dumpText: string
  // Derived graph
  graph: ElephantGraph
  // Pinned focus override
  pinnedFocusId: string | null
  // UI state
  isGraphOpen: boolean
  syncStatus: SyncStatus
  deviceId: string
  sessionId: string
  lastSavedAt: number | null

  // Actions
  setDumpText: (text: string) => void
  clearDump: () => void
  pinThought: (id: string | null) => void
  setGraphOpen: (open: boolean) => void
  loadFromSupabase: () => Promise<void>
}

// ── Empty graph ────────────────────────────────────────────────────────────
const EMPTY_GRAPH: ElephantGraph = {
  thoughts: [],
  connections: [],
  clusters: [],
  focusThoughtId: null,
}

// ── Build graph from text ──────────────────────────────────────────────────
function buildGraphFromText(text: string, sessionId: string): ElephantGraph {
  if (!text.trim()) return EMPTY_GRAPH
  const thoughts: Thought[] = parseThoughtsFromText(text, sessionId)
  return assembleGraph(thoughts)
}

// ── Supabase persistence ───────────────────────────────────────────────────
async function saveToSupabase(sessionId: string, dumpText: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('sessions')
      .upsert(
        { id: sessionId, device_id: DEVICE_ID, dump_text: dumpText },
        { onConflict: 'id' }
      )
    if (error) { console.error('Supabase save error:', error); return false }
    return true
  } catch (e) {
    console.error('Supabase save exception:', e)
    return false
  }
}

async function loadFromSupabase(deviceId: string) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('device_id', deviceId)
    .order('updated_at', { ascending: false })
    .limit(1)

  if (error) { console.error('Supabase load error:', error); return null }
  return data?.[0] ?? null
}

// ── Store ──────────────────────────────────────────────────────────────────
const initialSessionId = nanoid(12)

export const useElephantStore = create<ElephantState>()(
  subscribeWithSelector((set, get) => {
    const debouncedSave = debounce(async (sessionId: string, text: string) => {
      set({ syncStatus: 'saving' })
      const ok = await saveToSupabase(sessionId, text)
      set({ syncStatus: ok ? 'saved' : 'error', lastSavedAt: ok ? Date.now() : null })
      if (ok) setTimeout(() => set({ syncStatus: 'idle' }), 2000)
    }, 1500)

    return {
      dumpText: '',
      graph: EMPTY_GRAPH,
      pinnedFocusId: null,
      isGraphOpen: false,
      syncStatus: 'loading',
      deviceId: DEVICE_ID,
      sessionId: initialSessionId,
      lastSavedAt: null,

      setDumpText: (text: string) => {
        const { sessionId } = get()
        const graph = buildGraphFromText(text, sessionId)
        // Auto-clear pin if pinned thought no longer exists
        const { pinnedFocusId } = get()
        const stillExists = pinnedFocusId
          ? graph.thoughts.some(t => t.id === pinnedFocusId)
          : true
        set({
          dumpText: text,
          graph,
          pinnedFocusId: stillExists ? pinnedFocusId : null,
        });
        debouncedSave(sessionId, text)
      },

      clearDump: () => {
        const { sessionId } = get()
        set({ dumpText: '', graph: EMPTY_GRAPH, pinnedFocusId: null })
        saveToSupabase(sessionId, '')
      },

      pinThought: (id: string | null) => {
        const { pinnedFocusId } = get()
        set({ pinnedFocusId: pinnedFocusId === id ? null : id })
      },

      setGraphOpen: (open: boolean) => set({ isGraphOpen: open }),

      loadFromSupabase: async () => {
        set({ syncStatus: 'loading' })
        const row = await loadFromSupabase(DEVICE_ID)
        if (row) {
          const graph = buildGraphFromText(row.dump_text, row.id)
          set({
            dumpText: row.dump_text,
            graph,
            sessionId: row.id,
            syncStatus: 'idle',
          })
        } else {
          set({ syncStatus: 'idle' })
        }
      },
    }
  })
)

// ── Selector hooks ─────────────────────────────────────────────────────────
export const useGraph = () => useElephantStore(s => s.graph)
export const useDumpText = () => useElephantStore(s => s.dumpText)
export const useSyncStatus = () => useElephantStore(s => s.syncStatus)
export const useIsGraphOpen = () => useElephantStore(s => s.isGraphOpen)
export const useDeviceId = () => useElephantStore(s => s.deviceId)

export const useFocusThought = () =>
  useElephantStore(s => {
    const id = s.pinnedFocusId ?? s.graph.focusThoughtId
    return s.graph.thoughts.find(t => t.id === id) ?? null
  })

export const useThoughts = () => useElephantStore(s => s.graph.thoughts)
export const useClusters = () => useElephantStore(s => s.graph.clusters)
export const useConnections = () => useElephantStore(s => s.graph.connections)
