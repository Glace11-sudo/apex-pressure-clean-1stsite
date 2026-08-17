const SERVICES = [
  {
    icon: <path d="M3 20h18M5 20V9l7-5 7 5v11M9 20v-6h6v6" />,
    title: 'Power Wash',
    desc: 'High-pressure water eliminates dirt, grime, mold, and mildew from tough commercial and industrial surfaces.',
    spec: '750+ PSI · commercial & industrial',
  },
];

export default function Services() {
  return (
    <section id="services">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">Services</p>
          <h2>One method, done right</h2>
          <p>We specialize in high-pressure power washing, dialed in to the surface and the buildup.</p>
        </div>
        <div className="services-grid">
          {SERVICES.map((s) => (
            <div className="service-card" key={s.title}>
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{s.icon}</svg>
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <span className="spec">{s.spec}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
