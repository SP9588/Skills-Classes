import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  Eye,
  TrendingUp,
  Phone,
  MessageCircle,
  Share2,
  Download,
  Filter,
  Search,
  CheckCircle,
  Clock,
  Settings,
  RefreshCw,
  LogOut,
  ChevronRight,
  Shield,
  Layers,
  BarChart3,
  Calendar,
  Sparkles,
  Instagram
} from 'lucide-react';
import { Lead, AdminStats, CentreConfig, LeadStatus } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  config: CentreConfig;
  onUpdateConfig: (newConfig: CentreConfig) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig
}) => {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Tab navigation
  const [activeTab, setActiveTab] = useState<'metrics' | 'leads' | 'campaigns' | 'settings'>('metrics');

  // Data states
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all_courses');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all_statuses');
  const [selectedCampaignFilter, setSelectedCampaignFilter] = useState('all_campaigns');

  // Config editing state
  const [editPhone, setEditPhone] = useState(config.phone_number);
  const [editWhatsApp, setEditWhatsApp] = useState(config.whatsapp_number);
  const [editEmail, setEditEmail] = useState(config.email);
  const [editAddress1, setEditAddress1] = useState(config.address_line1);
  const [editAddress2, setEditAddress2] = useState(config.address_line2);
  const [editVillage, setEditVillage] = useState(config.village);
  const [editInstagramUrl, setEditInstagramUrl] = useState(config.instagram_url || '');
  const [editInstagramHandle, setEditInstagramHandle] = useState(config.instagram_handle || '');
  const [configSaveMsg, setConfigSaveMsg] = useState<string | null>(null);

  // Sync state if external config updates
  useEffect(() => {
    setEditPhone(config.phone_number);
    setEditWhatsApp(config.whatsapp_number);
    setEditEmail(config.email);
    setEditAddress1(config.address_line1);
    setEditAddress2(config.address_line2);
    setEditVillage(config.village);
    setEditInstagramUrl(config.instagram_url || '');
    setEditInstagramHandle(config.instagram_handle || '');
  }, [config]);

  // Load token from storage on mount
  useEffect(() => {
    const savedToken = sessionStorage.getItem('hasuwa_admin_token');
    if (savedToken) {
      setAuthToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch stats and leads whenever authenticated
  useEffect(() => {
    if (isAuthenticated && authToken) {
      fetchDashboardData();
    }
  }, [isAuthenticated, authToken]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: accessKey.trim() })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid admin credentials');
      }

      setAuthToken(data.token);
      sessionStorage.setItem('hasuwa_admin_token', data.token);
      setIsAuthenticated(true);
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthToken(null);
    sessionStorage.removeItem('hasuwa_admin_token');
  };

  const fetchDashboardData = async () => {
    if (!authToken) return;
    setIsLoading(true);

    try {
      const [statsRes, leadsRes] = await Promise.all([
        fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${authToken}` }
        }),
        fetch('/api/leads', {
          headers: { Authorization: `Bearer ${authToken}` }
        })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        setLeads(leadsData.leads || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    if (!authToken) return;

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus, updated_at: new Date().toISOString() } : l))
        );
      }
    } catch (err) {
      console.error('Failed to update lead status:', err);
    }
  };

  const handleNotesChange = async (leadId: string, notes: string) => {
    if (!authToken) return;

    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ admin_notes: notes })
      });

      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, admin_notes: notes, updated_at: new Date().toISOString() } : l))
      );
    } catch (err) {
      console.error('Failed to update notes:', err);
    }
  };

  const handleExportCSV = () => {
    if (!authToken) return;
    window.location.href = `/api/admin/export?token=${encodeURIComponent(authToken)}`;
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    setConfigSaveMsg(null);

    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          phone_number: editPhone,
          whatsapp_number: editWhatsApp,
          email: editEmail,
          address_line1: editAddress1,
          address_line2: editAddress2,
          village: editVillage,
          instagram_url: editInstagramUrl,
          instagram_handle: editInstagramHandle
        })
      });

      const data = await res.json();
      if (res.ok && data.config) {
        onUpdateConfig(data.config);
        setConfigSaveMsg('Centre contact configuration updated successfully!');
        setTimeout(() => setConfigSaveMsg(null), 3000);
      }
    } catch {
      setConfigSaveMsg('Failed to update configuration.');
    }
  };

  if (!isOpen) return null;

  // Filter leads
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      !searchQuery.trim() ||
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) ||
      (l.email && l.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      l.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse = selectedCourseFilter === 'all_courses' || l.course === selectedCourseFilter;
    const matchesStatus = selectedStatusFilter === 'all_statuses' || l.status === selectedStatusFilter;
    const matchesCampaign = selectedCampaignFilter === 'all_campaigns' || (l.campaign || '').toLowerCase() === selectedCampaignFilter.toLowerCase();

    return matchesSearch && matchesCourse && matchesStatus && matchesCampaign;
  });

  // Extract unique campaigns
  const uniqueCampaigns = Array.from(new Set(leads.map((l) => l.campaign || 'organic').filter(Boolean)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 text-white rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Centre Admin & Analytics Portal
                </h3>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live System
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Hasuwa Skills Academy • Gidhauri / Near Shivrinayaran
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <button
                  onClick={fetchDashboardData}
                  title="Refresh metrics"
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Barrier or Main Dashboard */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto my-auto text-center w-full">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-5">
              <Shield className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-extrabold text-white mb-2">
              Administrator Authentication
            </h4>
            <p className="text-xs text-slate-400 mb-6">
              Enter your secure administrator access key to view authorized course leads and analytics metrics.
            </p>

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs text-left">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter Admin Access Key (e.g. admin2026)"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Access Admin Dashboard'}
              </button>
            </form>

            <div className="mt-6 text-[11px] text-slate-500 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              <span>Default Key: </span>
              <code className="text-amber-400 font-mono">admin2026</code>
              <span> (Configurable via <code>ADMIN_ACCESS_KEY</code> in .env)</span>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard Content */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="px-6 border-b border-slate-800 bg-slate-950/40 flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('metrics')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                  activeTab === 'metrics'
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <span>Overview & Funnel</span>
              </button>

              <button
                onClick={() => setActiveTab('leads')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                  activeTab === 'leads'
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-4 h-4 text-amber-400" />
                <span>Course Enquiries ({leads.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('campaigns')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                  activeTab === 'campaigns'
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Social Campaigns & UTM</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                  activeTab === 'settings'
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Centre Settings</span>
              </button>
            </div>

            {/* Tab View Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* ================= TAB 1: METRICS & FUNNEL ================= */}
              {activeTab === 'metrics' && stats && (
                <div className="space-y-6">
                  {/* Top KPI Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                      <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                        <span>Total Visitors</span>
                        <Eye className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-white">
                        {stats.total_visitors}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Unique Sessions: <span className="text-indigo-300 font-bold">{stats.unique_visitors}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                      <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                        <span>Course Enquiries</span>
                        <Users className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-white">
                        {stats.total_enquiries}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Conversion: <span className="text-emerald-400 font-bold">{stats.conversion_rate}%</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                      <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                        <span>WhatsApp Clicks</span>
                        <MessageCircle className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-white">
                        {stats.whatsapp_clicks}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Direct Phone Clicks: <span className="text-emerald-300 font-bold">{stats.phone_clicks}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                      <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                        <span>CTA & Social Outbound</span>
                        <Sparkles className="w-4 h-4 text-rose-400" />
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-white">
                        {stats.apply_clicks + stats.register_clicks}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                        <span className="flex items-center gap-1 text-pink-300">
                          <Instagram className="w-3 h-3 text-pink-400" />
                          <span>Insta: <strong className="text-white">{stats.instagram_clicks || 0}</strong></span>
                        </span>
                        <span>Shares: <strong className="text-indigo-300">{stats.share_clicks}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Conversion Funnel Section */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-indigo-400" />
                      <span>Social Media Ad Conversion Funnel</span>
                    </h4>

                    <div className="space-y-3">
                      {[
                        { label: '1. Total Page Visitors', count: stats.funnel.visitors, pct: 100, color: 'bg-indigo-500' },
                        { label: '2. Scrolled 25% (Engaged Reading)', count: stats.funnel.scroll_25, pct: stats.funnel.visitors ? Math.round((stats.funnel.scroll_25 / stats.funnel.visitors) * 100) : 0, color: 'bg-blue-500' },
                        { label: '3. Scrolled 50% (Explored Courses)', count: stats.funnel.scroll_50, pct: stats.funnel.visitors ? Math.round((stats.funnel.scroll_50 / stats.funnel.visitors) * 100) : 0, color: 'bg-cyan-500' },
                        { label: '4. CTA Button Clicked (Apply / Call / WhatsApp)', count: stats.funnel.cta_clicks, pct: stats.funnel.visitors ? Math.round((stats.funnel.cta_clicks / stats.funnel.visitors) * 100) : 0, color: 'bg-amber-500' },
                        { label: '5. Form Started (Focused Interest)', count: stats.funnel.form_started, pct: stats.funnel.visitors ? Math.round((stats.funnel.form_started / stats.funnel.visitors) * 100) : 0, color: 'bg-orange-500' },
                        { label: '6. Form Submitted (Registered Lead)', count: stats.funnel.form_submitted, pct: stats.funnel.visitors ? Math.round((stats.funnel.form_submitted / stats.funnel.visitors) * 100) : 0, color: 'bg-emerald-500' },
                        { label: '7. Admission Confirmed', count: stats.funnel.confirmed_leads, pct: stats.funnel.visitors ? Math.round((stats.funnel.confirmed_leads / stats.funnel.visitors) * 100) : 0, color: 'bg-emerald-400' }
                      ].map((step, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-300">{step.label}</span>
                            <span className="text-slate-400">
                              <span className="text-white font-mono font-bold mr-2">{step.count}</span>
                              ({step.pct}%)
                            </span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${step.color} rounded-full transition-all duration-500`}
                              style={{ width: `${Math.max(step.pct, 2)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2-Column Visual Charts: Daily Trend & Course Distribution */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Daily Visitors vs Enquiries */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        <span>Daily Traffic & Enquiries (Last 7 Days)</span>
                      </h4>

                      <div className="flex items-end gap-2 h-44 pt-6 pb-2 border-b border-slate-700">
                        {stats.daily_metrics.map((m, i) => {
                          const maxVis = Math.max(...stats.daily_metrics.map((d) => d.visitors), 1);
                          const barHeight = Math.round((m.visitors / maxVis) * 100);
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                              {/* Hover tooltip */}
                              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-950 border border-slate-700 text-[10px] px-2 py-1 rounded text-white whitespace-nowrap pointer-events-none transition-opacity z-10">
                                {m.visitors} visits • {m.enquiries} leads
                              </div>

                              <div className="w-full flex items-end justify-center gap-0.5 h-full">
                                <div
                                  className="w-1/2 bg-indigo-500 rounded-t group-hover:bg-indigo-400 transition-all"
                                  style={{ height: `${Math.max(barHeight, 8)}%` }}
                                />
                                <div
                                  className="w-1/2 bg-amber-400 rounded-t group-hover:bg-amber-300 transition-all"
                                  style={{ height: `${Math.max(m.enquiries * 20, 6)}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-slate-400 truncate w-full text-center">
                                {m.date}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded bg-indigo-500" />
                          <span>Visitors</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded bg-amber-400" />
                          <span>Enquiries</span>
                        </div>
                      </div>
                    </div>

                    {/* Course Interest Breakdown */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-emerald-400" />
                          <span>Course Enquiry Distribution</span>
                        </h4>

                        <div className="space-y-4">
                          {[
                            { name: 'English Speaking & Personality', count: stats.course_breakdown.english || 0, color: 'bg-emerald-500' },
                            { name: 'Computer Courses (DCA/ADCA/Typing)', count: stats.course_breakdown.computer || 0, color: 'bg-indigo-500' },
                            { name: 'Bollywood & Hindi Vocals', count: stats.course_breakdown.bollywood || 0, color: 'bg-rose-500' },
                            { name: 'All Courses Combined Info', count: stats.course_breakdown.all || 0, color: 'bg-amber-500' }
                          ].map((item, idx) => {
                            const total = Object.values(stats.course_breakdown).reduce((a, b) => a + b, 0) || 1;
                            const pct = Math.round((item.count / total) * 100);
                            return (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-slate-300 font-medium">{item.name}</span>
                                  <span className="font-mono text-white font-bold">
                                    {item.count} ({pct}%)
                                  </span>
                                </div>
                                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${item.color} rounded-full`}
                                    style={{ width: `${Math.max(pct, 2)}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800 mt-4">
                        💡 Data is automatically updated in real-time as users submit enquiries from mobile & desktop.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 2: COURSE LEADS ================= */}
              {activeTab === 'leads' && (
                <div className="space-y-4">
                  {/* Filter Toolbar */}
                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    <div className="flex-1 relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search by student name, phone, email, or lead ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Course Filter */}
                      <select
                        value={selectedCourseFilter}
                        onChange={(e) => setSelectedCourseFilter(e.target.value)}
                        className="px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-300 focus:outline-hidden"
                      >
                        <option value="all_courses">All Courses</option>
                        <option value="english">English Speaking</option>
                        <option value="computer">Computer Courses</option>
                        <option value="bollywood">Bollywood Vocals</option>
                        <option value="all">All Combined</option>
                      </select>

                      {/* Status Filter */}
                      <select
                        value={selectedStatusFilter}
                        onChange={(e) => setSelectedStatusFilter(e.target.value)}
                        className="px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-300 focus:outline-hidden"
                      >
                        <option value="all_statuses">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Interested">Interested</option>
                        <option value="Registered">Registered</option>
                        <option value="Not Interested">Not Interested</option>
                      </select>

                      {/* Export CSV Button */}
                      <button
                        onClick={handleExportCSV}
                        className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Leads Table */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="px-4 py-3">Lead ID & Date</th>
                          <th className="px-4 py-3">Candidate Info</th>
                          <th className="px-4 py-3">Course & Mode</th>
                          <th className="px-4 py-3">Campaign / Source</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Direct Actions</th>
                          <th className="px-4 py-3">Admin Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {filteredLeads.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center py-8 text-slate-500">
                              No enquiry records found matching current criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredLeads.map((lead) => {
                            const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
                            return (
                              <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="font-mono font-bold text-indigo-400">{lead.id}</div>
                                  <div className="text-[10px] text-slate-500">
                                    {new Date(lead.created_at).toLocaleDateString('en-IN', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </div>
                                </td>

                                <td className="px-4 py-3">
                                  <div className="font-bold text-white text-sm">{lead.name}</div>
                                  <div className="text-slate-400 font-mono text-[11px]">{lead.phone}</div>
                                  {lead.email && <div className="text-slate-500 text-[10px]">{lead.email}</div>}
                                </td>

                                <td className="px-4 py-3">
                                  <span
                                    className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded ${
                                      lead.course === 'english'
                                        ? 'bg-emerald-500/20 text-emerald-300'
                                        : lead.course === 'computer'
                                        ? 'bg-indigo-500/20 text-indigo-300'
                                        : lead.course === 'bollywood'
                                        ? 'bg-rose-500/20 text-rose-300'
                                        : 'bg-amber-500/20 text-amber-300'
                                    }`}
                                  >
                                    {lead.course.toUpperCase()}
                                  </span>
                                  <div className="text-[10px] text-slate-400 mt-1 capitalize">
                                    Mode: {lead.learning_mode} • Pref: {lead.preferred_contact}
                                  </div>
                                </td>

                                <td className="px-4 py-3 text-[11px]">
                                  <div className="text-slate-300 font-medium capitalize">
                                    {lead.source || 'direct'}
                                  </div>
                                  <div className="text-slate-500 text-[10px]">
                                    {lead.campaign || 'organic'}
                                  </div>
                                </td>

                                <td className="px-4 py-3">
                                  <select
                                    value={lead.status}
                                    onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-hidden cursor-pointer ${
                                      lead.status === 'New'
                                        ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                                        : lead.status === 'Contacted'
                                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                        : lead.status === 'Interested'
                                        ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                                        : lead.status === 'Registered'
                                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                        : 'bg-slate-700/40 border-slate-600 text-slate-400'
                                    }`}
                                  >
                                    <option value="New" className="bg-slate-900 text-white">New</option>
                                    <option value="Contacted" className="bg-slate-900 text-white">Contacted</option>
                                    <option value="Interested" className="bg-slate-900 text-white">Interested</option>
                                    <option value="Registered" className="bg-slate-900 text-white">Registered</option>
                                    <option value="Not Interested" className="bg-slate-900 text-white">Not Interested</option>
                                  </select>
                                </td>

                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="flex items-center gap-1.5">
                                    {/* Call link */}
                                    <a
                                      href={`tel:${cleanPhone}`}
                                      className="p-1.5 bg-slate-800 hover:bg-emerald-600/30 text-emerald-400 rounded-lg border border-slate-700 transition-colors"
                                      title="Call Candidate"
                                    >
                                      <Phone className="w-3.5 h-3.5" />
                                    </a>

                                    {/* WhatsApp link */}
                                    <a
                                      href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hello ${lead.name}, thank you for your enquiry regarding ${lead.course} course at Hasuwa Skills Centre.`)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1.5 bg-slate-800 hover:bg-emerald-600/30 text-emerald-400 rounded-lg border border-slate-700 transition-colors"
                                      title="WhatsApp Candidate"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5" />
                                    </a>
                                  </div>
                                </td>

                                <td className="px-4 py-3">
                                  <input
                                    type="text"
                                    placeholder="Add notes..."
                                    defaultValue={lead.admin_notes || ''}
                                    onBlur={(e) => handleNotesChange(lead.id, e.target.value)}
                                    className="w-36 sm:w-48 px-2 py-1 text-[11px] rounded bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-hidden"
                                  />
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ================= TAB 3: SOCIAL CAMPAIGNS & UTM ================= */}
              {activeTab === 'campaigns' && stats && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Social Media UTM Campaign Performance
                    </h4>
                    <p className="text-xs text-slate-400 mb-4">
                      Directly measures enquiries coming from Instagram ads, Facebook boosts, WhatsApp shares, and organic channels.
                    </p>

                    <div className="overflow-x-auto rounded-xl border border-slate-800">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                          <tr>
                            <th className="px-4 py-3">Campaign Name</th>
                            <th className="px-4 py-3">Traffic Source</th>
                            <th className="px-4 py-3">Page Visitors</th>
                            <th className="px-4 py-3">Enquiries Generated</th>
                            <th className="px-4 py-3">Conversion Rate</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {stats.campaign_performance.map((c, i) => (
                            <tr key={i} className="hover:bg-slate-800/30">
                              <td className="px-4 py-3 font-mono font-bold text-white">
                                {c.campaign}
                              </td>
                              <td className="px-4 py-3 capitalize text-slate-300">
                                {c.source}
                              </td>
                              <td className="px-4 py-3 text-slate-300 font-mono">
                                {c.visitors}
                              </td>
                              <td className="px-4 py-3 font-mono font-bold text-amber-400">
                                {c.leads}
                              </td>
                              <td className="px-4 py-3">
                                <span className="font-mono font-bold text-emerald-400">
                                  {c.conversion}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Traffic Sources Breakdown */}
                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3">
                      Inbound Traffic Channel Distribution
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {Object.entries(stats.traffic_sources).map(([source, count], idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <div className="text-xs text-slate-400 capitalize">{source}</div>
                          <div className="text-xl font-bold text-white mt-1">{count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 4: CENTRE SETTINGS ================= */}
              {activeTab === 'settings' && (
                <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                  <h4 className="text-base font-bold text-white mb-2">
                    Centre Contact & Business Configuration
                  </h4>
                  <p className="text-xs text-slate-400 mb-6">
                    Changes here immediately update the website telephone buttons, WhatsApp links, and contact addresses.
                  </p>

                  {configSaveMsg && (
                    <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs">
                      {configSaveMsg}
                    </div>
                  )}

                  <form onSubmit={handleSaveConfig} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                          Phone Number (Calling)
                        </label>
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          required
                          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                          WhatsApp Number (with country code)
                        </label>
                        <input
                          type="text"
                          value={editWhatsApp}
                          onChange={(e) => setEditWhatsApp(e.target.value)}
                          required
                          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                        Village / Primary Location
                      </label>
                      <input
                        type="text"
                        value={editVillage}
                        onChange={(e) => setEditVillage(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                          Address Line 1
                        </label>
                        <input
                          type="text"
                          value={editAddress1}
                          onChange={(e) => setEditAddress1(e.target.value)}
                          required
                          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                          Address Line 2 (Block / Town)
                        </label>
                        <input
                          type="text"
                          value={editAddress2}
                          onChange={(e) => setEditAddress2(e.target.value)}
                          required
                          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>
                    </div>

                    {/* Instagram Social Media Settings */}
                    <div className="pt-3 border-t border-slate-800">
                      <div className="flex items-center gap-2 mb-3">
                        <Instagram className="w-4 h-4 text-pink-400" />
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                          Instagram Integration Settings
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                            Instagram Profile URL
                          </label>
                          <input
                            type="url"
                            value={editInstagramUrl}
                            onChange={(e) => setEditInstagramUrl(e.target.value)}
                            placeholder="https://www.instagram.com/hasuwaskillsacademy"
                            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-600 focus:border-pink-500 focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                            Instagram Handle (Username)
                          </label>
                          <input
                            type="text"
                            value={editInstagramHandle}
                            onChange={(e) => setEditInstagramHandle(e.target.value)}
                            placeholder="@hasuwaskillsacademy"
                            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-600 focus:border-pink-500 focus:outline-hidden"
                          />
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2">
                        This URL and handle are connected to the header, hero section, course enquiry thank-you screen, contact card, and footer across the website.
                      </p>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                      >
                        Save Configuration
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
