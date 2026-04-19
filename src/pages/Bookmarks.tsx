import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { ArchiveX, ArrowRight, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function Bookmarks() {
  const { bookmarks, planets, toggleBookmark, updateSettings } = useStore();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const bookmarkedPlanets = planets.filter(p => bookmarks.includes(p.id));

  const clearAllBookmarks = () => {
    // Manually clearing all elements from array
    bookmarks.forEach(id => toggleBookmark(id)); 
    setShowConfirm(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 md:p-16 h-full flex flex-col relative">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">Saved Locations</h1>
          <p className="font-serif text-[var(--text-muted)] text-lg">Your synchronized planetary targets.</p>
        </div>
        {bookmarkedPlanets.length > 0 && (
          <button 
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-mono tracking-widest uppercase text-[var(--danger)] border border-[rgba(207,79,79,0.3)] rounded-full hover:bg-[rgba(207,79,79,0.1)] transition-colors"
          >
            <Trash2 size={16} /> Delete All
          </button>
        )}
      </header>

      {bookmarkedPlanets.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="w-24 h-24 rounded-full border border-[var(--panel-border)] flex items-center justify-center mb-6">
            <ArchiveX size={32} className="text-[var(--text-muted)]" />
          </div>
          <h3 className="font-serif text-2xl mb-2">No active coordinates</h3>
          <p className="text-[var(--text-muted)] mb-8">You haven't saved any planetary bodies yet. Explore the system and mark targets to access them quickly from this diagnostic panel.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-3 rounded-full border border-[var(--accent)] text-[var(--accent)] hover:bg-[rgba(229,193,88,0.1)] transition-colors font-mono text-sm tracking-widest uppercase"
          >
            Launch Explorer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedPlanets.map((planet) => (
            <div key={planet.id} className="glass-panel p-6 rounded-xl flex flex-col group hover:border-[var(--accent)] transition-colors cursor-pointer" onClick={() => navigate(`/planet/${planet.id}`)}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-mono text-xs text-[var(--accent)] tracking-widest uppercase mb-1">Index #{planet.orderFromSun.toString().padStart(2, '0')}</h4>
                  <h2 className="text-2xl font-light">{planet.name}</h2>
                </div>
                <div 
                  className="w-4 h-4 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]" 
                  style={{ backgroundColor: planet.colorPrimary }}
                />
              </div>
              
              <div className="flex gap-4 font-mono text-xs text-[var(--text-muted)] mt-auto mb-6">
                <span>R: {planet.radius.toLocaleString()}km</span>
                <span>O: {planet.orbitalPeriod}d</span>
              </div>

              <div className="flex justify-between items-center border-t border-[rgba(255,255,255,0.05)] pt-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleBookmark(planet.id); }}
                  className="text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors font-mono text-xs uppercase"
                >
                  Unmark Target
                </button>
                <button className="w-8 h-8 rounded-full glass-panel flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:text-[#030408] transition-colors">
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030408]/80 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel-heavy p-8 rounded-2xl max-w-sm w-full relative"
            >
              <button 
                onClick={() => setShowConfirm(false)}
                className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white"
              >
                <X size={20} />
              </button>
              <div className="w-12 h-12 rounded-full border border-[var(--danger)] flex items-center justify-center text-[var(--danger)] mb-6 mx-auto">
                <Trash2 size={24} />
              </div>
              <h2 className="text-2xl font-light text-center mb-2">Clear all targets?</h2>
              <p className="font-serif text-[var(--text-muted)] text-center mb-8">
                This will remove all synchronized coordinates from your local terminal. This action cannot be undone.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={clearAllBookmarks}
                  className="w-full py-3 rounded-full bg-[var(--danger)] text-white font-mono text-sm tracking-widest uppercase hover:bg-opacity-90 transition-colors"
                >
                  Confirm Deletion
                </button>
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="w-full py-3 rounded-full border border-[var(--panel-border)] text-[var(--text)] font-mono text-sm tracking-widest uppercase hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
