export type PlanetId =
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune';

export interface GalleryImage {
  src: string;
  alt: string;
  credit: string;
}

// import.meta.env.BASE_URL is injected by Vite at build time.
// In dev it's "/", on GitHub Pages it's "/astrolume/" — paths resolve correctly either way.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const PLANET_TEXTURES = {
  mercury: { map: `${base}/textures/planets/mercury/main.jpg`, tilt: 0.03 },
  venus:   { map: `${base}/textures/planets/venus/main.jpg`,   tilt: 0.046 },
  earth:   { map: `${base}/textures/planets/earth/main.jpg`,
             clouds: `${base}/textures/planets/earth/clouds.png`, tilt: 0.408 },
  mars:    { map: `${base}/textures/planets/mars/main.jpg`,    tilt: 0.44 },
  jupiter: { map: `${base}/textures/planets/jupiter/main.jpg`, tilt: 0.054 },
  saturn:  { map: `${base}/textures/planets/saturn/main.jpg`,
             ring: `${base}/textures/planets/saturn/rings.png`, tilt: 0.467 },
  uranus:  { map: `${base}/textures/planets/uranus/main.jpg`,  tilt: 1.706 },
  neptune: { map: `${base}/textures/planets/neptune/main.jpg`, tilt: 0.494 },
};

export const PLANET_GALLERY: Record<string, GalleryImage[]> = {
  mercury: [
    { src: `${base}/assets/planets/mercury/true-color.jpg`,   alt: 'Mercury in true color — MESSENGER',                              credit: 'NASA/JHUAPL/CIW' },
    { src: `${base}/assets/planets/mercury/globe-mosaic.jpg`, alt: 'Full-globe color mosaic from MESSENGER orbital data',            credit: 'NASA/JHUAPL/CIW' },
    { src: `${base}/assets/planets/mercury/caloris-basin.jpg`,alt: 'Caloris Basin in enhanced color — largest impact crater on Mercury', credit: 'NASA/JHUAPL/CIW' },
  ],
  venus: [
    { src: `${base}/assets/planets/venus/true-color.jpg`, alt: 'Venus in true color — Mariner 10',              credit: 'NASA/JPL-Caltech' },
    { src: `${base}/assets/planets/venus/globe.jpg`,      alt: 'Magellan radar global map of Venus surface',    credit: 'NASA/JPL' },
    { src: `${base}/assets/planets/venus/uv-clouds.jpg`,  alt: 'Venus cloud patterns in ultraviolet',           credit: 'NASA/JPL' },
  ],
  earth: [
    { src: `${base}/assets/planets/earth/blue-marble.jpg`,   alt: '"The Blue Marble" — Earth from Apollo 17',              credit: 'NASA/Apollo 17 crew' },
    { src: `${base}/assets/planets/earth/pale-blue-dot.jpg`, alt: '"Pale Blue Dot" (2020 Revision) — Earth from 6 billion km', credit: 'NASA/JPL-Caltech' },
    { src: `${base}/assets/planets/earth/from-iss.jpg`,      alt: 'Earth from the ISS — Clouds over the ocean',            credit: 'NASA/ISS' },
  ],
  mars: [
    { src: `${base}/assets/planets/mars/true-color.jpg`,        alt: 'Mars in true color — ESA Rosetta spacecraft',               credit: 'ESA/MPS/UPD/LAM/IAA/RSSD/INTA/UPM/DASP/IDA' },
    { src: `${base}/assets/planets/mars/valles-marineris.jpg`,  alt: 'Valles Marineris — largest canyon in the solar system',     credit: 'NASA/JPL-Caltech/USGS' },
    { src: `${base}/assets/planets/mars/olympus-mons.jpg`,      alt: 'Olympus Mons — tallest volcano in the solar system (Viking 1)', credit: 'NASA' },
  ],
  jupiter: [
    { src: `${base}/assets/planets/jupiter/great-red-spot.jpg`, alt: 'Jupiter with Great Red Spot — Hubble Space Telescope',   credit: 'NASA/ESA/A. Simon (GSFC)' },
    { src: `${base}/assets/planets/jupiter/new-horizons.jpg`,   alt: 'Jupiter and Io — New Horizons, 2007',                    credit: 'NASA/JHUAPL/SwRI' },
    { src: `${base}/assets/planets/jupiter/voyager-1.jpg`,      alt: "Voyager 1 portrait of Jupiter's cloud bands, 1979",      credit: 'NASA/JPL' },
  ],
  saturn: [
    { src: `${base}/assets/planets/saturn/equinox.jpg`,       alt: 'Saturn at equinox — Cassini spacecraft, 2009',    credit: 'NASA/JPL/Space Science Institute' },
    { src: `${base}/assets/planets/saturn/natural-color.jpg`, alt: 'Natural color view of Saturn — Cassini Orbiter',  credit: 'Hubble Heritage Team (AURA/STScI/NASA/ESA)' },
    { src: `${base}/assets/planets/saturn/rings.jpg`,         alt: 'Ring structure close-up in high resolution',      credit: 'NASA/JPL/Space Science Institute' },
  ],
  uranus: [
    { src: `${base}/assets/planets/uranus/natural-color.jpg`, alt: 'Uranus in natural color — Voyager 2, 1986',                     credit: 'NASA/JPL-Caltech' },
    { src: `${base}/assets/planets/uranus/jwst-rings.png`,    alt: 'Uranus ring system and moons — James Webb Space Telescope',     credit: 'NASA/ESA/CSA/STScI' },
    { src: `${base}/assets/planets/uranus/hubble-aurora.jpg`, alt: 'Uranus showing faint cloud bands — Hubble Space Telescope',     credit: 'NASA/JPL/STScI' },
  ],
  neptune: [
    { src: `${base}/assets/planets/neptune/voyager-2.jpg`,      alt: 'Neptune in natural color — Voyager 2, 1989',                  credit: 'NASA/JPL-Caltech' },
    { src: `${base}/assets/planets/neptune/great-dark-spot.jpg`,alt: 'Close-up of the Great Dark Spot',                             credit: 'NASA/JPL-Caltech' },
    { src: `${base}/assets/planets/neptune/jwst.png`,           alt: 'Neptune, rings, and moons in near-infrared — JWST',           credit: 'NASA/ESA/CSA/STScI' },
  ],
};
