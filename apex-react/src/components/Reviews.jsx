const REVIEWS = [
  { quote: 'Our driveway looked brand new — the oil stains from my truck are completely gone.', who: 'Marcus T. · Bowie' },
  { quote: 'Booked online, they showed up on time, and the siding looks like the day we moved in.', who: 'Priya S. · Upper Marlboro' },
  { quote: 'Fast, careful around my flower beds, and the roof streaks are finally gone.', who: 'Dana R. · Hyattsville' },
];

export default function Reviews() {
  return (
    <section id="reviews">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">Reviews</p>
          <h2>What the neighbors say</h2>
        </div>
        <div className="reviews-grid">
          {REVIEWS.map((r) => (
            <div className="review" key={r.who}>
              <div className="stars">★★★★★</div>
              <p className="quote">&ldquo;{r.quote}&rdquo;</p>
              <div className="who">{r.who}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
