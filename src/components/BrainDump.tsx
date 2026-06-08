import { useRef, useEffect, useCallback } from 'react'
import { useElephantStore, useDumpText, useSyncStatus, useDeviceId } from '../store/elephantStore'

export function BrainDump() {
  const dumpText = useDumpText()
  const syncStatus = useSyncStatus()
  const deviceId = useDeviceId()
  const setDumpText = useElephantStore(s => s.setDumpText)
  const clearDump = useElephantStore(s => s.clearDump)
  const setGraphOpen = useElephantStore(s => s.setGraphOpen)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.max(el.scrollHeight, 220)}px`
  }, [dumpText])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDumpText(e.target.value)
  }, [setDumpText])

  const thoughtCount = dumpText.split('\n').filter(l => l.trim()).length

  const syncLabel = {
    idle: null,
    loading: '⟳ loading…',
    saving: '⟳ saving…',
    saved: '✓ saved',
    error: '✕ error',
  }[syncStatus]

  const syncColor = {
    idle: '',
    loading: 'text-stone-400',
    saving: 'text-stone-400',
    saved: 'text-emerald-500',
    error: 'text-red-400',
  }[syncStatus]

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-stone-800 tracking-tight">
            🐘 elephant
          </h1>
          <p className="text-xs text-stone-400 mt-0.5 font-sans">
            never forgets · one thought per line
          </p>
        </div>

        <div className="flex items-center gap-3">
          {syncLabel && (
            <span className={`text-xs font-mono ${syncColor}`}>{syncLabel}</span>
          )}
          {thoughtCount > 0 && (
            <button
              onClick={() => setGraphOpen(true)}
              className="text-xs px-3 py-1.5 rounded-lg border border-stone-200
                bg-white text-stone-600 hover:bg-stone-50 hover:border-stone-300
                transition-all font-sans"
            >
              view graph
            </button>
          )}
          {dumpText && (
            <button
              onClick={clearDump}
              className="text-xs px-3 py-1.5 rounded-lg border border-stone-200
                bg-white text-stone-400 hover:text-red-500 hover:border-red-200
                transition-all font-sans"
            >
              clear
            </button>
          )}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={dumpText}
          onChange={handleChange}
          placeholder={`GST invoice bhejni hai client ko\nTeam meeting kal 10 baje\nMorning run skip kar diya aaj\nDoctor appointment book karni hai…`}
          className="w-full resize-none rounded-2xl border border-stone-200 bg-stone-50/60
            p-5 text-sm text-stone-700 leading-7 font-sans
            placeholder:text-stone-300 placeholder:leading-7
            focus:outline-none focus:ring-2 focus:ring-stone-200 focus:bg-white
            transition-all"
          style={{ minHeight: '220px' }}
          spellCheck={false}
          autoFocus
        />

        {/* Line count badge */}
        {thoughtCount > 0 && (
          <div className="absolute bottom-4 right-4 text-xs text-stone-300 font-mono select-none">
            {thoughtCount} thought{thoughtCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Device ID footer */}
      <div className="mt-3 text-[10px] text-stone-300 font-mono text-right select-none">
        device: {deviceId}
      </div>
    </div>
  )
}
