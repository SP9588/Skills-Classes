import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Share2, Send, Instagram } from 'lucide-react';
import { Language } from '../types';
import { trackEvent } from '../utils/analytics';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  instagramUrl?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, lang, instagramUrl }) => {
  const [copied, setCopied] = useState(false);
  const [instaCopied, setInstaCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://hasuwaskills.in';
  const shareTitle = 'English Speaking, Computer Courses & Bollywood Vocal Training | Hasuwa, Chhattisgarh';
  const shareText = 'Check out professional courses in English Speaking, Computer (DCA/ADCA/Typing), and Bollywood Hindi Vocal training near Shivrinayaran, Chhattisgarh:';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleWhatsApp = () => {
    trackEvent('whatsapp_clicked', { customSource: 'share_modal' });
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleInstagramShare = async () => {
    trackEvent('instagram_clicked', { customSource: 'share_modal' });
    try {
      await navigator.clipboard.writeText(`${shareTitle}\n${shareText}\n${shareUrl}`);
      setInstaCopied(true);
      setTimeout(() => setInstaCopied(false), 3000);
    } catch {
      // fallback
    }
    const target = instagramUrl || 'https://www.instagram.com';
    window.open(target, '_blank', 'noopener,noreferrer');
  };

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {lang === 'hi' ? 'पेज शेयर करें' : 'Share Landing Page'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'hi' ? 'विद्यार्थियों और परिजनों के साथ साझा करें' : 'Share with students, friends & local study groups'}
            </p>
          </div>
        </div>

        {instaCopied && (
          <div className="mb-4 p-2.5 rounded-xl bg-pink-50 border border-pink-200 text-xs text-pink-700 flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-pink-600 shrink-0" />
            <span>
              {lang === 'hi'
                ? 'कैप्शन व लिंक कॉपी हो गया! इंस्टाग्राम स्टोरी या डीएम में पेस्ट करें।'
                : 'Caption & link copied! Paste into your Instagram Story, DM or Bio.'}
            </span>
          </div>
        )}

        {/* Share buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
            <span>WhatsApp</span>
          </button>

          {/* Instagram */}
          <button
            onClick={handleInstagramShare}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-pink-900 bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 border border-pink-200 transition-all cursor-pointer"
          >
            <Instagram className="w-4 h-4 text-pink-600" />
            <span>Instagram</span>
          </button>

          {/* Facebook */}
          <button
            onClick={handleFacebook}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
          >
            <span className="font-black text-sm text-blue-700">f</span>
            <span>Facebook</span>
          </button>

          {/* Telegram */}
          <button
            onClick={handleTelegram}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4 text-sky-600" />
            <span>Telegram</span>
          </button>

          {/* X / Twitter */}
          <button
            onClick={handleTwitter}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors cursor-pointer"
          >
            <span className="font-black text-sm">𝕏</span>
            <span>Twitter</span>
          </button>

          {/* Copy Direct */}
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-indigo-600" />}
            <span>{copied ? (lang === 'hi' ? 'कॉपी हुआ' : 'Copied!') : (lang === 'hi' ? 'लिंक कॉपी' : 'Copy Link')}</span>
          </button>
        </div>

        {/* Copy Link Input */}
        <div className="border-t border-slate-100 pt-4">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            {lang === 'hi' ? 'वेबसाइट लिंक कॉपी करें' : 'Or copy web link directly'}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-mono select-all focus:outline-hidden"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{lang === 'hi' ? 'कॉपी हो गया' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'कॉपी करें' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
