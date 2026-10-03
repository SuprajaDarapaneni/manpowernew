import React from 'react';
import {
  IndianRupee,
  Star,
  CheckCircle2,
  Clock,
  Briefcase,
  ChevronRight,
  TrendingUp,
  MapPin,
  ArrowUpRight,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EmployeeDashboard: React.FC = () => {
  const {
    workers,
    activeWorkerId,
    toggleWorkerAvailability,
    orders,
    setSelectedJobId,
    setEmployeeScreen,
    bids,
  } = useApp();

  const worker = workers.find((w) => w.id === activeWorkerId) || workers[0];
  const myBids = bids.filter((b) => b.workerId === worker.id);
  const acceptedJobs = myBids.filter((b) => b.status === 'accepted');

  // Open job in worker's category
  const availableJob = orders.find(
    (o) => (o.status === 'open' || o.status === 'bidding') && !myBids.some((b) => b.jobId === o.id)
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-800 pb-20">
      {/* Top Header matching Screenshot 1 (Employee Flow) */}
      <div className="bg-white px-5 pt-4 pb-4 border-b border-slate-200/80 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={worker.avatar}
              alt={worker.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500 shadow-xs"
            />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Welcome Back
              </span>
              <h2 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Hello, {worker.name.split(' ')[0]}
              </h2>
              <span className="text-[11px] text-emerald-700 font-semibold">{worker.category}</span>
            </div>
          </div>

          {/* Availability Toggle matching Screenshot 1 */}
          <button
            onClick={() => toggleWorkerAvailability(worker.id)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-xs ${
              worker.isAvailable
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-slate-200 text-slate-600 border border-slate-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                worker.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            ></span>
            <span>{worker.isAvailable ? 'Available' : 'Offline'}</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Earnings Card matching Screenshot 1 */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-5 rounded-3xl shadow-md space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-emerald-100 text-xs font-medium uppercase tracking-wider block">
                Available Balance
              </span>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-3xl font-extrabold">₹{worker.walletBalance.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => alert(`Initiating instant payout of ₹${worker.walletBalance} to your registered UPI...`)}
              className="px-3.5 py-1.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-bold shadow-xs transition"
            >
              Withdraw
            </button>
          </div>

          {/* 2 Key Metric Badges matching Screenshot 1 (Jobs & Rating) */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/20">
            <div className="bg-white/10 rounded-2xl p-2.5 flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-base font-extrabold block leading-tight">{worker.jobsCompleted}</span>
                <span className="text-[10px] text-emerald-100">Jobs Done</span>
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-2.5 flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
              </div>
              <div>
                <span className="text-base font-extrabold block leading-tight">{worker.rating}</span>
                <span className="text-[10px] text-emerald-100">Star Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Job Opportunity Alert Banner */}
        {availableJob && (
          <div
            onClick={() => {
              setSelectedJobId(availableJob.id);
              setEmployeeScreen('job-details');
            }}
            className="bg-amber-50 border border-amber-200/90 p-3.5 rounded-2xl shadow-xs cursor-pointer hover:bg-amber-100/70 transition flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                  New Nearby Job Alert
                </span>
                <h4 className="font-bold text-xs text-slate-900">{availableJob.category}</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  ₹{availableJob.minBudget} - ₹{availableJob.maxBudget} • {availableJob.location.split(',')[0]}
                </p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-white text-slate-700 flex items-center justify-center shrink-0">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Recent Jobs List matching Screenshot 1 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-slate-900 text-sm">Recent Jobs</h3>
            <button
              onClick={() => setEmployeeScreen('my-bids')}
              className="text-[11px] font-semibold text-emerald-600 hover:underline"
            >
              See all
            </button>
          </div>

          <div className="space-y-2.5">
            {[
              {
                title: 'Loading & Unloading',
                location: 'Mangalore Industrial Area',
                amount: '₹2,000',
                date: 'Yesterday',
                status: 'Paid',
              },
              {
                title: 'Food Serving Assistance',
                location: 'Kankanady Banquet Hall',
                amount: '₹1,800',
                date: '20 Sep',
                status: 'Paid',
              },
              {
                title: 'Warehouse Pallet Stacking',
                location: 'Bunder Port Cargo Yard',
                amount: '₹2,200',
                date: '17 Sep',
                status: 'Paid',
              },
            ].map((job, idx) => (
              <div
                key={idx}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{job.title}</h4>
                    <p className="text-[11px] text-slate-500">{job.location} • {job.date}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-slate-900 text-xs block">{job.amount}</span>
                  <span className="text-[10px] font-bold text-emerald-600">{job.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
