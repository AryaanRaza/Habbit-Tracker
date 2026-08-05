let currentRange = "week";
const RING_CIRC = 239;

function setRing(id, pct) {
  const el = document.getElementById(id);
  if (!el) return;
  const clamped = Math.max(0, Math.min(100, pct || 0));
  el.style.strokeDashoffset = RING_CIRC - (RING_CIRC * clamped) / 100;
}

function bindRangeToggle() {
  const buttons = document.querySelectorAll(".range-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      currentRange = btn.dataset.range;
      renderTopStats();
    });
  });
}
