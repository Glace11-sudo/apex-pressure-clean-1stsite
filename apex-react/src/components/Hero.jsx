import BeforeAfterSlider from './BeforeAfterSlider';

export default function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <p className="eyebrow">Power wash &middot; soft wash &middot; hybrid wash</p>
          <h1>Grime doesn&rsquo;t stand a <em>chance</em></h1>
          <p className="lede">Reliable, professional exterior cleaning for homes and businesses across Prince George&rsquo;s County and the surrounding DMV. Free estimates, no obligation.</p>
          <div className="hero-ctas">
            <a className="btn btn-primary" href="#book">Book a Free Estimate</a>
            <a className="btn btn-ghost" href="tel:+14433518124">Call 443-351-8124</a>
          </div>
          <div className="hero-note">
            <span><strong>Licensed</strong> &amp; insured</span>
            <span><strong>Free</strong> on-site estimates</span>
            <span><strong>DMV</strong> service area</span>
          </div>
        </div>
        <div>
          <BeforeAfterSlider />
        </div>
      </div>
    </section>
  );
}
