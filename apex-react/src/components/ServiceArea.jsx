import AreaMap from './AreaMap';

const CHIPS = [
  { label: "Prince George’s County · HQ", hq: true },
  { label: 'Anne Arundel County' },
  { label: 'Montgomery County' },
  { label: 'Charles County' },
  { label: 'Washington, D.C.' },
];

export default function ServiceArea() {
  return (
    <section id="area">
      <div className="wrap area-grid">
        <div>
          <p className="eyebrow">Service area</p>
          <h2>Proudly serving the DMV</h2>
          <p>Headquartered in Prince George&rsquo;s County, with regular routes through the surrounding counties and Washington, D.C.</p>
          <div className="area-chips">
            {CHIPS.map((c) => (
              <span className={`area-chip${c.hq ? ' hq' : ''}`} key={c.label}>
                <span className="dot"></span>{c.label}
              </span>
            ))}
          </div>
        </div>
        <AreaMap />
      </div>
    </section>
  );
}
