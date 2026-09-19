# Hasuwa Skills Academy — Mobile-First Landing Page & Lead Generation System

A modern, highly responsive, bilingual (English & हिन्दी) educational landing page and lead-generation platform for an educational and creative skills centre located near **Shivrinayaran, Chhattisgarh** (Village Hasuwa, Balauda, Gidhauri).

Built for high-converting social media traffic coming from **Instagram, Facebook, WhatsApp, YouTube, X, Google, and QR Codes**.

---

## 🌟 Major Training Streams

1. **Course 1: English Speaking & Personality Development**
   - Spoken English, Grammar, Vocabulary, Reading, Writing, Listening, Daily Conversation, Pronunciation, Interview Communication, Public Speaking, Confidence Building.
2. **Course 2: Computer Science & Computer Courses**
   - Basic Computer Course, DCA, ADCA, PGDCA, English Typing, Hindi Typing (Kruti Dev / Remington / Mangal), Web Designing (HTML/CSS), Basic Programming Concepts, Internet & Digital Skills, Office Productivity.
3. **Course 3: Bollywood & Hindi Vocal Training**
   - Bollywood Songs, Hindi Songs, Vocal Training, Singing Practice, Voice Improvement, Sur & Rhythm Practice, Song Performance, Recording Practice, Stage Confidence, Bollywood Singing Techniques (Clearly focused on film/vocal practice, not advertised as classical music).

---

## 🚀 Key Features

- **High-Conversion Mobile-First Hero**:
  - Direct Action CTAs: `REGISTER NOW`, `APPLY NOW`, `CALL NOW — 9279120271`, `CHAT ON WHATSAPP`.
- **Sticky Mobile Bottom Bar**:
  - `[📞 CALL]` `[💬 WHATSAPP]` `[📝 REGISTER]` with zero layout interference.
- **Lead Capture & Anti-Spam Form**:
  - Course selection, offline/online learning mode, preferred contact method, explicit consent checkbox.
  - Honeypot anti-spam trap, rate limiting, and instant reference ID.
- **Bilingual Interface**:
  - 1-click toggle between **ENGLISH** and **हिन्दी** across all UI elements, courses, trust points, and FAQs.
- **Privacy-Conscious First-Party Analytics**:
  - Tracks UTM campaign parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`).
  - Milestone scroll tracking (25%, 50%, 75%, 90%), CTA click events, and anonymous session tracking without third-party surveillance.
- **Full Administrator Dashboard**:
  - Metrics cards: Total Visitors, Enquiries, Conversion Rate, CTA click breakdowns.
  - Conversion Funnel (Visitors → Scroll 25% → Scroll 50% → CTA Click → Form Started → Form Submitted → Confirmed Lead).
  - Charts for daily visitor and enquiry trends, course popularity, traffic sources, and UTM campaigns.
  - Interactive Lead Management: Search, filter by course/status, update lead status (New, Contacted, Interested, Registered, Not Interested), private admin notes, 1-click WhatsApp/Call to student, and CSV Export.
- **Configurable Centre Info**:
  - Configurable Phone number (`9279120271`), WhatsApp number (`919279120271`), address, and hours.
- **Native Social Sharing**:
  - Native Web Share API with instant fallbacks to WhatsApp, Facebook, X, Telegram, and Copy Link.
- **SEO & Social Sharing Ready**:
  - OpenGraph cards, Twitter Card tags, and Schema.org EducationalOrganization structured JSON-LD.
- **Supabase & Vercel Ready**:
  - Includes `supabase/schema.sql` with full tables and Row Level Security (RLS) policies for ₹0 deployment.

---

## 🛠️ Local Development & Running

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run in development**:
   ```bash
   npm run dev
   ```
   The application runs on `http://localhost:3000`.

3. **Admin Dashboard Access**:
   - Click the subtle **Admin Portal** link in the footer, or the lock button in the header.
   - Enter the admin access key: `admin2026` (configurable via `ADMIN_ACCESS_KEY` in `.env`).

4. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

---

## 🔐 Environment Variables (.env.example)

```env
PHONE_NUMBER="9279120271"
WHATSAPP_NUMBER="919279120271"
ADMIN_ACCESS_KEY="admin2026"

# Optional Cloud Supabase Integration
SUPABASE_URL=""
SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""
```

---

## 📍 Centre Address
- **Village Hasuwa, Balauda**, Gidhauri
- Near Shivrinayaran, Chhattisgarh
- Contact: **9279120271**
