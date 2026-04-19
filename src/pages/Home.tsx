import { useEffect, useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { MutableRefObject } from 'react';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import { PlanetOrb, priorityPreload } from '../components/3d/PlanetOrb';
import { Planet } from '../data/planets';

// --- STEP 1: Updated Constants ---
const SPACING = 2.15;
const DEPTH_STEP = 1.25;
const FRONT_Z = 1.35;
const APPROACH = 7.5;
const CAROUSEL_SCALE_CENTER = 1.0;
const CAROUSEL_SCALE_NEAR = 0.62;
const CAROUSEL_SCALE_FAR = 0.44;
const CAROUSEL_PLANET_SCALE = 0.88;
const MIN_CLICK_MS = 140;

// Added type for the new CarouselScene
type CarouselMode = 'background' | 'focused';

interface SharedRefs {
  currentIndex: MutableRefObject<number>;
  hoveredIndex: MutableRefObject<number>;
  totalPlanets: number;
}

function expApproach(current: number, target: number, speed: number, dt: number) {
  return target + (current - target) * Math.exp(-speed * dt);
}

function ClickSphere({ onClick, onHover, onUnhover }: {
  onClick: () => void;
  onHover: () => void;
  onUnhover: () => void;
}) {
  return (
    <mesh
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerEnter={(e) => {
        e.stopPropagation();
        onHover();
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        onUnhover();
        document.body.style.cursor = 'default';
      }}
    >
      <sphereGeometry args={[1.3, 8, 8]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

// --- STEP 2: Added activeIndex to prevent TS errors ---
interface CarouselPlanetProps {
  planet: Planet;
  planetIndex: number;
  refs: SharedRefs;
  onSelect: () => void;
  activeIndex?: number;
}

function CarouselPlanet({ planet, planetIndex, refs, onSelect }: CarouselPlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const currentPos = useRef(new THREE.Vector3());
  const targetPos = useRef(new THREE.Vector3());
  const scaleRef = useRef(1);
  const focusRef = useRef(0);

  useFrame((_, dt) => {
    if (!groupRef.current) return;

    const currentIndex = refs.currentIndex.current;
    const total = refs.totalPlanets;

    let offset = planetIndex - currentIndex;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    const targetFocus = offset === 0 ? 1 : 0;
    focusRef.current = expApproach(focusRef.current, targetFocus, 11, dt);

    const focusMix = focusRef.current;
    const lateralX = offset * SPACING;
    const backZ = -Math.abs(offset) * DEPTH_STEP - 2.5;

    targetPos.current.set(
      THREE.MathUtils.lerp(lateralX, 0, focusMix),
      0,
      THREE.MathUtils.lerp(backZ, FRONT_Z, focusMix)
    );

    currentPos.current.lerp(targetPos.current, 1 - Math.exp(-APPROACH * dt));
    groupRef.current.position.copy(currentPos.current);

    const targetScale = THREE.MathUtils.lerp(
      Math.max(CAROUSEL_SCALE_FAR, CAROUSEL_SCALE_NEAR - Math.abs(offset) * 0.05),
      CAROUSEL_SCALE_CENTER,
      focusMix
    );
    scaleRef.current = expApproach(scaleRef.current, targetScale, 10, dt);
    groupRef.current.scale.setScalar(scaleRef.current);

    groupRef.current.rotation.y = expApproach(groupRef.current.rotation.y, offset * -0.18, 7.5, dt);
    groupRef.current.renderOrder = offset === 0 ? 10 : 0;
  });

  return (
    <group ref={groupRef}>
      <PlanetOrb
        planetId={planet.id}
        primaryColor={planet.colorPrimary}
        secondaryColor={planet.colorSecondary}
        isFocused={planetIndex === refs.currentIndex.current}
        carouselScale={CAROUSEL_PLANET_SCALE} // Using your new constant here!
      />
      <ClickSphere
        onClick={onSelect}
        onHover={() => {
          refs.hoveredIndex.current = planetIndex;
        }}
        onUnhover={() => {
          if (refs.hoveredIndex.current === planetIndex) refs.hoveredIndex.current = -1;
        }}
      />
    </group>
  );
}

function CanvasColorPipeline() {
  const { gl } = useThree();

  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1;
  }, [gl]);

  return null;
}

// --- STEP 3: Replaced CarouselLayer with CarouselScene ---
function CarouselScene({
  planets,
  sharedRefs,
  activeIndex,
  onSelectPlanet,
  mode,
}: {
  planets: Planet[];
  sharedRefs: SharedRefs;
  activeIndex: number;
  onSelectPlanet: (index: number) => void;
  mode: CarouselMode;
}) {
  const visiblePlanets = planets
    .map((planet, index) => ({ planet, index }))
    .filter(({ index }) => (mode === 'background' ? index !== activeIndex : index === activeIndex));

  const isBackground = mode === 'background';

  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 48 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <CanvasColorPipeline />
      <ambientLight intensity={isBackground ? 0.07 : 0.11} />
      <directionalLight position={[6, 3, 4]} intensity={isBackground ? 1.85 : 2.7} />
      <directionalLight position={[-4, -2, -3]} intensity={isBackground ? 0.12 : 0.22} color="#112244" />

      {visiblePlanets.map(({ planet, index }) => (
        <CarouselPlanet
          key={planet.id}
          planet={planet}
          planetIndex={index}
          activeIndex={activeIndex}
          refs={sharedRefs}
          onSelect={() => onSelectPlanet(index)}
        />
      ))}

      <Environment preset="night" />
      <SceneCleanup />
    </Canvas>
  );
}

function SceneCleanup() {
  const { gl } = useThree();

  useEffect(() => {
    return () => {
      gl.domElement.style.cursor = 'default';
      document.body.style.cursor = 'default';
    };
  }, [gl]);

  return null;
}

export function Home() {
  const navigate = useNavigate();
  const { planets, activePlanetId, setActivePlanet, settings } = useStore();

  const [currentIndex, setCurrentIndex] = useState(
    () => Math.max(0, planets.findIndex((p) => p.id === activePlanetId))
  );

  const currentIndexRef = useRef(currentIndex);
  const hoveredIndexRef = useRef(-1);
  const lastClickRef = useRef(0);

// Kick off prioritised texture loading whenever the active planet changes
  useEffect(() => {
    priorityPreload(planets[currentIndex]?.id ?? 'earth');
  }, [currentIndex, planets]);

  
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => { 
    const nextIndex = planets.findIndex((p) => p.id === activePlanetId); 
    if (nextIndex >= 0 && nextIndex !== currentIndex) { 
      setCurrentIndex(nextIndex); 
    } 
  }, [activePlanetId, currentIndex, planets]);

  const goTo = useCallback( 
    (idx: number) => { 
      const now = Date.now(); 
      if (now - lastClickRef.current < MIN_CLICK_MS) return; 
      lastClickRef.current = now; 

      setCurrentIndex(idx); 
      setActivePlanet(planets[idx]?.id || 'earth'); 
    }, 
    [planets, setActivePlanet] 
  );

  const prevPlanet = useCallback(
    () => goTo(currentIndexRef.current === 0 ? planets.length - 1 : currentIndexRef.current - 1),
    [goTo, planets.length]
  );

  const nextPlanet = useCallback(
    () => goTo(currentIndexRef.current === planets.length - 1 ? 0 : currentIndexRef.current + 1),
    [goTo, planets.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevPlanet();
      if (e.key === 'ArrowRight') nextPlanet();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nextPlanet, prevPlanet]);

  if (planets.length === 0) return null;

  const activePlanet = planets[currentIndex];
  const sharedRefs: SharedRefs = {
    currentIndex: currentIndexRef,
    hoveredIndex: hoveredIndexRef,
    totalPlanets: planets.length,
  };

  // --- STEP 4: Updated JSX Layout ---
  return (
    <div className="relative isolate min-h-[100svh] w-full overflow-hidden bg-[#030408] pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
      <div className="absolute inset-0">
        
        {/* Background Blurred Layer */}
        <div
          className="absolute inset-0 z-0 pointer-events-auto"
          style={{
            filter: 'blur(14px) brightness(0.52) contrast(0.9) saturate(0.82)',
            transform: 'scale(1.03)',
            opacity: 0.96,
          }}
        >
          <CarouselScene
            planets={planets}
            sharedRefs={sharedRefs}
            activeIndex={currentIndex}
            onSelectPlanet={goTo}
            mode="background"
          />
        </div>

        {/* Focused Foreground Layer */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <CarouselScene
            planets={planets}
            sharedRefs={sharedRefs}
            activeIndex={currentIndex}
            onSelectPlanet={goTo}
            mode="focused"
          />
        </div>
      </div>

      {/* Navigation Buttons Container */}
      <div className="absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-3 pointer-events-none sm:px-5 md:px-8 lg:px-10">
        <button
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full glass-panel text-[var(--accent)] transition-all hover:bg-[rgba(229,193,88,0.1)] md:h-16 md:w-16"
          onClick={prevPlanet}
          aria-label="Previous planet"
        >
          <ChevronLeft size={32} strokeWidth={1} />
        </button>
        <button
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full glass-panel text-[var(--accent)] transition-all hover:bg-[rgba(229,193,88,0.1)] md:h-16 md:w-16"
          onClick={nextPlanet}
          aria-label="Next planet"
        >
          <ChevronRight size={32} strokeWidth={1} />
        </button>
      </div>

      {/* Title & Telemetry */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePlanet.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={
            settings.reducedMotion
              ? { duration: 0 }
              : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
          }
          className="absolute bottom-10 z-40 flex w-full max-w-4xl flex-col items-center px-6 text-center md:bottom-16 left-1/2 -translate-x-1/2"
        >
          <h1 className="mb-2 text-4xl font-sans uppercase tracking-widest md:text-6xl">
            {activePlanet.name}
          </h1>
          <div className="mb-8 flex gap-4 font-mono text-sm uppercase tracking-widest text-[var(--text-muted)] md:gap-8 md:text-base">
            <span>R: {activePlanet.radius.toLocaleString()} KM</span>
            <span className="hidden sm:inline">|</span>
            <span>M: {activePlanet.moons} Moons</span>
            <span className="hidden sm:inline">|</span>
            <span>O: {activePlanet.orbitalPeriod} D</span>
          </div>

          <button
            onClick={() => navigate(`/planet/${activePlanet.id}`)}
            className="group flex items-center gap-3 rounded-full glass-panel px-8 py-3 transition-all duration-300 hover:bg-[var(--accent)] hover:text-[#030408] pointer-events-auto"
          >
            <span className="font-mono text-sm uppercase tracking-widest">Full Telemetry</span>
            <Info size={16} className="group-hover:text-[#030408]" />
          </button>
        </motion.div>
      </AnimatePresence>

      {/* Bottom Paging Dots */}
      <div className="absolute bottom-4 z-40 flex gap-2 md:bottom-6 left-1/2 -translate-x-1/2">
        {planets.map((p, i) => (
          <button
            key={p.id}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 pointer-events-auto ${
              i === currentIndex
                ? 'h-2 w-6 bg-[var(--accent)]'
                : 'h-2 w-2 bg-[var(--text-muted)] opacity-40 hover:opacity-70'
            }`}
            aria-label={`Go to ${p.name}`}
          />
        ))}
      </div>
    </div>
  );
}
