const SERVICES = [
  {
    icon: <path d="M3 20h18M5 20V9l7-5 7 5v11M9 20v-6h6v6" />,
    title: 'Power Wash',
    desc: 'High-pressure water eliminates dirt, grime, mold, and mildew from tough commercial and industrial surfaces.',
    spec: '750+ PSI · commercial & industrial',
  },
  {
    icon: <path d="M3 9 12 3l9 6M5 9v11h14V9" />,
    title: 'Soft Wash',
    desc: 'A low-pressure system paired with cleaning agents lifts organic growth from delicate surfaces without damage.',
    spec: 'Low pressure · siding, roofs & trim',
  },
  {
    icon: <path d="M12 3c2.8 3.6 5 6.9 5 9.8a5 5 0 0 1-10 0C7 9.9 9.2 6.6 12 3Z" />,
    title: 'Hybrid Wash',
    desc: 'Our proprietary blend of both methods cuts chemical use while outperforming either technique on its own.',
    spec: "Apex’s signature approach",
  },
];

export default function Services() {
  return (
    <section id="services">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">Services</p>
          <h2>Three methods, matched to the job</h2>
          <p>We choose the technique based on the surface and the buildup, not the other way around.</p>
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
