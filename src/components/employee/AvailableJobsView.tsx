import React from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  IndianRupee,
  Users,
  ChevronRight,
  Briefcase,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AvailableJobsView: React.FC = () => {
  const { orders, setSelectedJobId, setEmployeeScreen, bids, activeWorkerId } = useApp();

  const openOrders = orders.filter((o) => o.status === 'open' || o.status === 'bidding');

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-800 pb-20">
      {/* Header */}
      <div className="bg-white px-5 pt-4 pb-3 border-b border-slate-200/80 sticky top-0 z-20">
        <h2 className="font-bold text-base text-slate-900">Available Job Opportunities</h2>
        <p className="text-[11px] text-slate-400">Nearby requests seeking temporary workforce quotes</p>
      </div>

      <div className="p-4 space-y-3">
        {openOrders.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 p-6">
            <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No Open Jobs at the moment</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Switch to Customer App and tap "Post Job" to create a live opportunity!
            </p>
          </div>
        ) : (
          openOrders.map((job) => {
            const hasBidAlready = bids.some((b) => b.jobId === job.id && b.workerId === activeWorkerId);

            return (
              <div
                key={job.id}
                onClick={() => {
                  setSelectedJobId(job.id);
                  setEmployeeScreen('job-details');
                }}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 cursor-pointer transition space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1">
                      {job.orderNumber}
                    </span>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{job.category}</h3>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{job.location}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">Budget</span>
                    <span className="text-xs font-extrabold text-emerald-700">
                      ₹{job.minBudget} - ₹{job.maxBudget}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {job.scheduledDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {job.scheduledTime}
                    </span>
                  </div>

                  {hasBidAlready ? (
                    <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      Bid Placed
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center">
                      Bid Now <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
