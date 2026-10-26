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
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-4xl flex flex-col gap-10">
        {/* Header */}
        <div className="text-center">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
            24/7 SUPPORT & SALES
          </span>
          <h1 className="mt-3 font-heading font-black text-3xl sm:text-5xl text-white">
            Get in Touch with IconicScorer
          </h1>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
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
            className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 hover:border-emerald-400 flex flex-col items-center text-center gap-3 transition shadow-xl group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-lg text-white">WhatsApp Direct</h3>
            <p className="text-xs text-slate-400">Fastest response for instant payment activation & match day support.</p>
            <span className="mt-auto text-xs font-bold text-emerald-400 group-hover:underline">Chat on WhatsApp →</span>
          </a>

          {/* Email Support */}
          <a
            href="mailto:support@iconicscorer.com"
            className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 flex flex-col items-center text-center gap-3 transition shadow-xl group"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-lg text-white">Email Support</h3>
            <p className="text-xs text-slate-400">support@iconicscorer.com</p>
            <span className="mt-auto text-xs font-bold text-cyan-400 group-hover:underline">Send an Email →</span>
          </a>

          {/* Direct Phone */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-fuchsia-500/30 hover:border-fuchsia-400 flex flex-col items-center text-center gap-3 transition shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 group-hover:scale-110 transition">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-lg text-white">Hotline Support</h3>
            <p className="text-xs text-slate-400">Available 9:00 AM – 11:00 PM (BST / IST) daily.</p>
            <span className="mt-auto text-xs font-bold text-fuchsia-400">+880 (17) 000-0000</span>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="w-full rounded-3xl bg-slate-900/90 border border-slate-800 p-8 sm:p-10 shadow-2xl backdrop-blur-md">
          {submitted ? (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8 animate-bounce" />
              </div>
              <h3 className="font-heading font-black text-2xl text-white">Message Sent Successfully!</h3>
              <p className="text-sm text-slate-300 max-w-md">
                Thank you for contacting IconicScorer. Our team will review your inquiry and reach out via WhatsApp / Email shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <h3 className="font-heading font-black text-xl text-white">Send Us an Inquiry</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mahbubur Rahman"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. yourname@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+880 1700 000000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-sm text-white"
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
                <label className="block text-xs font-bold text-slate-300 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your tournament, stream date, or payment transaction ID..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-sm text-white"
                />
              </div>

              <button
                type="submit"
                className="self-end px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-heading font-black text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/20 active:scale-95 transition flex items-center gap-2"
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
