import React, { useState, useRef, useEffect } from 'react';
import {
  Palette,
  Sparkles,
  Save,
  RotateCcw,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Megaphone,
  Smartphone,
  ShieldCheck,
  Building2,
  Users,
  HardHat,
  Briefcase,
  Zap,
  Flame,
  Hammer,
  Rocket,
  Wrench,
  Activity,
  Layers,
  Phone,
  Mail,
  MapPin,
  Clock,
  IndianRupee,
  DollarSign,
  Euro,
  Check,
  Upload,
  Database,
  Trash2,
  Play,
  Table,
  Terminal,
  FileCode,
  FolderUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  LogoIconType,
  LogoShapeType,
  LogoGradientType,
  AdminThemeMode,
  AppCustomizationSettings,
} from '../../types';
import { BrandLogo } from '../common/BrandLogo';
import { manualSqlDb, SqlExecutionResponse } from '../../db/sqlDatabase';

export const AppCustomizationView: React.FC = () => {
  const { customization, updateCustomization, resetCustomization, triggerPushToast } = useApp();

  // Working form state
  const [formData, setFormData] = useState<AppCustomizationSettings>({ ...customization });
  const [activeTab, setActiveTab] = useState<'branding' | 'theme' | 'copy' | 'announcement' | 'support' | 'database'>('branding');
  const [savedNotice, setSavedNotice] = useState(false);

  // Logo file upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [logoInputMode, setLogoInputMode] = useState<'upload' | 'icon' | 'url'>(
    customization.logoType === 'image' && customization.logoImageUrl.startsWith('data:')
      ? 'upload'
      : customization.logoType === 'image'
      ? 'url'
      : 'icon'
  );

  // SQL Console states
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT app_name, logo_type, logo_image_url, primary_color, admin_sidebar_theme FROM app_customization;');
  const [sqlResult, setSqlResult] = useState<SqlExecutionResponse | null>(null);
  const [isExecutingSql, setIsExecutingSql] = useState(false);
  const [sqlTables, setSqlTables] = useState<{ name: string; count: number }[]>([]);

  // Load SQL tables on mount
  useEffect(() => {
    const loadSql = async () => {
      try {
        const s = await fetch('/api/sql/status');
        const sData = await s.json();
        if (sData?.tables) {
          setSqlTables(sData.tables);
          return;
        }
      } catch {}
      await manualSqlDb.ready();
      const stats = manualSqlDb.getTableStats();
      setSqlTables(stats);
    };
    loadSql();
  }, []);

  // Handle Logo Image Upload
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      triggerPushToast({
        type: 'general',
        title: 'Invalid File',
        message: 'Please choose an image file (PNG, JPG, SVG, WebP).',
        targetRole: 'admin',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      triggerPushToast({
        type: 'general',
        title: 'File Too Large',
        message: 'Logo image must be smaller than 5MB.',
        targetRole: 'admin',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setFormData((prev) => ({
          ...prev,
          logoType: 'image',
          logoImageUrl: dataUrl,
        }));
        setUploadedFileSize(`${(file.size / 1024).toFixed(1)} KB`);
        setUploadNotice(`Logo uploaded successfully (${(file.size / 1024).toFixed(1)} KB). Reflected in all apps!`);
        setTimeout(() => setUploadNotice(null), 4000);

        // Immediately update global app customization so it reflects across the app!
        updateCustomization({
          logoType: 'image',
          logoImageUrl: dataUrl,
        });

        // Also persist to manual SQL database table
        fetch('/api/customization/logo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ logoImageUrl: dataUrl, logoType: 'image' }),
        }).catch(() => {});
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleClearUploadedLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logoType: 'icon',
      logoImageUrl: '',
    }));
    updateCustomization({
      logoType: 'icon',
      logoImageUrl: '',
    });
    setUploadedFileSize(null);
    setUploadNotice('Logo reverted to vector icon emblem.');
    setTimeout(() => setUploadNotice(null), 3000);
  };

  // Run SQL Query against manual SQL database
  const handleExecuteSql = async (overrideQuery?: string) => {
    const q = (typeof overrideQuery === 'string' ? overrideQuery : sqlQuery).trim();
    if (!q) return;
    if (typeof overrideQuery === 'string') {
      setSqlQuery(overrideQuery);
    }
    setIsExecutingSql(true);
    try {
      const response = await fetch('/api/sql/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await response.json();
      if (data && typeof data.success === 'boolean') {
        setSqlResult(data);
      } else {
        await manualSqlDb.ready();
        const res = manualSqlDb.executeSql(q);
        setSqlResult(res);
      }
    } catch {
      await manualSqlDb.ready();
      const res = manualSqlDb.executeSql(q);
      setSqlResult(res);
    }

    try {
      const s = await fetch('/api/sql/status');
      const sData = await s.json();
      if (sData?.tables) {
        setSqlTables(sData.tables);
      } else {
        setSqlTables(manualSqlDb.getTableStats());
      }
    } catch {
      setSqlTables(manualSqlDb.getTableStats());
    }
    setIsExecutingSql(false);
  };

  // Available vector icon choices
  const iconOptions: { id: LogoIconType; label: string; icon: React.ElementType }[] = [
    { id: 'users', label: 'Workforce Community', icon: Users },
    { id: 'shield', label: 'Verified Security', icon: ShieldCheck },
    { id: 'hardhat', label: 'Labor & Construction', icon: HardHat },
    { id: 'briefcase', label: 'Commercial Business', icon: Briefcase },
    { id: 'zap', label: 'Fast Dispatch', icon: Zap },
    { id: 'flame', label: 'High Demand', icon: Flame },
    { id: 'sparkles', label: 'Premium Quality', icon: Sparkles },
    { id: 'building', label: 'Premises & Facility', icon: Building2 },
    { id: 'hammer', label: 'Tools & Heavy Tasks', icon: Hammer },
    { id: 'rocket', label: 'Rapid Scalability', icon: Rocket },
    { id: 'wrench', label: 'Skilled Maintenance', icon: Wrench },
    { id: 'activity', label: 'Live Operations', icon: Activity },
  ];

  // Available shapes
  const shapeOptions: { id: LogoShapeType; label: string; desc: string }[] = [
    { id: 'squircle', label: 'Squircle', desc: 'Modern curvature' },
    { id: 'rounded', label: 'Rounded', desc: 'Standard corners' },
    { id: 'circle', label: 'Circle', desc: 'Symmetric round' },
    { id: 'square', label: 'Square', desc: 'Crisp geometric' },
  ];

  // Available gradient color styles
  const gradientOptions: { id: LogoGradientType; label: string; previewClass: string }[] = [
    { id: 'red-yellow', label: 'Red & Yellow Flame', previewClass: 'from-red-600 to-yellow-500' },
    { id: 'ruby-gold', label: 'Ruby & Amber Gold', previewClass: 'from-rose-700 to-amber-400' },
    { id: 'amber-fire', label: 'Amber Fire Ochre', previewClass: 'from-amber-600 to-yellow-400' },
    { id: 'crimson-black', label: 'Crimson & Midnight', previewClass: 'from-slate-900 to-red-600' },
    { id: 'gold-dark', label: 'Gold & Obsidian', previewClass: 'from-amber-500 to-stone-900' },
    { id: 'sunset-gradient', label: 'Sunset Blaze', previewClass: 'from-red-600 to-orange-400' },
  ];

  // Available Admin sidebar themes
  const adminThemeOptions: { id: AdminThemeMode; label: string; bgClass: string; desc: string }[] = [
    { id: 'slate-900', label: 'Deep Industrial Slate', bgClass: 'bg-slate-900', desc: 'Modern platform standard' },
    { id: 'zinc-950', label: 'Midnight Obsidian', bgClass: 'bg-zinc-950', desc: 'High-contrast dark mode' },
    { id: 'red-950', label: 'Crimson Nightfall', bgClass: 'bg-red-950', desc: 'Bold brand immersion' },
    { id: 'charcoal-dark', label: 'Clean Charcoal', bgClass: 'bg-stone-900', desc: 'Balanced warm charcoal' },
  ];

  // Quick Preset Styles
  const applyPreset = (presetName: string) => {
    if (presetName === 'default') {
      setFormData((prev) => ({
        ...prev,
        appName: 'ManPowerLink',
        tagline: 'On-Demand Temporary Workforce & Bidding Marketplace',
        logoType: 'icon',
        logoIcon: 'users',
        logoShape: 'squircle',
        logoGradient: 'red-yellow',
        primaryColor: '#dc2626',
        accentColor: '#eab308',
        adminSidebarTheme: 'slate-900',
      }));
    } else if (presetName === 'industrial') {
      setFormData((prev) => ({
        ...prev,
        appName: 'HeavyLabor Connect',
        tagline: 'Instant Industrial & Construction Manpower Dispatch',
        logoType: 'icon',
        logoIcon: 'hardhat',
        logoShape: 'rounded',
        logoGradient: 'amber-fire',
        primaryColor: '#d97706',
        accentColor: '#f59e0b',
        adminSidebarTheme: 'zinc-950',
      }));
    } else if (presetName === 'enterprise') {
      setFormData((prev) => ({
        ...prev,
        appName: 'Apex Crew Hub',
        tagline: 'Enterprise Event & Premise Workforce On-Demand',
        logoType: 'icon',
        logoIcon: 'shield',
        logoShape: 'circle',
        logoGradient: 'ruby-gold',
        primaryColor: '#be123c',
        accentColor: '#fbbf24',
        adminSidebarTheme: 'red-950',
      }));
    } else if (presetName === 'express') {
      setFormData((prev) => ({
        ...prev,
        appName: 'TaskForce Express',
        tagline: 'Direct Daily Wage Quoting & Verified Shift Fulfillment',
        logoType: 'icon',
        logoIcon: 'zap',
        logoShape: 'squircle',
        logoGradient: 'sunset-gradient',
        primaryColor: '#ea580c',
        accentColor: '#facc15',
        adminSidebarTheme: 'charcoal-dark',
      }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomization(formData);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3500);
  };

  const handleReset = () => {
    if (window.confirm('Restore all branding and app customization settings to factory default?')) {
      resetCustomization();
      setFormData({
        appName: 'ManPowerLink',
        tagline: 'On-Demand Temporary Workforce & Bidding Marketplace',
        logoType: 'icon',
        logoIcon: 'users',
        logoImageUrl: '',
        logoShape: 'squircle',
        logoGradient: 'red-yellow',
        primaryColor: '#dc2626',
        accentColor: '#eab308',
        adminSidebarTheme: 'slate-900',
        adminPanelTitle: 'Admin Web Panel',
        customerAppTitle: 'Customer / Employer App',
        employeeAppTitle: 'Employee / Worker App',
        customerWelcomeHeading: 'Hire Verified Temporary Manpower in Minutes',
        customerWelcomeSubheading: 'Zero intermediaries. Place request, get instant partner bids, verify with OTP & pay directly.',
        workerGreeting: 'Ready to work today? Keep your wallet topped up to bid & receive instant jobs!',
        currencySymbol: '₹',
        supportPhone: '+91 824 298 4800',
        supportEmail: 'ops@manpowerlink.in',
        supportCity: 'Mangalore & Udupi, Karnataka',
        supportHours: '24/7 Operations Support',
        showAnnouncementBanner: false,
        announcementText: 'Special Incentive: Workers maintain wallet balance above ₹500 to receive priority instant dispatch!',
        announcementType: 'offer',
        announcementTarget: 'all',
        showPushSimulatorFloating: true,
        enableSoundChimes: true,
        updatedAt: new Date().toISOString().split('T')[0],
      });
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 via-red-500 to-yellow-500 text-white flex items-center justify-center shadow-md shadow-red-500/20">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                App & Admin Panel Customization
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Configure platform branding, logos, color themes, announcement banners, and copy across Admin, Customer & Employee portals
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 text-white text-xs font-bold shadow-md shadow-red-950/20 transition flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Customization</span>
          </button>
        </div>
      </div>

      {/* Success Notification Bar */}
      {savedNotice && (
        <div className="p-3.5 bg-yellow-50 border border-yellow-300 text-yellow-950 rounded-2xl flex items-center justify-between text-xs font-bold animate-fadeIn shadow-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
            <span>Settings saved! Your custom logo, colors, and content are now applied throughout the platform.</span>
          </div>
          <button onClick={() => setSavedNotice(false)} className="text-yellow-800 hover:text-black">
            &times;
          </button>
        </div>
      )}

      {/* Quick Theme Presets Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          <span className="text-xs font-bold text-slate-800">Quick Brand Presets:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => applyPreset('default')}
            className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition"
          >
            🔥 Red & Yellow (Default)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('industrial')}
            className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition"
          >
            🚧 Heavy Industrial
          </button>
          <button
            type="button"
            onClick={() => applyPreset('enterprise')}
            className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 transition"
          >
            🏢 Apex Enterprise
          </button>
          <button
            type="button"
            onClick={() => applyPreset('express')}
            className="px-3 py-1 rounded-lg text-xs font-bold bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-300 transition"
          >
            ⚡ Express Shifts
          </button>
        </div>
      </div>

      {/* Main Grid: Settings & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Settings Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Navigation Sub-Tabs */}
          <div className="flex items-center space-x-1.5 p-1.5 bg-slate-200/70 rounded-2xl overflow-x-auto text-xs font-bold">
            <button
              onClick={() => setActiveTab('branding')}
              className={`px-3 py-2 rounded-xl transition shrink-0 ${
                activeTab === 'branding' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Logo & Brand Name
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`px-3 py-2 rounded-xl transition shrink-0 ${
                activeTab === 'theme' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Colors & Admin Theme
            </button>
            <button
              onClick={() => setActiveTab('copy')}
              className={`px-3 py-2 rounded-xl transition shrink-0 ${
                activeTab === 'copy' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Titles & Greeting Copy
            </button>
            <button
              onClick={() => setActiveTab('announcement')}
              className={`px-3 py-2 rounded-xl transition shrink-0 ${
                activeTab === 'announcement' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Broadcast Banner
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`px-3 py-2 rounded-xl transition shrink-0 ${
                activeTab === 'support' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Support & Contact
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`px-3 py-2 rounded-xl transition shrink-0 flex items-center space-x-1.5 ${
                activeTab === 'database' ? 'bg-red-600 text-white shadow-xs font-bold' : 'text-slate-700 hover:text-slate-900 bg-yellow-100/70 border border-yellow-300'
              }`}
            >
              <Database className={`w-3.5 h-3.5 ${activeTab === 'database' ? 'text-yellow-300' : 'text-yellow-800'}`} />
              <span>SQL Database Engine</span>
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* TAB 1: LOGO & BRAND NAME */}
            {activeTab === 'branding' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-red-600" />
                    <span>1. Platform Identity & Logo Configuration</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Set the app name, slogan, and visual logo emblem displayed on headers, login screens and navbars
                  </p>
                </div>

                {/* Brand Name & Tagline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Platform Brand Name
                    </label>
                    <input
                      type="text"
                      value={formData.appName}
                      onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                      placeholder="e.g. ManPowerLink"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Currency Symbol
                    </label>
                    <div className="flex items-center space-x-2">
                      {['₹', '$', '€', '£', 'AED'].map((curr) => (
                        <button
                          type="button"
                          key={curr}
                          onClick={() => setFormData({ ...formData, currencySymbol: curr })}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                            formData.currencySymbol === curr
                              ? 'bg-red-600 text-white border-red-600'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {curr}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Brand Slogan / Tagline
                    </label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="e.g. On-Demand Temporary Workforce & Bidding Marketplace"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Logo Source Mode Selector & Upload */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Platform App Logo Configuration
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Upload custom logo image or select an emblem. Reflects across Customer App, Worker App & Admin Panel.
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold self-start sm:self-auto">
                      <Database className="w-3 h-3 text-emerald-600" />
                      <span>Stored in SQLite (app_customization)</span>
                    </span>
                  </div>

                  {uploadNotice && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-800 animate-fadeIn">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold">{uploadNotice}</span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                        Live in App
                      </span>
                    </div>
                  )}

                  {/* 3 Source Tabs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setLogoInputMode('upload');
                        setFormData((prev) => ({ ...prev, logoType: 'image' }));
                      }}
                      className={`p-3.5 rounded-2xl border text-left flex items-center space-x-3 transition cursor-pointer ${
                        logoInputMode === 'upload' && formData.logoType === 'image'
                          ? 'border-red-500 bg-red-50/70 ring-2 ring-red-500/20 text-red-950 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Upload Logo File</div>
                        <div className="text-[10px] text-slate-500">Device image (PNG, SVG, JPG)</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setLogoInputMode('url');
                        setFormData((prev) => ({ ...prev, logoType: 'image' }));
                      }}
                      className={`p-3.5 rounded-2xl border text-left flex items-center space-x-3 transition cursor-pointer ${
                        logoInputMode === 'url' && formData.logoType === 'image'
                          ? 'border-red-500 bg-red-50/70 ring-2 ring-red-500/20 text-red-950 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Image Web URL</div>
                        <div className="text-[10px] text-slate-500">Paste CDN / cloud link</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setLogoInputMode('icon');
                        setFormData((prev) => ({ ...prev, logoType: 'icon' }));
                      }}
                      className={`p-3.5 rounded-2xl border text-left flex items-center space-x-3 transition cursor-pointer ${
                        formData.logoType === 'icon'
                          ? 'border-red-500 bg-red-50/70 ring-2 ring-red-500/20 text-red-950 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-yellow-100 text-yellow-800 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Vector Emblem</div>
                        <div className="text-[10px] text-slate-500">12 curated vector icons</div>
                      </div>
                    </button>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {/* OPTION 1: FILE UPLOAD ZONE */}
                  {logoInputMode === 'upload' && formData.logoType === 'image' && (
                    <div className="space-y-3 bg-slate-50/70 p-4 rounded-3xl border border-slate-200">
                      {/* Active Preview if Image Present */}
                      {formData.logoImageUrl ? (
                        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex items-center space-x-3.5">
                            <BrandLogo
                              type="image"
                              imageUrl={formData.logoImageUrl}
                              shape={formData.logoShape}
                              gradient={formData.logoGradient}
                              size="lg"
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-slate-900">Uploaded Logo Active</span>
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800">
                                  Reflected in Apps
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {uploadedFileSize ? `File Size: ${uploadedFileSize}` : 'Custom image data loaded'} • Saved in SQLite database
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
                            >
                              <FolderUp className="w-3.5 h-3.5" />
                              <span>Replace File</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleClearUploadedLogo}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-semibold flex items-center space-x-1 transition cursor-pointer"
                              title="Clear logo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      ) : null}

                      {/* Drag & Drop Area */}
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition cursor-pointer ${
                          isDragging
                            ? 'border-red-500 bg-red-50/50 scale-[1.01]'
                            : 'border-slate-300 hover:border-red-400 bg-white'
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-2.5 shadow-2xs">
                          <Upload className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Click to Browse or Drag & Drop Brand Logo
                        </span>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Supports PNG, SVG, JPG, WebP transparent logos (Max size 5MB)
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="mt-3 px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition"
                        >
                          Select Image File
                        </button>
                      </div>

                      {/* Quick Sample Image Logos for Instant Test */}
                      <div className="pt-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                          Quick Preset Logos (Test with 1-Click):
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            {
                              name: 'Heavy Labor Hub',
                              icon: '🏗️',
                              url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=160&auto=format&fit=crop&q=80',
                            },
                            {
                              name: 'Pro Workforce',
                              icon: '⚡',
                              url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=160&auto=format&fit=crop&q=80',
                            },
                            {
                              name: 'Logistics Fleet',
                              icon: '🚚',
                              url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=160&auto=format&fit=crop&q=80',
                            },
                            {
                              name: 'Facility Crew',
                              icon: '🧹',
                              url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=160&auto=format&fit=crop&q=80',
                            },
                          ].map((sample) => (
                            <button
                              type="button"
                              key={sample.name}
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  logoType: 'image',
                                  logoImageUrl: sample.url,
                                }));
                                updateCustomization({
                                  logoType: 'image',
                                  logoImageUrl: sample.url,
                                });
                                fetch('/api/customization/logo', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ logoImageUrl: sample.url, logoType: 'image' }),
                                }).catch(() => {});
                                setUploadNotice(`Selected preset logo "${sample.name}" applied and saved to SQLite!`);
                                setTimeout(() => setUploadNotice(null), 3500);
                              }}
                              className="p-2 rounded-xl border border-slate-200 bg-white hover:border-red-400 hover:bg-red-50/30 text-left text-xs transition flex items-center space-x-2"
                            >
                              <span className="text-base">{sample.icon}</span>
                              <span className="text-[11px] font-bold text-slate-800 truncate">{sample.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OPTION 2: IMAGE URL */}
                  {logoInputMode === 'url' && formData.logoType === 'image' && (
                    <div className="space-y-3 bg-slate-50/70 p-4 rounded-3xl border border-slate-200">
                      <label className="block text-xs font-bold text-slate-700">
                        Custom Logo Image Web URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={formData.logoImageUrl}
                          onChange={(e) => setFormData({ ...formData, logoImageUrl: e.target.value })}
                          placeholder="https://example.com/your-brand-logo.png"
                          className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-red-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!formData.logoImageUrl) return;
                            updateCustomization({
                              logoType: 'image',
                              logoImageUrl: formData.logoImageUrl,
                            });
                            fetch('/api/customization/logo', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ logoImageUrl: formData.logoImageUrl, logoType: 'image' }),
                            }).catch(() => {});
                            setUploadNotice('Logo URL saved and updated in SQLite database!');
                            setTimeout(() => setUploadNotice(null), 3000);
                          }}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shrink-0 transition"
                        >
                          Apply URL
                        </button>
                      </div>

                      {formData.logoImageUrl && (
                        <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center space-x-3">
                          <BrandLogo
                            type="image"
                            imageUrl={formData.logoImageUrl}
                            shape={formData.logoShape}
                            gradient={formData.logoGradient}
                            size="md"
                          />
                          <div className="text-xs">
                            <span className="font-bold text-slate-900 block">URL Preview Active</span>
                            <span className="text-[10px] text-slate-400 truncate max-w-sm block">{formData.logoImageUrl}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* OPTION 3: VECTOR ICON SELECTION */}
                  {formData.logoType === 'icon' && (
                    <div className="space-y-3 bg-slate-50/70 p-4 rounded-3xl border border-slate-200">
                      <label className="block text-xs font-bold text-slate-700">
                        Select Vector Icon Graphic
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                        {iconOptions.map((opt) => {
                          const IconComp = opt.icon;
                          const isSelected = formData.logoIcon === opt.id;
                          return (
                            <button
                              type="button"
                              key={opt.id}
                              onClick={() => setFormData({ ...formData, logoIcon: opt.id })}
                              className={`p-2.5 rounded-2xl border flex flex-col items-center text-center transition cursor-pointer ${
                                isSelected
                                  ? 'border-red-600 bg-red-50 text-red-700 font-bold ring-2 ring-red-500/30'
                                  : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-600'
                              }`}
                            >
                              <IconComp className="w-5 h-5 mb-1" />
                              <span className="text-[10px] leading-tight line-clamp-1">{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Logo Shape & Gradient */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  {/* Shape */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Emblem Frame Shape
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {shapeOptions.map((s) => (
                        <button
                          type="button"
                          key={s.id}
                          onClick={() => setFormData({ ...formData, logoShape: s.id })}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                            formData.logoShape === s.id
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span>{s.label}</span>
                          {formData.logoShape === s.id && <Check className="w-3.5 h-3.5 text-red-600" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gradient Style */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Emblem Background Gradient
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {gradientOptions.map((g) => (
                        <button
                          type="button"
                          key={g.id}
                          onClick={() => setFormData({ ...formData, logoGradient: g.id })}
                          className={`p-2 rounded-xl border text-[11px] font-bold transition flex items-center space-x-2 ${
                            formData.logoGradient === g.id
                              ? 'border-red-500 bg-red-50 text-red-900 ring-1 ring-red-400'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full bg-gradient-to-br ${g.previewClass} shrink-0`} />
                          <span className="truncate">{g.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: COLORS & ADMIN THEME */}
            {activeTab === 'theme' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-red-600" />
                    <span>2. Color Palette & Admin Console Appearance</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Fine-tune brand colors and sidebar appearance in the Admin Master Console
                  </p>
                </div>

                {/* Primary & Accent Color inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Primary Brand Color (Buttons & Badges)
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0"
                      />
                      <input
                        type="text"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold w-32 focus:outline-none"
                      />
                      <span className="text-xs text-slate-400">Current Accent</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Secondary Accent Color (Highlights & Stars)
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={formData.accentColor}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0"
                      />
                      <input
                        type="text"
                        value={formData.accentColor}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold w-32 focus:outline-none"
                      />
                      <span className="text-xs text-slate-400">Highlight Tint</span>
                    </div>
                  </div>
                </div>

                {/* Admin Sidebar Themes */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <label className="block text-xs font-bold text-slate-700">
                    Admin Sidebar Surface Theme
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {adminThemeOptions.map((th) => (
                      <button
                        type="button"
                        key={th.id}
                        onClick={() => setFormData({ ...formData, adminSidebarTheme: th.id })}
                        className={`p-3.5 rounded-2xl border text-left flex items-center space-x-3 transition cursor-pointer ${
                          formData.adminSidebarTheme === th.id
                            ? 'border-red-500 bg-red-50/40 ring-2 ring-red-500/20'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl ${th.bgClass} border border-white/20 shrink-0`} />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{th.label}</div>
                          <div className="text-[11px] text-slate-400">{th.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: TITLES & COPY */}
            {activeTab === 'copy' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-red-600" />
                    <span>3. App Titles, Greeting & Onboarding Copy</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Tailor screen headers and greeting messages shown to customers and temporary workers
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Admin Panel Console Title
                    </label>
                    <input
                      type="text"
                      value={formData.adminPanelTitle}
                      onChange={(e) => setFormData({ ...formData, adminPanelTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Customer App Title
                      </label>
                      <input
                        type="text"
                        value={formData.customerAppTitle}
                        onChange={(e) => setFormData({ ...formData, customerAppTitle: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Employee / Worker App Title
                      </label>
                      <input
                        type="text"
                        value={formData.employeeAppTitle}
                        onChange={(e) => setFormData({ ...formData, employeeAppTitle: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Customer App Home Banner Heading
                      </label>
                      <input
                        type="text"
                        value={formData.customerWelcomeHeading}
                        onChange={(e) => setFormData({ ...formData, customerWelcomeHeading: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Customer App Home Banner Subheading
                      </label>
                      <textarea
                        rows={2}
                        value={formData.customerWelcomeSubheading}
                        onChange={(e) => setFormData({ ...formData, customerWelcomeSubheading: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Worker Portal Greeting & Status Notice
                      </label>
                      <input
                        type="text"
                        value={formData.workerGreeting}
                        onChange={(e) => setFormData({ ...formData, workerGreeting: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: BROADCAST BANNER */}
            {activeTab === 'announcement' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                    <Megaphone className="w-4 h-4 text-red-600" />
                    <span>4. Live Broadcast & Emergency Alert Banner</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Display an active banner notice across Customer and Worker mobile apps in real-time
                  </p>
                </div>

                {/* Banner Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      Enable Live Broadcast Banner
                    </span>
                    <span className="text-[11px] text-slate-500">
                      When enabled, this notice is immediately pinned atop client apps
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showAnnouncementBanner}
                      onChange={(e) => setFormData({ ...formData, showAnnouncementBanner: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                {/* Banner Text & Style */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Announcement Message
                    </label>
                    <textarea
                      rows={3}
                      value={formData.announcementText}
                      onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                      placeholder="e.g. Special Holiday Incentive: Workers receive 0% commission discount on morning shifts!"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Banner Style Tone
                      </label>
                      <select
                        value={formData.announcementType}
                        onChange={(e) => setFormData({ ...formData, announcementType: e.target.value as any })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-red-500"
                      >
                        <option value="offer">🎉 Offer / Incentive (Yellow & Red)</option>
                        <option value="advisory">⚠️ Advisory / Warning (Amber)</option>
                        <option value="urgent">🚨 Urgent Critical Alert (Red)</option>
                        <option value="info">ℹ️ Informational (Blue Slate)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Target Audience
                      </label>
                      <select
                        value={formData.announcementTarget}
                        onChange={(e) => setFormData({ ...formData, announcementTarget: e.target.value as any })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-red-500"
                      >
                        <option value="all">Everywhere (All Apps)</option>
                        <option value="customer">Customers Only</option>
                        <option value="employee">Workers Only</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: SUPPORT & CONTACT */}
            {activeTab === 'support' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-red-600" />
                    <span>5. Support, Dispatch Helpline & Regional Contacts</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Contact details displayed in the apps for client inquiries, dispute resolution, and worker help
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-red-600" />
                      <span>Helpline Phone</span>
                    </label>
                    <input
                      type="text"
                      value={formData.supportPhone}
                      onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                      placeholder="+91 824 298 4800"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1.5">
                      <Mail className="w-3.5 h-3.5 text-red-600" />
                      <span>Support Email</span>
                    </label>
                    <input
                      type="email"
                      value={formData.supportEmail}
                      onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                      placeholder="ops@manpowerlink.in"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      <span>Operational Hub / City</span>
                    </label>
                    <input
                      type="text"
                      value={formData.supportCity}
                      onChange={(e) => setFormData({ ...formData, supportCity: e.target.value })}
                      placeholder="Mangalore & Coastal Karnataka"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-red-600" />
                      <span>Operating Hours</span>
                    </label>
                    <input
                      type="text"
                      value={formData.supportHours}
                      onChange={(e) => setFormData({ ...formData, supportHours: e.target.value })}
                      placeholder="24/7 Operations Support"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: MANUAL SQL RELATIONAL DATABASE ENGINE */}
            {activeTab === 'database' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                      <Database className="w-4 h-4 text-red-600" />
                      <span>6. Manual SQL Relational Database Engine</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      In-process SQLite relational database storage. Not Cloud SQL — 100% self-hosted manual SQL engine with ACID guarantees.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5 border border-emerald-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      <span>SQLite Engine Online</span>
                    </span>
                  </div>
                </div>

                {/* Storage highlight card for Logo & Customization */}
                <div className="p-4 bg-gradient-to-r from-red-50 to-yellow-50 border border-yellow-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <BrandLogo
                      type={formData.logoType}
                      icon={formData.logoIcon}
                      imageUrl={formData.logoImageUrl}
                      shape={formData.logoShape}
                      gradient={formData.logoGradient}
                      size="sm"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>Active App Logo & Branding Stored in SQL</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-yellow-400 text-slate-950">
                          Table: app_customization
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Logo Type: <strong>{formData.logoType}</strong> • App Name: <strong>{formData.appName}</strong> • Row ID: <code>current_brand_config</code>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleExecuteSql('SELECT id, app_name, logo_type, logo_image_url, primary_color, updated_at FROM app_customization WHERE id = "current_brand_config";')}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 shadow-2xs transition shrink-0 flex items-center space-x-1 cursor-pointer"
                  >
                    <Terminal className="w-3.5 h-3.5 text-red-600" />
                    <span>Inspect Logo Record</span>
                  </button>
                </div>

                {/* Tables Grid */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                      <Table className="w-3.5 h-3.5 text-slate-500" />
                      <span>Relational SQL Tables in Database</span>
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {sqlTables.length} Active Tables
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {sqlTables.map((tbl) => (
                      <div
                        key={tbl.name}
                        className="p-3 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 transition group hover:shadow-xs"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-slate-900 truncate" title={tbl.name}>
                            {tbl.name}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200 group-hover:bg-yellow-200 text-slate-700 group-hover:text-yellow-950">
                            {tbl.count} {tbl.count === 1 ? 'row' : 'rows'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleExecuteSql(`SELECT * FROM ${tbl.name} LIMIT 10;`)}
                          className="w-full text-left text-[11px] font-semibold text-red-600 hover:text-red-700 flex items-center justify-between pt-1 border-t border-slate-200/60 cursor-pointer"
                        >
                          <span>Query Table</span>
                          <Play className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SQL Query Console */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                      <Terminal className="w-3.5 h-3.5 text-red-600" />
                      <span>Interactive SQL Query Console</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Standard SQL Syntax (SELECT, INSERT, UPDATE, PRAGMA)
                    </span>
                  </div>

                  {/* Preset Queries */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Branding & Logo', q: 'SELECT id, app_name, logo_type, logo_image_url, primary_color, updated_at FROM app_customization;' },
                      { label: 'All Categories', q: 'SELECT id, name, base_rate_per_hour, total_workers, active FROM categories;' },
                      { label: 'Top Workers', q: 'SELECT id, name, category, hourly_rate, wallet_balance, rating FROM workers LIMIT 5;' },
                      { label: 'Latest Orders', q: 'SELECT id, order_number, customer_name, status, total_estimated_amount FROM orders LIMIT 5;' },
                      { label: 'Wallet Ledger', q: 'SELECT id, worker_id, amount, type, description, created_at FROM wallet_transactions LIMIT 5;' },
                    ].map((preset) => (
                      <button
                        type="button"
                        key={preset.label}
                        onClick={() => handleExecuteSql(preset.q)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-red-50 hover:text-red-700 border border-slate-200 hover:border-red-300 rounded-lg text-[11px] font-semibold text-slate-700 transition cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Textarea */}
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={sqlQuery}
                      onChange={(e) => setSqlQuery(e.target.value)}
                      placeholder="SELECT * FROM app_customization;"
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 bg-slate-900 text-yellow-300 font-mono text-xs focus:outline-none focus:border-red-500 shadow-inner"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Executed by in-process SQLite manual relational engine
                    </span>
                    <button
                      type="button"
                      disabled={isExecutingSql}
                      onClick={() => handleExecuteSql()}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm shadow-red-600/30 cursor-pointer"
                    >
                      <Play className={`w-3.5 h-3.5 ${isExecutingSql ? 'animate-spin' : ''}`} />
                      <span>{isExecutingSql ? 'Executing SQL...' : 'Run SQL Query'}</span>
                    </button>
                  </div>
                </div>

                {/* Query Results */}
                {sqlResult && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${sqlResult.success ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span className="text-xs font-bold text-slate-900">
                          {sqlResult.success ? 'SQL Query Result' : 'Query Error'}
                        </span>
                        {typeof sqlResult.executionTimeMs === 'number' && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            ⚡ {sqlResult.executionTimeMs}ms
                          </span>
                        )}
                      </div>
                      {sqlResult.results?.[0]?.values && (
                        <span className="text-[11px] font-bold text-slate-500">
                          {sqlResult.results[0].values.length} {sqlResult.results[0].values.length === 1 ? 'row' : 'rows'} returned
                        </span>
                      )}
                    </div>

                    {sqlResult.error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-mono">
                        {sqlResult.error}
                      </div>
                    )}

                    {sqlResult.results && sqlResult.results.length > 0 ? (
                      sqlResult.results.map((r, idx) => (
                        <div key={idx} className="overflow-x-auto rounded-2xl border border-slate-200 max-h-72">
                          <table className="w-full text-left text-xs font-mono">
                            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 sticky top-0">
                              <tr>
                                {r.columns.map((col) => (
                                  <th key={col} className="px-3 py-2 font-bold whitespace-nowrap">
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                              {r.values.map((row, rowIdx) => (
                                <tr key={rowIdx} className="hover:bg-yellow-50/40">
                                  {row.map((val, colIdx) => (
                                    <td key={colIdx} className="px-3 py-2 whitespace-nowrap text-slate-800 max-w-xs truncate" title={String(val ?? '')}>
                                      {val === null || val === undefined ? (
                                        <span className="text-slate-300 italic">null</span>
                                      ) : typeof val === 'string' && val.startsWith('data:image') ? (
                                        <span className="text-red-600 font-semibold text-[10px]">[Base64 Image Data ({Math.round(val.length / 1024)} KB)]</span>
                                      ) : (
                                        String(val)
                                      )}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))
                    ) : sqlResult.success && typeof sqlResult.rowsAffected === 'number' ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                        Query executed successfully. {sqlResult.rowsAffected} rows affected.
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Last updated: {customization.updatedAt}
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 text-white font-bold text-xs shadow-md shadow-red-950/20 transition flex items-center space-x-2 cursor-pointer active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save All Customization Setups</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Live Multi-Device Brand Preview Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs sticky top-20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-red-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Real-Time Multi-Device Preview
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-yellow-100 text-yellow-900 font-extrabold text-[10px]">
                Live Preview
              </span>
            </div>

            {/* 1. Preview: Universal Header Navbar */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                1. Top Header Navbar Brand
              </span>
              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <BrandLogo
                    type={formData.logoType}
                    icon={formData.logoIcon}
                    imageUrl={formData.logoImageUrl}
                    shape={formData.logoShape}
                    gradient={formData.logoGradient}
                    size="sm"
                  />
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-extrabold text-sm text-slate-900 leading-none">
                        {formData.appName}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-yellow-400 text-slate-950">
                        Marketplace
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                      {formData.tagline}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Preview: Admin Sidebar */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                2. Admin Sidebar Look
              </span>
              <div className={`p-3.5 rounded-2xl ${
                formData.adminSidebarTheme === 'slate-900'
                  ? 'bg-slate-900 text-white'
                  : formData.adminSidebarTheme === 'zinc-950'
                  ? 'bg-zinc-950 text-white'
                  : formData.adminSidebarTheme === 'red-950'
                  ? 'bg-red-950 text-white'
                  : 'bg-stone-900 text-white'
              } border border-slate-700/60 shadow-md space-y-3`}>
                <div className="flex items-center space-x-2.5">
                  <BrandLogo
                    type={formData.logoType}
                    icon={formData.logoIcon}
                    imageUrl={formData.logoImageUrl}
                    shape={formData.logoShape}
                    gradient={formData.logoGradient}
                    size="sm"
                  />
                  <div>
                    <div className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                      {formData.adminPanelTitle}
                    </div>
                    <div className="text-[10px] text-slate-400">{formData.appName} Master Console</div>
                  </div>
                </div>

                <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-[11px] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                    <span className="font-semibold text-slate-200">Active Rule: ₹200 Min Wallet</span>
                  </div>
                  <span className="text-yellow-400 font-bold">10% Fee</span>
                </div>
              </div>
            </div>

            {/* 3. Preview: Customer App Card */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                3. Customer App Greeting Card
              </span>
              <div className="p-3.5 bg-gradient-to-br from-red-600 via-red-700 to-amber-600 text-white rounded-2xl shadow-sm space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-200">
                    {formData.customerAppTitle}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-white/20">
                    {formData.currencySymbol} Currency
                  </span>
                </div>
                <div className="font-extrabold text-sm leading-tight">
                  {formData.customerWelcomeHeading}
                </div>
                <div className="text-[10px] text-red-100 line-clamp-2">
                  {formData.customerWelcomeSubheading}
                </div>
              </div>
            </div>

            {/* 4. Preview: Broadcast Banner */}
            {formData.showAnnouncementBanner && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  4. Live Broadcast Banner Preview
                </span>
                <div
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 border shadow-2xs ${
                    formData.announcementType === 'urgent'
                      ? 'bg-red-600 text-white border-red-700'
                      : formData.announcementType === 'offer'
                      ? 'bg-yellow-400 text-slate-950 border-yellow-500'
                      : formData.announcementType === 'advisory'
                      ? 'bg-amber-500 text-white border-amber-600'
                      : 'bg-slate-800 text-white border-slate-700'
                  }`}
                >
                  <Megaphone className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[11px] line-clamp-2">{formData.announcementText}</span>
                </div>
              </div>
            )}

            {/* 5. Preview: Worker App Header */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                5. Worker App Header with Uploaded Logo
              </span>
              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <BrandLogo
                      type={formData.logoType}
                      icon={formData.logoIcon}
                      imageUrl={formData.logoImageUrl}
                      shape={formData.logoShape}
                      gradient={formData.logoGradient}
                      size="xs"
                    />
                    <span className="text-xs font-black text-slate-900">
                      {formData.appName} <span className="text-yellow-600 font-bold text-[10px]">Partner Portal</span>
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400">{formData.supportCity || 'Mangalore, KA'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-yellow-100 text-yellow-800 flex items-center justify-center font-bold text-[11px]">
                      RG
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block leading-tight">Ramesh Gowda</span>
                      <span className="text-[10px] text-red-600 font-semibold">Loading & Unloading</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-950 border border-yellow-300">
                    Online
                  </span>
                </div>
              </div>
            </div>

            {/* SQLite Database Live Sync Status Card */}
            <div className="p-3 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-bold text-slate-100">Manual SQLite Engine</span>
                </div>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ACID SQL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                All branding & logo data is written to table <code>app_customization</code> in SQLite. Instant query & persistence across app restarts.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('database')}
                className="w-full py-1.5 bg-white/10 hover:bg-white/20 text-yellow-300 rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1 transition cursor-pointer"
              >
                <span>Open SQL Console & Tables</span>
                <Play className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
