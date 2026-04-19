import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { Monitor, Moon, Settings as SettingsIcon } from 'lucide-react';

export function Settings() {
  const { settings, updateSettings } = useStore();

  return (
    <div className="max-w-4xl mx-auto p-8 md:p-16 text-[var(--text)]">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4 flex items-center gap-4">
          <SettingsIcon className="text-[var(--text-muted)]" size={40} strokeWidth={1} />
          Terminal Preferences
        </h1>
        <p className="font-serif text-[var(--text-muted)] text-lg">Configure observatory metrics and interface behaviors.</p>
      </header>
      
      <div className="space-y-10">
        
        <section className="glass-panel p-8 rounded-xl">
          <h2 className="font-mono text-[var(--accent)] text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
            <Monitor size={16} /> Display System
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-6">
              <div>
                <h3 className="text-xl mb-1">Deep Space Background</h3>
                <p className="text-sm font-serif text-[var(--text-muted)]">Render subtle starfield mapping behind primary assets.</p>
              </div>
              <Toggle 
                checked={settings.showStars} 
                onChange={(v) => updateSettings({ showStars: v })} 
              />
            </div>

            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="text-xl mb-1">Reduced Motion</h3>
                <p className="text-sm font-serif text-[var(--text-muted)]">Minimize cinematic transitions and idle planet rotation.</p>
              </div>
              <Toggle 
                checked={settings.reducedMotion} 
                onChange={(v) => updateSettings({ reducedMotion: v })} 
              />
            </div>
          </div>
        </section>

        <section className="glass-panel p-8 rounded-xl">
          <h2 className="font-mono text-[var(--accent)] text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
            <Moon size={16} /> Telemetry Standards
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="text-xl mb-1">Unit System</h3>
                <p className="text-sm font-serif text-[var(--text-muted)]">Select primary measurement scale for telemetry readouts.</p>
              </div>
              
              <div className="flex glass-panel p-1 rounded-lg font-mono text-sm uppercase tracking-widest">
                <button 
                  className={cn("px-4 py-2 rounded", settings.units === 'metric' ? "bg-[var(--accent)] text-[#030408]" : "text-[var(--text-muted)]")}
                  onClick={() => updateSettings({ units: 'metric' })}
                >
                  Metric
                </button>
                <button 
                  className={cn("px-4 py-2 rounded", settings.units === 'imperial' ? "bg-[var(--accent)] text-[#030408]" : "text-[var(--text-muted)]")}
                  onClick={() => updateSettings({ units: 'imperial' })}
                >
                  Imperial
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean, onChange: (val: boolean) => void }) {
  return (
    <button 
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-14 h-8 rounded-full transition-colors duration-300",
        checked ? "bg-[var(--accent)]" : "bg-[#1a1c23] border border-[var(--panel-border)]"
      )}
    >
      <div 
        className={cn(
          "absolute top-1 left-1 w-6 h-6 rounded-full transition-transform duration-300",
          checked ? "bg-[#030408] translate-x-6" : "bg-[var(--text-muted)] translate-x-0"
        )} 
      />
    </button>
  );
}
