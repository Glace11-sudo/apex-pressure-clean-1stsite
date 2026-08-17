import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import GalleryLightbox from './GalleryLightbox';
import driveways from '../assets/gallery/driveways.svg';
import patiosWalkways from '../assets/gallery/patios-walkways.svg';
import commercialLots from '../assets/gallery/commercial-lots.svg';
import homes from '../assets/gallery/homes.svg';
import dumpsterPads from '../assets/gallery/dumpster-pads.svg';
import sidewalks from '../assets/gallery/sidewalks.svg';
import commercialFleets from '../assets/gallery/commercial-fleets.svg';

const CATEGORIES = [
  { slug: 'driveways', label: 'Driveways', spec: 'Concrete & pavers', art: driveways },
  { slug: 'patios-walkways', label: 'Patios & Walkways', spec: 'Stone & brick', art: patiosWalkways },
  { slug: 'commercial-work', label: 'Commercial Work', spec: 'Lots, storefronts & high-traffic surfaces', art: commercialLots },
  { slug: 'homes', label: 'Homes', spec: 'Siding, brick & stucco', art: homes },
  { slug: 'dumpster-pads', label: 'Dumpster Pads', spec: 'Grease & grime removal', art: dumpsterPads },
  { slug: 'sidewalks', label: 'Sidewalks', spec: 'Municipal & HOA', art: sidewalks },
  { slug: 'commercial-fleets', label: 'Commercial Fleets', spec: 'Trucks, buses & equipment', art: commercialFleets },
];

export default function Gallery() {
  const [categoryPhotos, setCategoryPhotos] = useState({});
  const [lightbox, setLightbox] = useState(null); // { slug, index }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const entries = await Promise.all(CATEGORIES.map(async (c) => {
        const { data, error } = await supabase.storage.from('gallery').list(c.slug, {
          sortBy: { column: 'created_at', order: 'desc' },
        });
        if (error || !data) return [c.slug, []];

        const files = data.filter((f) => f.id && f.name !== '.emptyFolderPlaceholder');
        const photos = files.map((f) => ({
          name: f.name,
          url: supabase.storage.from('gallery').getPublicUrl(`${c.slug}/${f.name}`).data.publicUrl,
        }));
        return [c.slug, photos];
      }));
      if (cancelled) return;
      setCategoryPhotos(Object.fromEntries(entries));
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const anyPhotos = Object.values(categoryPhotos).some((p) => p.length > 0);
  const activeCategory = lightbox && CATEGORIES.find((c) => c.slug === lightbox.slug);
  const activePhotos = lightbox ? categoryPhotos[lightbox.slug] : null;

  return (
    <section id="gallery">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">Gallery</p>
          <h2>Recent work</h2>
          <p>
            {anyPhotos
              ? 'A look at some of our recent jobs.'
              : "Real job photos are on the way — here's the surfaces we work on most."}
          </p>
        </div>
        <div className="gallery-grid">
          {CATEGORIES.map((c) => {
            const photos = categoryPhotos[c.slug] || [];
            const cover = photos[0];
            return (
              <div className="gallery-tile" key={c.slug}>
                <button
                  type="button"
                  className="gallery-media"
                  disabled={!cover}
                  onClick={() => cover && setLightbox({ slug: c.slug, index: 0 })}
                >
                  <img src={cover ? cover.url : c.art} alt={cover ? c.label : ''} loading="lazy" />
                  {!cover && <span className="gallery-tag">Photos coming soon</span>}
                  {photos.length > 1 && <span className="gallery-tag">{photos.length} photos</span>}
                </button>
                <div className="gallery-info">
                  <h3>{c.label}</h3>
                  <p>{c.spec}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {lightbox && activePhotos && activePhotos.length > 0 && (
        <GalleryLightbox
          title={activeCategory.label}
          photos={activePhotos}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onPrev={() => setLightbox((l) => ({ ...l, index: (l.index - 1 + activePhotos.length) % activePhotos.length }))}
          onNext={() => setLightbox((l) => ({ ...l, index: (l.index + 1) % activePhotos.length }))}
        />
      )}
    </section>
  );
}
