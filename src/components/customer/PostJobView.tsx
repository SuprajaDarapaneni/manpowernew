import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  IndianRupee,
  FileText,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PostJobView: React.FC = () => {
  const { categories, postJob, setCustomerScreen } = useApp();

  const [category, setCategory] = useState('Loading & Unloading');
  const [title, setTitle] = useState('Loading & Unloading Warehouse Stock');
  const [location, setLocation] = useState('Mangalore Industrial Area, Karnataka');
  const [scheduledDate, setScheduledDate] = useState('2025-09-25');
  const [scheduledTime, setScheduledTime] = useState('10:00 AM');
  const [workingHours, setWorkingHours] = useState(5);
  const [requiredWorkers, setRequiredWorkers] = useState(4);
  const [minBudget, setMinBudget] = useState(2000);
  const [maxBudget, setMaxBudget] = useState(2500);
  const [specialInstructions, setSpecialInstructions] = useState('Heavy items, warehouse work, gloves needed.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    postJob({
      customerId: 'cust-demo',
      customerName: 'Demo Employer',
      customerPhone: '+91 98450 99887',
      category,
      title: title || `${category} Service`,
      location,
      scheduledDate,
      scheduledTime,
      workingHours: Number(workingHours),
      requiredWorkers: Number(requiredWorkers),
      minBudget: Number(minBudget),
      maxBudget: Number(maxBudget),
      specialInstructions,
    });

    // Automatically navigate to view bids screen
    setCustomerScreen('view-bids');
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-800 pb-20">
      {/* Header matching Screenshot 3 */}
      <div className="bg-white px-4 py-3.5 border-b border-slate-200/80 sticky top-0 z-20 flex items-center justify-between">
        <button
          onClick={() => setCustomerScreen('home')}
          className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-sm text-slate-900">Post Job / Set Requirements</h2>
        <div className="w-5"></div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Service Category */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Service Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Job Site Location</span>
          </label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Mangalore, Karnataka"
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Schedule & Working Hours */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Date</span>
              </label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Start Time</span>
              </label>
              <input
                type="text"
                required
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                placeholder="10:00 AM"
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
              Working Duration (Hours)
            </label>
            <div className="flex items-center space-x-2">
              {[2, 4, 5, 8].map((hrs) => (
                <button
                  type="button"
                  key={hrs}
                  onClick={() => setWorkingHours(hrs)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    workingHours === hrs
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {hrs} hrs
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Number of Employees counter (- / +) matching Screenshot 3 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Number of Employees
            </label>
            <span className="text-[11px] text-slate-400">Total workers required for this assignment</span>
          </div>

          <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setRequiredWorkers(Math.max(1, requiredWorkers - 1))}
              className="w-8 h-8 rounded-lg bg-white shadow-xs font-extrabold text-slate-700 flex items-center justify-center hover:bg-slate-100 active:scale-95"
            >
              -
            </button>
            <span className="font-extrabold text-slate-900 text-sm px-1">{requiredWorkers}</span>
            <button
              type="button"
              onClick={() => setRequiredWorkers(requiredWorkers + 1)}
              className="w-8 h-8 rounded-lg bg-emerald-600 text-white shadow-xs font-extrabold flex items-center justify-center hover:bg-emerald-700 active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* Budget Range matching Screenshot 3 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Budget Range (₹)</span>
            <span className="text-emerald-700 font-extrabold text-xs">
              ₹{minBudget} - ₹{maxBudget}
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">Min ₹</span>
              <input
                type="number"
                step="100"
                value={minBudget}
                onChange={(e) => setMinBudget(Number(e.target.value))}
                className="w-full pl-12 pr-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">Max ₹</span>
              <input
                type="number"
                step="100"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full pl-12 pr-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Special Instructions (Optional) matching Screenshot 3 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Special Instructions (Optional)
          </label>
          <textarea
            rows={2}
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="e.g. Heavy items, warehouse work, gloves needed"
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
          ></textarea>
        </div>

        {/* Submit Button matching Screenshot 3 ("Post Job & Get Bids") */}
        <button
          type="submit"
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md shadow-emerald-600/20 active:scale-98 transition flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Post Job & Get Bids</span>
        </button>
      </form>
    </div>
  );
};
