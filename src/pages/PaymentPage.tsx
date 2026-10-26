import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Info, Check, CreditCard, Lock, Sparkles, Zap, ArrowRight, Smartphone, AlertCircle } from 'lucide-react';
import { useAuth, SUBSCRIPTION_PLANS, Plan } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, purchasePlan, isAuthenticated, signup } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<Plan>(SUBSCRIPTION_PLANS[0]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad'>('bkash');

  // Customer form for guest users
  const [buyerName, setBuyerName] = useState(user?.name || '');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || '');
  const [buyerPhone, setBuyerPhone] = useState(user?.phone || '');
  const [trxId, setTrxId] = useState('');
  const [formError, setFormError] = useState('');

  // Prices are all in Bangladeshi Taka (BDT ৳)
  const getDisplayPrice = (plan: Plan) => {
    return `৳${plan.price}`;
  };

  const handleProceed = () => {
    setFormError('');
    setShowCheckoutModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!isAuthenticated) {
      if (!buyerEmail.trim() || !buyerName.trim()) {
        setFormError('দয়া করে আপনার নাম এবং ইমেইল দিন যাতে সাবস্ক্রিপশন যুক্ত করা যায়।');
        return;
      }
      await signup(buyerName, buyerEmail, buyerPhone);
    }

    if (!trxId.trim()) {
      setFormError('অনুগ্রহ করে পেমেন্ট করার পর বিকাশ বা নগদের TrxID নম্বরটি লিখুন।');
      return;
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
      }, 2000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#dbeafe] via-[#eff6ff] to-[#f8fafc] text-slate-900 py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-gradient-to-b from-sky-300/35 via-blue-200/25 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-cyan-300/25 blur-3xl pointer-events-none rounded-full" />

      <div className="w-full max-w-6xl flex flex-col gap-8 relative z-10">
        {/* Main Card Container */}
        <div className="w-full rounded-3xl bg-white/95 border border-slate-200/90 p-5 sm:p-10 shadow-[0_20px_50px_rgba(2,132,199,0.08)] backdrop-blur-xl flex flex-col items-center relative overflow-hidden">
          {/* Top subtle glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-sky-400/20 blur-3xl pointer-events-none rounded-full" />

          {/* Secure Checkout Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-xs font-bold text-sky-700 shadow-sm">
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span>Secure MFS Checkout via bKash (বিকাশ) & Nagad (নগদ)</span>
          </div>

          {/* Title Header */}
          <h1 className="mt-4 font-heading font-black text-3xl sm:text-5xl text-slate-900 tracking-tight text-center">
            <span className="text-blue-600">IconicScorer</span> PRO PLANS
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium text-center">
            সকল টুর্নামেন্ট ও ম্যাচের জন্য বিডিটি (৳) তে সাশ্রয়ী প্যাকেজ • পেমেন্ট করলেই লাইভ ২৪ ঘণ্টা কাউন্টডাউন শুরু
          </p>

          {/* Currency Badge */}
          <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-700">
            <span>মুদ্রা: বাংলাদেশি টাকা (BDT ৳)</span>
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
              <span className="font-bold text-slate-900">{selectedPlan.durationDays} Day(s) (Real-Time 24h Countdown)</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm sm:text-base font-bold text-slate-700">Total Amount (মোট টাকা)</span>
              <span className="font-score text-3xl sm:text-4xl font-black text-slate-900">
                {getDisplayPrice(selectedPlan)}
              </span>
            </div>

            {/* Action Checkout Button */}
            <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/80">
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>পেমেন্ট নিশ্চিত করার সাথে সাথেই স্বয়ংক্রিয়ভাবে লাইভ ২৪ ঘণ্টা ব্রডকাস্ট সময় চালু হয়ে যাবে।</span>
              </div>

              <button
                onClick={handleProceed}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-heading font-black text-sm uppercase tracking-wider shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] active:scale-95 transition flex items-center justify-center gap-2"
              >
                <span>Proceed to Pay (পেমেন্ট করুন)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal with Strictly bKash & Nagad Gateways */}
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
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 text-sm font-bold"
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
                  আপনার <strong>{selectedPlan.name}</strong> প্যাকেজ সফলভাবে চালু হয়েছে। ২৪ ঘণ্টার রিয়েল-টাইম কাউন্টডাউন শুরু হয়েছে।
                </p>
                <span className="text-xs text-blue-600 font-mono">ড্যাশবোর্ডে প্রবেশ করানো হচ্ছে...</span>
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
                      গ্রাহকের তথ্য (Subscriber Details)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-600 mb-1 font-semibold">আপনার নাম *</label>
                        <input
                          type="text"
                          required
                          placeholder="পূর্ণ নাম"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1 font-semibold">ইমেইল ঠিকানা *</label>
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

                {/* Gateway Selector: Strictly bKash & Nagad Only */}
                <div className="space-y-2 text-xs">
                  <label className="font-bold text-slate-700 block">পেমেন্ট মেথড নির্বাচন করুন (বিকাশ অথবা নগদ):</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* bKash */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bkash')}
                      className={`p-3.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 font-bold transition ${
                        paymentMethod === 'bkash'
                          ? 'bg-pink-50 border-[#d12053] text-[#d12053] shadow-md ring-2 ring-pink-200 scale-[1.02]'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#d12053] text-white flex items-center justify-center font-black text-sm shadow">
                        ৳
                      </div>
                      <span className="font-heading font-black text-sm">bKash (বিকাশ)</span>
                      <span className="text-[10px] text-pink-600 font-mono">Personal Send Money</span>
                    </button>

                    {/* Nagad */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('nagad')}
                      className={`p-3.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 font-bold transition ${
                        paymentMethod === 'nagad'
                          ? 'bg-amber-50 border-[#f7921e] text-[#f7921e] shadow-md ring-2 ring-amber-200 scale-[1.02]'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#f7921e] text-white flex items-center justify-center font-black text-sm shadow">
                        ৳
                      </div>
                      <span className="font-heading font-black text-sm">Nagad (নগদ)</span>
                      <span className="text-[10px] text-amber-700 font-mono">Personal Send Money</span>
                    </button>
                  </div>
                </div>

                {/* Instructions Box depending on gateway */}
                {paymentMethod === 'bkash' && (
                  <div className="p-4 rounded-2xl bg-pink-50/90 border border-pink-200 text-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#d12053] flex items-center gap-1">
                        <Smartphone className="w-4 h-4" /> বিকাশ সেন্ড মানি নির্দেশনা:
                      </span>
                      <span className="font-bold text-[#d12053] bg-pink-100 px-2 py-0.5 rounded-full font-mono">
                        {getDisplayPrice(selectedPlan)}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      আপনার বিকাশ অ্যাপ থেকে <strong>{getDisplayPrice(selectedPlan)}</strong> টাকা নিচে দেওয়া নম্বরে <strong>Send Money</strong> করুন:
                    </p>
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-pink-200">
                      <span className="text-slate-500 font-semibold">বিকাশ পার্সোনাল নম্বর:</span>
                      <code className="font-mono text-pink-700 font-black text-sm">+8801700000000</code>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        বিকাশ TrxID (Transaction ID) লিখুন:
                      </label>
                      <input
                        type="text"
                        placeholder="যেমন: 9JA28X8P"
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-pink-300 text-slate-900 text-xs font-mono placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-200"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'nagad' && (
                  <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#f7921e] flex items-center gap-1">
                        <Smartphone className="w-4 h-4" /> নগদ সেন্ড মানি নির্দেশনা:
                      </span>
                      <span className="font-bold text-[#f7921e] bg-amber-100 px-2 py-0.5 rounded-full font-mono">
                        {getDisplayPrice(selectedPlan)}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      আপনার নগদ অ্যাপ থেকে <strong>{getDisplayPrice(selectedPlan)}</strong> টাকা নিচে দেওয়া নম্বরে <strong>Send Money</strong> করুন:
                    </p>
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-amber-200">
                      <span className="text-slate-500 font-semibold">নগদ পার্সোনাল নম্বর:</span>
                      <code className="font-mono text-amber-700 font-black text-sm">+8801800000000</code>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        নগদ TrxID (Transaction ID) লিখুন:
                      </label>
                      <input
                        type="text"
                        placeholder="যেমন: 7KD92Q1M"
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-slate-900 text-xs font-mono placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200"
                      />
                    </div>
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
