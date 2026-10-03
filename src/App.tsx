import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HeaderNavbar } from './components/common/HeaderNavbar';
import { AdminLayout } from './components/admin/AdminLayout';
import { CustomerApp } from './components/customer/CustomerApp';
import { EmployeeApp } from './components/employee/EmployeeApp';
import { SplitConnectedView } from './components/split/SplitConnectedView';
import { AdminStandaloneApp } from './apps/admin/AdminStandaloneApp';
import { CustomerStandaloneApp } from './apps/customer/CustomerStandaloneApp';
import { EmployeeStandaloneApp } from './apps/employee/EmployeeStandaloneApp';
import { SeparatedCodeViewerModal } from './components/common/SeparatedCodeViewerModal';
import { BackendStatusModal } from './components/common/BackendStatusModal';
import {
  CheckCircle2,
  Code2,
  ExternalLink,
  Layers,
  Smartphone,
  HardHat,
  Server,
} from 'lucide-react';

const MainView: React.FC = () => {
  const { currentRole, setCurrentRole } = useApp();
  const [isCodeViewerOpen, setIsCodeViewerOpen] = useState(false);
  const [isBackendStatusOpen, setIsBackendStatusOpen] = useState(false);
  const [standaloneApp, setStandaloneApp] = useState<'admin' | 'customer' | 'employee' | null>(null);

  // Check URL query param e.g. ?app=admin, ?app=customer, ?app=employee
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const appParam = params.get('app');
      if (appParam === 'admin' || appParam === 'customer' || appParam === 'employee') {
        setStandaloneApp(appParam);
      } else if (appParam === 'split') {
        setCurrentRole('split');
      }
    } catch (e) {
      // ignore
    }
  }, [setCurrentRole]);

  // If running in Standalone Mode, render the isolated standalone application
  if (standaloneApp === 'admin') {
    return <AdminStandaloneApp onExitStandalone={() => setStandaloneApp(null)} />;
  }
  if (standaloneApp === 'customer') {
    return <CustomerStandaloneApp onExitStandalone={() => setStandaloneApp(null)} />;
  }
  if (standaloneApp === 'employee') {
    return <EmployeeStandaloneApp onExitStandalone={() => setStandaloneApp(null)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Universal Navigation Bar */}
      <HeaderNavbar
        onOpenCodeViewer={() => setIsCodeViewerOpen(true)}
        onOpenBackendStatus={() => setIsBackendStatusOpen(true)}
        onLaunchStandalone={(app) => setStandaloneApp(app)}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {currentRole === 'admin' && <AdminLayout />}

        {currentRole === 'customer' && (
          <div className="flex-1 py-4 sm:py-8 px-2 sm:px-4 flex items-center justify-center">
            <CustomerApp />
          </div>
        )}

        {currentRole === 'employee' && (
          <div className="flex-1 py-4 sm:py-8 px-2 sm:px-4 flex items-center justify-center">
            <EmployeeApp />
          </div>
        )}

        {currentRole === 'split' && <SplitConnectedView />}
      </main>

      {/* Architecture Separation & Concept Footnote */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              MP
            </div>
            <div>
              <p className="font-bold text-slate-800">
                ManPowerLink — Temporary Manpower Marketplace UI/UX System
              </p>
              <p className="text-[11px] text-slate-400">
                3 Separated Codebases &bull; Express.js Full-Stack REST Backend &bull; Admin &bull; Customer &bull; Employee
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsBackendStatusOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold transition text-[11px] border border-emerald-200"
            >
              <Server className="w-3.5 h-3.5 text-emerald-600" />
              <span>Backend REST APIs</span>
            </button>

            <button
              onClick={() => setIsCodeViewerOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition text-[11px]"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Inspect Separated App Code</span>
            </button>

            <button
              onClick={() => setStandaloneApp(currentRole === 'split' ? 'admin' : currentRole)}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition text-[11px]"
            >
              <span>Launch Standalone</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </footer>

      {/* Separated Code Viewer Modal */}
      <SeparatedCodeViewerModal
        isOpen={isCodeViewerOpen}
        onClose={() => setIsCodeViewerOpen(false)}
        onLaunchStandalone={(app) => setStandaloneApp(app)}
      />

      {/* Backend API & Architecture Modal */}
      <BackendStatusModal
        isOpen={isBackendStatusOpen}
        onClose={() => setIsBackendStatusOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainView />
    </AppProvider>
  );
}
