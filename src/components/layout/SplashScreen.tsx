import { motion } from 'motion/react';

export function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[200] overflow-hidden bg-[radial-gradient(circle_at_top,#11162a_0%,#05070d_40%,#020308_100%)] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="absolute inset-0 opacity-70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(116, 140, 255, 0.18), transparent 30%), radial-gradient(circle at 80% 30%, rgba(229, 193, 88, 0.14), transparent 28%), radial-gradient(circle at 50% 80%, rgba(75, 198, 255, 0.12), transparent 26%)',
        }}
      />

      <motion.div
        className="absolute inset-0 opacity-35 mix-blend-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 20px 30px, rgba(255,255,255,0.95), transparent 2px), radial-gradient(1px 1px at 80px 120px, rgba(255,255,255,0.8), transparent 2px), radial-gradient(2px 2px at 140px 60px, rgba(255,255,255,0.75), transparent 2px), radial-gradient(1px 1px at 220px 180px, rgba(255,255,255,0.7), transparent 2px)',
          backgroundSize: '260px 260px',
        }}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          className="relative mb-10 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="absolute h-40 w-40 rounded-full border border-white/10 bg-white/5 blur-[1px]"
            animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.75, 0.45] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute h-56 w-56 rounded-full border border-[rgba(229,193,88,0.18)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="h-28 w-28 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff4c4_0%,#e5c158_28%,#6d4f14_100%)] shadow-[0_0_90px_rgba(229,193,88,0.35)]"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <motion.p
          className="mb-2 text-[10px] uppercase tracking-[0.45em] text-white/45"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
        >
          Loading the cosmos
        </motion.p>
        <motion.h1
          className="text-5xl uppercase tracking-[0.25em] text-white sm:text-6xl md:text-7xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
        >
          Astrolume
        </motion.h1>
        <motion.p
          className="mt-4 max-w-md text-sm leading-relaxed text-white/60 sm:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
        >
          Preparing planetary textures, lighting, and explorer data.
        </motion.p>

        <div className="mt-10 h-px w-64 max-w-[70vw] overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full w-1/2 bg-[linear-gradient(90deg,transparent,rgba(229,193,88,0.95),transparent)]"
            initial={{ x: '-20%' }}
            animate={{ x: '140%' }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>

      <motion.div
        className="absolute bottom-6 left-0 right-0 text-center text-[11px] uppercase tracking-[0.45em] text-white/55"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.18 }}
      >
        BIOWESS 2026
      </motion.div>
    </motion.div>
  );
}
