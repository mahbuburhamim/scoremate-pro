import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  SlidersHorizontal,
  LogOut,
  Ticket,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  User,
  Sparkles,
  Trophy,
  Link as LinkIcon,
  Phone,
  HelpCircle,
} from 'lucide-react';
import { useCricket } from '../context/CricketContext';
import { useAuth } from '../context/AuthContext';
import { SubscriptionCountdown } from './SubscriptionCountdown';
import logoImg from '../assets/logo.png';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { activeMatch } = useCricket();
  const { user, isAuthenticated, hasActiveSubscription, openAuthModal, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo on Left */}
        <NavLink
          to={hasActiveSubscription ? '/dashboard' : '/'}
          onClick={closeMenu}
          className="flex items-center gap-3 group py-1 shrink-0"
        >
          <img
            src={logoImg}
            alt="IconicScorer"
            className="h-12 sm:h-14 md:h-16 w-auto max-w-[180px] sm:max-w-[240px] object-contain transition-transform group-hover:scale-105"
          />
        </NavLink>

        {/* Desktop Nav Links (Hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-semibold">
          <NavLink
            to={hasActiveSubscription ? '/dashboard' : '/'}
            end
            className={({ isActive }) =>
              `transition font-medium ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600'
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/tournament"
            className={({ isActive }) =>
              `transition font-medium ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600'
              }`
            }
          >
            Tournament
          </NavLink>

          {/* Payment Pill matching reference */}
          <NavLink
            to="/payment"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-full border transition font-medium text-xs ${
                isActive
                  ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold shadow-sm'
                  : 'border-slate-300/90 text-slate-700 hover:border-blue-400 hover:text-blue-600 hover:bg-slate-50'
              }`
            }
          >
            Payment
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `transition font-medium ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600'
              }`
            }
          >
            Contact
          </NavLink>

          {/* Public Scoreboard Links for Preview */}
          <NavLink
            to="/links"
            className={({ isActive }) =>
              `transition font-medium ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600'
              }`
            }
          >
            Scoreboard Links
          </NavLink>

          {/* Football Scoreboard (Esports Top-Left 1920x1080) */}
          <NavLink
            to="/football"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition font-bold text-xs ${
                isActive
                  ? 'border-cyan-500 bg-cyan-50 text-cyan-800 shadow-sm'
                  : 'border-slate-300 text-slate-700 hover:border-cyan-400 hover:text-cyan-700 hover:bg-slate-50'
              }`
            }
          >
            <span>⚽ Football</span>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-cyan-600 text-white tracking-wider">
              NEW
            </span>
          </NavLink>

          {/* Controller link if subscribed */}
          {hasActiveSubscription && (
            <NavLink
              to={`/controller/${activeMatch.id}`}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200 hover:bg-blue-100 transition ${
                  isActive ? 'ring-2 ring-blue-400/40' : ''
                }`
              }
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Controller</span>
            </NavLink>
          )}

          {/* Create Account link for unauthenticated visitors */}
          {!isAuthenticated && (
            <button
              onClick={() => openAuthModal('signup')}
              className="text-slate-600 hover:text-blue-600 font-semibold transition"
            >
              Create Account
            </button>
          )}
        </nav>

        {/* Right Actions: Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              {/* Live Subscription Countdown */}
              {user?.planExpiryTimestamp && (
                <SubscriptionCountdown compact />
              )}

              {/* Ticket Pill */}
              <div
                title="Remaining Match Tickets"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs text-amber-700 font-mono font-bold shadow-sm"
              >
                <Ticket className="w-3.5 h-3.5 text-amber-600" />
                <span>{user?.ticketsRemaining ?? 15} Tickets</span>
              </div>

              {/* User Avatar */}
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {user?.name?.slice(0, 1).toUpperCase() || 'U'}
                </div>
                <span className="text-xs font-bold text-slate-700 max-w-[120px] truncate">
                  {user?.name?.split(' ')[0]}
                </span>
              </div>

              {isAdmin && (
                <NavLink
                  to="/admin"
                  className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition"
                >
                  Admin
                </NavLink>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-2 rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => openAuthModal('login')}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-heading font-black text-sm shadow-[0_8px_20px_rgba(37,99,235,0.35)] active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Log in</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {!isAuthenticated && (
            <button
              onClick={() => openAuthModal('login')}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold text-xs shadow-md"
            >
              Log in
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200 px-5 py-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          {isAuthenticated && (
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                  {user?.name?.slice(0, 1).toUpperCase() || 'U'}
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-sm block">{user?.name}</span>
                  <span className="text-[11px] text-slate-500">{user?.planName || 'Active Subscriber'}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs text-amber-700 font-mono font-bold">
                  <Ticket className="w-3.5 h-3.5 text-amber-600" />
                  <span>{user?.ticketsRemaining ?? 15}</span>
                </div>
                {user?.planExpiryTimestamp && (
                  <SubscriptionCountdown compact />
                )}
              </div>
            </div>
          )}

          <nav className="flex flex-col gap-2 font-medium text-sm text-slate-700">
            <NavLink
              to={hasActiveSubscription ? '/dashboard' : '/'}
              onClick={closeMenu}
              className={({ isActive }) =>
                `p-3 rounded-xl transition ${
                  isActive ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/links"
              onClick={closeMenu}
              className={({ isActive }) =>
                `p-3 rounded-xl transition ${
                  isActive ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50'
                }`
              }
            >
              Scoreboard Links
            </NavLink>

            <NavLink
              to="/football"
              onClick={closeMenu}
              className={({ isActive }) =>
                `p-3 rounded-xl transition flex items-center justify-between ${
                  isActive ? 'bg-cyan-50 text-cyan-800 font-bold' : 'hover:bg-slate-50'
                }`
              }
            >
              <span className="flex items-center gap-2">
                <span>⚽</span>
                <span>Football Scoreboard (Top-Left)</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-cyan-600 text-white">
                1080p
              </span>
            </NavLink>

            <NavLink
              to="/tournament"
              onClick={closeMenu}
              className={({ isActive }) =>
                `p-3 rounded-xl transition ${
                  isActive ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50'
                }`
              }
            >
              Tournament Manager
            </NavLink>

            <NavLink
              to="/payment"
              onClick={closeMenu}
              className={({ isActive }) =>
                `p-3 rounded-xl transition flex items-center justify-between ${
                  isActive ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50'
                }`
              }
            >
              <span>Payment Plans</span>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                16 Plans
              </span>
            </NavLink>

            <NavLink
              to="/contact"
              onClick={closeMenu}
              className={({ isActive }) =>
                `p-3 rounded-xl transition ${
                  isActive ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50'
                }`
              }
            >
              Contact Support
            </NavLink>

            {hasActiveSubscription && (
              <NavLink
                to={`/controller/${activeMatch.id}`}
                onClick={closeMenu}
                className="p-3 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-between shadow-md mt-1"
              >
                <span className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Open Live Scorer Controller</span>
                </span>
                <ArrowRight className="w-4 h-4" />
              </NavLink>
            )}
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    closeMenu();
                    openAuthModal('signup');
                  }}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm text-center transition"
                >
                  Create Account
                </button>
                <button
                  onClick={() => {
                    closeMenu();
                    openAuthModal('login');
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-heading font-black text-sm text-center shadow-md active:scale-95 transition"
                >
                  Log In
                </button>
              </>
            ) : (
              <>
              {isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={closeMenu}
                  className="w-full py-2.5 rounded-xl text-blue-700 hover:bg-blue-50 text-sm font-bold text-center transition"
                >
                  Admin Panel
                </NavLink>
              )}
              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl text-red-600 hover:bg-red-50 text-sm font-bold flex items-center justify-center gap-2 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
