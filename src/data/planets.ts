export interface Planet {
  id: string;
  name: string;
  englishName: string;
  orderFromSun: number;
  radius: number; // km
  mass: number; // 10^24 kg
  gravity: number; // m/s^2
  density: number; // g/cm^3
  escapeVelocity: number; // km/s
  orbitalPeriod: number; // days
  rotationPeriod: number; // hours
  moons: number;
  atmosphere: string;
  description: string;
  colorPrimary: string;
  colorSecondary: string;
  source: string;
}

export const fallbackPlanets: Planet[] = [
  {
    id: "mercury",
    name: "Mercury",
    englishName: "Mercury",
    orderFromSun: 1,
    radius: 2439.7,
    mass: 0.330,
    gravity: 3.7,
    density: 5.427,
    escapeVelocity: 4.3,
    orbitalPeriod: 88,
    rotationPeriod: 1407.6,
    moons: 0,
    atmosphere: "Minimal (Sodium, Potassium)",
    description: "The smallest planet in our solar system and nearest to the Sun, Mercury is only slightly larger than Earth's Moon. From the surface of Mercury, the Sun would appear more than three times as large as it does when viewed from Earth.",
    colorPrimary: "#8c8c8c",
    colorSecondary: "#595959",
    source: "NASA Solar System Exploration",
  },
  {
    id: "venus",
    name: "Venus",
    englishName: "Venus",
    orderFromSun: 2,
    radius: 6051.8,
    mass: 4.87,
    gravity: 8.87,
    density: 5.243,
    escapeVelocity: 10.4,
    orbitalPeriod: 224.7,
    rotationPeriod: -5832.5,
    moons: 0,
    atmosphere: "Thick (Carbon Dioxide, Nitrogen)",
    description: "Venus is the second planet from the Sun and is Earth's closest planetary neighbor. It's one of the four inner, terrestrial planets, and it's often called Earth's twin because it's similar in size and density.",
    colorPrimary: "#d9a05b",
    colorSecondary: "#bf7b3f",
    source: "NASA Solar System Exploration",
  },
  {
    id: "earth",
    name: "Earth",
    englishName: "Earth",
    orderFromSun: 3,
    radius: 6371,
    mass: 5.97,
    gravity: 9.8,
    density: 5.514,
    escapeVelocity: 11.2,
    orbitalPeriod: 365.2,
    rotationPeriod: 24,
    moons: 1,
    atmosphere: "Nitrogen, Oxygen",
    description: "Our home planet is the third planet from the Sun, and the only place we know of so far that's inhabited by living things. While Earth is only the fifth largest planet in the solar system, it is the only world in our solar system with liquid water on the surface.",
    colorPrimary: "#2b82c9",
    colorSecondary: "#1f5f99",
    source: "NASA Solar System Exploration",
  },
  {
    id: "mars",
    name: "Mars",
    englishName: "Mars",
    orderFromSun: 4,
    radius: 3389.5,
    mass: 0.642,
    gravity: 3.71,
    density: 3.933,
    escapeVelocity: 5.0,
    orbitalPeriod: 687,
    rotationPeriod: 24.6,
    moons: 2,
    atmosphere: "Thin (Carbon Dioxide, Nitrogen, Argon)",
    description: "Mars is the fourth planet from the Sun – a dusty, cold, desert world with a very thin atmosphere. Mars is also a dynamic planet with seasons, polar ice caps, canyons, extinct volcanoes, and evidence that it was even more active in the past.",
    colorPrimary: "#c1440e",
    colorSecondary: "#e77d11",
    source: "NASA Solar System Exploration",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    englishName: "Jupiter",
    orderFromSun: 5,
    radius: 69911,
    mass: 1898,
    gravity: 24.79,
    density: 1.326,
    escapeVelocity: 59.5,
    orbitalPeriod: 4331,
    rotationPeriod: 9.9,
    moons: 95,
    atmosphere: "Hydrogen, Helium",
    description: "Jupiter has a long history of surprising scientists—all the way back to 1610 when Galileo Galilei found the first moons beyond Earth. That discovery changed the way we see the universe. Fifth in line from the Sun, Jupiter is, by far, the largest planet in the solar system.",
    colorPrimary: "#c88b3a",
    colorSecondary: "#a67c52",
    source: "NASA Solar System Exploration",
  },
  {
    id: "saturn",
    name: "Saturn",
    englishName: "Saturn",
    orderFromSun: 6,
    radius: 58232,
    mass: 568,
    gravity: 10.44,
    density: 0.687,
    escapeVelocity: 35.5,
    orbitalPeriod: 10747,
    rotationPeriod: 10.7,
    moons: 146,
    atmosphere: "Hydrogen, Helium",
    description: "Saturn is the sixth planet from the Sun and the second largest planet in our solar system. Adorned with a dazzling, complex system of icy rings, Saturn is unique in our solar neighborhood. The other giant planets have rings, but none are as spectacular.",
    colorPrimary: "#e3d599",
    colorSecondary: "#caba8c",
    source: "NASA Solar System Exploration",
  },
  {
    id: "uranus",
    name: "Uranus",
    englishName: "Uranus",
    orderFromSun: 7,
    radius: 25362,
    mass: 86.8,
    gravity: 8.69,
    density: 1.271,
    escapeVelocity: 21.3,
    orbitalPeriod: 30589,
    rotationPeriod: -17.2,
    moons: 28,
    atmosphere: "Hydrogen, Helium, Methane",
    description: "Uranus is the seventh planet from the Sun, and has the third-largest diameter in our solar system. It was the first planet found with the aid of a telescope. Uranus is very cold and windy. The ice giant is surrounded by 13 faint rings.",
    colorPrimary: "#4b70dd",
    colorSecondary: "#3b58b5",
    source: "NASA Solar System Exploration",
  },
  {
    id: "neptune",
    name: "Neptune",
    englishName: "Neptune",
    orderFromSun: 8,
    radius: 24622,
    mass: 102,
    gravity: 11.15,
    density: 1.638,
    escapeVelocity: 23.5,
    orbitalPeriod: 59800,
    rotationPeriod: 16.1,
    moons: 16,
    atmosphere: "Hydrogen, Helium, Methane",
    description: "Dark, cold, and whipped by supersonic winds, ice giant Neptune is the eighth and most distant planet in our solar system. More than 30 times as far from the Sun as Earth, Neptune is the only planet in our solar system not visible to the naked eye.",
    colorPrimary: "#3f54ba",
    colorSecondary: "#2b3c94",
    source: "NASA Solar System Exploration",
  }
];

export async function fetchPlanetsApi(): Promise<Planet[]> {
  try {
    const res = await fetch("https://api.le-systeme-solaire.net/rest/bodies?filter[]=isPlanet,eq,true");
    const data = await res.json();
    
    if (!data || !data.bodies) return fallbackPlanets;

    // Enhance fallback with API data (which is more precise but lacks nice descriptions)
    return fallbackPlanets.map(fb => {
      const apiBody = data.bodies.find((b: any) => b.englishName.toLowerCase() === fb.name.toLowerCase());
      if (apiBody) {
        return {
          ...fb,
          radius: apiBody.meanRadius || fb.radius,
          gravity: apiBody.gravity || fb.gravity,
          density: apiBody.density || fb.density,
          escapeVelocity: apiBody.escape || fb.escapeVelocity,
          moons: apiBody.moons ? apiBody.moons.length : fb.moons,
        };
      }
      return fb;
    });
  } catch (error) {
    console.error("Failed to fetch from API, using fallback data.");
    return fallbackPlanets;
  }
}
