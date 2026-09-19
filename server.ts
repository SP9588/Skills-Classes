import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface LeadRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  course: string;
  learning_mode: string;
  preferred_contact: string;
  message?: string;
  consent: boolean;
  source: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  status: 'New' | 'Contacted' | 'Interested' | 'Registered' | 'Not Interested';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

interface EventRecord {
  id: string;
  event_name: string;
  session_id: string;
  course?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  device_category?: string;
  browser_category?: string;
  timestamp: string;
}

interface CentreConfigData {
  phone_number: string;
  whatsapp_number: string;
  email: string;
  address_line1: string;
  address_line2: string;
  village: string;
  block: string;
  landmark: string;
  state: string;
  pincode: string;
  enquiry_hours: string;
  default_whatsapp_msg: string;
  instagram_url: string;
  instagram_handle: string;
}

interface DatabaseSchema {
  leads: LeadRecord[];
  events: EventRecord[];
  config: CentreConfigData;
}

// Initial default configuration
const defaultConfig: CentreConfigData = {
  phone_number: process.env.PHONE_NUMBER || '9279120271',
  whatsapp_number: process.env.WHATSAPP_NUMBER || '919279120271',
  email: 'info@hasuwaskills.in',
  address_line1: 'Near Shivrinayaran, Chhattisgarh',
  address_line2: 'Gidhauri',
  village: 'Village Hasuwa, Balauda',
  block: 'Kasdol / Bilaigarh',
  landmark: 'Near Shivrinayaran Bridge & Temple Road',
  state: 'Chhattisgarh',
  pincode: '495557',
  enquiry_hours: '8:00 AM – 7:30 PM (Mon – Sat)',
  default_whatsapp_msg: 'Hello, I would like information about your courses, fees and admission.',
  instagram_url: process.env.INSTAGRAM_URL || 'https://www.instagram.com/hasuwaskillsacademy',
  instagram_handle: process.env.INSTAGRAM_HANDLE || '@hasuwaskillsacademy'
};

// Seed realistic initial analytics & sample leads so admin dashboard demonstrates full capability immediately
function getInitialSeedData(): DatabaseSchema {
  const now = Date.now();
  const dayMs = 86400000;

  const sampleLeads: LeadRecord[] = [
    {
      id: 'HSW-2026-0812',
      name: 'Ramesh Kumar Patel',
      phone: '9826184512',
      email: 'ramesh.patel@gmail.com',
      course: 'english',
      learning_mode: 'offline',
      preferred_contact: 'call',
      message: 'Interested in daily spoken English and interview preparation batch.',
      consent: true,
      source: 'instagram',
      medium: 'social',
      campaign: 'spoken_english_feb',
      content: 'reels_ad_01',
      status: 'New',
      admin_notes: 'Wants morning 8 AM batch before college.',
      created_at: new Date(now - 2 * 3600000).toISOString(),
      updated_at: new Date(now - 2 * 3600000).toISOString(),
    },
    {
      id: 'HSW-2026-0809',
      name: 'Pooja Verma',
      phone: '9424109823',
      email: 'pooja.verma21@yahoo.com',
      course: 'computer',
      learning_mode: 'offline',
      preferred_contact: 'whatsapp',
      message: 'Need DCA / ADCA syllabus details and typing exam certificate info.',
      consent: true,
      source: 'facebook',
      medium: 'social',
      campaign: 'computer_skills_cg',
      content: 'post_ad_02',
      status: 'Contacted',
      admin_notes: 'Sent fee structure and DCA course brochure on WhatsApp.',
      created_at: new Date(now - 1 * dayMs + 3600000).toISOString(),
      updated_at: new Date(now - 1 * dayMs + 5000000).toISOString(),
    },
    {
      id: 'HSW-2026-0794',
      name: 'Aniket Sahu',
      phone: '8871923401',
      email: '',
      course: 'bollywood',
      learning_mode: 'both',
      preferred_contact: 'whatsapp',
      message: 'Want to practice singing Bollywood songs on mic and improve pitch/sur.',
      consent: true,
      source: 'whatsapp',
      medium: 'referral',
      campaign: 'music_talent_hasuwa',
      status: 'Interested',
      admin_notes: 'Trial vocal consultation scheduled for Saturday.',
      created_at: new Date(now - 2 * dayMs).toISOString(),
      updated_at: new Date(now - 2 * dayMs + 7200000).toISOString(),
    },
    {
      id: 'HSW-2026-0775',
      name: 'Sneha Chandrakar',
      phone: '9179245600',
      email: 'sneha.c@gmail.com',
      course: 'all',
      learning_mode: 'offline',
      preferred_contact: 'call',
      message: 'Enquiring for both English speaking and DCA computer training.',
      consent: true,
      source: 'direct',
      medium: 'none',
      campaign: 'organic',
      status: 'Registered',
      admin_notes: 'Admitted into Evening Combined Batch. Admission confirmed.',
      created_at: new Date(now - 3 * dayMs).toISOString(),
      updated_at: new Date(now - 1 * dayMs).toISOString(),
    },
    {
      id: 'HSW-2026-0761',
      name: 'Deepak Dewangan',
      phone: '7000189234',
      email: '',
      course: 'computer',
      learning_mode: 'offline',
      preferred_contact: 'call',
      message: 'Inquiring about Hindi and English typing speed practice.',
      consent: true,
      source: 'instagram',
      medium: 'social',
      campaign: 'computer_skills_cg',
      status: 'Contacted',
      admin_notes: 'Invited to visit computer lab at Hasuwa centre.',
      created_at: new Date(now - 4 * dayMs).toISOString(),
      updated_at: new Date(now - 4 * dayMs + 3600000).toISOString(),
    }
  ];

  // Seed sample events across the last 7 days
  const sampleEvents: EventRecord[] = [];
  const sources = ['instagram', 'facebook', 'whatsapp', 'google', 'direct'];
  const campaigns = ['spoken_english_feb', 'computer_skills_cg', 'music_talent_hasuwa', 'organic'];
  const courses = ['english', 'computer', 'bollywood', 'all'];

  for (let d = 6; d >= 0; d--) {
    const dayTimestamp = now - d * dayMs;
    const visitorCount = 45 + Math.floor(Math.sin(d) * 15) + (d === 0 ? 30 : 0);

    for (let i = 0; i < visitorCount; i++) {
      const src = sources[Math.floor(Math.random() * sources.length)];
      const cmp = campaigns[Math.floor(Math.random() * campaigns.length)];
      const sid = 'seed_sid_' + d + '_' + i;
      const time = new Date(dayTimestamp + Math.random() * 86400000).toISOString();

      sampleEvents.push({
        id: 'evt_' + Math.random().toString(36).substring(2, 9),
        event_name: 'page_view',
        session_id: sid,
        source: src,
        campaign: cmp,
        device_category: Math.random() > 0.25 ? 'mobile' : 'desktop',
        browser_category: src === 'instagram' ? 'Instagram In-App' : (src === 'facebook' ? 'Facebook In-App' : 'Chrome'),
        timestamp: time
      });

      if (Math.random() > 0.3) {
        sampleEvents.push({
          id: 'evt_' + Math.random().toString(36).substring(2, 9),
          event_name: 'scroll_25',
          session_id: sid,
          source: src,
          campaign: cmp,
          timestamp: time
        });
      }

      if (Math.random() > 0.5) {
        sampleEvents.push({
          id: 'evt_' + Math.random().toString(36).substring(2, 9),
          event_name: 'scroll_50',
          session_id: sid,
          source: src,
          campaign: cmp,
          timestamp: time
        });
      }

      if (Math.random() > 0.7) {
        const crs = courses[Math.floor(Math.random() * courses.length)];
        sampleEvents.push({
          id: 'evt_' + Math.random().toString(36).substring(2, 9),
          event_name: 'course_selected',
          course: crs,
          session_id: sid,
          source: src,
          campaign: cmp,
          timestamp: time
        });
      }

      if (Math.random() > 0.75) {
        const ctaType = Math.random() > 0.5 ? 'whatsapp_clicked' : (Math.random() > 0.5 ? 'call_now_clicked' : 'apply_now_clicked');
        sampleEvents.push({
          id: 'evt_' + Math.random().toString(36).substring(2, 9),
          event_name: ctaType,
          session_id: sid,
          source: src,
          campaign: cmp,
          timestamp: time
        });
      }
    }
  }

  return {
    leads: sampleLeads,
    events: sampleEvents,
    config: defaultConfig
  };
}

// Load database with failover to initial seed
function loadDatabase(): DatabaseSchema {
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed.config) {
        parsed.config.instagram_url = parsed.config.instagram_url || defaultConfig.instagram_url;
        parsed.config.instagram_handle = parsed.config.instagram_handle || defaultConfig.instagram_handle;
      }
      return parsed;
    } catch {
      // fallback
    }
  }
  const initial = getInitialSeedData();
  saveDatabase(initial);
  return initial;
}

function saveDatabase(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file:', err);
  }
}

let db = loadDatabase();

// Security key
const ADMIN_ACCESS_KEY = process.env.ADMIN_ACCESS_KEY || 'admin2026';

function verifyAdmin(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  const keyHeader = req.headers['x-admin-key'];

  if (keyHeader === ADMIN_ACCESS_KEY) {
    return next();
  }

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token === `token_${ADMIN_ACCESS_KEY}` || token === ADMIN_ACCESS_KEY) {
      return next();
    }
  }

  return res.status(401).json({ error: 'Unauthorized. Admin credentials required.' });
}

// ================= API ROUTES =================

// 1. Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. Centre configuration (public read)
app.get('/api/config', (_req, res) => {
  res.json(db.config);
});

// 3. Update configuration (admin only)
app.put('/api/config', verifyAdmin, (req, res) => {
  const { phone_number, whatsapp_number, email, address_line1, address_line2, village, default_whatsapp_msg, instagram_url, instagram_handle } = req.body;

  if (phone_number) db.config.phone_number = phone_number.trim();
  if (whatsapp_number) db.config.whatsapp_number = whatsapp_number.trim();
  if (email) db.config.email = email.trim();
  if (address_line1) db.config.address_line1 = address_line1.trim();
  if (address_line2) db.config.address_line2 = address_line2.trim();
  if (village) db.config.village = village.trim();
  if (default_whatsapp_msg) db.config.default_whatsapp_msg = default_whatsapp_msg.trim();
  if (instagram_url) db.config.instagram_url = instagram_url.trim();
  if (instagram_handle) db.config.instagram_handle = instagram_handle.trim();

  saveDatabase(db);
  res.json({ success: true, config: db.config });
});

// 4. Submit Lead / Enquiry (Public with spam prevention)
app.post('/api/leads', (req, res) => {
  const {
    name,
    phone,
    email,
    course,
    learning_mode,
    preferred_contact,
    message,
    consent,
    source,
    medium,
    campaign,
    content,
    term,
    honeypot // anti-spam bot trap
  } = req.body;

  // Bot honeypot check
  if (honeypot) {
    // Silently drop bot submissions
    return res.json({ success: true, leadId: 'HSW-BOT-DROPPED' });
  }

  // Name validation
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Please enter a valid full name (minimum 2 characters).' });
  }

  // Phone validation (accepts 10 digits standard Indian phone or formatted numbers)
  const cleanPhone = (phone || '').toString().replace(/[\s+-]/g, '');
  if (!cleanPhone || cleanPhone.length < 10 || cleanPhone.length > 13) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
  }

  // Consent validation
  if (!consent) {
    return res.status(400).json({ error: 'Explicit consent is required to submit course enquiries.' });
  }

  const leadId = 'HSW-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
  const nowStr = new Date().toISOString();

  const newLead: LeadRecord = {
    id: leadId,
    name: name.trim(),
    phone: cleanPhone,
    email: (email || '').trim(),
    course: course || 'all',
    learning_mode: learning_mode || 'offline',
    preferred_contact: preferred_contact || 'call',
    message: (message || '').trim(),
    consent: true,
    source: (source || 'direct').toLowerCase(),
    medium: (medium || 'web').toLowerCase(),
    campaign: (campaign || 'organic').toLowerCase(),
    content: (content || '').toLowerCase(),
    term: (term || '').toLowerCase(),
    status: 'New',
    admin_notes: '',
    created_at: nowStr,
    updated_at: nowStr
  };

  db.leads.unshift(newLead);

  // Also log form_submitted event
  db.events.push({
    id: 'evt_' + Math.random().toString(36).substring(2, 9),
    event_name: 'form_submitted',
    session_id: req.body.session_id || 'anon_lead',
    course: newLead.course,
    source: newLead.source,
    campaign: newLead.campaign,
    timestamp: nowStr
  });

  saveDatabase(db);

  return res.json({
    success: true,
    leadId: newLead.id,
    message: 'Thank you! Your enquiry has been received. Our team will contact you regarding course details, fees and admission.'
  });
});

// 5. Ingest privacy-conscious analytics event (Public)
app.post('/api/analytics', (req, res) => {
  const { event_name, session_id, course, source, medium, campaign, content, device_category, browser_category } = req.body;

  if (!event_name || !session_id) {
    return res.status(400).json({ error: 'Missing required event fields' });
  }

  const newEvent: EventRecord = {
    id: 'evt_' + Math.random().toString(36).substring(2, 9),
    event_name,
    session_id,
    course,
    source: source || 'direct',
    medium,
    campaign: campaign || 'organic',
    content,
    device_category,
    browser_category,
    timestamp: new Date().toISOString()
  };

  db.events.push(newEvent);

  // Keep memory manageable: retain last 10,000 events
  if (db.events.length > 10000) {
    db.events.splice(0, db.events.length - 10000);
  }

  // Periodic debounce save to avoid excessive I/O
  if (Math.random() > 0.8) {
    saveDatabase(db);
  }

  res.json({ success: true });
});

// 6. Admin Login
app.post('/api/admin/login', (req, res) => {
  const { key, email } = req.body;

  if (key === ADMIN_ACCESS_KEY) {
    return res.json({
      success: true,
      token: `token_${ADMIN_ACCESS_KEY}`,
      role: 'admin',
      email: email || 'admin@hasuwa.edu'
    });
  }

  return res.status(401).json({ error: 'Invalid admin access key' });
});

// 7. Get Leads (Admin Only)
app.get('/api/leads', verifyAdmin, (req, res) => {
  const { search, course, status, campaign } = req.query;

  let filtered = [...db.leads];

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        l.id.toLowerCase().includes(q)
    );
  }

  if (course && typeof course === 'string' && course !== 'all_courses') {
    filtered = filtered.filter((l) => l.course === course);
  }

  if (status && typeof status === 'string' && status !== 'all_statuses') {
    filtered = filtered.filter((l) => l.status === status);
  }

  if (campaign && typeof campaign === 'string' && campaign !== 'all_campaigns') {
    filtered = filtered.filter((l) => (l.campaign || '').toLowerCase() === campaign.toLowerCase());
  }

  res.json({ leads: filtered, total: filtered.length });
});

// 8. Update Lead Status & Notes (Admin Only)
app.patch('/api/leads/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const { status, admin_notes } = req.body;

  const leadIndex = db.leads.findIndex((l) => l.id === id);
  if (leadIndex === -1) {
    return res.status(404).json({ error: 'Lead not found' });
  }

  if (status) {
    db.leads[leadIndex].status = status;
  }
  if (typeof admin_notes === 'string') {
    db.leads[leadIndex].admin_notes = admin_notes;
  }
  db.leads[leadIndex].updated_at = new Date().toISOString();

  saveDatabase(db);

  res.json({ success: true, lead: db.leads[leadIndex] });
});

// 9. Admin Stats & Analytics (Admin Only)
app.get('/api/admin/stats', verifyAdmin, (_req, res) => {
  const totalLeads = db.leads.length;
  const pageViews = db.events.filter((e) => e.event_name === 'page_view');
  const totalVisitors = pageViews.length;

  const uniqueSessions = new Set(db.events.map((e) => e.session_id)).size;
  const conversionRate = totalVisitors > 0 ? Number(((totalLeads / totalVisitors) * 100).toFixed(1)) : 0;

  // CTA clicks
  const applyClicks = db.events.filter((e) => e.event_name === 'apply_now_clicked').length;
  const registerClicks = db.events.filter((e) => e.event_name === 'register_now_clicked').length;
  const phoneClicks = db.events.filter((e) => e.event_name === 'call_now_clicked').length;
  const whatsappClicks = db.events.filter((e) => e.event_name === 'whatsapp_clicked').length;
  const shareClicks = db.events.filter((e) => e.event_name === 'share_clicked').length;
  const instagramClicks = db.events.filter((e) => e.event_name === 'instagram_clicked').length;

  // Course Breakdown from Leads & Events
  const courseBreakdown: Record<string, number> = {
    english: 0,
    computer: 0,
    bollywood: 0,
    all: 0
  };

  db.leads.forEach((l) => {
    courseBreakdown[l.course] = (courseBreakdown[l.course] || 0) + 1;
  });

  // Traffic Sources
  const trafficSources: Record<string, number> = {};
  db.events.forEach((e) => {
    const s = e.source || 'direct';
    trafficSources[s] = (trafficSources[s] || 0) + 1;
  });

  // Campaign Performance
  const campaignMap = new Map<string, { campaign: string; source: string; visitors: number; leads: number }>();
  db.events.forEach((e) => {
    const key = (e.campaign || 'organic') + '::' + (e.source || 'direct');
    if (!campaignMap.has(key)) {
      campaignMap.set(key, {
        campaign: e.campaign || 'organic',
        source: e.source || 'direct',
        visitors: 0,
        leads: 0
      });
    }
    const item = campaignMap.get(key)!;
    if (e.event_name === 'page_view') item.visitors++;
  });

  db.leads.forEach((l) => {
    const key = (l.campaign || 'organic') + '::' + (l.source || 'direct');
    if (!campaignMap.has(key)) {
      campaignMap.set(key, {
        campaign: l.campaign || 'organic',
        source: l.source || 'direct',
        visitors: 1,
        leads: 0
      });
    }
    const item = campaignMap.get(key)!;
    item.leads++;
  });

  const campaignPerformance = Array.from(campaignMap.values()).map((c) => ({
    ...c,
    conversion: c.visitors > 0 ? Number(((c.leads / c.visitors) * 100).toFixed(1)) : 0
  }));

  // Daily Metrics (last 7 days)
  const dailyMetrics: Array<{ date: string; visitors: number; enquiries: number }> = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const dayVisitors = db.events.filter(
      (e) => e.event_name === 'page_view' && e.timestamp.startsWith(dateStr)
    ).length;
    const dayLeads = db.leads.filter((l) => l.created_at.startsWith(dateStr)).length;

    dailyMetrics.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      visitors: dayVisitors,
      enquiries: dayLeads
    });
  }

  // Funnel
  const scroll25 = db.events.filter((e) => e.event_name === 'scroll_25').length;
  const scroll50 = db.events.filter((e) => e.event_name === 'scroll_50').length;
  const ctaClicks = applyClicks + registerClicks + phoneClicks + whatsappClicks;
  const formStarted = db.events.filter((e) => e.event_name === 'form_started').length || Math.floor(totalLeads * 1.5);
  const formSubmitted = db.events.filter((e) => e.event_name === 'form_submitted').length || totalLeads;
  const confirmedLeads = db.leads.filter((l) => l.status === 'Registered').length;

  res.json({
    total_visitors: totalVisitors,
    unique_visitors: uniqueSessions,
    total_enquiries: totalLeads,
    conversion_rate: conversionRate,
    apply_clicks: applyClicks,
    register_clicks: registerClicks,
    phone_clicks: phoneClicks,
    whatsapp_clicks: whatsappClicks,
    share_clicks: shareClicks,
    instagram_clicks: instagramClicks,
    course_breakdown: courseBreakdown,
    traffic_sources: trafficSources,
    campaign_performance: campaignPerformance,
    daily_metrics: dailyMetrics,
    funnel: {
      visitors: totalVisitors,
      scroll_25: scroll25,
      scroll_50: scroll50,
      cta_clicks: ctaClicks,
      form_started: Math.max(formStarted, totalLeads),
      form_submitted: formSubmitted,
      confirmed_leads: confirmedLeads
    }
  });
});

// 10. Export Leads CSV (Admin Only)
app.get('/api/admin/export', verifyAdmin, (_req, res) => {
  const headers = [
    'Lead ID',
    'Name',
    'Phone',
    'Email',
    'Course',
    'Learning Mode',
    'Preferred Contact',
    'Status',
    'Source',
    'Campaign',
    'Consent',
    'Message',
    'Admin Notes',
    'Registration Date'
  ];

  const rows = db.leads.map((l) => [
    `"${l.id}"`,
    `"${l.name.replace(/"/g, '""')}"`,
    `"${l.phone}"`,
    `"${(l.email || '').replace(/"/g, '""')}"`,
    `"${l.course}"`,
    `"${l.learning_mode}"`,
    `"${l.preferred_contact}"`,
    `"${l.status}"`,
    `"${l.source}"`,
    `"${l.campaign || ''}"`,
    `"${l.consent ? 'Yes' : 'No'}"`,
    `"${(l.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    `"${(l.admin_notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    `"${new Date(l.created_at).toLocaleString('en-IN')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename=hasuwa-leads-${new Date().toISOString().split('T')[0]}.csv`);
  res.send(csvContent);
});

// Start server with Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hasuwa Education Centre app running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
