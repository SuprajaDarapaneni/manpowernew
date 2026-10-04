import React from 'react';
import {
  Home,
  PlusCircle,
  Briefcase,
  User,
  ShieldCheck,
  MapPin,
  Phone,
  Star,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PhoneFrame } from '../common/PhoneFrame';
import { CustomerHome } from './CustomerHome';
import { PostJobView } from './PostJobView';
import { ViewBidsView } from './ViewBidsView';
import { OrderConfirmationView } from './OrderConfirmationView';
import { MyOrdersView } from './MyOrdersView';
import { CustomerLoginView } from '../auth/CustomerLoginView';

export const CustomerApp: React.FC = () => {
  const { customerScreen, setCustomerScreen, orders, customerAuth, signOut } = useApp();

  const activeOrdersCount = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length;

  if (!customerAuth) {
    return (
      <PhoneFrame
        title="Customer / Employer App"
        roleBadge={{ label: 'Sign In Required', color: 'bg-amber-100 text-amber-800' }}
      >
        <CustomerLoginView />
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame
      title="Customer / Employer App"
      roleBadge={{ label: customerAuth.businessName || 'Employer View', color: 'bg-teal-100 text-teal-800' }}
    >
      <div className="flex-1 flex flex-col relative h-full">
        {/* Render Active Screen */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {customerScreen === 'home' && <CustomerHome />}
          {customerScreen === 'post-job' && <PostJobView />}
          {customerScreen === 'view-bids' && <ViewBidsView />}
          {customerScreen === 'order-confirmation' && <OrderConfirmationView />}
          {customerScreen === 'my-orders' && <MyOrdersView />}
          {customerScreen === 'profile' && (
            <div className="flex-1 p-5 space-y-4 bg-slate-50 text-xs">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-800 font-extrabold text-xl flex items-center justify-center mx-auto">
                  {customerAuth?.name.slice(0, 2).toUpperCase() || 'KT'}
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{customerAuth?.name || 'Kiran Transport & Co.'}</h3>
                <p className="text-slate-500 text-[11px]">{customerAuth?.emailOrPhone || '+91 98450 11223'} • Mangalore, KA</p>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Verified Business Employer
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">Total Manpower Hired:</span>
                  <span className="font-bold text-slate-900">42 Workers</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">Jobs Posted:</span>
                  <span className="font-bold text-slate-900">18 Orders</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">Employer Rating:</span>
                  <span className="font-bold text-amber-500">4.9 ★</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Session Status:</span>
                  <span className="font-bold text-emerald-600">Active & Kept Signed In</span>
                </div>
              </div>

              <button
                onClick={() => signOut('customer')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-bold transition flex items-center justify-center space-x-2 border border-slate-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out from Employer Account</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile App Bottom Navigation Bar matching Screenshot 2 & 6 */}
        <div className="h-16 bg-white border-t border-slate-200 flex items-center justify-around px-2 z-30 sticky bottom-0">
          <button
            onClick={() => setCustomerScreen('home')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
              customerScreen === 'home' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Home</span>
          </button>

          <button
            onClick={() => setCustomerScreen('post-job')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
              customerScreen === 'post-job' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <PlusCircle className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Post Job</span>
          </button>

          <button
            onClick={() => setCustomerScreen('my-orders')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl relative transition ${
              customerScreen === 'my-orders' || customerScreen === 'view-bids' || customerScreen === 'order-confirmation'
                ? 'text-emerald-600 font-bold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Briefcase className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">My Orders</span>
            {activeOrdersCount > 0 && (
              <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>

          <button
            onClick={() => setCustomerScreen('profile')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
              customerScreen === 'profile' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Profile</span>
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
};
