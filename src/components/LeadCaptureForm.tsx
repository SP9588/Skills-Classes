import React, { useState, useEffect } from 'react';
import { Send, AlertCircle, Phone, MessageCircle, RefreshCw, ShieldCheck, Lock, Instagram } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Language, CourseId, LearningMode, ContactMethod } from '../types';
import { translations } from '../data/translations';
import { trackEvent, getCampaignParams, getSessionId } from '../utils/analytics';

interface LeadCaptureFormProps {
  lang: Language;
  selectedCourse: CourseId;
  setSelectedCourse: (course: CourseId) => void;
  phone: string;
  whatsapp: string;
  instagramUrl?: string;
  instagramHandle?: string;
}

// Framer Motion drawing animation variants for the success checkmark
const checkmarkCircleVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

const checkmarkStrokeVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      delay: 0.35,
      ease: 'easeOut'
    }
  }
};

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
  lang,
  selectedCourse,
  setSelectedCourse,
  phone,
  whatsapp,
  instagramUrl,
  instagramHandle
}) => {
  const t = translations[lang];

  // Form states
  const [name, setName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState<CourseId>(selectedCourse);
  const [learningMode, setLearningMode] = useState<LearningMode>('offline');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('call');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(true);
  const [honeypot, setHoneypot] = useState(''); // Hidden bot trap

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  // Sync external course selection
  useEffect(() => {
    setCourse(selectedCourse);
  }, [selectedCourse]);

  const handleFieldFocus = () => {
    if (!hasStartedTyping) {
      setHasStartedTyping(true);
      trackEvent('form_started', { course });
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      errors.name = lang === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें (कम से कम 2 अक्षर).' : 'Please enter your full name (minimum 2 characters).';
    }

    const cleanPhone = userPhone.replace(/[\s+-]/g, '');
    if (!cleanPhone || cleanPhone.length < 10 || cleanPhone.length > 13) {
      errors.phone = lang === 'hi' ? 'कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें.' : 'Please enter a valid 10-digit mobile number.';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = lang === 'hi' ? 'कृपया सही ईमेल दर्ज करें अथवा इसे खाली छोड़ दें.' : 'Please enter a valid email address or leave it blank.';
    }

    if (!consent) {
      errors.consent = lang === 'hi' ? 'कृपया नियम व संपर्क करने की सहमति स्वीकार करें.' : 'Please check the consent box to proceed.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    const utm = getCampaignParams();
    const sessionId = getSessionId();

    const payload = {
      name: name.trim(),
      phone: userPhone.trim(),
      email: email.trim(),
      course,
      learning_mode: learningMode,
      preferred_contact: contactMethod,
      message: message.trim(),
      consent,
      honeypot, // Anti-spam
      source: utm.utm_source || 'direct',
      medium: utm.utm_medium || 'web',
      campaign: utm.utm_campaign || 'organic',
      content: utm.utm_content || '',
      term: utm.utm_term || '',
      session_id: sessionId
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry.');
      }

      setSubmittedLeadId(data.leadId || 'HSW-' + Date.now().toString().slice(-4));
      trackEvent('form_submitted', { course });
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error. Please try again or contact us directly via phone or WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedLeadId(null);
    setName('');
    setUserPhone('');
    setEmail('');
    setMessage('');
    setFieldErrors({});
    setErrorMessage(null);
  };

  const handleWhatsAppFollowup = () => {
    trackEvent('whatsapp_clicked', { customSource: 'form_success' });
    const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, '');
    const courseTitle = t.courseOptions[course];
    const text = `Hello, I submitted an enquiry on your website (Ref: ${submittedLeadId}). My name is ${name}. I am interested in ${courseTitle}. Please share fee details and batch timings.`;
    window.open(`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleCallFollowup = () => {
    trackEvent('call_now_clicked', { customSource: 'form_success' });
    window.location.href = `tel:${phone}`;
  };

  return (
    <section id="register" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-indigo-50/40 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* AnimatePresence for seamless transition between form and success feedback */}
        <AnimatePresence mode="wait">
          {submittedLeadId ? (
            <motion.div
              key="success-card"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-200 shadow-xl text-center relative overflow-hidden"
            >
              {/* Top celebratory accent */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-600" />

              {/* Animated Checkmark Badge Container */}
              <div className="relative inline-flex items-center justify-center mx-auto mb-6">
                {/* Subtle outer radiating pulse rings */}
                <motion.span
                  className="absolute -inset-2.5 rounded-full bg-emerald-300/30 pointer-events-none"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [0.9, 1.35, 1.55], opacity: [0.7, 0.25, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                />
                <motion.span
                  className="absolute -inset-1 rounded-full bg-emerald-400/20 pointer-events-none"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.2, 1.35], opacity: [0.6, 0.2, 0] }}
                  transition={{ duration: 2, delay: 0.3, repeat: Infinity, ease: 'easeOut' }}
                />

                {/* Micro sparkle particles radiating outwards */}
                <motion.span
                  initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], x: 26, y: -24 }}
                  transition={{ duration: 0.65, delay: 0.32, ease: 'easeOut' }}
                  className="absolute w-2 h-2 rounded-full bg-emerald-400 pointer-events-none"
                />
                <motion.span
                  initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], x: -26, y: -22 }}
                  transition={{ duration: 0.65, delay: 0.36, ease: 'easeOut' }}
                  className="absolute w-1.5 h-1.5 rounded-full bg-teal-400 pointer-events-none"
                />
                <motion.span
                  initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], x: 24, y: 22 }}
                  transition={{ duration: 0.65, delay: 0.4, ease: 'easeOut' }}
                  className="absolute w-1.5 h-1.5 rounded-full bg-amber-400 pointer-events-none"
                />
                <motion.span
                  initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], x: -24, y: 24 }}
                  transition={{ duration: 0.65, delay: 0.38, ease: 'easeOut' }}
                  className="absolute w-2 h-2 rounded-full bg-emerald-400 pointer-events-none"
                />

                {/* Spring Pop Circular Badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 280,
                    damping: 18,
                    delay: 0.08
                  }}
                  className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-100 to-emerald-50 border border-emerald-200/90 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/15"
                >
                  {/* Precision SVG Checkmark with Drawn Path Stroke via Framer Motion */}
                  <svg
                    className="w-10 h-10 text-emerald-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <motion.circle
                      cx="12"
                      cy="12"
                      r="10"
                      variants={checkmarkCircleVariants}
                      initial="hidden"
                      animate="visible"
                    />
                    <motion.path
                      d="m8 12.5 2.8 2.8 5.4-5.6"
                      variants={checkmarkStrokeVariants}
                      initial="hidden"
                      animate="visible"
                    />
                  </svg>
                </motion.div>
              </div>

              {/* Thank You Success Message Feedback */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, delay: 0.22 }}
              >
                {/* Thank You Pill Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-300/80 text-emerald-800 text-xs sm:text-sm font-extrabold uppercase tracking-wide mb-3 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{t.thankYou}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                  {t.submissionSuccessTitle}
                </h3>

                <p className="text-base text-slate-600 max-w-xl mx-auto mb-6 leading-relaxed">
                  {t.submissionSuccessMsg}
                </p>
              </motion.div>

              {/* Reference ID Chip */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.32 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold mb-8 border border-slate-200 shadow-xs"
              >
                <span>{t.enquiryRef}:</span>
                <span className="font-mono text-indigo-700 font-extrabold tracking-wide">{submittedLeadId}</span>
              </motion.div>

              {/* Quick Next Steps */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-lg mx-auto mb-8"
              >
                <button
                  onClick={handleWhatsAppFollowup}
                  className="w-full sm:w-auto flex-1 py-3.5 px-5 rounded-xl text-sm font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 fill-emerald-950" />
                  <span>{t.whatsappUsNow}</span>
                </button>

                <button
                  onClick={handleCallFollowup}
                  className="w-full sm:w-auto flex-1 py-3.5 px-5 rounded-xl text-sm font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>{t.callUsNow}</span>
                </button>
              </motion.div>

              {/* Instagram Follow Connection Card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.44 }}
                className="max-w-md mx-auto mb-8 p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border border-pink-200 text-left flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-pink-700">
                      {lang === 'hi' ? 'इंस्टाग्राम पर जुड़ें' : 'Connect on Instagram'}
                    </div>
                    <div className="text-sm font-black text-slate-900">
                      {instagramHandle || '@hasuwaskillsacademy'}
                    </div>
                    <div className="text-[11px] text-slate-600">
                      {lang === 'hi' ? 'दैनिक वोकैबुलरी, स्पीकिंग रील्स व क्लास झलकियां' : 'Daily spoken reels, DCA tips & batch updates'}
                    </div>
                  </div>
                </div>
                <a
                  href={instagramUrl || 'https://www.instagram.com/hasuwaskillsacademy'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('instagram_clicked', { customSource: 'thank_you_screen' })}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white text-xs font-bold shrink-0 transition-transform active:scale-95 shadow-xs"
                >
                  {lang === 'hi' ? 'फॉलो करें' : 'Follow'}
                </a>
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.48 }}
                onClick={handleReset}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'अन्य कोर्स के लिए नई पूछताछ दर्ज करें' : 'Submit another enquiry for a different course'}</span>
              </motion.button>
            </motion.div>
          ) : (
            /* Main Lead Form */
            <motion.div
              key="lead-form-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12, scale: 0.99 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/90 shadow-xl relative overflow-hidden"
            >
              {/* Top decorative accent */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-indigo-600 to-emerald-500" />

              <div className="text-center max-w-2xl mx-auto mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'प्रवेश एवं पूछताछ फॉर्म' : 'Official Course Enquiry'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  {t.formTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  {t.formSubtitle}
                </p>
              </div>

              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Anti-spam hidden honeypot */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website_url">Do not fill this</label>
                  <input
                    type="text"
                    id="website_url"
                    name="website_url"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Row 1: Name and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="lead-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t.fieldName} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="lead-name"
                      type="text"
                      required
                      placeholder={t.fieldNamePlaceholder}
                      value={name}
                      onFocus={handleFieldFocus}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all ${
                        fieldErrors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                    {fieldErrors.name && (
                      <p className="text-xs text-rose-600 mt-1 font-medium">{fieldErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lead-phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t.fieldPhone} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                        🇮🇳 +91
                      </span>
                      <input
                        id="lead-phone"
                        type="tel"
                        required
                        placeholder={t.fieldPhonePlaceholder}
                        value={userPhone}
                        onFocus={handleFieldFocus}
                        onChange={(e) => {
                          setUserPhone(e.target.value);
                          if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: '' });
                        }}
                        className={`w-full pl-16 pr-4 py-3 rounded-xl border text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all ${
                          fieldErrors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                        }`}
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p className="text-xs text-rose-600 mt-1 font-medium">{fieldErrors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Row 2: Email and Course Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="lead-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t.fieldEmail}
                    </label>
                    <input
                      id="lead-email"
                      type="email"
                      placeholder={t.fieldEmailPlaceholder}
                      value={email}
                      onFocus={handleFieldFocus}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all ${
                        fieldErrors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="text-xs text-rose-600 mt-1 font-medium">{fieldErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lead-course" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t.fieldCourse} <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="lead-course"
                      value={course}
                      onChange={(e) => {
                        const val = e.target.value as CourseId;
                        setCourse(val);
                        setSelectedCourse(val);
                        trackEvent('course_selected', { course: val });
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    >
                      <option value="english">1. {t.courseOptions.english}</option>
                      <option value="computer">2. {t.courseOptions.computer}</option>
                      <option value="bollywood">3. {t.courseOptions.bollywood}</option>
                      <option value="all">4. {t.courseOptions.all}</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Learning Mode and Preferred Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="lead-mode" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t.fieldLearningMode}
                    </label>
                    <select
                      id="lead-mode"
                      value={learningMode}
                      onChange={(e) => setLearningMode(e.target.value as LearningMode)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    >
                      <option value="offline">{t.learningModes.offline}</option>
                      <option value="online">{t.learningModes.online}</option>
                      <option value="both">{t.learningModes.both}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="lead-contact-method" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t.fieldContactMethod}
                    </label>
                    <select
                      id="lead-contact-method"
                      value={contactMethod}
                      onChange={(e) => setContactMethod(e.target.value as ContactMethod)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    >
                      <option value="whatsapp">{t.contactMethods.whatsapp}</option>
                      <option value="call">{t.contactMethods.call}</option>
                      <option value="email">{t.contactMethods.email}</option>
                    </select>
                  </div>
                </div>

                {/* Row 4: Message / Enquiry */}
                <div>
                  <label htmlFor="lead-message" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.fieldMessage}
                  </label>
                  <textarea
                    id="lead-message"
                    rows={3}
                    placeholder={t.fieldMessagePlaceholder}
                    value={message}
                    onFocus={handleFieldFocus}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                  />
                </div>

                {/* Consent Checkbox (Explicit privacy consent mandated) */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => {
                        setConsent(e.target.checked);
                        if (fieldErrors.consent) setFieldErrors({ ...fieldErrors, consent: '' });
                      }}
                      className="w-4 h-4 mt-1 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer shrink-0"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      {t.consentText}
                    </span>
                  </label>
                  {fieldErrors.consent && (
                    <p className="text-xs text-rose-600 mt-1 font-medium pl-7">{fieldErrors.consent}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    id="submit-enquiry-btn"
                    className="w-full py-4 px-6 rounded-xl text-base font-extrabold text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 active:scale-[0.99] shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>{t.submitting}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>{t.submitButton}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Privacy disclosure */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>
                    {lang === 'hi'
                      ? 'आपकी जानकारी सुरक्षित है। हम कभी भी स्पैम या अवांछित संदेश नहीं भेजते।'
                      : 'Privacy Protected. We do not sell or spam your contact details.'}
                  </span>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
