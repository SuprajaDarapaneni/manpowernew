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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WorkersManagementView: React.FC = () => {
  const { workers, toggleWorkerAvailability, categories } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.phone.includes(searchTerm);
    const matchesCategory = categoryFilter === 'all' || w.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workers Directory & Profiles</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage temporary workforce profiles, check verification, monitor rating badges and set availability status
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs bg-slate-100 p-1.5 rounded-xl">
          <span className="font-semibold text-slate-800 px-2">{workers.length} Registered</span>
          <span className="text-emerald-700 font-semibold px-2 bg-white rounded-lg shadow-xs">
            {workers.filter((w) => w.isAvailable).length} Available for dispatch
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search workers by name, phone, area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:border-emerald-500 bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Workers Table matching Screenshot 5 */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Worker Profile</th>
                <th className="py-3.5 px-6">Primary Skill / Category</th>
                <th className="py-3.5 px-6">Contact & Location</th>
                <th className="py-3.5 px-6">Rating & Track Record</th>
                <th className="py-3.5 px-6">Wallet Balance</th>
                <th className="py-3.5 px-6 text-center">Availability Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredWorkers.map((worker) => (
                <tr key={worker.id} className="hover:bg-slate-50/70 transition">
                  {/* Worker Name & Avatar */}
                  <td className="py-4 px-6">
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
                            <span title="Verified Worker">
                              <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">ID: {worker.id}</span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-6">
                    <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold">
                      {worker.category}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {worker.skills.slice(0, 2).map((skill, idx) => (
                        <span key={idx} className="text-[10px] text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-4 px-6 text-xs space-y-0.5">
                    <div className="flex items-center space-x-1 text-slate-700 font-medium">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{worker.phone}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{worker.location}</span>
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-900">{worker.rating}</span>
                      <span className="text-xs text-slate-400">({worker.totalReviews})</span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-medium block mt-0.5">
                      {worker.jobsCompleted} Completed Jobs
                    </span>
                  </td>

                  {/* Wallet Balance */}
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-900 text-sm">
                      ₹{worker.walletBalance.toLocaleString()}
                    </span>
                    <span className="block text-[10px] text-slate-400">Available to withdraw</span>
                  </td>

                  {/* Status Toggle */}
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => toggleWorkerAvailability(worker.id)}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition ${
                        worker.isAvailable
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${worker.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                      <span>{worker.isAvailable ? 'Available' : 'Offline'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
