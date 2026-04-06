import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { TeamDashboard } from './pages/TeamDashboard';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { getAdminToken, getGroupToken } from './lib/api';
import { ADMIN_DASHBOARD_PATH, ADMIN_ENTRY_PATH } from './lib/adminPaths';

function GuardGroup({ children }: { children: ReactElement }) {
  return getGroupToken() ? children : <Navigate to="/connexion" replace />;
}

function GuardAdmin({ children }: { children: ReactElement }) {
  return getAdminToken() ? children : <Navigate to={ADMIN_ENTRY_PATH} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/connexion" replace />} />
      <Route path="/accueil" element={<Home />} />
      <Route path="/inscription" element={<Register />} />
      <Route path="/connexion" element={<Login />} />
      <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
      <Route
        path="/dashboard"
        element={
          <GuardGroup>
            <TeamDashboard />
          </GuardGroup>
        }
      />
      <Route path={ADMIN_ENTRY_PATH} element={<AdminLogin />} />
      <Route
        path={ADMIN_DASHBOARD_PATH}
        element={
          <GuardAdmin>
            <AdminDashboard />
          </GuardAdmin>
        }
      />
      <Route path="*" element={<Navigate to="/connexion" replace />} />
    </Routes>
  );
}
