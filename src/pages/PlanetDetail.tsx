/**
 * PlanetDetail.tsx — Production Pass
 *
 * Fixes:
 * - Ensures `gallery` is defined inside component scope
 * - Removes stray JSX after component end
 * - Keeps the inline gallery/modal system self-contained
 * - Uses the existing planet gallery data shape from this file
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  ArrowLeft,
  BookmarkPlus,
  BookmarkCheck,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { PLANET_GALLERY } from '../data/planetMedia';
import type { GalleryImage } from '../data/planetMedia';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// Per-planet enrichment data
// ─────────────────────────────────────────────────────────────────────────────
const PLANET_FACTS: Record<string, string> = {
  mercury:
    'Mercury experiences temperature swings of over 600 °C between day and night — the most extreme in the solar system.',
  venus:
    'A day on Venus (243 Earth days) is longer than its year (225 Earth days), and it rotates backwards.',
  earth:
    'Earth is the only known planet where plate tectonics actively recycle the crust, a key factor in sustaining life.',
  mars:
    'Olympus Mons on Mars is the tallest volcano in the solar system — nearly three times the height of Everest.',
  jupiter:
    "Jupiter's Great Red Spot is a storm that has raged for at least 350 years and is larger than Earth.",
  saturn:
    'Saturn is the least dense planet — it would float on water. Its rings are mostly water ice and span 282,000 km.',
  uranus:
    'Uranus rotates on its side (98° axial tilt), likely from a massive ancient collision.',
  neptune:
    'Neptune has the fastest winds in the solar system — up to 2,100 km/h — despite being the farthest from the Sun.',
};

// Earth baseline values for comparison
const EARTH = {
  radius: 6371,
  mass: 5.97,
  gravity: 9.8,
  orbitalPeriod: 365.2,
  moons: 1,
};


// ─────────────────────────────────────────────────────────────────────────────
// Shimmer placeholder
// ─────────────────────────────────────────────────────────────────────────────
function Shimmer() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-lg">
      <div
        className="h-full w-full"
        style={{
          background:
            'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.6s infinite linear',
        }}
      />
      <style>{`@keyframes shimmer { from { background-position: 200% 0 } to { background-position: -200% 0 } }`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Gallery image card
// ─────────────────────────────────────────────────────────────────────────────
function GalleryCard({
  img,
  onClick,
}: {
  img: GalleryImage;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      className="flex-shrink-0 w-68 md:w-76 snap-start cursor-zoom-in group"
      onClick={onClick}
    >
      <div
        className="relative overflow-hidden rounded-lg bg-[rgba(255,255,255,0.04)] border border-[var(--panel-border)]"
        style={{ aspectRatio: '4/3' }}
      >
        {!loaded && !error && <Shimmer />}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest">
              
            </span>
          </div>
        )}

        <img
          src={img.src}
          alt={img.caption}
          className={cn(
            'w-full h-full object-cover transition-all duration-500 group-hover:scale-105',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.5)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <span className="font-mono text-[10px] text-white uppercase tracking-widest">
            View full
          </span>
        </div>
      </div>

      <p className="mt-2 font-serif text-sm text-[var(--text)] leading-snug line-clamp-2">
        {img.caption}
      </p>
      <p className="mt-1 font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
        {img.credit}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Fullscreen modal
// ─────────────────────────────────────────────────────────────────────────────
function ImageModal({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const img = images[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.92)] backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-5xl max-h-[85vh] w-full mx-4 flex flex-col"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={img.src}
          alt={img.caption}
          className="w-full max-h-[72vh] object-contain rounded-lg"
        />

        <div className="mt-4 flex justify-between items-start">
          <div>
            <p className="font-serif text-base text-[var(--text)]">{img.caption}</p>
            <p className="font-mono text-xs text-[var(--text-muted)] mt-1 tracking-widest uppercase">
              {img.credit}
            </p>
          </div>
          <span className="font-mono text-xs text-[var(--text-muted)] shrink-0 ml-4">
            {index + 1} / {images.length}
          </span>
        </div>
      </motion.div>

      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white hover:text-[var(--accent)] transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
      >
        <ChevronLeft size={22} />
      </button>

      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white hover:text-[var(--accent)] transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
      >
        <ChevronRight size={22} />
      </button>

      <button
        className="absolute top-4 right-4 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-[var(--text-muted)] hover:text-white transition-colors"
        onClick={onClose}
      >
        <X size={18} />
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-serif italic text-xl text-[var(--text-muted)] mb-6 border-b border-[var(--panel-border)] pb-2">
      {children}
    </h3>
  );
}

function DataCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass-panel p-4 md:p-5 rounded-lg flex flex-col justify-center">
      <span className="font-mono text-[10px] md:text-xs text-[var(--text-muted)] tracking-widest uppercase mb-1 md:mb-2">
        {label}
      </span>
      <span className="font-mono text-sm md:text-lg text-[var(--text)]">{value}</span>
    </div>
  );
}

function CompareBar({
  label,
  value,
  earthValue,
  unit,
}: {
  label: string;
  value: number;
  earthValue: number;
  unit: string;
}) {
  const ratio = value / earthValue;
  const pct = Math.min(100, (ratio / 3) * 100); // cap display at 3× Earth
  const isMore = ratio >= 1;

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="font-mono text-xs text-[var(--text-muted)] tracking-widest uppercase">
          {label}
        </span>
        <span className="font-mono text-xs text-[var(--text)]">
          {value.toLocaleString(undefined, { maximumFractionDigits: 1 })} {unit}
          <span className={cn('ml-2', isMore ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]')}>
            ({ratio.toFixed(2)}× Earth)
          </span>
        </span>
      </div>
      <div className="h-1 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: isMore
              ? 'linear-gradient(90deg, var(--accent), rgba(229,193,88,0.5))'
              : 'linear-gradient(90deg, #4488ff, rgba(68,136,255,0.4))',
          }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export function PlanetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { planets, bookmarks, toggleBookmark, setActivePlanet, settings } = useStore();

  const planet = planets.find((p) => p.id === id);

  const [modalIndex, setModalIndex] = useState<number | null>(null);

  useEffect(() => {
    if (planet) setActivePlanet(planet.id);
  }, [planet, setActivePlanet]);

  const gallery = planet ? PLANET_GALLERY[planet.id] ?? [] : [];
  const fact = planet ? PLANET_FACTS[planet.id] : '';

  // Preload all 3 gallery images immediately on page open, before user scrolls
  useEffect(() => {
    gallery.forEach((img) => {
      const preloader = new Image();
      preloader.src = img.src;
    });
  }, [planet?.id]);

  const openModal = useCallback((i: number) => setModalIndex(i), []);
  const closeModal = useCallback(() => setModalIndex(null), []);
  const prevModal = useCallback(
    () =>
      setModalIndex((i) =>
        i !== null ? (i === 0 ? gallery.length - 1 : i - 1) : null
      ),
    [gallery.length]
  );
  const nextModal = useCallback(
    () =>
      setModalIndex((i) =>
        i !== null ? (i === gallery.length - 1 ? 0 : i + 1) : null
      ),
    [gallery.length]
  );

  if (!planet) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p className="font-mono text-[var(--text-muted)]">ERR: Telemetry unavailable.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-[var(--accent)] underline"
        >
          Return to Observatory
        </button>
      </div>
    );
  }

  const isBookmarked = bookmarks.includes(planet.id);
  const isImperial = settings.units === 'imperial';

  function fmt(
    val: number,
    type: 'distance' | 'gravity' | 'velocity' | 'density' | 'mass'
  ) {
    if (!val) return 'N/A';
    const v =
      type === 'distance' || type === 'velocity'
        ? isImperial
          ? val * 0.621371
          : val
        : type === 'gravity'
          ? isImperial
            ? val * 3.28084
            : val
          : val;

    return v.toLocaleString(undefined, {
      maximumFractionDigits: type === 'gravity' ? 2 : 1,
    });
  }

  const AU_MAP: Record<string, string> = {
    mercury: '0.39',
    venus: '0.72',
    earth: '1.00',
    mars: '1.52',
    jupiter: '5.20',
    saturn: '9.58',
    uranus: '19.2',
    neptune: '30.1',
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      
      {/* ── Full-Screen Data Panel ── */}
      {/* Notice we changed w-1/2 to w-full so it takes up the whole screen */}
      <div className="w-full h-full overflow-y-auto p-6 md:p-12 xl:p-16">
        <div className="max-w-4xl mx-auto"> {/* Made this a bit wider (max-w-4xl) for full screen */}
          
          {/* We moved the Back button here so you don't lose it! */}
          <button
            onClick={() => navigate('/')}
            className="mb-8 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-[var(--text-muted)] hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Header */}
          <header className="flex justify-between items-start mb-12">
            <div>
              <h4 className="font-mono text-[var(--accent)] text-sm tracking-widest uppercase mb-2">
                INDEX #{planet.orderFromSun.toString().padStart(2, '0')} · {AU_MAP[planet.id]} AU
              </h4>
              <h1 className="text-5xl md:text-7xl font-light tracking-tight">{planet.name}</h1>
            </div>

            <button
              onClick={() => toggleBookmark(planet.id)}
              className={cn(
                'p-3 rounded-full border transition-all mt-2',
                isBookmarked
                  ? 'bg-[var(--accent)] border-[var(--accent)] text-[#030408]'
                  : 'glass-panel text-[var(--text-muted)] hover:text-white'
              )}
            >
              {isBookmarked ? <BookmarkCheck size={24} /> : <BookmarkPlus size={24} />}
            </button>
          </header>

          {/* Overview */}
          <section className="mb-12">
            <SectionHeader>Overview</SectionHeader>
            <p className="font-serif text-lg leading-relaxed text-[var(--text)]">
              {planet.description}
            </p>
          </section>

          {/* Did you know */}
          {fact && (
            <div className="mb-12 border-l-2 border-[var(--accent)] pl-5">
              <p className="font-mono text-xs text-[var(--accent)] tracking-widest uppercase mb-2">
                Did You Know
              </p>
              <p className="font-serif text-base leading-relaxed text-[var(--text-muted)] italic">
                {fact}
              </p>
            </div>
          )}

          {/* Primary Telemetry */}
          <section className="mb-12">
            <SectionHeader>Primary Telemetry</SectionHeader>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <DataCard
                label={`Radius (${isImperial ? 'mi' : 'km'})`}
                value={fmt(planet.radius, 'distance')}
              />
              <DataCard
                label={`Gravity (${isImperial ? 'ft/s²' : 'm/s²'})`}
                value={fmt(planet.gravity, 'gravity')}
              />
              <DataCard label="Mass (×10²⁴ kg)" value={fmt(planet.mass, 'mass')} />
              <DataCard label="Density (g/cm³)" value={fmt(planet.density, 'density')} />
              <DataCard
                label={`Escape Vel. (${isImperial ? 'mi/s' : 'km/s'})`}
                value={fmt(planet.escapeVelocity, 'velocity')}
              />
              <DataCard label="Natural Satellites" value={`${planet.moons}`} />
            </div>
          </section>

          {/* Compared to Earth */}
          <section className="mb-12">
            <SectionHeader>Compared to Earth</SectionHeader>
            <CompareBar
              label="Radius"
              value={planet.radius}
              earthValue={EARTH.radius}
              unit={isImperial ? 'mi' : 'km'}
            />
            <CompareBar
              label="Gravity"
              value={planet.gravity}
              earthValue={EARTH.gravity}
              unit={isImperial ? 'ft/s²' : 'm/s²'}
            />
            <CompareBar
              label="Orbital Period"
              value={planet.orbitalPeriod}
              earthValue={EARTH.orbitalPeriod}
              unit="days"
            />
            <CompareBar
              label="Satellites"
              value={planet.moons || 0}
              earthValue={Math.max(1, planet.moons)}
              unit="moons"
            />
          </section>

          {/* Orbital Dynamics */}
          <section className="mb-12">
            <SectionHeader>Orbital Dynamics</SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DataCard
                label="Orbital Period (Earth Days)"
                value={planet.orbitalPeriod?.toLocaleString() ?? 'N/A'}
              />
              <DataCard
                label="Rotation Period (Hours)"
                value={
                  planet.rotationPeriod
                    ? Math.abs(planet.rotationPeriod).toLocaleString() +
                      (planet.rotationPeriod < 0 ? ' ↺ retrograde' : '')
                    : 'N/A'
                }
              />
              <DataCard label="Distance from Sun" value={`${AU_MAP[planet.id]} AU`} />
              <DataCard label="Order from Sun" value={`#${planet.orderFromSun}`} />
            </div>
          </section>

          {/* Atmosphere */}
          <section className="mb-12">
            <SectionHeader>Atmospheric Profile</SectionHeader>
            <div className="glass-panel p-6 rounded-lg">
              <span className="font-mono text-sm tracking-widest uppercase text-[var(--accent)] block mb-2">
                Composition
              </span>
              <span className="font-serif text-lg">{planet.atmosphere || 'None / Trace'}</span>
            </div>
          </section>

          {/* Gallery */}
          {gallery.length > 0 && (
            <section className="mb-16">
              <SectionHeader>Image Archive</SectionHeader>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar -mx-1 px-1">
                {gallery.map((img, i) => (
                  <GalleryCard key={i} img={img} onClick={() => openModal(i)} />
                ))}
              </div>
              <p className="mt-3 font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
                All imagery: public domain — NASA, ESA, Wikimedia Commons
              </p>
            </section>
          )}

          {/* Footer */}
          <footer className="font-mono text-xs text-[var(--text-muted)] flex justify-between border-t border-[var(--panel-border)] pt-6 pb-20 md:pb-0">
            <span>SOURCE: {planet.source}</span>
            <a
              href={`https://solarsystem.nasa.gov/planets/${planet.id}/overview/`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
            >
              NASA.GOV <ExternalLink size={10} />
            </a>
          </footer>
        </div>
      </div>

      {/* ── Image Modal ── */}
      <AnimatePresence>
        {modalIndex !== null && (
          <ImageModal
            images={gallery}
            index={modalIndex}
            onClose={closeModal}
            onPrev={prevModal}
            onNext={nextModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
