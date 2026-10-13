import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  IndianRupee,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useCustomerApp } from '../hooks/useCustomerApp';
import confetti from 'canvas-confetti';

export const PostJobView: React.FC = () => {
  const { categories, postJob, setCustomerScreen, customerAuth, addNotification } = useCustomerApp();

  const [title, setTitle] = useState('Urgent Warehouse Cargo Loading');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.name || 'Loading & Unloading');
  const [requiredWorkers, setRequiredWorkers] = useState(3);
  const [durationHours, setDurationHours] = useState(8);
  const [pricePerHead, setPricePerHead] = useState(550);
  const [location, setLocation] = useState(customerAuth?.location || 'Baikampady Industrial Hub, Mangalore');
  const [date, setDate] = useState('Today, 2:00 PM');
  const [notes, setNotes] = useState('Heavy carton lifting, truck loading, hydration provided.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrderNumber, setSubmittedOrderNumber] = useState<string | null>(null);

  const matchedCat = categories.find((c) => c.name.toLowerCase() === selectedCategory.toLowerCase()) || categories[0];
  const minFloorPrice = matchedCat?.minPricePerHead || 450;
  const isBelowFloor = pricePerHead < minFloorPrice;

  const totalBudget = requiredWorkers * pricePerHead;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBelowFloor) return;

    setIsSubmitting(true);
    const newOrderId = postJob({
      title,
      category: selectedCategory,
      requiredWorkers,
      durationHours,
      ratePerHour: Math.round(pricePerHead / durationHours),
      pricePerHead,
      location,
      notes,
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}

    setIsSubmitting(false);
    setSubmittedOrderNumber(newOrderId || 'Order #1046');
    addNotification('Job Order Published', `Requirement for ${requiredWorkers} workers published to nearby partners.`, 'success', 'employee');
  };

  if (submittedOrderNumber) {
    return (
      <div className="p-4 sm:p-6 text-center space-y-4">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Booking Published!
          </span>
          <h2 className="text-lg font-black text-slate-900">{title}</h2>
          <p className="text-xs text-slate-500">
            {requiredWorkers} workers requested &bull; Budget ₹{totalBudget.toLocaleString()}
          </p>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Order Ref:</span>
            <strong className="font-mono text-slate-900">{submittedOrderNumber}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Status:</span>
            <span className="text-amber-600 font-bold">Waiting for Worker Quotes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Location:</span>
            <span className="text-slate-800 font-medium">{location}</span>
          </div>
        </div>

        <button
          onClick={() => {
            setSubmittedOrderNumber(null);
            setCustomerScreen('bids');
          }}
          className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-2 transition cursor-pointer"
        >
          <span>View Incoming Quotes & Bids</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 text-xs space-y-4">
      <div className="space-y-0.5">
        <h2 className="text-base font-extrabold text-slate-900">Post Manpower Requirement</h2>
        <p className="text-slate-500 text-[11px]">
          Describe your task, set headcount and get competitive quotes in minutes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Job Title / Scope of Work *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Loading 2 Container Trucks"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
          />
        </div>

        {/* Trade Category */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Service Category Trade *
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white cursor-pointer font-medium"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name} (Floor: ₹{c.minPricePerHead}/head)
              </option>
            ))}
          </select>
        </div>

        {/* Headcount & Shift Hours */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Required Workers
            </label>
            <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
              <button
                type="button"
                onClick={() => setRequiredWorkers(Math.max(1, requiredWorkers - 1))}
                className="px-3 py-1.5 font-bold text-slate-600 hover:bg-slate-200"
              >
                -
              </button>
              <span className="flex-1 text-center font-bold text-slate-900 text-xs">
                {requiredWorkers} People
              </span>
              <button
                type="button"
                onClick={() => setRequiredWorkers(requiredWorkers + 1)}
                className="px-3 py-1.5 font-bold text-slate-600 hover:bg-slate-200"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Shift Duration
            </label>
            <select
              value={durationHours}
              onChange={(e) => setDurationHours(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium cursor-pointer"
            >
              <option value={4}>4 Hours (Half Day)</option>
              <option value={8}>8 Hours (Full Day Shift)</option>
              <option value={10}>10 Hours (Overtime Shift)</option>
              <option value={12}>12 Hours (Extended Shift)</option>
            </select>
          </div>
        </div>

        {/* Price Per Head with Floor Rule */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-700">
              Offered Rate Per Worker (₹) *
            </label>
            <span className="text-[10px] text-slate-500 font-semibold">
              Admin Min Floor: ₹{minFloorPrice}
            </span>
          </div>
          <div className="relative">
            <IndianRupee className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="number"
              min={minFloorPrice}
              value={pricePerHead}
              onChange={(e) => setPricePerHead(Number(e.target.value))}
              className={`w-full bg-slate-50 border rounded-xl pl-8 pr-3 py-2 text-xs font-bold text-slate-900 focus:outline-none ${
                isBelowFloor ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 focus:border-red-500'
              }`}
            />
          </div>
          {isBelowFloor && (
            <div className="mt-1 flex items-center text-[11px] text-rose-600 font-medium gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>Rate cannot be below the regulated floor price of ₹{minFloorPrice}/worker.</span>
            </div>
          )}
        </div>

        {/* Location & Date */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Worksite Location
          </label>
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter worksite address"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Total Estimate Summary */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">
              Estimated Total Escrow
            </span>
            <span className="text-xs text-slate-600 font-medium">
              {requiredWorkers} workers &times; ₹{pricePerHead}
            </span>
          </div>
          <div className="text-right">
            <span className="text-base font-black text-slate-900">
              ₹{totalBudget.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-600 block font-semibold">
              Held in Escrow until Job Done
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isBelowFloor}
          className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-2 transition disabled:opacity-50 cursor-pointer"
        >
          <span>Publish & Receive Worker Quotes</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
