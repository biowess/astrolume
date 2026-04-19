export function About() {
  return (
    <div className="h-full flex items-center justify-center p-8 md:p-16">
      <div className="max-w-3xl glass-panel-heavy p-10 md:p-16 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          {/* Subtle decoration */}
          <div className="w-40 h-40 border-4 border-dashed border-white rounded-full animate-[spin_60s_linear_infinite]" />
        </div>
        
        <h1 className="text-5xl font-light tracking-tight mb-8">About the Observatory</h1>
        <div className="font-serif text-lg leading-relaxed text-[var(--text-muted)] space-y-6">
          <p>
            Conceived as a luxury mechanical interface, this module serves as a tranquil, data-rich exploration vessel for our local cosmic coordinates.
          </p>
          <p>
            It is designed to counter the chaotic noise of standard modern interfaces by leaning heavily into physicality—glass, soft geometries, precise typographic hierarchies, and profound depth. The focus is singular: presenting planetary bodies not as playthings, but as monumental artifacts worthy of study.
          </p>
          <div className="pt-8 border-t border-[var(--panel-border)] mt-8">
            <h3 className="font-mono text-sm tracking-widest uppercase mb-4 text-[var(--text)]">Telemetry & Specs</h3>
            <ul className="text-sm font-mono space-y-2">
              <li><span className="text-[var(--accent)]">ENG /</span> React, TypeScript</li>
              <li><span className="text-[var(--accent)]">VIS /</span> Three.js, React Three Fiber</li>
              <li><span className="text-[var(--accent)]">SYS /</span> Zustand, Tailwind CSS, Framer Motion</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
