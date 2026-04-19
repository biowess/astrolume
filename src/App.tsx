import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Shell } from './components/layout/Shell';
import { SplashScreen } from './components/layout/SplashScreen';
import { Home } from './pages/Home';
import { PlanetDetail } from './pages/PlanetDetail';
import { Bookmarks } from './pages/Bookmarks';
import { Docs } from './pages/Docs';
import { About } from './pages/About';
import { Settings } from './pages/Settings';
import { useStore } from './store/useStore';
import { preloadPlanetTextures } from './components/3d/PlanetOrb';

function AppRoutes() {
  const location = useLocation();

  return (
    <Shell>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          className="relative min-h-full w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/planet/:id" element={<PlanetDetail />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/documentation" element={<Docs />} />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Shell>
  );
}

export default function App() {
  const fetchPlanets = useStore((state) => state.fetchPlanets);
  const [bootReady, setBootReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await Promise.allSettled([
          fetchPlanets(), 
          preloadPlanetTextures(),
          // 👇 THIS IS THE NEW LINE WE ADDED 👇
          new Promise((resolve) => setTimeout(resolve, 3500))
        ]);
      } finally {
        if (!cancelled) setBootReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fetchPlanets]);

  return (
    <BrowserRouter>
      {bootReady && <AppRoutes />}
      <AnimatePresence>
        {!bootReady && <SplashScreen key="splash" />}
      </AnimatePresence>
    </BrowserRouter>
  );
}