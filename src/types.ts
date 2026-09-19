export type CourseId = 'english' | 'computer' | 'bollywood' | 'all';
export type LearningMode = 'offline' | 'online' | 'both';
export type ContactMethod = 'whatsapp' | 'call' | 'email';
export type LeadStatus = 'New' | 'Contacted' | 'Interested' | 'Registered' | 'Not Interested';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  course: CourseId;
  learning_mode: LearningMode;
  preferred_contact: ContactMethod;
  message?: string;
  consent: boolean;
  source: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  status: LeadStatus;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsEvent {
  id: string;
  event_name:
    | 'page_view'
    | 'landing_page_loaded'
    | 'scroll_25'
    | 'scroll_50'
    | 'scroll_75'
    | 'scroll_90'
    | 'apply_now_clicked'
    | 'register_now_clicked'
    | 'call_now_clicked'
    | 'whatsapp_clicked'
    | 'share_clicked'
    | 'course_selected'
    | 'form_started'
    | 'form_submitted'
    | 'email_clicked'
    | 'map_contact_clicked'
    | 'instagram_clicked';
  session_id: string;
  course?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  device_category?: 'mobile' | 'tablet' | 'desktop';
  browser_category?: string;
  timestamp: string;
}

export interface CentreConfig {
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
  instagram_url?: string;
  instagram_handle?: string;
}

export interface AdminStats {
  total_visitors: number;
  unique_visitors: number;
  total_enquiries: number;
  conversion_rate: number;
  apply_clicks: number;
  register_clicks: number;
  phone_clicks: number;
  whatsapp_clicks: number;
  share_clicks: number;
  instagram_clicks?: number;
  course_breakdown: Record<string, number>;
  traffic_sources: Record<string, number>;
  campaign_performance: Array<{
    campaign: string;
    source: string;
    visitors: number;
    leads: number;
    conversion: number;
  }>;
  daily_metrics: Array<{
    date: string;
    visitors: number;
    enquiries: number;
  }>;
  funnel: {
    visitors: number;
    scroll_25: number;
    scroll_50: number;
    cta_clicks: number;
    form_started: number;
    form_submitted: number;
    confirmed_leads: number;
  };
}

export type Language = 'en' | 'hi';
