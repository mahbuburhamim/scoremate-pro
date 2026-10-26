import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CricketProvider } from './context/CricketContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { ProtectedRoute } from './components/ProtectedRoute';

import { PublicLandingPage } from './pages/PublicLandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { PaymentPage } from './pages/PaymentPage';
import { ContactPage } from './pages/ContactPage';
import { TournamentPage } from './pages/TournamentPage';
import { LinksPage } from './pages/LinksPage';
import { ControllerPage } from './pages/ControllerPage';
import { OverlayPage } from './pages/OverlayPage';

const RootHomeRoute: React.FC = () => {
  const { hasActiveSubscription } = useAuth();
  // If subscribed, direct to member dashboard; otherwise show public marketing/services landing page
  if (hasActiveSubscription) {
    return <DashboardPage />;
  }
  return <PublicLandingPage />;
};

const AppLayout: React.FC = () => {
  const location = useLocation();
  // Do not render navbar or auth modals on transparent broadcast overlay (for OBS / vMix)
  const isOverlay = location.pathname.startsWith('/overlay');

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white ${
        isOverlay ? 'bg-transparent' : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      {!isOverlay && <Navbar />}
      {!isOverlay && <AuthModal />}

      <main className="flex-1">
        <Routes>
          {/* Public Home & Marketing */}
          <Route path="/" element={<RootHomeRoute />} />

          {/* Pricing & Subscription */}
          <Route path="/payment" element={<PaymentPage />} />

          {/* Contact Support */}
          <Route path="/contact" element={<ContactPage />} />

          {/* Protected Member Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute featureName="Member Broadcast Dashboard">
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Live Controller */}
          <Route
            path="/controller/:matchId"
            element={
              <ProtectedRoute featureName="Live Scorer Controller">
                <ControllerPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Tournament Manager */}
          <Route
            path="/tournament"
            element={
              <ProtectedRoute featureName="Tournament & Squad Manager">
                <TournamentPage />
              </ProtectedRoute>
            }
          />

          {/* Public Scoreboard Links (Anyone can preview, but Copy Link requires subscription) */}
          <Route path="/links" element={<LinksPage />} />

          {/* Public OBS Transparent Broadcast Overlay (Never blocked for OBS Browser Source) */}
          <Route path="/overlay/:matchId" element={<OverlayPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CricketProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </CricketProvider>
    </AuthProvider>
  );
};

export default App;
