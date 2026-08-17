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

function drawDirtySiding(cv, slider) {
  const { ctx, w, h } = sizeCanvas(cv, slider);
  const rand = mulberry32(7);

  ctx.fillStyle = '#9c9a7e';
  ctx.fillRect(0, 0, w, h);

  const boardH = h / 15;
  for (let y = 0; y <= h; y += boardH) {
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    ctx.strokeStyle = 'rgba(40,36,24,0.22)';
    ctx.beginPath(); ctx.moveTo(0, y + 1.5); ctx.lineTo(w, y + 1.5); ctx.stroke();
  }

  for (let i = 0; i < 6; i++) {
    const sx = rand() * w;
    const sw = 14 + rand() * 26;
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, `rgba(50,46,28,${0.32 + rand() * 0.18})`);
    grad.addColorStop(0.6, `rgba(50,46,28,${0.12 + rand() * 0.1})`);
    grad.addColorStop(1, 'rgba(50,46,28,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(sx, h * 0.35, sw, h * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 22; i++) {
    const gx = rand() * w;
    const gy = rand() * rand() * h * 0.6;
    const gr = rand() * rand() * 16 + 3;
    ctx.fillStyle = `rgba(40,48,30,${0.14 + rand() * 0.2})`;
    ctx.beginPath();
    ctx.ellipse(gx, gy, gr, gr * (0.5 + rand() * 0.5), rand() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(20,18,10,0.12)';
  ctx.fillRect(0, 0, w, h);
}

function drawCleanSiding(cv, slider) {
  const { ctx, w, h } = sizeCanvas(cv, slider);
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#FAFCFD');
  grad.addColorStop(1, '#E3EDF4');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const boardH = h / 15;
  for (let y = 0; y <= h; y += boardH) {
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    ctx.strokeStyle = 'rgba(180,196,208,0.5)';
    ctx.beginPath(); ctx.moveTo(0, y + 1.5); ctx.lineTo(w, y + 1.5); ctx.stroke();
  }

  const sheen = ctx.createLinearGradient(0, 0, w, h);
  sheen.addColorStop(0.35, 'rgba(255,255,255,0)');
  sheen.addColorStop(0.48, 'rgba(255,255,255,0.55)');
  sheen.addColorStop(0.55, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);

  const rand = mulberry32(23);
  for (let i = 0; i < 26; i++) {
    const dx = rand() * w, dy = rand() * h, dr = rand() * 2 + 0.6;
    ctx.fillStyle = `rgba(4,126,242,${0.16 + rand() * 0.22})`;
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
      drawDirtySiding(beforeRef.current, sliderRef.current);
      drawCleanSiding(afterRef.current, sliderRef.current);
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
      <p className="slider-caption">Drag to compare &mdash; one pass, same siding</p>
    </>
  );
}
