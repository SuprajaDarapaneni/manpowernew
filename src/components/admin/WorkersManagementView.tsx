import React, { useState } from 'react';
import {
  Users,
  Search,
  Star,
  ShieldCheck,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  Briefcase,
  IndianRupee,
  Wallet,
  Plus,
  Edit3,
  Trash2,
  AlertTriangle,
  X,
  Save,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Sparkles,
  Sliders,
  DollarSign,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Worker, WalletTransaction } from '../../types';

export const WorkersManagementView: React.FC = () => {
  const {
    workers,
    categories,
    commission,
    walletTransactions,
    toggleWorkerAvailability,
    updateWorkerProfile,
    createWorkerProfile,
    deleteWorkerProfile,
    adjustWorkerWalletAdmin,
    triggerPushToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [walletFilter, setWalletFilter] = useState<'all' | 'low' | 'healthy'>('all');

  // Modal States
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
  const [selectedLedgerWorker, setSelectedLedgerWorker] = useState<Worker | null>(null);
  const [walletAdjustWorker, setWalletAdjustWorker] = useState<Worker | null>(null);

  // Wallet adjustment modal state
  const [adjustAmount, setAdjustAmount] = useState<number>(200);
  const [adjustIsCredit, setAdjustIsCredit] = useState<boolean>(true);
  const [adjustReason, setAdjustReason] = useState<string>('Performance Incentive Bonus');

  // Form state for creating a new worker
  const [newWorkerData, setNewWorkerData] = useState<{
    name: string;
    phone: string;
    category: string;
    hourlyRate: number;
    location: string;
    skills: string;
    walletBalance: number;
    avatar: string;
    isVerified: boolean;
    aadhaarNo: string;
  }>({
    name: '',
    phone: '+91 ',
    category: categories[0]?.name || 'Loading & Unloading',
    hourlyRate: 250,
    location: 'Mangalore, Karnataka',
    skills: 'Material Handling, Safe Lifting',
    walletBalance: 500,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    aadhaarNo: 'XXXX-XXXX-4819',
  });

  const minRequiredDefault = commission.minWalletBalance ?? 200;

  // Filtered list
  const filteredWorkers = workers.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.phone.includes(searchTerm);
    const matchesCategory = categoryFilter === 'all' || w.category === categoryFilter;

    const minReq = w.minBalanceOverride ?? minRequiredDefault;
    const matchesWallet =
      walletFilter === 'all'
        ? true
        : walletFilter === 'low'
        ? w.walletBalance < minReq
        : w.walletBalance >= minReq;

    return matchesSearch && matchesCategory && matchesWallet;
  });

  // Analytics Metrics
  const totalRegistered = workers.length;
  const availableWorkers = workers.filter((w) => w.isAvailable).length;
  const lowBalanceWorkers = workers.filter(
    (w) => w.walletBalance < (w.minBalanceOverride ?? minRequiredDefault)
  ).length;
  const totalFloatingWalletBalance = workers.reduce((acc, w) => acc + (w.walletBalance || 0), 0);

  // Save edited worker
  const handleSaveEditWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorker) return;
    updateWorkerProfile(editingWorker.id, editingWorker);
    setEditingWorker(null);
  };

  // Submit new worker
  const handleCreateWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkerData.name.trim() || !newWorkerData.phone.trim()) {
      triggerPushToast({
        type: 'general',
        title: 'Validation Error',
        message: 'Please provide both full name and phone number for the worker profile.',
        targetRole: 'admin',
      });
      return;
    }

    createWorkerProfile({
      name: newWorkerData.name.trim(),
      phone: newWorkerData.phone.trim(),
      category: newWorkerData.category,
      hourlyRate: Number(newWorkerData.hourlyRate),
      location: newWorkerData.location.trim(),
      skills: newWorkerData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      walletBalance: Number(newWorkerData.walletBalance),
      avatar: newWorkerData.avatar,
      isVerified: newWorkerData.isVerified,
      aadhaarNo: newWorkerData.aadhaarNo,
      rating: 5.0,
      totalReviews: 1,
      jobsCompleted: 0,
      distanceKm: 2.1,
      isAvailable: true,
    });

    setIsAddWorkerOpen(false);
    setNewWorkerData({
      name: '',
      phone: '+91 ',
      category: categories[0]?.name || 'Loading & Unloading',
      hourlyRate: 250,
      location: 'Mangalore, Karnataka',
      skills: 'Material Handling, Safe Lifting',
      walletBalance: 500,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
      aadhaarNo: 'XXXX-XXXX-4819',
    });
  };

  // Execute admin wallet adjustment
  const handleExecuteWalletAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAdjustWorker || adjustAmount <= 0) return;
    adjustWorkerWalletAdmin(
      walletAdjustWorker.id,
      Number(adjustAmount),
      adjustIsCredit,
      adjustReason.trim()
    );
    setWalletAdjustWorker(null);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-yellow-500 text-white flex items-center justify-center shadow-md">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Workers Management & Profile Setups
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Configure employee profiles, manage in-app wallet balances, enforce commission thresholds, and control dispatch availability
          </p>
        </div>

        <button
          onClick={() => setIsAddWorkerOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-950/20 flex items-center justify-center space-x-2 transition active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Worker Profile</span>
        </button>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Registered</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalRegistered}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Enrolled partners</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Available for Dispatch</span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{availableWorkers}</div>
          <div className="text-[11px] text-yellow-700 font-semibold mt-0.5">Ready to receive jobs</div>
        </div>

        <div
          onClick={() => setWalletFilter(walletFilter === 'low' ? 'all' : 'low')}
          className={`bg-white p-4 rounded-2xl border shadow-xs cursor-pointer transition ${
            walletFilter === 'low'
              ? 'border-red-500 bg-red-50/40 ring-2 ring-red-500/20'
              : 'border-slate-200 hover:border-red-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Low Wallet Balance</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-extrabold text-red-600 mt-1">{lowBalanceWorkers}</div>
          <div className="text-[11px] text-red-700 font-semibold mt-0.5">
            Below ₹{minRequiredDefault} minimum • Tap to filter
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Floating Wallet Pool</span>
            <Wallet className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 flex items-center">
            <span className="text-yellow-600 mr-0.5">₹</span>
            {totalFloatingWalletBalance.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Worker prepay reserve</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by worker name, phone, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-red-500 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:border-red-500 bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Wallet Balance Status Filter */}
          <select
            value={walletFilter}
            onChange={(e) => setWalletFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:border-red-500 bg-white"
          >
            <option value="all">All Wallet Balances</option>
            <option value="healthy">Healthy Balance (≥ ₹{minRequiredDefault})</option>
            <option value="low">Low Balance (&lt; ₹{minRequiredDefault})</option>
          </select>
        </div>
      </div>

      {/* Workers Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-200 tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Worker Profile</th>
                <th className="py-3.5 px-5">Category & Rate</th>
                <th className="py-3.5 px-5">Contact & Location</th>
                <th className="py-3.5 px-5">Rating & Jobs</th>
                <th className="py-3.5 px-5">Wallet Balance</th>
                <th className="py-3.5 px-5 text-center">Dispatch Status</th>
                <th className="py-3.5 px-5 text-right">Profile Setups</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No worker records match your search or filters.
                  </td>
                </tr>
              ) : (
                filteredWorkers.map((worker) => {
                  const minReq = worker.minBalanceOverride ?? minRequiredDefault;
                  const isLow = worker.walletBalance < minReq;

                  return (
                    <tr key={worker.id} className="hover:bg-slate-50/80 transition">
                      {/* Worker Profile & Avatar */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center space-x-3">
                          <img
                            src={worker.avatar}
                            alt={worker.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="font-bold text-slate-900">{worker.name}</span>
                              {worker.isVerified && (
                                <span title="Identity & Aadhaar Verified">
                                  <ShieldCheck className="w-4 h-4 text-red-600 fill-yellow-100" />
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">
                              ID: {worker.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category & Hourly Rate */}
                      <td className="py-3.5 px-5">
                        <span className="inline-block px-2.5 py-0.5 bg-yellow-50 text-yellow-950 border border-yellow-200 rounded-lg text-xs font-bold">
                          {worker.category}
                        </span>
                        <div className="text-[11px] text-slate-500 font-semibold mt-1">
                          ₹{worker.hourlyRate}/hr base
                        </div>
                      </td>

                      {/* Contact & Location */}
                      <td className="py-3.5 px-5 text-xs space-y-0.5">
                        <div className="flex items-center space-x-1 text-slate-800 font-medium font-mono">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{worker.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[150px]">{worker.location}</span>
                        </div>
                      </td>

                      {/* Rating & Jobs Completed */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-slate-900">{worker.rating}</span>
                          <span className="text-xs text-slate-400">({worker.totalReviews})</span>
                        </div>
                        <span className="text-[11px] text-slate-600 font-medium block mt-0.5">
                          {worker.jobsCompleted} Completed Jobs
                        </span>
                      </td>

                      {/* Wallet Balance with Low Balance Warning */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center space-x-1.5">
                          <span
                            className={`font-extrabold text-sm ${
                              isLow ? 'text-red-600' : 'text-slate-900'
                            }`}
                          >
                            ₹{worker.walletBalance.toLocaleString()}
                          </span>
                          {isLow && (
                            <span
                              title={`Low Balance: Required min is ₹${minReq} to receive orders`}
                              className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-extrabold flex items-center gap-0.5"
                            >
                              <AlertTriangle className="w-3 h-3 text-red-600" /> Low
                            </span>
                          )}
                        </div>
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          Min Req: ₹{minReq}
                        </span>
                      </td>

                      {/* Availability Status */}
                      <td className="py-3.5 px-5 text-center">
                        <button
                          onClick={() => toggleWorkerAvailability(worker.id)}
                          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                            worker.isAvailable
                              ? 'bg-yellow-100 text-yellow-950 border border-yellow-300 hover:bg-yellow-200'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              worker.isAvailable ? 'bg-red-600 animate-pulse' : 'bg-slate-400'
                            }`}
                          />
                          <span>{worker.isAvailable ? 'Available' : 'Offline'}</span>
                        </button>
                      </td>

                      {/* Actions: Edit Profile, Adjust Wallet, Statement */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Wallet Adjust Button */}
                          <button
                            title="Adjust In-App Wallet"
                            onClick={() => {
                              setWalletAdjustWorker(worker);
                              setAdjustAmount(200);
                              setAdjustIsCredit(true);
                              setAdjustReason('Admin Wallet Adjustment');
                            }}
                            className="p-1.5 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-900 border border-yellow-200 transition"
                          >
                            <Wallet className="w-4 h-4 text-red-600" />
                          </button>

                          {/* Statement Ledger */}
                          <button
                            title="View Transaction Ledger"
                            onClick={() => setSelectedLedgerWorker(worker)}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition"
                          >
                            <Clock className="w-4 h-4 text-slate-600" />
                          </button>

                          {/* Edit Profile Setup */}
                          <button
                            title="Edit Worker Profile Setup"
                            onClick={() => setEditingWorker({ ...worker })}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition"
                          >
                            <Edit3 className="w-4 h-4 text-red-600" />
                          </button>

                          {/* Delete Worker */}
                          <button
                            title="Remove Worker"
                            onClick={() => {
                              if (confirm(`Remove worker profile for ${worker.name}?`)) {
                                deleteWorkerProfile(worker.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 1. WORKER PROFILE SETUP & EDIT MODAL                 */}
      {/* ==================================================== */}
      {editingWorker && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Edit Worker Profile Setups
                  </h3>
                  <p className="text-xs text-slate-400">
                    ID: {editingWorker.id} • All settings sync to Employee App
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingWorker(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditWorker} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Worker Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingWorker.name}
                    onChange={(e) => setEditingWorker({ ...editingWorker, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="text"
                    required
                    value={editingWorker.phone}
                    onChange={(e) => setEditingWorker({ ...editingWorker, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Service Category
                  </label>
                  <select
                    value={editingWorker.category}
                    onChange={(e) => setEditingWorker({ ...editingWorker, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-red-500 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hourly Base Rate */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hourly Base Rate (₹/hr)
                  </label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={editingWorker.hourlyRate}
                    onChange={(e) =>
                      setEditingWorker({ ...editingWorker, hourlyRate: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Work Location / Operational Area
                  </label>
                  <input
                    type="text"
                    required
                    value={editingWorker.location}
                    onChange={(e) =>
                      setEditingWorker({ ...editingWorker, location: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Aadhaar / ID No */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Aadhaar / Gov ID Verification
                  </label>
                  <input
                    type="text"
                    value={editingWorker.aadhaarNo || 'XXXX-XXXX-4819'}
                    onChange={(e) =>
                      setEditingWorker({ ...editingWorker, aadhaarNo: e.target.value })
                    }
                    placeholder="XXXX-XXXX-1234"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Wallet Balance Direct Setting */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    In-App Wallet Balance (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingWorker.walletBalance}
                    onChange={(e) =>
                      setEditingWorker({ ...editingWorker, walletBalance: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Minimum Balance Requirement Override */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Min Balance Override (₹) <span className="font-normal text-slate-400">(Default: {minRequiredDefault})</span>
                  </label>
                  <input
                    type="number"
                    value={editingWorker.minBalanceOverride ?? minRequiredDefault}
                    onChange={(e) =>
                      setEditingWorker({
                        ...editingWorker,
                        minBalanceOverride: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Worker Star Rating (1.0 - 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={editingWorker.rating}
                    onChange={(e) =>
                      setEditingWorker({ ...editingWorker, rating: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Completed Jobs */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Total Jobs Completed
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingWorker.jobsCompleted}
                    onChange={(e) =>
                      setEditingWorker({ ...editingWorker, jobsCompleted: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Skills tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Skills & Equipment Badges (Comma-separated)
                </label>
                <input
                  type="text"
                  value={editingWorker.skills.join(', ')}
                  onChange={(e) =>
                    setEditingWorker({
                      ...editingWorker,
                      skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Avatar Photo URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Profile Photo URL
                </label>
                <input
                  type="url"
                  value={editingWorker.avatar}
                  onChange={(e) => setEditingWorker({ ...editingWorker, avatar: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Toggles: Verified & Available */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <label className="flex items-center space-x-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingWorker.isVerified}
                    onChange={(e) =>
                      setEditingWorker({ ...editingWorker, isVerified: e.target.checked })
                    }
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="text-xs font-bold text-slate-800">Identity Verified Badge</span>
                </label>

                <label className="flex items-center space-x-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingWorker.isAvailable}
                    onChange={(e) =>
                      setEditingWorker({ ...editingWorker, isAvailable: e.target.checked })
                    }
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="text-xs font-bold text-slate-800">Available for Dispatch</span>
                </label>
              </div>

              {/* Save Button */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingWorker(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-950/20 flex items-center justify-center space-x-1.5 transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Setups</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. ADD NEW WORKER ONBOARDING MODAL                  */}
      {/* ==================================================== */}
      {isAddWorkerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-yellow-500 text-white flex items-center justify-center shadow-md">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Onboard New Worker</h3>
                  <p className="text-xs text-slate-400">Add partner profile to temporary manpower dispatch</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddWorkerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWorker} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Kulal"
                    value={newWorkerData.name}
                    onChange={(e) => setNewWorkerData({ ...newWorkerData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / Mobile *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98450 12345"
                    value={newWorkerData.phone}
                    onChange={(e) => setNewWorkerData({ ...newWorkerData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Trade / Category
                  </label>
                  <select
                    value={newWorkerData.category}
                    onChange={(e) => setNewWorkerData({ ...newWorkerData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-red-500 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hourly Base Rate (₹)
                  </label>
                  <input
                    type="number"
                    min="100"
                    value={newWorkerData.hourlyRate}
                    onChange={(e) =>
                      setNewWorkerData({ ...newWorkerData, hourlyRate: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Initial Wallet Credit (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newWorkerData.walletBalance}
                    onChange={(e) =>
                      setNewWorkerData({ ...newWorkerData, walletBalance: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Operating City / Area
                  </label>
                  <input
                    type="text"
                    value={newWorkerData.location}
                    onChange={(e) =>
                      setNewWorkerData({ ...newWorkerData, location: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Material Handling, Heavy Stacking, Site Cleanup"
                  value={newWorkerData.skills}
                  onChange={(e) => setNewWorkerData({ ...newWorkerData, skills: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddWorkerOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-950/20 flex items-center justify-center space-x-1.5 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enrol Worker</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. ADMIN WALLET ADJUSTMENT MODAL                    */}
      {/* ==================================================== */}
      {walletAdjustWorker && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-200 animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Adjust Worker Wallet</h3>
                  <p className="text-[11px] text-slate-400">{walletAdjustWorker.name}</p>
                </div>
              </div>
              <button
                onClick={() => setWalletAdjustWorker(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">Current Balance:</span>
              <span className="font-extrabold text-sm text-slate-900">
                ₹{walletAdjustWorker.walletBalance.toLocaleString()}
              </span>
            </div>

            <form onSubmit={handleExecuteWalletAdjust} className="space-y-3.5">
              {/* Type: Credit or Debit */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Action</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustIsCredit(true)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      adjustIsCredit
                        ? 'bg-yellow-400 text-yellow-950 border-yellow-500 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    + Credit Wallet
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustIsCredit(false)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      !adjustIsCredit
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    - Debit Wallet
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Adjustment Amount (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason / Note</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Incentive bonus, Security deposit"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Net Balance Preview */}
              <div className="bg-yellow-50 p-2.5 rounded-xl border border-yellow-200 flex items-center justify-between text-xs">
                <span className="text-yellow-900 font-semibold">New Balance After:</span>
                <span className="font-extrabold text-sm text-yellow-950">
                  ₹
                  {(
                    adjustIsCredit
                      ? walletAdjustWorker.walletBalance + adjustAmount
                      : Math.max(0, walletAdjustWorker.walletBalance - adjustAmount)
                  ).toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-950/20 transition cursor-pointer"
              >
                Apply Adjustment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. WORKER TRANSACTION LEDGER STATEMENT MODAL        */}
      {/* ==================================================== */}
      {selectedLedgerWorker && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-yellow-500 text-white flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Wallet Statement & Ledger
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {selectedLedgerWorker.name} • Balance: ₹{selectedLedgerWorker.walletBalance.toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLedgerWorker(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
              {walletTransactions.filter((tx) => tx.workerId === selectedLedgerWorker.id).length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-xs">
                  No transaction records logged yet for this worker.
                </div>
              ) : (
                walletTransactions
                  .filter((tx) => tx.workerId === selectedLedgerWorker.id)
                  .map((tx) => (
                    <div key={tx.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            tx.type === 'debit'
                              ? 'bg-red-50 text-red-600 border border-red-200'
                              : 'bg-yellow-50 text-yellow-800 border border-yellow-300'
                          }`}
                        >
                          {tx.type === 'debit' ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate">{tx.description}</div>
                          <div className="text-[10px] text-slate-400">
                            {tx.timestamp} • {tx.paymentMethod?.toUpperCase()}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div
                          className={`font-extrabold ${
                            tx.type === 'debit' ? 'text-red-600' : 'text-emerald-700'
                          }`}
                        >
                          {tx.type === 'debit' ? '-' : '+'}₹{tx.amount.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Bal: ₹{tx.balanceAfter?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <button
              onClick={() => setSelectedLedgerWorker(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              Close Ledger
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
