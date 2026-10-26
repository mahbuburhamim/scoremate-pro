import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Radio, Trophy, Link as LinkIcon, Tv, SlidersHorizontal, Activity, LogOut, User as UserIcon, Ticket, Sparkles } from 'lucide-react';
import { useCricket } from '../context/CricketContext';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { activeMatch, isSyncing } = useCricket();
  const { user, isAuthenticated, hasActiveSubscription, openAuthModal, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0c0a14]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo on Left */}
        <NavLink to={hasActiveSubscription ? "/dashboard" : "/"} className="flex items-center gap-3 group py-1">
          <img
            src={logoImg}
            alt="IconicScorer"
            className="h-12 sm:h-14 md:h-16 w-auto max-w-[200px] sm:max-w-[260px] object-contain hover:scale-105 transition-transform drop-shadow-[0_0_15px_rgba(6,182,212,0.45)]"
          />
        </NavLink>

        {/* Center Nav Links - matches user's screenshot layout */}
        <nav className="flex items-center gap-2 sm:gap-4 md:gap-6 text-sm font-semibold">
          <NavLink
            to={hasActiveSubscription ? "/dashboard" : "/"}
            end
            className={({ isActive }) =>
              `transition hover:text-white ${isActive ? 'text-white font-bold' : 'text-slate-300'}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/tournament"
            className={({ isActive }) =>
              `transition hover:text-white ${isActive ? 'text-white font-bold' : 'text-slate-300'}`
            }
          >
            Tournament
          </NavLink>

          {/* Payment Pill with border box (exact match from user reference image) */}
          <NavLink
            to="/payment"
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-lg border transition ${
                isActive
                  ? 'border-white text-white font-bold bg-white/5'
                  : 'border-slate-400/80 text-slate-200 hover:border-white hover:text-white'
              }`
            }
          >
            Payment
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `transition hover:text-white ${isActive ? 'text-white font-bold' : 'text-slate-300'}`
            }
          >
            Contact
          </NavLink>

          {/* Member Only links if subscribed */}
          {hasActiveSubscription && (
            <>
              <NavLink
                to="/links"
                className={({ isActive }) =>
                  `hidden lg:inline transition hover:text-white ${isActive ? 'text-white font-bold' : 'text-slate-300'}`
                }
              >
                Scoreboard Links
              </NavLink>

              <NavLink
                to={`/controller/${activeMatch.id}`}
                className={({ isActive }) =>
                  `hidden sm:flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold ${
                    isActive ? 'underline' : ''
                  }`
                }
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Controller</span>
              </NavLink>
            </>
          )}

          {/* Create Account link for unauthenticated visitors (green accent from screenshot) */}
          {!isAuthenticated && (
            <button
              onClick={() => openAuthModal('signup')}
              className="text-emerald-400 hover:text-emerald-300 font-bold transition hidden sm:inline"
            >
              Create Account
            </button>
          )}
        </nav>

        {/* Right Actions: Log in / User Profile */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Ticket Pill */}
              <div
                title="Remaining Match Tickets"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-amber-400 font-mono font-bold"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>{user?.ticketsRemaining ?? 15}</span>
              </div>

              {/* User Dropdown / Name */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-600 flex items-center justify-center text-xs font-bold text-white shadow">
                  {user?.name?.slice(0, 1).toUpperCase() || 'U'}
                </div>
                <span className="hidden md:inline text-xs font-bold text-slate-200">
                  {user?.name?.split(' ')[0]}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Log in Button - Blue Pill (exact match from user reference image) */}
              <button
                onClick={() => openAuthModal('login')}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-heading font-black text-sm shadow-md shadow-blue-600/30 active:scale-95 transition cursor-pointer"
              >
                Log in
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
