import { AnalyticsEvent } from '../types';

// Extract UTM parameters safely from window.location
export function getCampaignParams() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  
  // Also check sessionStorage in case the user navigated within the site
  const storedUtm = sessionStorage.getItem('hasuwa_utm');
  let parsedStored: Record<string, string> = {};
  if (storedUtm) {
    try {
      parsedStored = JSON.parse(storedUtm);
    } catch {
      // ignore
    }
  }

  const current: Record<string, string> = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((key) => {
    const val = params.get(key);
    if (val) {
      current[key] = val;
    } else if (parsedStored[key]) {
      current[key] = parsedStored[key];
    }
  });

  // If new UTM found, update storage
  if (Object.keys(current).length > 0) {
    sessionStorage.setItem('hasuwa_utm', JSON.stringify(current));
  }

  return current;
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return 'anon';
  let sid = sessionStorage.getItem('hasuwa_sid');
  if (!sid) {
    sid = 'sid_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
    sessionStorage.setItem('hasuwa_sid', sid);
  }
  return sid;
}

export function getDeviceCategory(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

export function getBrowserCategory(): string {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Instagram')) return 'Instagram In-App';
  if (ua.includes('FBAN') || ua.includes('FBAV')) return 'Facebook In-App';
  if (ua.includes('WhatsApp')) return 'WhatsApp In-App';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edge')) return 'Edge';
  return 'Other Browser';
}

const trackedMilestones = new Set<string>();

export async function trackEvent(
  eventName: AnalyticsEvent['event_name'],
  extra?: { course?: string; customSource?: string }
) {
  if (typeof window === 'undefined') return;

  const utm = getCampaignParams();
  const sessionId = getSessionId();

  // Deduplicate scroll milestones in this session
  if (eventName.startsWith('scroll_')) {
    if (trackedMilestones.has(eventName)) return;
    trackedMilestones.add(eventName);
  }

  const payload = {
    event_name: eventName,
    session_id: sessionId,
    course: extra?.course,
    source: extra?.customSource || utm.utm_source || (document.referrer ? new URL(document.referrer, window.location.href).hostname : 'direct'),
    medium: utm.utm_medium || (document.referrer ? 'referral' : 'direct'),
    campaign: utm.utm_campaign || 'organic',
    content: utm.utm_content || '',
    device_category: getDeviceCategory(),
    browser_category: getBrowserCategory(),
    timestamp: new Date().toISOString()
  };

  try {
    // Send event to server
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch {
    // Graceful offline fallback
    try {
      const localEvents = JSON.parse(localStorage.getItem('hasuwa_offline_events') || '[]');
      localEvents.push(payload);
      if (localEvents.length > 50) localEvents.shift();
      localStorage.setItem('hasuwa_offline_events', JSON.stringify(localEvents));
    } catch {
      // ignore
    }
  }
}

export function trackPageView() {
  trackEvent('page_view');
  trackEvent('landing_page_loaded');
}

export function initScrollTracking() {
  if (typeof window === 'undefined') return () => {};

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const progress = Math.round((scrollTop / scrollHeight) * 100);

    if (progress >= 25) trackEvent('scroll_25');
    if (progress >= 50) trackEvent('scroll_50');
    if (progress >= 75) trackEvent('scroll_75');
    if (progress >= 90) trackEvent('scroll_90');
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}
