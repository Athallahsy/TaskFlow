import gsap from 'gsap';

/**
 * Check if user prefers reduced motion.
 * If so, all animations become instant.
 */
const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Open modal: fade in + scale from 95% to 100%
 */
export const openModal = (overlayEl, panelEl) => {
  if (prefersReducedMotion()) {
    gsap.set(overlayEl, { opacity: 1 });
    gsap.set(panelEl, { opacity: 1, scale: 1 });
    return;
  }
  const tl = gsap.timeline();
  tl.fromTo(overlayEl, { opacity: 0 }, { opacity: 1, duration: 0.2 });
  tl.fromTo(
    panelEl,
    { opacity: 0, scale: 0.95 },
    { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' },
    '<'
  );
  return tl;
};

/**
 * Close modal: fade out + scale to 95%
 */
export const closeModal = (overlayEl, panelEl, onComplete) => {
  if (prefersReducedMotion()) {
    if (onComplete) onComplete();
    return;
  }
  const tl = gsap.timeline({ onComplete });
  tl.to(panelEl, { opacity: 0, scale: 0.95, duration: 0.15, ease: 'power2.in' });
  tl.to(overlayEl, { opacity: 0, duration: 0.15 }, '<');
  return tl;
};

/**
 * Stagger cards from bottom — for task/project lists
 */
export const staggerCards = (elements) => {
  if (!elements || elements.length === 0) return;
  if (prefersReducedMotion()) {
    gsap.set(elements, { opacity: 1, y: 0 });
    return;
  }
  gsap.fromTo(
    elements,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.25,
      stagger: 0.08,
      ease: 'power2.out',
    }
  );
};

/**
 * Toast slide in from top
 */
export const toastIn = (el) => {
  if (prefersReducedMotion()) {
    gsap.set(el, { opacity: 1, y: 0 });
    return;
  }
  gsap.fromTo(
    el,
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }
  );
};

/**
 * Toast slide out
 */
export const toastOut = (el, onComplete) => {
  if (prefersReducedMotion()) {
    if (onComplete) onComplete();
    return;
  }
  gsap.to(el, {
    opacity: 0,
    y: -16,
    duration: 0.15,
    ease: 'power2.in',
    onComplete,
  });
};

/**
 * Animate task status change — slide + bounce
 */
export const animateStatusChange = (el) => {
  if (prefersReducedMotion()) return;
  gsap.fromTo(
    el,
    { x: -10, opacity: 0.7 },
    { x: 0, opacity: 1, duration: 0.3, ease: 'back.out(1.2)' }
  );
};

/**
 * Chart reveal from 0
 */
export const animateChartIn = (el) => {
  if (prefersReducedMotion()) return;
  gsap.fromTo(
    el,
    { opacity: 0, scale: 0.95 },
    { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
  );
};
