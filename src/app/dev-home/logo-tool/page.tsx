'use client'

import { useEffect, useRef, useState } from 'react'

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<number[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/teckstart-source.svg')
        const svg = await res.text()
        if (cancelled) return
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
          const paths = containerRef.current.querySelectorAll('path')
          paths.forEach((p, idx) => {
            p.setAttribute('data-idx', String(idx + 1))
            p.addEventListener('click', () => {
              const num = idx + 1
              const willSelect = !p.classList.contains('accent')
              p.classList.toggle('accent', willSelect)
              setSelected((prev) => {
                const next = new Set(prev)
                if (willSelect) next.add(num)
                else next.delete(num)
                return Array.from(next).sort((a, b) => a - b)
              })
            })
          })
          setLoaded(true)
        }
      } catch (e) {
        console.error('Failed to load SVG', e)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const reset = () => {
    const paths = containerRef.current?.querySelectorAll('path')
    paths?.forEach((p) => p.classList.remove('accent'))
    setSelected([])
  }

  return (
    <div className="p-6 space-y-4">
      <style>{`
        svg { max-width: 100%; height: auto; }
        .accent { fill: #F39200 !important; }
        path { transition: filter 0.12s ease; }
        path:hover { filter: drop-shadow(0 0 1px #F39200); cursor: pointer; }
        .idx-badge { position: absolute; font-size: 10px; background: rgba(0,0,0,0.5); color: white; padding: 2px 4px; border-radius: 3px; }
      `}</style>
      <h1 className="text-lg font-semibold">Teckstart Logo Color Tool</h1>
      <p className="text-sm text-muted-foreground">
        Click parts of the logo to mark them orange. Selected path indices will be listed; tell me which index corresponds to the arrow, and I will bake it into the SVG.
      </p>
      <div className="flex items-center gap-2">
        <button onClick={reset} className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm">Reset</button>
        {loaded ? (
          <span className="text-xs text-gray-600">Loaded. Paths: {containerRef.current?.querySelectorAll('path').length}</span>
        ) : (
          <span className="text-xs text-gray-600">Loading SVG…</span>
        )}
      </div>
      <div className="text-sm">Selected: {selected.length ? selected.join(', ') : 'None'}</div>
      <div ref={containerRef} className="border rounded p-2 bg-white" />
    </div>
  )
}
