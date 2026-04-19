export function Docs() {
  return (
    <div className="max-w-4xl mx-auto p-8 md:p-16 text-[var(--text)]">
      <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-8">Documentation</h1>
      <div className="space-y-12">
        
        <section className="glass-panel p-8 rounded-xl">
          <h2 className="text-xl text-[var(--accent)] mb-4 font-serif italic">Navigation & Carousel</h2>
          <p className="font-serif leading-relaxed text-[var(--text-muted)] mb-6 text-lg">
            The central observatory interface utilizes a horizontal displacement carousel. 
            Use the corresponding left and right auxiliary arrows, or standard keyboard mappings (Left/Right arrow keys) to shift your viewport focus. 
          </p>
          <div className="flex gap-4 items-center bg-[rgba(0,0,0,0.3)] p-4 rounded-lg font-mono text-sm">
            <span className="px-2 py-1 bg-[#1a1c23] border border-[var(--panel-border)] rounded text-[var(--text-muted)]">← Focus Prior</span>
            <span className="px-2 py-1 bg-[#1a1c23] border border-[var(--panel-border)] rounded text-[var(--text-muted)]">Focus Next →</span>
          </div>
        </section>

        <section className="glass-panel p-8 rounded-xl">
          <h2 className="text-xl text-[var(--accent)] mb-4 font-serif italic">Detailed Observation</h2>
          <p className="font-serif leading-relaxed text-[var(--text-muted)] mb-4 text-lg">
            Accessing a planetary body's detailed dossier ("Full Mode") isolates the planet and presents rich telemetry, including atmospheric composition, orbital metrics, and mass indices.
          </p>
        </section>

        <section className="glass-panel p-8 rounded-xl">
          <h2 className="text-xl text-[var(--accent)] mb-4 font-serif italic">Data Sources</h2>
          <p className="font-serif leading-relaxed text-[var(--text-muted)] text-lg">
            Telemetry is provisioned by the NASA Solar System Exploration database and The Solar System OpenData API. 
            Fallback models ensure system operability across variable network states.
          </p>
        </section>

      </div>
    </div>
  )
}
