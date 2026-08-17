import { useEffect } from 'react';

export default function GalleryLightbox({ title, photos, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    }
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose, onPrev, onNext]);

  const photo = photos[index];

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" aria-label="Close" onClick={onClose}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>

      {photos.length > 1 && (
        <button
          className="lightbox-nav-btn prev"
          aria-label="Previous photo"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6 9 12l6 6" /></svg>
        </button>
      )}

      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox-image-wrap">
          <img src={photo.url} alt={title} />
        </div>
        <div className="lightbox-caption">{title} &middot; {index + 1} / {photos.length}</div>
      </div>

      {photos.length > 1 && (
        <button
          className="lightbox-nav-btn next"
          aria-label="Next photo"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      )}
    </div>
  );
}
