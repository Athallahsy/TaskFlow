import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/ToastContainer';
import Button from '../components/common/Button';
import api from '../api/axios';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '', general: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nama wajib diisi.';
    if (!form.email) errs.email = 'Email wajib diisi.';
    if (!form.password) errs.password = 'Password wajib diisi.';
    else if (form.password.length < 6) errs.password = 'Password minimal 6 karakter.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.token, res.data.user);
      showToast('Registrasi berhasil. Selamat datang di TaskFlow!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Terjadi kesalahan. Coba lagi.';
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#4F46E5] rounded-2xl mb-4 shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Buat Akun Baru</h1>
          <p className="text-[#64748B] text-sm mt-1">Gratis, tanpa kartu kredit</p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#E2E8F0] p-8">
          {errors.general && (
            <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-lg text-sm text-[#DC2626]">
              {errors.general}
            </div>
          )}
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              <div>
                <label htmlFor="reg-name" className="block text-sm font-medium text-[#0F172A] mb-1.5">Nama Lengkap</label>
                <input
                  id="reg-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nama kamu"
                  autoComplete="name"
                  className={['w-full px-3.5 py-2.5 rounded-lg border text-[#0F172A] text-sm transition focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent placeholder:text-[#94A3B8]', errors.name ? 'border-[#EF4444] bg-[#FEF2F2]' : 'border-[#E2E8F0]'].join(' ')}
                />
                {errors.name && <p className="mt-1 text-xs text-[#EF4444]">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="reg-email" className="block text-sm font-medium text-[#0F172A] mb-1.5">Email</label>
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@contoh.com"
                  autoComplete="email"
                  className={['w-full px-3.5 py-2.5 rounded-lg border text-[#0F172A] text-sm transition focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent placeholder:text-[#94A3B8]', errors.email ? 'border-[#EF4444] bg-[#FEF2F2]' : 'border-[#E2E8F0]'].join(' ')}
                />
                {errors.email && <p className="mt-1 text-xs text-[#EF4444]">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="reg-password" className="block text-sm font-medium text-[#0F172A] mb-1.5">Password</label>
                <input
                  id="reg-password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimal 6 karakter"
                  autoComplete="new-password"
                  className={['w-full px-3.5 py-2.5 rounded-lg border text-[#0F172A] text-sm transition focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent placeholder:text-[#94A3B8]', errors.password ? 'border-[#EF4444] bg-[#FEF2F2]' : 'border-[#E2E8F0]'].join(' ')}
                />
                {errors.password && <p className="mt-1 text-xs text-[#EF4444]">{errors.password}</p>}
              </div>
            </div>
            <Button type="submit" className="w-full mt-6" loading={loading} size="lg">
              {loading ? 'Menyimpan...' : 'Buat Akun'}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-[#64748B] mt-6">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-[#4F46E5] font-medium hover:text-[#4338CA] transition-colors">Masuk</Link>
        </p>
      </div>
    </div>
  );
}
