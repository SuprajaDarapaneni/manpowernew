import React, { useState } from 'react';
import {
  Search,
  Users,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Briefcase,
  IndianRupee,
} from 'lucide-react';
import { useCustomerApp } from '../hooks/useCustomerApp';
import { CategoryIcon } from '../../../components/common/CategoryIcon';
import { ServiceCategory } from '../../../types';

export const CustomerHomeView: React.FC = () => {
  const { categories, workers, setCustomerScreen } = useCustomerApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWorkers = workers.filter((w) => {
    if (selectedCategoryFilter && w.category.toLowerCase() !== selectedCategoryFilter.toLowerCase()) {
      return false;
    }
    if (searchQuery) {
      return (
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 p-3 sm:p-4 text-xs">
      {/* Hero Quick Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-1.5 max-w-[280px]">
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
            Instant Dispatch
          </span>
          <h2 className="text-base sm:text-lg font-black leading-tight">
            Book Verified Temporary Manpower in 60s
          </h2>
          <p className="text-[11px] text-white/90 leading-snug">
            Transparent floor pricing, verified Aadhaar workers & zero hidden commissions.
          </p>
          <button
            onClick={() => setCustomerScreen('post-job')}
            className="mt-2 px-3.5 py-1.5 rounded-xl bg-white text-red-700 font-bold text-xs shadow-sm flex items-center space-x-1.5 transition hover:bg-slate-50 cursor-pointer"
          >
            <span>Post Work Requirement</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search warehouse helpers, packing, loading..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 shadow-2xs"
        />
      </div>

      {/* Trade Categories Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
            Popular Labor Trades ({filteredCategories.length})
          </h3>
          {selectedCategoryFilter && (
            <button
              onClick={() => setSelectedCategoryFilter(null)}
              className="text-[11px] text-red-600 font-bold hover:underline"
            >
              Clear Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {filteredCategories.map((cat) => {
            const isSelected = selectedCategoryFilter === cat.name;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategoryFilter(isSelected ? null : cat.name);
                }}
                className={`p-2.5 rounded-xl border text-left transition relative cursor-pointer ${
                  isSelected
                    ? 'bg-red-50 border-red-400 shadow-xs ring-1 ring-red-400'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="p-1.5 rounded-lg bg-red-100 text-red-600">
                    <CategoryIcon iconName={cat.icon} className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {cat.totalWorkers}+ crew
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs truncate">{cat.name}</h4>
                <div className="flex items-center text-[10px] text-emerald-700 font-semibold mt-1">
                  <span>From ₹{cat.baseRatePerHour}/hr</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nearby Verified Workers */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
              Nearby Available Workers
            </h3>
            <p className="text-[10px] text-slate-500">Verified identity & on-site ratings</p>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
            {filteredWorkers.length} Online Now
          </span>
        </div>

        <div className="space-y-2">
          {filteredWorkers.map((worker) => (
            <div
              key={worker.id}
              className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition flex items-center justify-between gap-3"
            >
              <div className="flex items-center space-x-2.5">
                <div className="relative">
                  <img
                    src={worker.avatar}
                    alt={worker.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                  />
                  {worker.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-0.5 rounded-full">
                      <ShieldCheck className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1.5">
                    <strong className="text-slate-900 font-bold text-xs">{worker.name}</strong>
                    <div className="flex items-center text-amber-600 text-[10px] font-bold">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500 mr-0.5" />
                      <span>{worker.rating}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    {worker.category} &bull; {worker.jobsCompleted} completed
                  </div>
                  <div className="flex items-center text-[10px] text-slate-400 space-x-2">
                    <span className="flex items-center">
                      <MapPin className="w-2.5 h-2.5 mr-0.5" />
                      {worker.distanceKm} km away
                    </span>
                    <span>&bull;</span>
                    <span className="text-emerald-700 font-bold">₹{worker.hourlyRate}/hr</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCustomerScreen('post-job')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition shrink-0 cursor-pointer"
              >
                Book Worker
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
