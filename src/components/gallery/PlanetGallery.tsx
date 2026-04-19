import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface GalleryImage {
  src: string;
  alt: string;
  credit: string;
}

function GalleryCard({
  image,
  onClick,
}: {
  image: GalleryImage;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-shrink-0 w-72 md:w-80 snap-start text-left group"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5" style={{ aspectRatio: '4 / 3' }}>
        {!loaded && !failed && <div className="absolute inset-0 animate-pulse bg-white/5" />}

        {failed ? (
          <div className="absolute inset-0 grid place-items-center text-xs tracking-widest text-white/50">
            UNAVAILABLE
          </div>
        ) : (
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            decoding="async"
            className={cn(
              'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105',
              loaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        )}
      </div>

      <p className="mt-2 text-sm text-white/90 line-clamp-2">{image.alt}</p>
      <p className="mt-1 text-[10px] tracking-widest uppercase text-white/45">{image.credit}</p>
    </button>
  );
}

function FullscreenModal({
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
  const image = images[index];

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-5xl mx-4"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image.src}
          alt={image.alt}
          className="max-h-[78vh] w-full object-contain rounded-2xl"
        />

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-base text-white">{image.alt}</p>
            <p className="mt-1 text-xs tracking-widest uppercase text-white/50">{image.credit}</p>
          </div>
          <div className="text-xs text-white/50">
            {index + 1} / {images.length}
          </div>
        </div>
      </motion.div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 grid place-items-center"
      >
        <ChevronLeft size={18} />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 grid place-items-center"
      >
        <ChevronRight size={18} />
      </button>

      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 h-10 w-10 rounded-full bg-white/10 grid place-items-center"
      >
        <X size={18} />
      </button>
    </motion.div>
  );
}

export function PlanetGallery({
  images,
}: {
  images: GalleryImage[];
}) {
  const [index, setIndex] = useState<number | null>(null);

  const open = (i: number) => setIndex(i);
  const close = () => setIndex(null);

  const prev = () => setIndex((current) => (current === null ? null : (current === 0 ? images.length - 1 : current - 1)));
  const next = () => setIndex((current) => (current === null ? null : (current === images.length - 1 ? 0 : current + 1)));

  return (
    <>
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4">
        {images.map((image, i) => (
          <GalleryCard key={`${image.src}-${i}`} image={image} onClick={() => open(i)} />
        ))}
      </div>

      <AnimatePresence>
        {index !== null && (
          <FullscreenModal
            images={images}
            index={index}
            onClose={close}
            onPrev={prev}
            onNext={next}
          />
        )}
      </AnimatePresence>
    </>
  );
}