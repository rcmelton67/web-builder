const heroTestimonials = [
  {
    quote: "Absolutely beautiful memorial stone. Exceeded expectations.",
    author: "Karen"
  },
  {
    quote: "High quality craftsmanship and fast shipping.",
    author: "Lucy"
  },
  {
    quote: "The engraving is deep and perfectly done.",
    author: "TJ"
  },
  {
    quote: "Customer service was exceptional during a difficult time.",
    author: "Verified Buyer"
  }
];

let currentIndex = 0;

function rotateTestimonial() {
  const quoteEl = document.getElementById("testimonial-quote");
  const authorEl = document.getElementById("testimonial-author");
  if (!quoteEl || !authorEl || heroTestimonials.length === 0) return;

  currentIndex = (currentIndex + 1) % heroTestimonials.length;

  quoteEl.style.opacity = 0;
  authorEl.style.opacity = 0;

  setTimeout(() => {
    quoteEl.textContent = "“" + heroTestimonials[currentIndex].quote + "”";
    authorEl.textContent = "— " + heroTestimonials[currentIndex].author;
    quoteEl.style.opacity = 1;
    authorEl.style.opacity = 1;
  }, 300);
}

setInterval(rotateTestimonial, 5000);
