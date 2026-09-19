import React from 'react';
import { MapPin, Phone, MessageCircle, Navigation, Share2, Clock, Mail, ExternalLink, Instagram } from 'lucide-react';
import { Language, CentreConfig } from '../types';
import { translations } from '../data/translations';
import { trackEvent } from '../utils/analytics';

interface ContactLocationProps {
  lang: Language;
  config: CentreConfig;
  onOpenShare: () => void;
}

export const ContactLocation: React.FC<ContactLocationProps> = ({ lang, config, onOpenShare }) => {
  const t = translations[lang];

  const handleCall = () => {
    trackEvent('call_now_clicked', { customSource: 'contact_section' });
    window.location.href = `tel:${config.phone_number}`;
  };

  const handleWhatsApp = () => {
    trackEvent('whatsapp_clicked', { customSource: 'contact_section' });
    const cleanWhatsApp = config.whatsapp_number.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(config.default_whatsapp_msg || 'Hello, I would like information about your courses, fees and admission.')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleInstagram = () => {
    trackEvent('instagram_clicked', { customSource: 'contact_section' });
    const targetUrl = config.instagram_url || 'https://www.instagram.com/hasuwaskillsacademy';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleGetDirections = () => {
    trackEvent('map_contact_clicked', { customSource: 'contact_section' });
    // Search query for Hasuwa / Gidhauri / Shivrinayaran in Chhattisgarh
    const query = encodeURIComponent('Village Hasuwa, Gidhauri, Near Shivrinayaran, Chhattisgarh');
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    trackEvent('share_clicked', { customSource: 'contact_section' });
    onOpenShare();
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>{t.addressHeading}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            {lang === 'hi' ? 'हमारा पता एवं संपर्क विवरण' : 'Centre Location & Contact Information'}
          </h2>
          <p className="text-xs sm:text-base text-slate-600">
            {t.addressNote}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Official Centre Address */}
          <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-xl">
            {/* Background subtle light */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-amber-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                  PIN: {config.pincode}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white mb-4">
                {lang === 'hi' ? 'हसुवा कौशल एवं शिक्षा केंद्र' : 'Hasuwa Skills & Training Centre'}
              </h3>

              <div className="space-y-2 text-slate-300 text-sm sm:text-base mb-6 leading-relaxed font-medium">
                <p className="text-white font-bold">{config.village}</p>
                <p>{config.address_line2}</p>
                <p className="text-amber-300 font-semibold">{config.address_line1}</p>
                <p className="text-slate-400 text-xs">{config.landmark}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 mb-6 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">{lang === 'hi' ? 'पूछताछ समय: ' : 'Enquiry Hours: '}</span>
                  <span>{config.enquiry_hours}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-white/10">
              <button
                onClick={handleGetDirections}
                id="get-directions-btn"
                className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Navigation className="w-4 h-4" />
                <span>{t.getDirections}</span>
              </button>

              <button
                onClick={handleShare}
                id="share-page-btn"
                className="py-3 px-4 rounded-xl text-sm font-bold text-white bg-white/10 hover:bg-white/15 border border-white/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-indigo-300" />
                <span>{t.sharePage}</span>
              </button>
            </div>
          </div>

          {/* Card 2: Direct Contact Options */}
          <div className="rounded-3xl bg-slate-50 border border-slate-200/90 p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                {lang === 'hi' ? 'सीधे संपर्क करें या संदेश भेजें' : 'Direct Telephone & WhatsApp Contact'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                {lang === 'hi'
                  ? 'फीस संरचना, वर्तमान बैच और नए प्रवेश से जुड़े किसी भी सवाल के लिए संपर्क करें।'
                  : 'Contact freely for syllabus, duration, fee structure and offline/online batch schedules.'}
              </p>

              <div className="space-y-4 mb-8">
                {/* Phone Call Card */}
                <div
                  onClick={handleCall}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {lang === 'hi' ? 'फोन कॉल' : 'Telephone'}
                      </div>
                      <div className="text-base sm:text-lg font-black text-slate-900">
                        {config.phone_number}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 group-hover:underline">
                    {lang === 'hi' ? 'कॉल करें' : 'Call Now'} →
                  </span>
                </div>

                {/* WhatsApp Card */}
                <div
                  onClick={handleWhatsApp}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                      <MessageCircle className="w-5 h-5 fill-white" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        WhatsApp
                      </div>
                      <div className="text-base sm:text-lg font-black text-slate-900">
                        {config.phone_number}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 group-hover:underline">
                    {lang === 'hi' ? 'मैसेज भेजें' : 'Chat Now'} →
                  </span>
                </div>

                {/* Instagram Card */}
                <div
                  onClick={handleInstagram}
                  id="instagram-contact-card"
                  className="p-4 rounded-2xl bg-gradient-to-r from-purple-50/80 via-pink-50/80 to-amber-50/80 border border-pink-200/90 hover:border-pink-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      <Instagram className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-pink-700 flex items-center gap-1.5">
                        <span>{lang === 'hi' ? 'इंस्टाग्राम प्रोफाइल' : 'Instagram Profile'}</span>
                        <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-pink-100 text-pink-700 font-bold">REELS & DEMOS</span>
                      </div>
                      <div className="text-base sm:text-lg font-black text-slate-900">
                        {config.instagram_handle || '@hasuwaskillsacademy'}
                      </div>
                      <div className="text-[11px] text-slate-600">
                        {lang === 'hi' ? 'दैनिक इंग्लिश स्पीकिंग रील्स व छात्र प्रस्तुतियां' : 'Daily spoken English tips, vocal practice & batch announcements'}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-pink-600 group-hover:underline whitespace-nowrap pl-2">
                    {lang === 'hi' ? 'फॉलो करें' : 'Follow'} →
                  </span>
                </div>

                {/* Email Card */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {lang === 'hi' ? 'ईमेल' : 'Email Address'}
                    </div>
                    <div className="text-sm font-semibold text-slate-800">
                      {config.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pt-4 border-t border-slate-200/80">
              <p className="text-xs text-slate-500">
                {t.socialPromotionNotice}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
