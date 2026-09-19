import React from 'react';
import { Phone, MessageCircle, Globe, Shield, BookOpen, Instagram } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { trackEvent } from '../utils/analytics';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  phone: string;
  whatsapp: string;
  instagramUrl?: string;
  instagramHandle?: string;
  onOpenAdmin: () => void;
  onOpenRegister: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  phone,
  whatsapp,
  instagramUrl,
  instagramHandle,
  onOpenAdmin,
  onOpenRegister
}) => {
  const t = translations[lang];

  const handleCallClick = () => {
    trackEvent('call_now_clicked', { customSource: 'header' });
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_clicked', { customSource: 'header' });
    const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(t.default_whatsapp_msg || 'Hello, I would like information about your courses, fees and admission.')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleInstagramClick = () => {
    trackEvent('instagram_clicked', { customSource: 'header' });
    const targetUrl = instagramUrl || 'https://www.instagram.com/hasuwaskillsacademy';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors shadow-xs">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{t.admissionsOpen}</span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline text-amber-300 font-normal">{t.locationShort}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCallClick}
              className="flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer text-slate-200 font-semibold"
              title="Call Centre Directly"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{phone}</span>
            </button>

            <span className="hidden sm:inline text-slate-600">|</span>

            {/* Instagram Profile Quick Link */}
            <button
              onClick={handleInstagramClick}
              className="hidden sm:flex items-center gap-1.5 hover:text-pink-300 transition-colors cursor-pointer text-slate-200 font-semibold"
              title="Official Instagram Profile"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <span>{instagramHandle || '@hasuwaskillsacademy'}</span>
            </button>

            <span className="text-slate-600">|</span>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-white/10 rounded-md p-0.5 border border-white/10">
              <Globe className="w-3 h-3 text-slate-300 ml-1" />
              <button
                onClick={() => setLang('en')}
                className={`px-1.5 py-0.5 text-[11px] rounded font-semibold transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-1.5 py-0.5 text-[11px] rounded font-semibold transition-all cursor-pointer ${
                  lang === 'hi'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 leading-tight">
              {lang === 'hi' ? 'हसुवा स्किल्स एकेडमी' : 'Hasuwa Skills Academy'}
            </div>
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
              <span>{lang === 'hi' ? 'शिवरीनारायण, छ.ग.' : 'Near Shivrinayaran, CG'}</span>
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#courses" className="hover:text-indigo-600 transition-colors">
            {lang === 'hi' ? 'कोर्सेज' : 'Courses'}
          </a>
          <a href="#why-us" className="hover:text-indigo-600 transition-colors">
            {lang === 'hi' ? 'विशेषताएं' : 'Why Us'}
          </a>
          <a href="#faq" className="hover:text-indigo-600 transition-colors">
            {lang === 'hi' ? 'अक्सर पूछे जाने वाले सवाल' : 'FAQs'}
          </a>
          <a href="#contact" className="hover:text-indigo-600 transition-colors">
            {lang === 'hi' ? 'पता एवं संपर्क' : 'Contact'}
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Instagram Button */}
          <button
            onClick={handleInstagramClick}
            className="hidden lg:inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-pink-700 bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 border border-pink-200/80 transition-all shadow-xs cursor-pointer"
            title="Follow on Instagram"
          >
            <Instagram className="w-4 h-4 text-pink-600" />
            <span>Instagram</span>
          </button>

          <button
            onClick={handleWhatsAppClick}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-colors shadow-xs cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={onOpenRegister}
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-md shadow-indigo-600/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            {t.registerNow}
          </button>

          {/* Secure Admin Lock Button */}
          <button
            onClick={onOpenAdmin}
            aria-label="Admin Portal"
            title="Administrator Portal"
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
