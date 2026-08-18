import { useRef, useState } from 'react';
import beforePhoto from '../assets/hero/before.jpg';
import afterPhoto from '../assets/hero/after.jpg';

export default function BeforeAfterSlider() {
  const sliderRef = useRef(null);
  const draggingRef = useRef(false);
  const [split, setSplitState] = useState(46);

  const setSplit = (pct) => setSplitState(Math.max(8, Math.min(92, pct)));

  const pctFromEvent = (clientX) => {
    const r = sliderRef.current.getBoundingClientRect();
    return ((clientX - r.left) / r.width) * 100;
  };

  return (
    <>
      <div
        className="slider"
        id="slider"
        ref={sliderRef}
        style={{ '--split': `${split}%` }}
        onPointerDown={(e) => {
          draggingRef.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          setSplit(pctFromEvent(e.clientX));
        }}
        onPointerMove={(e) => {
          if (!draggingRef.current) return;
          setSplit(pctFromEvent(e.clientX));
        }}
        onPointerUp={() => { draggingRef.current = false; }}
        onPointerCancel={() => { draggingRef.current = false; }}
        onPointerLeave={() => { draggingRef.current = false; }}
      >
        <img id="layer-before" src={beforePhoto} alt="Before power washing" />
        <img id="layer-after" src={afterPhoto} alt="After power washing" />
        <span className="slider-tag before">Before</span>
        <span className="slider-tag after">After</span>
        <div className="slider-handle">
          <div className="slider-grip">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M8 8 3 12l5 4M16 8l5 4-5 4" /></svg>
          </div>
        </div>
      </div>
      <p className="slider-caption">Drag to compare &mdash; one pass, same siding</p>
    </>
  );
}
