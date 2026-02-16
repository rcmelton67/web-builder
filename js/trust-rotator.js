export function initTrustRotator(id, phrases) {
  const el = document.getElementById(id);
  if (!el) return;

  let i = 0;
  el.textContent = phrases[i];

  setInterval(() => {
    el.style.opacity = 0;
    setTimeout(() => {
      i = (i + 1) % phrases.length;
      el.textContent = phrases[i];
      el.style.opacity = 1;
    }, 300);
  }, 4000);
}
