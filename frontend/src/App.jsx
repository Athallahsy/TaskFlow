import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/ToastContainer';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProjectDetailPage from './pages/ProjectDetailPage';import AppShell from './components/layout/AppShell';
import Breadcrumb from './components/layout/Breadcrumb';

/*
Contoh Cara Pemakaian AppShell & Breadcrumb untuk halaman terproteksi:

function ProtectedPageExample() {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Project Detail' }
  ];

  return (
    <AppShell>
      <div className="p-3">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-xl font-bold">Judul Halaman</h1>
        <p className="text-sm text-text-secondary mt-1">Konten halaman Anda di sini...</p>
      </div>
    </AppShell>
  );
}
*/

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login"    element={<GuestRoute><AuthPage /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><AuthPage /></GuestRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/projects/:id" element={<PrivateRoute><ProjectDetailPage /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
