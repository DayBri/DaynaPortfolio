/**
 * Tour state machine: idle → walking → arrived.
 * Travelling = tweening the planet's Z rotation so the target stop comes to the top.
 * A stop at angle θ (local position (sinθ, cosθ, 0)) is at the top when pivot.rotation.z = θ.
 */
export function createTour({ pivot, stopAngles, character, reducedMotion, onDepart, onArrive }) {
  const count = stopAngles.length;
  let index = 0;
  let tween = null; // { from, to, t, duration, target }

  const ease = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
  const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

  function goTo(i) {
    i = ((i % count) + count) % count;
    const destination = tween ? tween.target : index;
    if (i === destination) return;

    const from = pivot.rotation.z;
    const delta = wrap(stopAngles[i] - from);
    const duration = Math.max(0.9, Math.abs(delta) * 1.4) * (reducedMotion ? 0.35 : 1);
    tween = { from, to: from + delta, t: 0, duration, target: i };

    character.setWalking(Math.sign(delta));
    onDepart?.(i);
  }

  function update(dt) {
    if (!tween) return;
    tween.t = Math.min(1, tween.t + dt / tween.duration);
    pivot.rotation.z = tween.from + (tween.to - tween.from) * ease(tween.t);
    if (tween.t >= 1) {
      index = tween.target;
      tween = null;
      character.setWalking(0);
      character.face(index === 0 ? 'camera' : 'building');
      onArrive?.(index);
    }
  }

  /** Teleport without walking (used for the initial / deep-linked stop). */
  function jumpTo(i) {
    tween = null;
    index = i;
    pivot.rotation.z = stopAngles[i];
    character.face(i === 0 ? 'camera' : 'building');
  }

  return {
    goTo,
    jumpTo,
    next: () => goTo((tween ? tween.target : index) + 1),
    prev: () => goTo((tween ? tween.target : index) - 1),
    update,
    get index() {
      return tween ? tween.target : index;
    },
    get walking() {
      return !!tween;
    },
  };
}
