import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/ToastContainer';
import AuthCarousel from '../components/auth/AuthCarousel';
import { LOGIN_SLIDES, REGISTER_SLIDES } from '../data/authSlides';
import api from '../api/axios';
import gsap from 'gsap';

/* ─────────────────────────────────────────────────────────────────────────
   AuthPage
   ─────────────────────────────────────────────────────────────────────────
   Layout desktop (≥768px):
   ┌──────────────────────────────────────────────────────────────────┐
   │  [Register form 50%]  [Login form 50%]   ← fixed in DOM         │
   │  [────── AuthCarousel 50% slides left:0% ↔ left:50% ──────]     │
   └──────────────────────────────────────────────────────────────────┘

   - Carousel (teal panel) selalu ada di DOM, posisi `absolute`,
     digeser GSAP antara left:0% (register) dan left:50% (login).
   - Form Login  : posisi tetap left:50%, opacity 1/0 via CSS class
   - Form Register: posisi tetap left:0%,  opacity 1/0 via CSS class
   - Hanya carousel yang benar-benar slide; form hanya crossfade.

   Layout mobile (<768px):
   - Carousel hidden.
   - Form aktif full width, toggle langsung tanpa animasi.
   ──────────────────────────────────────────────────────────────────── */

// ─── Reusable form field (underline style) ─────────────────────────────────
function AuthField({ id, label, type, name, value, onChange, placeholder, autoComplete, error }) {
  return (
    <div className="auth-field">
      <label htmlFor={id} className="auth-field__label">{label}</label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`auth-field__input${error ? ' auth-field__input--error' : ''}`}
      />
      {error && <p className="auth-field__error-msg" role="alert">{error}</p>}
    </div>
  );
}

// ─── Logo mark ─────────────────────────────────────────────────────────────
function LogoMark() {
  return (
    <div className="auth-form__logo">
      <span className="auth-form__brand">TaskFlow</span>
    </div>
  );
}

export default function AuthPage() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  // ─── Mode: derived from current URL path ────────────────────────────────
  const [mode, setMode] = useState(
    () => location.pathname === '/register' ? 'register' : 'login'
  );

  // ─── Form states ────────────────────────────────────────────────────────
  const [loginForm,    setLoginForm]    = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
  const [loginErrors,    setLoginErrors]    = useState({});
  const [registerErrors, setRegisterErrors] = useState({});
  const [loginLoading,    setLoginLoading]    = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  // ─── Refs ────────────────────────────────────────────────────────────────
  const carouselRef  = useRef(null);   // the teal sliding panel
  const prefersReduced = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  // Desktop breakpoint (must match CSS)
  const isMobile = () => window.innerWidth < 768;

  // ─── Slide the carousel panel ────────────────────────────────────────────
  const slideCarousel = (targetMode, instant = false) => {
    const el = carouselRef.current;
    if (!el || isMobile()) return;

    const targetLeft = targetMode === 'login' ? '0%' : '50%';

    if (prefersReduced.current || instant) {
      gsap.set(el, { left: targetLeft });
      return;
    }
    gsap.to(el, {
      left: targetLeft,
      duration: 0.55,
      ease: 'power3.inOut',
    });
  };

  // ─── Toggle mode ─────────────────────────────────────────────────────────
  const switchMode = (next) => {
    if (next === mode) return;
    setMode(next);
    navigate(next === 'login' ? '/login' : '/register', { replace: true });
    slideCarousel(next);
  };

  // Sync carousel position on first render (handles direct URL access)
  useEffect(() => {
    slideCarousel(mode, true /* instant — no animation on mount */);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Login handlers ───────────────────────────────────────────────────────
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
    setLoginErrors(prev => ({ ...prev, [name]: '', general: '' }));
  };

  const validateLogin = () => {
    const errs = {};
    if (!loginForm.email)    errs.email    = 'Email wajib diisi.';
    if (!loginForm.password) errs.password = 'Password wajib diisi.';
    return errs;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const errs = validateLogin();
    if (Object.keys(errs).length) { setLoginErrors(errs); return; }

    setLoginLoading(true);
    try {
      const res = await api.post('/auth/login', loginForm);
      login(res.data.token, res.data.user);
      showToast('Login berhasil. Selamat datang kembali!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Terjadi kesalahan. Coba lagi.';
      setLoginErrors({ general: msg });
    } finally {
      setLoginLoading(false);
    }
  };

  // ─── Register handlers ────────────────────────────────────────────────────
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
    setRegisterErrors(prev => ({ ...prev, [name]: '', general: '' }));
  };

  const validateRegister = () => {
    const errs = {};
    if (!registerForm.name.trim()) errs.name = 'Nama wajib diisi.';
    if (!registerForm.email)       errs.email = 'Email wajib diisi.';
    if (!registerForm.password)    errs.password = 'Password wajib diisi.';
    else if (registerForm.password.length < 6) errs.password = 'Password minimal 6 karakter.';
    return errs;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const errs = validateRegister();
    if (Object.keys(errs).length) { setRegisterErrors(errs); return; }

    setRegisterLoading(true);
    try {
      const res = await api.post('/auth/register', registerForm);
      login(res.data.token, res.data.user);
      showToast('Registrasi berhasil. Selamat datang di TaskFlow!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Terjadi kesalahan. Coba lagi.';
      setRegisterErrors({ general: msg });
    } finally {
      setRegisterLoading(false);
    }
  };

  const isLogin = mode === 'login';

  return (
    <div className="auth-page auth-page--overlay">

      {/*
        ── FORM CONTAINER ────────────────────────────────────────────────────
        Relative positioned host. Both forms sit inside, each 50% wide,
        positioned absolutely within this container.
        On mobile: container is normal flow, forms are 100% wide and
        shown/hidden via CSS class.
      */}
      <div className="auth-overlay__forms">

        {/* ── REGISTER FORM — always at left: 0% ── */}
        <div
          className={`auth-overlay__pane auth-overlay__pane--register${!isLogin ? ' auth-overlay__pane--active' : ''}`}
          aria-hidden={isLogin}
        >
          <div className="auth-form-wrapper">
            <LogoMark />
            <h1 className="auth-form__title">Buat Akun Baru</h1>
            <p className="auth-form__subtitle">Gratis, tanpa kartu kredit</p>

            {registerErrors.general && (
              <div className="auth-form__error-banner" role="alert">
                {registerErrors.general}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} noValidate className="auth-form__form">
              <AuthField
                id="reg-name" label="Nama Lengkap" type="text"
                name="name" value={registerForm.name}
                onChange={handleRegisterChange}
                placeholder="Nama kamu" autoComplete="name"
                error={registerErrors.name}
              />
              <AuthField
                id="reg-email" label="Email" type="email"
                name="email" value={registerForm.email}
                onChange={handleRegisterChange}
                placeholder="email@contoh.com" autoComplete="email"
                error={registerErrors.email}
              />
              <AuthField
                id="reg-password" label="Password" type="password"
                name="password" value={registerForm.password}
                onChange={handleRegisterChange}
                placeholder="Minimal 6 karakter" autoComplete="new-password"
                error={registerErrors.password}
              />
              <button
                type="submit"
                id="register-submit"
                className="auth-submit-btn"
                disabled={registerLoading}
                tabIndex={isLogin ? -1 : 0}
              >
                {registerLoading ? 'Menyimpan...' : 'Buat Akun'}
              </button>
            </form>

            <p className="auth-form__footer">
              Sudah punya akun?{' '}
              <button
                type="button"
                className="auth-form__link auth-form__link--btn"
                onClick={() => switchMode('login')}
                tabIndex={isLogin ? -1 : 0}
              >
                Masuk
              </button>
            </p>
          </div>
        </div>

        {/* ── LOGIN FORM — always at left: 50% ── */}
        <div
          className={`auth-overlay__pane auth-overlay__pane--login${isLogin ? ' auth-overlay__pane--active' : ''}`}
          aria-hidden={!isLogin}
        >
          <div className="auth-form-wrapper">
            <LogoMark />
            <h1 className="auth-form__title">Selamat Datang Kembali</h1>
            <p className="auth-form__subtitle">Masuk untuk melanjutkan pekerjaan kamu</p>

            {loginErrors.general && (
              <div className="auth-form__error-banner" role="alert">
                {loginErrors.general}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} noValidate className="auth-form__form">
              <AuthField
                id="login-email" label="Email" type="email"
                name="email" value={loginForm.email}
                onChange={handleLoginChange}
                placeholder="email@contoh.com" autoComplete="email"
                error={loginErrors.email}
              />
              <AuthField
                id="login-password" label="Password" type="password"
                name="password" value={loginForm.password}
                onChange={handleLoginChange}
                placeholder="Masukkan password" autoComplete="current-password"
                error={loginErrors.password}
              />
              <button
                type="submit"
                id="login-submit"
                className="auth-submit-btn"
                disabled={loginLoading}
                tabIndex={isLogin ? 0 : -1}
              >
                {loginLoading ? 'Memuat...' : 'Masuk'}
              </button>
            </form>

            <p className="auth-form__footer">
              Belum punya akun?{' '}
              <button
                type="button"
                className="auth-form__link auth-form__link--btn"
                onClick={() => switchMode('register')}
                tabIndex={isLogin ? 0 : -1}
              >
                Daftar sekarang
              </button>
            </p>
          </div>
        </div>

        {/*
          ── CAROUSEL PANEL (absolute, slides between left:0% and left:50%)
          On mobile: hidden via CSS.
        */}
        <div className="auth-overlay__carousel" ref={carouselRef} aria-hidden="true">
          <AuthCarousel slides={isLogin ? LOGIN_SLIDES : REGISTER_SLIDES} />
        </div>
      </div>
    </div>
  );
}
