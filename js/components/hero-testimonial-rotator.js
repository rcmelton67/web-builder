document.addEventListener("DOMContentLoaded", async () => {

  const quoteEl = document.getElementById("testimonial-quote");
  const authorEl = document.getElementById("testimonial-author");

  if (!quoteEl || !authorEl) return;

  try {
    const response = await fetch("/data/reviews.json");
    const reviews = await response.json();

    // Filter only 5-star reviews with usable text
    const fiveStarReviews = reviews.filter(r =>
      r.rating === 5 &&
      (r.review || r.text) &&
      (r.review || r.text).length > 40
    );

    if (!fiveStarReviews.length) return;

    // Shuffle
    const shuffled = fiveStarReviews.sort(() => 0.5 - Math.random());

    // Take top 10 randomized
    const selected = shuffled.slice(0, 10);

    let index = 0;

    function shorten(text, maxLength = 140) {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength).trim() + "…";
    }

    function rotate() {
      index = (index + 1) % selected.length;

      quoteEl.style.opacity = 0;
      authorEl.style.opacity = 0;

      setTimeout(() => {
        const reviewText = selected[index].review || selected[index].text;
        quoteEl.textContent = "“" + shorten(reviewText) + "”";
        authorEl.textContent = "— " + (selected[index].reviewer || "Verified Customer");
        quoteEl.style.opacity = 1;
        authorEl.style.opacity = 1;
      }, 300);
    }

    // Initial populate
    quoteEl.textContent = "“" + shorten(selected[0].review || selected[0].text) + "”";
    authorEl.textContent = "— " + (selected[0].reviewer || "Verified Customer");

    setInterval(rotate, 6000);

  } catch (err) {
    console.warn("Hero testimonials failed to load:", err);
  }

});
