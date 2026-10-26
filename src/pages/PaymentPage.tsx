import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Info, Check, CreditCard, Lock, Sparkles, Zap, ArrowRight, Smartphone, AlertCircle } from 'lucide-react';
import { useAuth, SUBSCRIPTION_PLANS, Plan } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, purchasePlan, isAuthenticated, signup } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<Plan>(SUBSCRIPTION_PLANS[0]);
  const [currency, setCurrency] = useState<'INR' | 'BDT' | 'USD'>('INR');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'bkash' | 'card'>('razorpay');

  // Customer form for guest users
  const [buyerName, setBuyerName] = useState(user?.name || '');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || '');
  const [buyerPhone, setBuyerPhone] = useState(user?.phone || '');
  const [trxId, setTrxId] = useState('');
  const [formError, setFormError] = useState('');

  // Conversion rates for preview if user toggles currency
  const getDisplayPrice = (plan: Plan) => {
    if (currency === 'BDT') {
      return `৳${Math.round(plan.price * 1.45)}`;
    }
    if (currency === 'USD') {
      return `$${Math.round(plan.price * 0.012)}`;
    }
    return `₹${plan.price}`;
  };

  const handleProceed = () => {
    setFormError('');
    setShowCheckoutModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!isAuthenticated) {
      if (!buyerEmail.trim() || !buyerName.trim()) {
        setFormError('Please enter your Name and Email so we can link your subscription.');
        return;
      }
      await signup(buyerName, buyerEmail, buyerPhone);
    }

    setIsProcessing(true);

    setTimeout(async () => {
      await purchasePlan(selectedPlan, paymentMethod);
      setIsProcessing(false);
      setPaymentSuccess(true);

      // Confetti burst
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }

      setTimeout(() => {
        setShowCheckoutModal(false);
        navigate('/dashboard');
      }, 1800);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-6xl flex flex-col gap-8">
        {/* Main Card Container (Exact Replica of User Reference Screenshot) */}
        <div className="w-full rounded-3xl bg-[#13111c] border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-md flex flex-col items-center relative overflow-hidden">
          {/* Top subtle glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-fuchsia-600/15 blur-3xl pointer-events-none" />

          {/* Secure Checkout Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-300 shadow">
            <Lock className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>Secure Checkout via Razorpay</span>
          </div>

          {/* Title Header */}
          <h1 className="mt-4 font-heading font-black text-3xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-pink-400 to-rose-400 tracking-tight">
            IconicScorer PRO
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 font-medium">
            Choose a plan and unlock all premium themes
          </p>

          {/* Currency Toggle */}
          <div className="mt-4 flex items-center gap-2 p-1 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-bold">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1 rounded-lg transition ${
                currency === 'INR' ? 'bg-fuchsia-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              INR (₹)
            </button>
            <button
              onClick={() => setCurrency('BDT')}
              className={`px-3 py-1 rounded-lg transition ${
                currency === 'BDT' ? 'bg-fuchsia-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              BDT (৳)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1 rounded-lg transition ${
                currency === 'USD' ? 'bg-fuchsia-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              USD ($)
            </button>
          </div>

          {/* Plan Cards Grid (16 Cards matching screenshot layout) */}
          <div className="mt-8 w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isSelected = selectedPlan.id === plan.id;
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`relative p-3.5 sm:p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-lg shadow-fuchsia-600/30 ring-2 ring-fuchsia-400 scale-[1.02]'
                      : 'bg-[#1b1726] hover:bg-slate-800/90 border border-slate-800 text-slate-200'
                  }`}
                >
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {plan.name}
                  </span>
                  <span className="font-score text-2xl sm:text-3xl font-black mt-1 leading-none">
                    {getDisplayPrice(plan)}
                  </span>
                  <span className={`text-[10px] mt-1 font-medium ${isSelected ? 'text-fuchsia-100' : 'text-slate-400'}`}>
                    {plan.tickets} Ticket(s)
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Summary Bar (Exact Replica from reference image) */}
          <div className="mt-8 w-full rounded-2xl bg-[#0e0c15] border border-slate-800/80 p-6 flex flex-col gap-3 shadow-inner">
            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 font-semibold border-b border-slate-800/60 pb-3">
              <span>Selected Plan</span>
              <span className="font-bold text-white uppercase">{selectedPlan.name}</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 font-semibold border-b border-slate-800/60 pb-3">
              <span className="flex items-center gap-1.5">
                Tickets <Info className="w-3.5 h-3.5 text-slate-500" />
              </span>
              <span className="font-bold text-white">{selectedPlan.tickets}</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 font-semibold border-b border-slate-800/60 pb-3">
              <span className="flex items-center gap-1.5">
                Duration <Info className="w-3.5 h-3.5 text-slate-500" />
              </span>
              <span className="font-bold text-white">{selectedPlan.durationDays} Day(s)</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm sm:text-base font-bold text-slate-300">Total Amount</span>
              <span className="font-score text-3xl sm:text-4xl font-black text-white">
                {getDisplayPrice(selectedPlan)}
              </span>
            </div>

            {/* Action Checkout Button */}
            <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Instant access unlocked immediately upon payment confirmation.</span>
              </div>

              <button
                onClick={handleProceed}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 hover:from-fuchsia-500 hover:to-rose-500 text-white font-heading font-black text-sm uppercase tracking-wider shadow-lg shadow-fuchsia-600/30 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <span>Proceed to Pay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal with Multi-Gateway Selector */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#151221] border border-fuchsia-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl flex flex-col gap-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-fuchsia-400" />
                <h3 className="font-heading font-black text-lg text-white uppercase">
                  Checkout — {selectedPlan.name}
                </h3>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm"
              >
                ✕
              </button>
            </div>

            {paymentSuccess ? (
              <div className="py-8 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
                  <Check className="w-8 h-8 animate-bounce" />
                </div>
                <h4 className="font-heading font-black text-2xl text-white">Payment Confirmed!</h4>
                <p className="text-sm text-slate-300">
                  Your <strong>{selectedPlan.name}</strong> subscription has been activated with <strong>{selectedPlan.tickets} match tickets</strong>.
                </p>
                <span className="text-xs text-cyan-400 font-mono">Redirecting to Member Dashboard...</span>
              </div>
            ) : (
              <>
                {/* Plan Summary header */}
                <div className="bg-[#0b0914] p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white text-base block">{selectedPlan.name} Plan</span>
                    <span className="text-slate-400">{selectedPlan.tickets} Match Tickets • {selectedPlan.durationDays} Days</span>
                  </div>
                  <span className="font-score text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400">
                    {getDisplayPrice(selectedPlan)}
                  </span>
                </div>

                {/* If user is not logged in, collect name and email */}
                {!isAuthenticated && (
                  <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
                    <span className="text-xs font-bold text-cyan-400 block uppercase tracking-wider">
                      Subscriber Details
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">Your Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Full Name"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Your Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="email@example.com"
                          value={buyerEmail}
                          onChange={(e) => setBuyerEmail(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Gateway Selector */}
                <div className="space-y-2 text-xs">
                  <label className="font-bold text-slate-300 block">Select Payment Gateway:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('razorpay')}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 font-bold transition ${
                        paymentMethod === 'razorpay'
                          ? 'bg-fuchsia-950/60 border-fuchsia-500 text-white shadow'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-cyan-400" />
                      <span>Razorpay / UPI / Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bkash')}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 font-bold transition ${
                        paymentMethod === 'bkash'
                          ? 'bg-pink-950/60 border-pink-500 text-white shadow'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-5 h-5 text-pink-400" />
                      <span>bKash / Nagad (BD MFS)</span>
                    </button>
                  </div>
                </div>

                {/* bKash instructions if selected */}
                {paymentMethod === 'bkash' && (
                  <div className="p-3.5 rounded-xl bg-pink-950/30 border border-pink-500/30 text-xs space-y-2">
                    <p className="text-pink-200">
                      Send <strong>{getDisplayPrice(selectedPlan)}</strong> via bKash / Nagad Send Money to: <code className="bg-slate-950 px-2 py-0.5 rounded font-mono text-white font-bold">+8801700000000</code>
                    </p>
                    <input
                      type="text"
                      placeholder="Enter TrxID (e.g. 9JA28X8P)"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-pink-500/40 text-white text-xs placeholder-slate-500"
                    />
                  </div>
                )}

                {formError && (
                  <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCheckoutModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 text-xs font-semibold"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleConfirmPayment}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 hover:from-fuchsia-500 hover:to-rose-500 text-white font-heading font-black text-xs uppercase tracking-wider shadow-lg shadow-fuchsia-600/30 flex items-center gap-2 active:scale-95 transition"
                  >
                    {isProcessing ? (
                      <span>Verifying & Activating...</span>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Pay {getDisplayPrice(selectedPlan)} & Unlock Pro</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
