-- ==============================================================================
-- HASUWA SKILLS ACADEMY - SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Location: Hasuwa, Gidhauri, near Shivrinayaran, Chhattisgarh
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. LEADS TABLE (Stores Student Course Registrations & Inquiries)
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY DEFAULT ('HSW-' || to_char(CURRENT_DATE, 'YYYY') || '-' || floor(1000 + random() * 9000)::text),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    course VARCHAR(50) NOT NULL DEFAULT 'all',
    learning_mode VARCHAR(20) NOT NULL DEFAULT 'offline',
    preferred_contact VARCHAR(20) NOT NULL DEFAULT 'call',
    message TEXT,
    consent BOOLEAN NOT NULL DEFAULT true,
    source VARCHAR(100) DEFAULT 'direct',
    medium VARCHAR(100) DEFAULT 'web',
    campaign VARCHAR(100) DEFAULT 'organic',
    content VARCHAR(100),
    term VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'New', -- New, Contacted, Interested, Registered, Not Interested
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexing for high-performance admin queries
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_course ON public.leads(course);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_campaign ON public.leads(campaign);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON public.leads(phone);

-- 3. ANALYTICS EVENTS TABLE (Privacy-Conscious Aggregated Event Logging)
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name VARCHAR(100) NOT NULL,
    session_id VARCHAR(100) NOT NULL,
    course VARCHAR(50),
    source VARCHAR(100) DEFAULT 'direct',
    medium VARCHAR(100),
    campaign VARCHAR(100) DEFAULT 'organic',
    content VARCHAR(100),
    device_category VARCHAR(20),
    browser_category VARCHAR(50),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_name_time ON public.analytics_events(event_name, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_events_session ON public.analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_campaign ON public.analytics_events(campaign);

-- 4. CENTRE CONFIGURATION TABLE
CREATE TABLE IF NOT EXISTS public.centre_config (
    id INT PRIMARY KEY DEFAULT 1,
    phone_number VARCHAR(20) NOT NULL DEFAULT '9279120271',
    whatsapp_number VARCHAR(20) NOT NULL DEFAULT '919279120271',
    email VARCHAR(255) NOT NULL DEFAULT 'info@hasuwaskills.in',
    address_line1 VARCHAR(255) NOT NULL DEFAULT 'Near Shivrinayaran, Chhattisgarh',
    address_line2 VARCHAR(255) NOT NULL DEFAULT 'Gidhauri',
    village VARCHAR(255) NOT NULL DEFAULT 'Village Hasuwa, Balauda',
    enquiry_hours VARCHAR(100) NOT NULL DEFAULT '8:00 AM – 7:30 PM (Mon – Sat)',
    default_whatsapp_msg TEXT NOT NULL DEFAULT 'Hello, I would like information about your courses, fees and admission.',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.centre_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 1. Leads Table Policies:
-- Allow any anonymous public visitor to INSERT their course enquiry
CREATE POLICY "Public can submit course enquiries"
ON public.leads
FOR INSERT
TO public
WITH CHECK (consent = true AND length(name) >= 2 AND length(phone) >= 10);

-- Only authenticated administrators can VIEW leads
CREATE POLICY "Only admins can view lead submissions"
ON public.leads
FOR SELECT
TO authenticated
USING (true);

-- Only authenticated administrators can UPDATE lead status & notes
CREATE POLICY "Only admins can update leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 2. Analytics Events Table Policies:
-- Public can log privacy-conscious anonymous events
CREATE POLICY "Public can insert analytics events"
ON public.analytics_events
FOR INSERT
TO public
WITH CHECK (true);

-- Only authenticated admins can read analytics events for reporting
CREATE POLICY "Only admins can view analytics events"
ON public.analytics_events
FOR SELECT
TO authenticated
USING (true);

-- 3. Centre Config Table Policies:
-- Public can read centre contact details
CREATE POLICY "Public can view centre configuration"
ON public.centre_config
FOR SELECT
TO public
USING (true);

-- Only admins can modify contact configuration
CREATE POLICY "Only admins can update centre configuration"
ON public.centre_config
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
