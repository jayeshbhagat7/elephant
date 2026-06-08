import { useEffect } from 'react'
import { useElephantStore } from './store/elephantStore'
import { BrainDump } from './components/BrainDump'
import { FocusCard } from './components/FocusCard'
import { ThoughtList } from './components/ThoughtList'
import { GraphModal } from './components/GraphModal'

export default function App() {
  const loadFromSupabase = useElephantStore(s => s.loadFromSupabase)

  useEffect(() => {
    loadFromSupabase()
  }, [loadFromSupabase])

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Subtle grain texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <main className="relative max-w-2xl mx-auto px-5 py-10 space-y-8">
        <BrainDump />
        <FocusCard />
        <ThoughtList />
      </main>

      <GraphModal />
    </div>
  )
}
