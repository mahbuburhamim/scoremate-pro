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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-sky-200/30 via-blue-100/20 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-cyan-200/20 blur-3xl pointer-events-none rounded-full" />

      <div className="w-full max-w-6xl flex flex-col gap-8 relative z-10">
        {/* Main Card Container */}
        <div className="w-full rounded-3xl bg-white/95 border border-slate-200/90 p-5 sm:p-10 shadow-[0_20px_50px_rgba(2,132,199,0.08)] backdrop-blur-xl flex flex-col items-center relative overflow-hidden">
          {/* Top subtle glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-sky-400/15 blur-3xl pointer-events-none rounded-full" />

          {/* Secure Checkout Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-xs font-bold text-sky-700 shadow-sm">
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span>Secure Checkout via Razorpay & bKash</span>
          </div>

          {/* Title Header */}
          <h1 className="mt-4 font-heading font-black text-3xl sm:text-5xl text-slate-900 tracking-tight text-center">
            <span className="text-blue-600">IconicScorer</span> PRO
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium text-center">
            Choose a plan and unlock all premium TV-grade broadcast themes
          </p>

          {/* Currency Toggle */}
          <div className="mt-4 flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-bold">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3.5 py-1 rounded-full transition ${
                currency === 'INR' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              INR (₹)
            </button>
            <button
              onClick={() => setCurrency('BDT')}
              className={`px-3.5 py-1 rounded-full transition ${
                currency === 'BDT' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              BDT (৳)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3.5 py-1 rounded-full transition ${
                currency === 'USD' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              USD ($)
            </button>
          </div>

          {/* Plan Cards Grid (16 Cards, 2 cols on mobile, 3 on sm, 4 on md, 6 on lg) */}
          <div className="mt-8 w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isSelected = selectedPlan.id === plan.id;
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`relative p-3.5 sm:p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/30 ring-2 ring-sky-400 scale-[1.02]'
                      : 'bg-white hover:bg-sky-50/60 border border-slate-200/90 text-slate-800 shadow-sm hover:border-sky-300'
                  }`}
                >
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-600'}`}>
                    {plan.name}
                  </span>
                  <span className="font-score text-2xl sm:text-3xl font-black mt-1 leading-none">
                    {getDisplayPrice(plan)}
                  </span>
                  <span className={`text-[10px] mt-1 font-medium ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>
                    {plan.tickets} Ticket(s)
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Summary Bar */}
          <div className="mt-8 w-full rounded-2xl bg-slate-50/90 border border-slate-200/90 p-5 sm:p-6 flex flex-col gap-3.5 shadow-sm">
            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 font-semibold border-b border-slate-200/80 pb-3">
              <span>Selected Plan</span>
              <span className="font-bold text-slate-900 uppercase">{selectedPlan.name}</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 font-semibold border-b border-slate-200/80 pb-3">
              <span className="flex items-center gap-1.5">
                Tickets <Info className="w-3.5 h-3.5 text-slate-400" />
              </span>
              <span className="font-bold text-slate-900">{selectedPlan.tickets} Match Tickets</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 font-semibold border-b border-slate-200/80 pb-3">
              <span className="flex items-center gap-1.5">
                Duration <Info className="w-3.5 h-3.5 text-slate-400" />
              </span>
              <span className="font-bold text-slate-900">{selectedPlan.durationDays} Day(s)</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm sm:text-base font-bold text-slate-700">Total Amount</span>
              <span className="font-score text-3xl sm:text-4xl font-black text-slate-900">
                {getDisplayPrice(selectedPlan)}
              </span>
            </div>

            {/* Action Checkout Button */}
            <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/80">
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant broadcast activation unlocked immediately upon payment confirmation.</span>
              </div>

              <button
                onClick={handleProceed}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-heading font-black text-sm uppercase tracking-wider shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] active:scale-95 transition flex items-center justify-center gap-2"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white/95 border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl flex flex-col gap-4 text-slate-900 backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="font-heading font-black text-lg text-slate-900 uppercase">
                  Checkout — {selectedPlan.name}
                </h3>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 text-sm"
              >
                ✕
              </button>
            </div>

            {paymentSuccess ? (
              <div className="py-8 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600">
                  <Check className="w-8 h-8 animate-bounce" />
                </div>
                <h4 className="font-heading font-black text-2xl text-slate-900">Payment Confirmed!</h4>
                <p className="text-sm text-slate-600">
                  Your <strong>{selectedPlan.name}</strong> subscription has been activated with <strong>{selectedPlan.tickets} match tickets</strong>.
                </p>
                <span className="text-xs text-blue-600 font-mono">Redirecting to Member Dashboard...</span>
              </div>
            ) : (
              <>
                {/* Plan Summary header */}
                <div className="bg-sky-50/80 p-4 rounded-2xl border border-sky-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 text-base block">{selectedPlan.name} Plan</span>
                    <span className="text-slate-500">{selectedPlan.tickets} Match Tickets • {selectedPlan.durationDays} Days</span>
                  </div>
                  <span className="font-score text-3xl font-black text-blue-600">
                    {getDisplayPrice(selectedPlan)}
                  </span>
                </div>

                {/* If user is not logged in, collect name and email */}
                {!isAuthenticated && (
                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-xs font-bold text-blue-600 block uppercase tracking-wider">
                      Subscriber Details
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-600 mb-1 font-semibold">Your Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Full Name"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1 font-semibold">Your Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="email@example.com"
                          value={buyerEmail}
                          onChange={(e) => setBuyerEmail(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Gateway Selector */}
                <div className="space-y-2 text-xs">
                  <label className="font-bold text-slate-700 block">Select Payment Gateway:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('razorpay')}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 font-bold transition ${
                        paymentMethod === 'razorpay'
                          ? 'bg-blue-50/80 border-blue-500 text-blue-700 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <span>Razorpay / UPI / Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bkash')}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 font-bold transition ${
                        paymentMethod === 'bkash'
                          ? 'bg-pink-50/80 border-pink-500 text-pink-700 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Smartphone className="w-5 h-5 text-pink-600" />
                      <span>bKash / Nagad (BD MFS)</span>
                    </button>
                  </div>
                </div>

                {/* bKash instructions if selected */}
                {paymentMethod === 'bkash' && (
                  <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-200 text-xs space-y-2">
                    <p className="text-pink-900">
                      Send <strong>{getDisplayPrice(selectedPlan)}</strong> via bKash / Nagad Send Money to: <code className="bg-white px-2 py-0.5 rounded font-mono text-pink-700 font-bold border border-pink-200">+8801700000000</code>
                    </p>
                    <input
                      type="text"
                      placeholder="Enter TrxID (e.g. 9JA28X8P)"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-pink-300 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                )}

                {formError && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCheckoutModal(false)}
                    className="px-4 py-2 rounded-full text-slate-500 hover:bg-slate-100 text-xs font-semibold"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleConfirmPayment}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-heading font-black text-xs uppercase tracking-wider shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] flex items-center gap-2 active:scale-95 transition"
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
