import { useEffect, useRef, useState } from 'react';
import { mulberry32 } from '../lib/random';

function sizeCanvas(cv, container) {
  const r = container.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = r.width * dpr;
  cv.height = r.height * dpr;
  const ctx = cv.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w: r.width, h: r.height };
}

function drawGrime(cv, slider) {
  const { ctx, w, h } = sizeCanvas(cv, slider);
  const rand = mulberry32(7);
  ctx.fillStyle = '#9a9186';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(60,54,40,0.18)';
  ctx.lineWidth = 1;
  const cell = w / 6;
  for (let x = 0; x <= w; x += cell) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y <= h; y += cell) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  for (let i = 0; i < 140; i++) {
    const gx = rand() * w, gy = rand() * h, gr = rand() * rand() * 26 + 3;
    const tone = rand();
    ctx.fillStyle = tone < 0.5
      ? `rgba(90,74,40,${0.10 + rand() * 0.22})`
      : `rgba(60,66,44,${0.08 + rand() * 0.18})`;
    ctx.beginPath();
    ctx.ellipse(gx, gy, gr, gr * (0.6 + rand() * 0.5), rand() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let s = 0; s < 3; s++) {
    const sx = w * (0.2 + rand() * 0.6), sy = h * (0.3 + rand() * 0.5);
    const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, 50);
    grad.addColorStop(0, 'rgba(20,18,14,0.5)');
    grad.addColorStop(1, 'rgba(20,18,14,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(sx, sy, 50, 26, rand() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(18,16,12,0.14)';
  ctx.fillRect(0, 0, w, h);
}

function drawClean(cv, slider) {
  const { ctx, w, h } = sizeCanvas(cv, slider);
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#eaf3fd');
  grad.addColorStop(1, '#cfe6fb');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 1;
  const cell = w / 6;
  for (let x = 0; x <= w; x += cell) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y <= h; y += cell) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  const sheen = ctx.createLinearGradient(0, 0, w, h);
  sheen.addColorStop(0.35, 'rgba(255,255,255,0)');
  sheen.addColorStop(0.48, 'rgba(255,255,255,0.6)');
  sheen.addColorStop(0.55, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);
  const rand = mulberry32(23);
  for (let i = 0; i < 26; i++) {
    const dx = rand() * w, dy = rand() * h, dr = rand() * 2 + 0.6;
    ctx.fillStyle = `rgba(4,126,242,${0.18 + rand() * 0.25})`;
    ctx.beginPath();
    ctx.arc(dx, dy, dr, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function BeforeAfterSlider() {
  const sliderRef = useRef(null);
  const beforeRef = useRef(null);
  const afterRef = useRef(null);
  const draggingRef = useRef(false);
  const [split, setSplitState] = useState(46);

  const setSplit = (pct) => setSplitState(Math.max(8, Math.min(92, pct)));

  const pctFromEvent = (clientX) => {
    const r = sliderRef.current.getBoundingClientRect();
    return ((clientX - r.left) / r.width) * 100;
  };

  useEffect(() => {
    const render = () => {
      drawGrime(beforeRef.current, sliderRef.current);
      drawClean(afterRef.current, sliderRef.current);
    };
    render();
    window.addEventListener('resize', render);
    return () => window.removeEventListener('resize', render);
  }, []);

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
        <canvas id="layer-before" ref={beforeRef}></canvas>
        <canvas id="layer-after" ref={afterRef}></canvas>
        <span className="slider-tag before">Before</span>
        <span className="slider-tag after">After</span>
        <div className="slider-handle">
          <div className="slider-grip">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M8 8 3 12l5 4M16 8l5 4-5 4" /></svg>
          </div>
        </div>
      </div>
      <p className="slider-caption">Drag to compare &mdash; one pass, same driveway</p>
    </>
  );
}
