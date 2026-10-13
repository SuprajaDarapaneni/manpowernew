import React, { useState } from 'react';
import {
  Bell,
  X,
  Zap,
  CheckCircle2,
  IndianRupee,
  Briefcase,
  Play,
  Sparkles,
  Smartphone,
  Send,
  Volume2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PushNotificationType } from '../../shared/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PushNotificationSimulatorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    triggerPushToast,
    orders,
    workers,
    activeWorkerId,
    customerAuth,
    employeeAuth,
  } = useApp();

  // Custom alert form
  const [customType, setCustomType] = useState<PushNotificationType>('bid');
  const [customRole, setCustomRole] = useState<'customer' | 'employee'>('customer');
  const [customTitle, setCustomTitle] = useState('🔔 New Bid Received! ₹450');
  const [customMessage, setCustomMessage] = useState('Suresh Poojary placed a quote for Loading & Unloading shift.');
  const [customAmount, setCustomAmount] = useState<number>(450);

  if (!isOpen) return null;

  const currentOrder = orders[0] || {
    id: 'job-1045',
    orderNumber: 'MP-2026-1045',
    category: 'Loading & Unloading',
    location: 'Baikampady Industrial Area, Mangalore',
    amountPerHead: 500,
  };

  const currentWorker = workers.find((w) => w.id === activeWorkerId) || workers[0];

  // Quick preset triggers
  const handleSimulateNewBid = () => {
    triggerPushToast({
      title: '🔔 New Bid Received! ₹450',
      message: `${currentWorker.name} placed a competitive quote for ${currentOrder.category}.`,
      type: 'bid',
      targetRole: 'customer',
      orderId: currentOrder.id,
      amount: 450,
      workerName: currentWorker.name,
      actionLabel: 'Tap to Review Bids',
      actionScreen: 'view-bids',
    });
    onClose();
  };

  const handleSimulateJobAccepted = () => {
    triggerPushToast({
      title: '🎉 Job Offer Accepted & Confirmed!',
      message: `You are assigned to ${currentOrder.category} at ${currentOrder.location.split(',')[0]}. Check-in with Start OTP.`,
      type: 'job_accepted',
      targetRole: 'employee',
      orderId: currentOrder.id,
      amount: currentOrder.amountPerHead,
      actionLabel: 'Tap to View Worksite',
      actionScreen: 'job-details',
    });
    onClose();
  };

  const handleSimulateWorkerConfirmedCustomer = () => {
    triggerPushToast({
      title: '👷 Crew Member Confirmed!',
      message: `${currentWorker.name} accepted Order ${currentOrder.orderNumber} (${currentOrder.category}). Crew is on the way.`,
      type: 'job_accepted',
      targetRole: 'customer',
      orderId: currentOrder.id,
      workerName: currentWorker.name,
      actionLabel: 'Tap to View Booking',
      actionScreen: 'order-detail',
    });
    onClose();
  };

  const handleSimulatePaymentReceived = () => {
    triggerPushToast({
      title: '💰 Payout Received: ₹1,500',
      message: `Shift completed and verified. Payout of ₹1,500 credited to your worker wallet!`,
      type: 'payment',
      targetRole: 'employee',
      amount: 1500,
      actionLabel: 'Tap to View Wallet',
      actionScreen: 'earnings',
    });
    onClose();
  };

  const handleSimulatePaymentCustomerReceipt = () => {
    triggerPushToast({
      title: '🧾 Payment Settled Successfully',
      message: `Payment of ₹${currentOrder.amountPerHead * 2} for Order ${currentOrder.orderNumber} processed. Invoice ready.`,
      type: 'payment',
      targetRole: 'customer',
      orderId: currentOrder.id,
      amount: currentOrder.amountPerHead * 2,
      actionLabel: 'Tap to View Order',
      actionScreen: 'order-detail',
    });
    onClose();
  };

  const handleSimulateNearbyJobAlert = () => {
    triggerPushToast({
      title: '📍 New Nearby Shift Alert!',
      message: `2 Workers needed for ${currentOrder.category} at ${currentOrder.location.split(',')[0]} (₹${currentOrder.amountPerHead}/head).`,
      type: 'order',
      targetRole: 'employee',
      orderId: currentOrder.id,
      amount: currentOrder.amountPerHead,
      actionLabel: 'Tap to Accept Shift',
      actionScreen: 'available-jobs',
    });
    onClose();
  };

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    triggerPushToast({
      title: customTitle,
      message: customMessage,
      type: customType,
      targetRole: customRole,
      amount: customAmount > 0 ? customAmount : undefined,
      actionLabel: customRole === 'customer' ? 'Tap to View in Customer App' : 'Tap to View in Worker App',
      actionScreen: customRole === 'customer' ? 'view-bids' : 'job-details',
      orderId: currentOrder.id,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 font-sans overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-600 via-red-700 to-yellow-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Bell className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base tracking-tight">Push Notification Simulator</h3>
                <span className="px-2 py-0.2 rounded-full bg-yellow-400/20 text-yellow-200 text-[10px] font-bold uppercase tracking-wider border border-yellow-400/30">
                  Live Toast System
                </span>
              </div>
              <p className="text-[11px] text-yellow-100">
                Test temporary heads-up toast alerts for new bids, accepted jobs & payouts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-yellow-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 text-xs text-slate-700 max-h-[80vh] overflow-y-auto">
          {/* Quick 1-Click Simulation Cards */}
          <div>
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block mb-2">
              1-Click Realistic Notification Scenarios
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Scenario 1: New Bid on Customer Job */}
              <button
                type="button"
                onClick={handleSimulateNewBid}
                className="p-3 rounded-xl bg-slate-50 hover:bg-yellow-50 border border-slate-200 hover:border-yellow-300 text-left transition flex items-start space-x-2.5 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition">
                  <Zap className="w-4 h-4 fill-yellow-500 text-yellow-600" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-xs group-hover:text-red-700">New Bid on Job</span>
                    <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-800 text-[9px] font-bold">Customer</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Alerts customer that a worker submitted a ₹450 quote.
                  </p>
                </div>
              </button>

              {/* Scenario 2: Worker Accepts Job */}
              <button
                type="button"
                onClick={handleSimulateJobAccepted}
                className="p-3 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 text-left transition flex items-start space-x-2.5 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-xs group-hover:text-red-700">Job Accepted!</span>
                    <span className="px-1.5 py-0.2 rounded bg-yellow-100 text-yellow-900 border border-yellow-300 text-[9px] font-bold">Worker</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Alerts worker they are assigned to shift with Start OTP.
                  </p>
                </div>
              </button>

              {/* Scenario 3: Payment Status Update (Worker Wallet) */}
              <button
                type="button"
                onClick={handleSimulatePaymentReceived}
                className="p-3 rounded-xl bg-slate-50 hover:bg-yellow-50 border border-slate-200 hover:border-yellow-300 text-left transition flex items-start space-x-2.5 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition">
                  <IndianRupee className="w-4 h-4 text-yellow-700" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-xs group-hover:text-red-700">Payout Credited</span>
                    <span className="px-1.5 py-0.2 rounded bg-yellow-100 text-yellow-900 border border-yellow-300 text-[9px] font-bold">Worker</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Plays cash chime & alerts worker ₹1,500 has been credited.
                  </p>
                </div>
              </button>

              {/* Scenario 4: Payment Confirmed (Customer Receipt) */}
              <button
                type="button"
                onClick={handleSimulatePaymentCustomerReceipt}
                className="p-3 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 text-left transition flex items-start space-x-2.5 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-xs group-hover:text-red-700">Payment Settled</span>
                    <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-800 text-[9px] font-bold">Customer</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Notifies employer of completed payment receipt.
                  </p>
                </div>
              </button>

              {/* Scenario 5: Worker Confirmed for Customer */}
              <button
                type="button"
                onClick={handleSimulateWorkerConfirmedCustomer}
                className="p-3 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 text-left transition flex items-start space-x-2.5 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-xs group-hover:text-red-700">Crew Member Joined</span>
                    <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-800 text-[9px] font-bold">Customer</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Alerts employer that worker is dispatched.
                  </p>
                </div>
              </button>

              {/* Scenario 6: Nearby Job Alert */}
              <button
                type="button"
                onClick={handleSimulateNearbyJobAlert}
                className="p-3 rounded-xl bg-slate-50 hover:bg-yellow-50 border border-slate-200 hover:border-yellow-300 text-left transition flex items-start space-x-2.5 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition">
                  <Sparkles className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-xs group-hover:text-red-700">Nearby Job Alert</span>
                    <span className="px-1.5 py-0.2 rounded bg-yellow-100 text-yellow-900 border border-yellow-300 text-[9px] font-bold">Worker</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Pushes instant job demand alert to nearby workers.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Custom Notification Form */}
          <div className="border-t border-slate-200 pt-4 space-y-3">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block">
              Fire Custom Push Notification
            </span>

            <form onSubmit={handleSendCustom} className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Target App Audience</label>
                  <select
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold focus:outline-none focus:border-red-500"
                  >
                    <option value="customer">Customer / Employer App</option>
                    <option value="employee">Employee / Worker App</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Alert Category</label>
                  <select
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold focus:outline-none focus:border-red-500"
                  >
                    <option value="bid">New Bid (Zap Chime)</option>
                    <option value="job_accepted">Job Accepted (Success Chime)</option>
                    <option value="payment">Payment Payout (Cash Ring)</option>
                    <option value="order">Job Requirement Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Notification Title</label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Message Description</label>
                <input
                  type="text"
                  required
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Send Live Toast Alert</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <Volume2 className="w-3.5 h-3.5 text-red-600" />
            <span>Includes Web Audio API notification chimes</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
