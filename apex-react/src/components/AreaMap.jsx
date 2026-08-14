import { useEffect, useRef } from 'react';

const POINTS = [
  { x: 0.5, y: 0.52, r: 16, label: 'PG' },
  { x: 0.68, y: 0.62, r: 10, label: 'AA' },
  { x: 0.32, y: 0.28, r: 10, label: 'MC' },
  { x: 0.24, y: 0.68, r: 10, label: 'CC' },
  { x: 0.55, y: 0.30, r: 9, label: 'DC' },
];

export default function AreaMap() {
  const wrapRef = useRef(null);
  const cvRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const cv = cvRef.current;

    function draw() {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = r.width - 32, h = w * 0.75;
      cv.width = w * dpr;
      cv.height = h * dpr;
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
      const ctx = cv.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const styles = getComputedStyle(document.documentElement);
      const sky = styles.getPropertyValue('--sky-tint').trim();
      const blue = styles.getPropertyValue('--blue').trim();
      const blueDeep = styles.getPropertyValue('--blue-deep').trim();
      const lime = styles.getPropertyValue('--lime').trim();
      const limeInk = styles.getPropertyValue('--lime-ink').trim();
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      const hq = POINTS[0];
      POINTS.slice(1).forEach((p) => {
        ctx.beginPath();
        ctx.moveTo(hq.x * w, hq.y * h);
        ctx.lineTo(p.x * w, p.y * h);
        ctx.strokeStyle = blue;
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      POINTS.forEach((p, i) => {
        const isHQ = i === 0;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle = isHQ ? lime : blueDeep;
        ctx.fill();
        ctx.fillStyle = isHQ ? limeInk : '#fff';
        ctx.font = `700 9px ${getComputedStyle(document.body).fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.label, p.x * w, p.y * h);
      });
    }

    draw();
    window.addEventListener('resize', draw);
    let mql;
    if (window.matchMedia) {
      mql = window.matchMedia('(prefers-color-scheme: dark)');
      mql.addEventListener('change', draw);
    }
    return () => {
      window.removeEventListener('resize', draw);
      if (mql) mql.removeEventListener('change', draw);
    };
  }, []);

  return (
    <div className="area-canvas-wrap" ref={wrapRef}>
      <canvas id="areaMap" ref={cvRef}></canvas>
    </div>
  );
}
