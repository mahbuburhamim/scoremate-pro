import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Send, CheckCircle2, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Tournament Live Overlay Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-sky-200/30 via-blue-100/20 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="w-full max-w-4xl flex flex-col gap-10 relative z-10">
        {/* Header */}
        <div className="text-center">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-sky-50 px-3.5 py-1.5 rounded-full border border-sky-200 shadow-sm">
            24/7 SUPPORT & SALES
          </span>
          <h1 className="mt-3 font-heading font-black text-3xl sm:text-5xl text-slate-900">
            <span className="text-blue-600">Get in Touch</span> with IconicScorer
          </h1>
          <p className="mt-3 text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Need help with payment activation, bKash / Nagad / Razorpay transfers, custom overlay branding, or tournament setup? We are here to help.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* WhatsApp Card */}
          <a
            href="https://wa.me/8801700000000"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-400 hover:shadow-[0_15px_30px_rgba(16,185,129,0.1)] flex flex-col items-center text-center gap-3 transition shadow-sm group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition shadow-sm">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-lg text-slate-900">WhatsApp Direct</h3>
            <p className="text-xs text-slate-500">Fastest response for instant payment activation & match day support.</p>
            <span className="mt-auto text-xs font-bold text-emerald-600 group-hover:underline">Chat on WhatsApp →</span>
          </a>

          {/* Email Support */}
          <a
            href="mailto:support@iconicscorer.com"
            className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-[0_15px_30px_rgba(2,132,199,0.1)] flex flex-col items-center text-center gap-3 transition shadow-sm group"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-blue-600 group-hover:scale-110 transition shadow-sm">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-lg text-slate-900">Email Support</h3>
            <p className="text-xs text-slate-500">support@iconicscorer.com</p>
            <span className="mt-auto text-xs font-bold text-blue-600 group-hover:underline">Send an Email →</span>
          </a>

          {/* Direct Phone */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-purple-400 hover:shadow-[0_15px_30px_rgba(168,85,247,0.1)] flex flex-col items-center text-center gap-3 transition shadow-sm group">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 group-hover:scale-110 transition shadow-sm">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-lg text-slate-900">Hotline Support</h3>
            <p className="text-xs text-slate-500">Available 9:00 AM – 11:00 PM (BST / IST) daily.</p>
            <span className="mt-auto text-xs font-bold text-purple-600">+880 (17) 000-0000</span>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="w-full rounded-3xl bg-white/95 border border-slate-200/90 p-6 sm:p-10 shadow-[0_20px_50px_rgba(2,132,199,0.06)] backdrop-blur-xl">
          {submitted ? (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-8 h-8 animate-bounce" />
              </div>
              <h3 className="font-heading font-black text-2xl text-slate-900">Message Sent Successfully!</h3>
              <p className="text-sm text-slate-600 max-w-md">
                Thank you for contacting IconicScorer. Our team will review your inquiry and reach out via WhatsApp / Email shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <h3 className="font-heading font-black text-xl text-slate-900">Send Us an Inquiry</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mahbubur Rahman"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-slate-900 placeholder-slate-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. yourname@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-slate-900 placeholder-slate-400 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+880 1700 000000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-slate-900 placeholder-slate-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-slate-900 transition"
                  >
                    <option>Tournament Live Overlay Inquiry</option>
                    <option>bKash / Nagad Manual Payment Verification</option>
                    <option>Custom Graphic / Brand Logo Overlay</option>
                    <option>Technical OBS Support</option>
                    <option>Other Question</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your tournament, stream date, or payment transaction ID..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-slate-900 placeholder-slate-400 transition"
                />
              </div>

              <button
                type="submit"
                className="self-end px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-heading font-black text-sm uppercase tracking-wider shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] active:scale-95 transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
