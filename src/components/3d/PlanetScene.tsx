/**
 * PlanetScene.tsx — Detail page only
 * Used exclusively by PlanetDetail where exactly one Canvas is needed.
 */

import { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetOrb } from './PlanetOrb';
import { fitCameraToObject } from './fitCameraToObject';
import { cn } from '../../lib/utils';
import { Planet } from '../../data/planets';

interface PlanetSceneProps {
  planet: Planet;
  isFocused: boolean;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Color pipeline helper — MUST live inside Canvas
// ─────────────────────────────────────────────────────────────────────────────
function CanvasColorPipeline() {
  const { gl } = useThree();

  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1;
  }, [gl]);

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Inner component — must live inside <Canvas> so useThree works
// ─────────────────────────────────────────────────────────────────────────────
function AutoFramedPlanet({
  planet,
  isFocused,
}: {
  planet: Planet;
  isFocused: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, size } = useThree();

  // Re-frame whenever the planet changes or the canvas size changes
  useEffect(() => {
    if (!groupRef.current) return;

    const id = requestAnimationFrame(() => {
      if (!groupRef.current) return;
      fitCameraToObject(
        camera as THREE.PerspectiveCamera,
        groupRef.current,
        0.15
      );
    });

    return () => cancelAnimationFrame(id);
  }, [planet.id, camera, size.width, size.height]);

  return (
    <group ref={groupRef}>
      <PlanetOrb
        planetId={planet.id}
        primaryColor={planet.colorPrimary}
        secondaryColor={planet.colorSecondary}
        isFocused={isFocused}
        carouselScale={1}
      />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Public component
// ─────────────────────────────────────────────────────────────────────────────
export function PlanetScene({
  planet,
  isFocused,
  className,
}: PlanetSceneProps) {
  return (
    <div className={cn('w-full h-full', className)}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 46 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Color pipeline FIRST */}
        <CanvasColorPipeline />

        {/* Sun-like key */}
        <ambientLight intensity={0.10} />

        <directionalLight
          position={[6, 3, 4]}
          intensity={2.6}
          castShadow={false}
        />

        {/* Dim fill from shadow side */}
        <directionalLight
          position={[-4, -2, -3]}
          intensity={0.22}
          color="#112244"
        />

        <AutoFramedPlanet planet={planet} isFocused={isFocused} />

        <Environment preset="night" />
      </Canvas>
    </div>
  );
}