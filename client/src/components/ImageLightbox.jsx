import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ImageLightbox — fullscreen photo viewer.
 * Props:
 *   images: string[]
 *   open: boolean
 *   startIndex: number
 *   onClose: () => void
 */
const ImageLightbox = ({ images = [], open, startIndex = 0, onClose }) => {
  const [current, setCurrent] = useState(startIndex);

  // reset when opened with new startIndex
  React.useEffect(() => { if (open) setCurrent(startIndex); }, [open, startIndex]);

  const prev = (e) => { e.stopPropagation(); setCurrent(i => (i - 1 + images.length) % images.length); };
  const next = (e) => { e.stopPropagation(); setCurrent(i => (i + 1) % images.length); };

  // Keyboard navigation
  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'ArrowLeft')  setCurrent(i => (i - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setCurrent(i => (i + 1) % images.length);
      if (e.key === 'Escape')     onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, images.length, onClose]);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.95)' }}
          onClick={onClose}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold z-10 hover:bg-white/10 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >✕</button>

          {/* Counter */}
          <span className="absolute top-5 left-1/2 -translate-x-1/2 text-sm text-white/60 font-medium">
            {current + 1} / {images.length}
          </span>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg hover:bg-white/15 transition-colors z-10"
            >‹</button>
          )}

          {/* Main image */}
          <motion.img
            key={current}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            src={images[current]}
            alt={`Photo ${current + 1}`}
            className="max-h-[88vh] max-w-[90vw] object-contain rounded-xl"
            onClick={e => e.stopPropagation()}
            draggable={false}
          />

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg hover:bg-white/15 transition-colors z-10"
            >›</button>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setCurrent(i); }}
                  className="w-12 h-8 rounded-md overflow-hidden border-2 transition-all duration-150"
                  style={{ borderColor: i === current ? '#E8003D' : 'transparent', opacity: i === current ? 1 : 0.5 }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageLightbox;
