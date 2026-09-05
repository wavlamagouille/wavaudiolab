const HEADER_HEIGHT = 76; // px — must match SiteHeader's h-[76px] and StageStack's own constant

// Every stage in StageStack sits at the exact same absolute position
// (only opacity changes as you scroll), so a plain anchor link can't
// target "where mixing becomes visible" the way it could for normal
// stacked content — there's no distinct DOM position to jump to. This
// reads the boundaries StageStack already computes and exposes as a
// data attribute, finds the named stage's own segment, and scrolls to
// its midpoint (where it's fully visible, not still fading in or out).
export function scrollToStage(name: string): boolean {
  const wrapper = document.getElementById("mixing");
  if (!wrapper) return false;

  const boundariesAttr = wrapper.dataset.boundaries;
  if (!boundariesAttr) return false;

  let boundaries: number[];
  try {
    boundaries = JSON.parse(boundariesAttr);
  } catch {
    return false;
  }

  const layers = Array.from(wrapper.querySelectorAll("[data-stage-layer]"));
  const index = layers.findIndex(
    (layer) => (layer as HTMLElement).dataset.stageName === name
  );
  if (index === -1) return false;

  const midFraction = (boundaries[index] + boundaries[index + 1]) / 2;
  const range = wrapper.offsetHeight - (window.innerHeight - HEADER_HEIGHT);
  const targetScrollY = wrapper.offsetTop - HEADER_HEIGHT + midFraction * range;

  window.scrollTo({ top: Math.max(0, targetScrollY), behavior: "smooth" });
  return true;
}
