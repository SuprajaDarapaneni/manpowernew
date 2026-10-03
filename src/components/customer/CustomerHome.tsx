import React, { useState } from 'react';
import {
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  ShieldCheck,
  PlusCircle,
  Briefcase,
  ChevronRight,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CategoryIcon } from '../common/CategoryIcon';

export const CustomerHome: React.FC = () => {
  const { categories, workers, setCustomerScreen, setSelectedJobId, orders } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activeCategories = categories.filter((c) => c.active);

  const filteredWorkers = workers.filter((w) => {
    const matchesCat = selectedCategory === 'all' || w.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Recent job needing bids
  const latestOpenJob = orders.find((o) => o.status === 'bidding' || o.status === 'open');

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-800 pb-20">
      {/* Mobile Top Header matching Screenshot 2 */}
      <div className="bg-white px-5 pt-4 pb-4 border-b border-slate-200/80 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              MP
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Current Location
              </span>
              <div className="flex items-center space-x-1 text-slate-900 font-bold text-xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mangalore, Karnataka</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCustomerScreen('post-job')}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post Job</span>
          </button>
        </div>

        {/* Search Bar matching Screenshot 2 ("Find the right manpower") */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Find the right manpower (e.g. Loading, Cleaning)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100/80 border border-slate-200/60 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white transition"
          />
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Active Bidding Callout Banner if job is in bidding */}
        {latestOpenJob && (
          <div
            onClick={() => {
              setSelectedJobId(latestOpenJob.id);
              setCustomerScreen('view-bids');
            }}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm cursor-pointer hover:shadow-md transition flex items-center justify-between group"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block mb-1">
                Active Bids Alert
              </span>
              <h4 className="font-bold text-xs">{latestOpenJob.category} ({latestOpenJob.orderNumber})</h4>
              <p className="text-[11px] text-emerald-100 mt-0.5">
                Workers are placing bids now • Click to compare quotes
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-white text-white group-hover:text-emerald-700 flex items-center justify-center transition shrink-0 ml-2">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Service Categories Grid matching Screenshot 2 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-sm">Service Categories</h3>
            <span className="text-[11px] text-emerald-700 font-semibold cursor-pointer">
              {activeCategories.length} Available
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {activeCategories.slice(0, 8).map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? 'all' : cat.name)}
                  className={`flex flex-col items-center p-2 rounded-xl transition text-center ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200/80 text-slate-700 hover:border-emerald-300'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    <CategoryIcon name={cat.icon} className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold line-clamp-1 leading-tight">
                    {cat.name}
                  </span>
                  <span className={`text-[9px] mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                    ₹{cat.baseRatePerHour}/hr
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nearby Available Workers matching Screenshot 2 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Nearby Available Workers</h3>
              <p className="text-[11px] text-slate-400">Verified manpower ready for immediate assignment</p>
            </div>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-[11px] font-semibold text-emerald-600 hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>

          <div className="space-y-3">
            {filteredWorkers.map((worker) => (
              <div
                key={worker.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={worker.avatar}
                      alt={worker.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    {worker.isAvailable && (
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{worker.name}</h4>
                      {worker.isVerified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                      )}
                    </div>

                    <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="flex items-center text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                        {worker.rating}
                      </span>
                      <span>•</span>
                      <span>{worker.category}</span>
                      <span>•</span>
                      <span>{worker.distanceKm} km away</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {worker.skills.slice(0, 2).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-2">
                  <span className="text-xs font-extrabold text-slate-900 block">
                    ₹{worker.hourlyRate}
                    <span className="text-[10px] text-slate-400 font-normal">/hr</span>
                  </span>
                  <button
                    onClick={() => {
                      setCustomerScreen('post-job');
                    }}
                    className="mt-2 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-lg transition"
                  >
                    Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
