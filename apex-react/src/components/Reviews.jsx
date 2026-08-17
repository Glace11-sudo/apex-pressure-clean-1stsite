const REVIEWS = [
  {
    quote: "I'll be honest — I was a little hesitant to try a new company I hadn't heard of before. But I'm so glad I did. Apex Pressure Cleaning did an amazing job on my house. Everything looks so clean and fresh — I couldn't believe the difference. Algie was professional, on time, and made sure I was happy with everything before he left. I will definitely be calling again and recommending to my neighbors!",
    who: 'Sunceria Lovelace',
  },
  {
    quote: "I recently had the front face of my property, driveway, and under-stairway closet power washed by Apex Pressure Clean, and I couldn't be happier with the results. Everything looks incredibly clean and refreshed — the difference is night and day. He was professional, punctual, and very thorough with his work. You can tell Apex Pressure Clean truly cares about quality and customer satisfaction. I highly recommend their services to anyone looking to bring new life back to their property!",
    who: 'John Price',
  },
  {
    quote: 'Had a great experience with Apex Pressure Cleaning. They did an amazing job cleaning the outside of my house, everything looks so fresh and spotless now. They were professional, on time, and paid attention to detail. You can tell they really care about the quality of their work. Highly recommend and will definitely use them again!',
    who: 'Sydney Barros',
  },
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
              <div className="who">{r.who} &middot; Google review</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
