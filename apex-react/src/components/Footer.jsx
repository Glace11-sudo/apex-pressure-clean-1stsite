import apexMark from '../assets/apex-mark.png';

export default function Footer() {
  return (
    <footer>
      <div className="wrap foot-grid">
        <span className="foot-brand">
          <img src={apexMark} alt="Apex Pressure Clean shark logo" />
          &copy; <span id="year">{new Date().getFullYear()}</span> Apex Pressure Clean &middot; Prince George&rsquo;s County, MD
        </span>
        <span>
          <a href="tel:+14433518124">443-351-8124</a> &middot;
          {' '}Serving PG County, Anne Arundel, Montgomery &amp; Charles Counties, and D.C.
        </span>
      </div>
    </footer>
  );
}
