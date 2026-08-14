const STEPS = [
  { title: 'Inspect', desc: 'We walk the property and flag surfaces that need pre-treatment or extra care.' },
  { title: 'Pre-treat', desc: 'Cleaning agents go down first to break up grime and organic growth.' },
  { title: 'Wash', desc: 'Power, soft, or hybrid wash, chosen per surface and dialed to the material.' },
  { title: 'Rinse & Protect', desc: 'Clear water rinse, plus an optional protective treatment for driveways and decks.' },
];

export default function Process() {
  return (
    <section className="process" id="process">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">How it works</p>
          <h2>Four steps, one visit</h2>
        </div>
        <div className="process-grid">
          {STEPS.map((s) => (
            <div className="step" key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
