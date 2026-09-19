import React from 'react';
import { Phone, MessageCircle, ArrowDownCircle, CheckCircle2, MapPin, Sparkles, Send, Users, Instagram } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { trackEvent } from '../utils/analytics';

interface HeroProps {
  lang: Language;
  phone: string;
  whatsapp: string;
  instagramUrl?: string;
  instagramHandle?: string;
  onApplyNow: () => void;
  onSelectCourse: (courseId: 'english' | 'computer' | 'bollywood' | 'all') => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  phone,
  whatsapp,
  instagramUrl,
  instagramHandle,
  onApplyNow,
  onSelectCourse
}) => {
  const t = translations[lang];

  const handleCallClick = () => {
    trackEvent('call_now_clicked', { customSource: 'hero' });
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_clicked', { customSource: 'hero' });
    const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(t.default_whatsapp_msg || 'Hello, I would like information about your courses, fees and admission.')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleInstagramClick = () => {
    trackEvent('instagram_clicked', { customSource: 'hero' });
    const targetUrl = instagramUrl || 'https://www.instagram.com/hasuwaskillsacademy';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleApplyClick = () => {
    trackEvent('apply_now_clicked', { customSource: 'hero' });
    onApplyNow();
  };

  const handleRegisterClick = () => {
    trackEvent('register_now_clicked', { customSource: 'hero' });
    onApplyNow();
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white pt-8 pb-16 sm:pt-12 sm:pb-24">
      {/* Subtle geometric background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(245,158,11,0.12),transparent_45%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Admissions & Location Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-semibold text-amber-300 mb-6 shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{t.admissionsOpen}</span>
            <span className="text-slate-400">|</span>
            <span className="flex items-center gap-1 text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              {t.locationShort}
            </span>
          </div>

          {/* Core Master Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-tight sm:leading-none mb-4">
            <span className="bg-gradient-to-r from-amber-200 via-white to-amber-300 bg-clip-text text-transparent">
              {t.tagline}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl font-medium text-indigo-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            {t.subheadline}
          </p>

          {/* Quick Value Highlights (Social Media Landing Friendly) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-2xl mx-auto mb-8 text-left text-xs sm:text-sm">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2.5 backdrop-blur-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-200">{lang === 'hi' ? 'शुरुआती लोगों के लिए सरल' : '100% Beginner Friendly'}</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2.5 backdrop-blur-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-200">{lang === 'hi' ? 'ऑफलाइन व ऑनलाइन बैच' : 'Offline & Online Batches'}</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2.5 backdrop-blur-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-200">{lang === 'hi' ? 'प्रैक्टिकल व जॉब स्किल्स' : 'Hands-on Practical Practice'}</span>
            </div>
          </div>

          {/* CTA Button Grid - Engineered for Large Mobile Touch Targets */}
          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-4 max-w-2xl mx-auto mb-8">
            {/* Primary CTA: APPLY NOW */}
            <button
              onClick={handleApplyClick}
              id="hero-apply-btn"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-extrabold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer min-h-[52px]"
            >
              <Send className="w-5 h-5 text-slate-900" />
              <span>{t.applyNow}</span>
            </button>

            {/* Secondary CTA: REGISTER NOW */}
            <button
              onClick={handleRegisterClick}
              id="hero-register-btn"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-extrabold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/40 shadow-lg shadow-indigo-600/30 active:scale-[0.98] transition-all cursor-pointer min-h-[52px]"
            >
              <Users className="w-5 h-5" />
              <span>{t.registerNow}</span>
            </button>
          </div>

          {/* Direct Instant Contact CTAs (Phone & WhatsApp) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto mb-10">
            {/* CALL NOW CTA */}
            <button
              onClick={handleCallClick}
              id="hero-call-btn"
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-bold text-slate-100 bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer min-h-[48px]"
            >
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.callNow}</span>
            </button>

            {/* WHATSAPP CTA */}
            <button
              onClick={handleWhatsAppClick}
              id="hero-whatsapp-btn"
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 shadow-md shadow-emerald-500/20 transition-all cursor-pointer min-h-[48px]"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-950 shrink-0" />
              <span>{t.chatWhatsApp}</span>
            </button>
          </div>

          {/* Social Proof & Instagram Presence Banner */}
          <div className="flex items-center justify-center mb-8">
            <button
              onClick={handleInstagramClick}
              id="hero-instagram-btn"
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-pink-400/40 hover:border-pink-400 text-xs text-white backdrop-blur-md transition-all cursor-pointer group shadow-sm"
              title="Official Instagram Page"
            >
              <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                <Instagram className="w-3.5 h-3.5" />
              </span>
              <span className="font-semibold text-slate-200">
                {lang === 'hi' ? 'इंस्टाग्राम:' : 'Follow on Instagram:'}{' '}
                <span className="text-pink-300 font-bold">{instagramHandle || '@hasuwaskillsacademy'}</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-pink-500/30 text-pink-200 px-2 py-0.5 rounded-full">
                {lang === 'hi' ? 'रील्स व टिप्स' : 'Reels & Tips'}
              </span>
            </button>
          </div>

          {/* Quick Course Jump Selector */}
          <div className="pt-4 border-t border-white/10">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
              {lang === 'hi' ? 'सीधे अपने मनपसंद कोर्स की जानकारी चुनें:' : 'Jump directly to your interested course:'}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => onSelectCourse('english')}
                className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-indigo-600/40 text-xs font-medium text-slate-200 border border-white/10 hover:border-indigo-400 transition-all cursor-pointer"
              >
                🗣️ {lang === 'hi' ? 'इंग्लिश स्पीकिंग' : 'English Speaking'}
              </button>
              <button
                onClick={() => onSelectCourse('computer')}
                className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-indigo-600/40 text-xs font-medium text-slate-200 border border-white/10 hover:border-indigo-400 transition-all cursor-pointer"
              >
                💻 {lang === 'hi' ? 'कंप्यूटर (DCA / ADCA / टाइपिंग)' : 'Computer (DCA / ADCA / Typing)'}
              </button>
              <button
                onClick={() => onSelectCourse('bollywood')}
                className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-indigo-600/40 text-xs font-medium text-slate-200 border border-white/10 hover:border-indigo-400 transition-all cursor-pointer"
              >
                🎤 {lang === 'hi' ? 'बॉलीवुड व हिंदी वोकल्स' : 'Bollywood & Hindi Vocals'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
