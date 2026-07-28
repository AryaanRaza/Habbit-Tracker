let currentRange = "week";
const RING_CIRC = 239;

function setRing(id, pct) {
  const el = document.getElementById(id);
  if (!el) return;
  const clamped = Math.max(0, Math.min(100, pct || 0));
  el.style.strokeDashoffset = RING_CIRC - (RING_CIRC * clamped) / 100;
}

