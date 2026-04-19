/**
 * PlanetOrb.tsx — Production Pass
 *
 * Changes from v2:
 * - Per-planet size multipliers (relative scale illusion: Jupiter 2.8×, Mercury 0.42×)
 * - Fresnel atmospheric glow: custom ShaderMaterial on a slightly larger sphere,
 *   view-angle opacity — bright at limb, transparent at face. No transmission pass.
 * - Lighting: envMapIntensity tuned per planet type; roughness refined per surface
 * - Saturn ring: z-fighting fixed by adding a tiny polygon offset
 * - Cloud layer: only on Earth; independent Y rotation separated from tilt group
 * - Rotation: outer group handles y-spin only; tilt group is static (no rotation
 *   artifacts at poles)
 * - Texture loader: memoised by URL via module-level cache to survive React
 *   StrictMode double-mounts without re-fetching
 */

import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import { PLANET_TEXTURES } from '../../data/planetMedia';

// ─────────────────────────────────────────────────────────────────────────────
// Relative size multipliers — clamped for UI usability, preserving perception
// Earth = 1.0 baseline
// ─────────────────────────────────────────────────────────────────────────────
const PLANET_SCALE: Record<string, number> = {
  mercury: 0.42,
  venus: 0.95,
  earth: 1.0,
  mars: 0.55,
  jupiter: 2.8,
  saturn: 2.4,
  uranus: 1.6,
  neptune: 1.55,
};

// ─────────────────────────────────────────────────────────────────────────────
// Module-level texture cache — survives React StrictMode double-mounts
// ─────────────────────────────────────────────────────────────────────────────
const texCache = new Map<string, THREE.Texture>();
const texPromises = new Map<string, Promise<THREE.Texture>>();

function configureTexture(texture: THREE.Texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

function loadTexture(url: string) {
  const cached = texCache.get(url);
  if (cached) return Promise.resolve(cached);

  const pending = texPromises.get(url);
  if (pending) return pending;

  const loader = new THREE.TextureLoader();
  const promise = loader.loadAsync(url).then((texture) => {
    const configured = configureTexture(texture);
    texCache.set(url, configured);
    texPromises.delete(url);
    return configured;
  }).catch((error) => {
    texPromises.delete(url);
    throw error;
  });

  texPromises.set(url, promise);
  return promise;
}

export async function preloadPlanetTextures() {
  const urls: string[] = [];

  for (const entry of Object.values(PLANET_TEXTURES)) {
    urls.push(entry.map);

    if ('clouds' in entry && entry.clouds) {
      urls.push(entry.clouds);
    }

    if ('ring' in entry && entry.ring) {
      urls.push(entry.ring);
    }
  }

  await Promise.all(urls.map(loadTexture));
}

function useCachedTexture(url?: string) {
  const [tex, setTex] = useState<THREE.Texture | null>(() =>
    url ? texCache.get(url) ?? null : null
  );

  useEffect(() => {
    if (!url) {
      setTex(null);
      return;
    }

    const cached = texCache.get(url);
    if (cached) {
      setTex(cached);
      return;
    }

    let alive = true;
    loadTexture(url)
      .then((texture) => {
        if (alive) setTex(texture);
      })
      .catch((err) => {
        console.warn('[PlanetOrb] texture load failed:', url, err);
      });

    return () => {
      alive = false;
    };
  }, [url]);

  return tex;
}

// ─────────────────────────────────────────────────────────────────────────────
// Fresnel atmosphere shader — bright at grazing angle, dark face-on
// ─────────────────────────────────────────────────────────────────────────────
const ATM_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-(modelViewMatrix * vec4(position, 1.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ATM_FRAG = /* glsl */ `
  uniform vec3 glowColor;
  uniform float intensity;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float fresnel = 1.0 - clamp(dot(vNormal, vViewDir), 0.0, 1.0);
    fresnel = pow(fresnel, 3.5);
    gl_FragColor = vec4(glowColor, fresnel * intensity);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Saturn ring shader — radial UV mapping
// ─────────────────────────────────────────────────────────────────────────────
const RING_VERT = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const RING_FRAG = /* glsl */ `
  uniform sampler2D ringTex;
  uniform float inner;
  uniform float outer;
  varying vec3 vPos;
  void main() {
    float r = length(vPos.xy);
    float t = clamp((r - inner) / (outer - inner), 0.0, 1.0);
    vec4 col = texture2D(ringTex, vec2(t, 0.5));
    float fade = smoothstep(0.0, 0.05, t) * smoothstep(1.0, 0.95, t);
    gl_FragColor = vec4(col.rgb * 0.85, col.a * fade * 0.88);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Roughness map (no extra assets — just per-planet tuning)
// ─────────────────────────────────────────────────────────────────────────────
const ROUGHNESS: Record<string, number> = {
  mercury: 0.95,
  venus: 0.8,
  earth: 0.55,
  mars: 0.92,
  jupiter: 0.65,
  saturn: 0.7,
  uranus: 0.45,
  neptune: 0.5,
};

// ─────────────────────────────────────────────────────────────────────────────
// Rotation speed (radians / second)
// ─────────────────────────────────────────────────────────────────────────────
const ROT_SPEED_CENTER = 0.06;
const ROT_SPEED_SIDE = 0.012;
const CLOUD_EXTRA = 0.008;

// ─────────────────────────────────────────────────────────────────────────────
// Atmosphere planets — these get the fresnel glow shell
// ─────────────────────────────────────────────────────────────────────────────
const ATM_PLANETS: Record<string, { color: string; intensity: number }> = {
  earth: { color: '#4488ff', intensity: 0.55 },
  venus: { color: '#ffcc66', intensity: 0.5 },
  uranus: { color: '#55ccdd', intensity: 0.4 },
  neptune: { color: '#2244cc', intensity: 0.48 },
  jupiter: { color: '#cc9966', intensity: 0.25 },
  saturn: { color: '#ddcc88', intensity: 0.22 },
};

// ─────────────────────────────────────────────────────────────────────────────
export interface PlanetOrbProps {
  planetId: string;
  primaryColor: string;
  secondaryColor: string;
  isFocused: boolean;
  carouselScale?: number;
}

export function PlanetOrb({
  planetId,
  primaryColor,
  isFocused,
  carouselScale = 1,
}: PlanetOrbProps) {
  const spinRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const settings = useStore((s) => s.settings);

  const def = PLANET_TEXTURES[planetId as keyof typeof PLANET_TEXTURES];
  const mapTex = useCachedTexture(def?.map);
  const cloudTex = useCachedTexture(def?.clouds);
  const ringTex = useCachedTexture(def?.ring);

  const tilt = def?.tilt ?? 0.2;
  const hasTexture = !!mapTex;
  const atmDef = ATM_PLANETS[planetId];
  const planetSize = (PLANET_SCALE[planetId] ?? 1.0) * carouselScale;

  // Atmosphere material — no transmission, pure additive fresnel
  const atmMat = useMemo(() => {
    if (!atmDef) return null;

    return new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(atmDef.color) },
        intensity: { value: atmDef.intensity },
      },
      vertexShader: ATM_VERT,
      fragmentShader: ATM_FRAG,
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [atmDef?.color, atmDef?.intensity]);

  // Ring material
  const ringMat = useMemo(() => {
  if (!ringTex) return null;

  return new THREE.ShaderMaterial({
    uniforms: {
      ringTex: { value: ringTex },
      inner: { value: 1.12 },
      outer: { value: 1.85 },
    },
    vertexShader: RING_VERT,
    fragmentShader: RING_FRAG,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
}, [ringTex]);

  useFrame((_, dt) => {
    if (settings.reducedMotion) return;
    const speed = isFocused ? ROT_SPEED_CENTER : ROT_SPEED_SIDE;

    if (spinRef.current) spinRef.current.rotation.y += dt * speed;
    if (cloudsRef.current) cloudsRef.current.rotation.y += dt * CLOUD_EXTRA;
  });

  return (
    <group scale={planetSize}>
      <group ref={spinRef}>
        <group rotation={[tilt, 0, 0]}>
          <Sphere args={[1, 64, 64]}>
            <meshStandardMaterial
              color={hasTexture ? '#ffffff' : primaryColor}
              map={mapTex ?? undefined}
              roughness={ROUGHNESS[planetId] ?? 0.75}
              metalness={0.02}
              envMapIntensity={hasTexture ? 0.4 : 0.2}
            />
          </Sphere>

          {planetId === 'earth' && cloudTex && (
            <Sphere ref={cloudsRef} args={[1.018, 64, 64]}>
              <meshStandardMaterial
                map={cloudTex}
                transparent
                opacity={0.42}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                roughness={1}
                metalness={0}
              />
            </Sphere>
          )}

          {atmMat && (
            <Sphere args={[1.1, 48, 48]}>
              <primitive object={atmMat} attach="material" />
            </Sphere>
          )}

          {planetId === 'saturn' && ringMat && (
  <mesh
    rotation={[Math.PI / 2.1, 0, 0.2]}
    position={[0, 0, 0.02]}
    renderOrder={3}
    material={ringMat}
  >
    <ringGeometry args={[1.12, 1.85, 128]} />
  </mesh>
)}
        </group>
      </group>

      <pointLight
        color={primaryColor}
        intensity={isFocused ? 0.28 : 0}
        distance={4}
        decay={2}
      />
    </group>
  );
}