import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CricketProvider } from './context/CricketContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { TournamentPage } from './pages/TournamentPage';
import { LinksPage } from './pages/LinksPage';
import { ControllerPage } from './pages/ControllerPage';
import { OverlayPage } from './pages/OverlayPage';

const AppLayout: React.FC = () => {
  const location = useLocation();
  // Do not render navbar on transparent broadcast overlay
  const isOverlay = location.pathname.startsWith('/overlay');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {!isOverlay && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/tournament" element={<TournamentPage />} />
          <Route path="/links" element={<LinksPage />} />
          <Route path="/controller/:matchId" element={<ControllerPage />} />
          <Route path="/overlay/:matchId" element={<OverlayPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CricketProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </CricketProvider>
  );
};

export default App;
