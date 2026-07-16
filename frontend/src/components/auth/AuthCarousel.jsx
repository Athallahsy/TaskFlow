import { useEffect, useRef, useState } from 'react';
import { AUTH_SLIDES } from '../../data/authSlides';
import gsap from 'gsap';

/**
 * AuthCarousel
 * ------------
 * Panel kiri overlay pada AuthPage.
 *
 * Props:
 *   slides  — array slide aktif (dari authSlides.js).
 *             Saat prop ini berganti (mode switch), carousel crossfade
 *             ke slide pertama dari set baru.
 *
 * Fitur:
 *  - Auto-slide tiap 4.5 detik, crossfade GSAP 400ms
 *  - Dot indicator — klik manual me-reset timer
 *  - prefers-reduced-motion: auto-slide mati, transisi instan
 */
export default function AuthCarousel({ slides = AUTH_SLIDES }) {
  const [current, setCurrent] = useState(0);
  const contentRef = useRef(null);
  const timerRef   = useRef(null);
  const prefersReduced = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // ─── Ikon placeholder per slide (berputar sesuai index) ─────────────────
  const ICON_DEFS = [
    // 0 — clipboard / project
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"
         className="auth-carousel__icon" stroke="currentColor" strokeWidth="1.5">
      <rect x="10" y="14" width="44" height="40" rx="4" strokeLinecap="round"/>
      <path d="M22 14v-4a2 2 0 012-2h16a2 2 0 012 2v4" strokeLinecap="round"/>
      <path d="M20 30h24M20 38h16" strokeLinecap="round"/>
      <circle cx="44" cy="44" r="10" fill="currentColor" fillOpacity=".15" stroke="currentColor"/>
      <path d="M40 44l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    // 1 — chart / dashboard
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"
         className="auth-carousel__icon" stroke="currentColor" strokeWidth="1.5">
      <rect x="8" y="8" width="48" height="48" rx="6"/>
      <path d="M16 44l10-12 8 6 10-14 6 6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="16" cy="44" r="2" fill="currentColor"/>
      <circle cx="26" cy="32" r="2" fill="currentColor"/>
      <circle cx="34" cy="38" r="2" fill="currentColor"/>
      <circle cx="44" cy="24" r="2" fill="currentColor"/>
      <circle cx="50" cy="30" r="2" fill="currentColor"/>
    </svg>,
    // 2 — crosshair / focus
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"
         className="auth-carousel__icon" stroke="currentColor" strokeWidth="1.5">
      <circle cx="32" cy="32" r="24"/>
      <circle cx="32" cy="32" r="14" strokeDasharray="4 3"/>
      <circle cx="32" cy="32" r="5" fill="currentColor" fillOpacity=".4"/>
      <path d="M32 8v5M32 51v5M8 32h5M51 32h5" strokeLinecap="round"/>
    </svg>,
  ];

  // ─── Fade helper ─────────────────────────────────────────────────────────
  const fadeToSlide = (nextIndex, instant = false) => {
    const el = contentRef.current;
    if (!el || prefersReduced.current || instant) {
      setCurrent(nextIndex);
      return;
    }
    gsap.killTweensOf(el);
    gsap.to(el, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        setCurrent(nextIndex);
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });
      },
    });
  };

  // ─── Reset ke slide 0 saat set slides berganti (mode switch) ────────────
  const prevSlidesRef = useRef(slides);
  useEffect(() => {
    if (slides !== prevSlidesRef.current) {
      prevSlidesRef.current = slides;
      clearInterval(timerRef.current);
      fadeToSlide(0);
      startTimer();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides]);

  // ─── Auto-slide ──────────────────────────────────────────────────────────
  const startTimer = () => {
    if (prefersReduced.current) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const el = contentRef.current;
      if (!el) return;
      gsap.killTweensOf(el);
      gsap.to(el, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          setCurrent((prev) => {
            const next = (prev + 1) % slides.length;
            gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });
            return next;
          });
        },
      });
    }, 4500);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides]);

  // ─── Dot click ───────────────────────────────────────────────────────────
  const handleDotClick = (index) => {
    clearInterval(timerRef.current);
    fadeToSlide(index);
    startTimer();
  };

  const slide = slides[current] ?? slides[0];
  const iconIdx = current % ICON_DEFS.length;

  return (
    <div className="auth-carousel">
      {/* Decorative blobs */}
      <div className="auth-carousel__blob auth-carousel__blob--1" aria-hidden="true" />
      <div className="auth-carousel__blob auth-carousel__blob--2" aria-hidden="true" />

      {/* Slide content — faded in/out as a unit */}
      <div className="auth-carousel__content" ref={contentRef}>
        <div className="auth-carousel__placeholder" aria-hidden="true">
          <div className="auth-carousel__placeholder-inner">
            {ICON_DEFS[iconIdx]}
          </div>
        </div>

        <div className="auth-carousel__text">
          <h2 className="auth-carousel__headline">{slide.headline}</h2>
          <p  className="auth-carousel__subtext">{slide.subtext}</p>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="auth-carousel__dots" role="tablist" aria-label="Navigasi slide">
        {slides.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === current}
            aria-label={`Slide ${i + 1}: ${s.headline}`}
            className={`auth-carousel__dot${i === current ? ' auth-carousel__dot--active' : ''}`}
            onClick={() => handleDotClick(i)}
          />
        ))}
      </div>
    </div>
  );
}
