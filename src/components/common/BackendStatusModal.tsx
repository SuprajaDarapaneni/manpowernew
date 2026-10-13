import React, { useState } from 'react';
import {
  Server,
  Activity,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Send,
  RefreshCw,
  Terminal,
  Database,
  Layers,
  ArrowRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';

interface BackendStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EndpointDef {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  category: 'System' | 'Auth' | 'Categories' | 'Workers' | 'Orders' | 'Bidding' | 'Commission' | 'Stats';
  samplePayload?: string;
}

const ENDPOINTS: EndpointDef[] = [
  { method: 'GET', path: '/api/health', description: 'Server health, uptime, MongoDB Atlas & entity counts', category: 'System' },
  { method: 'GET', path: '/api/db/info', description: 'Database schema, MongoDB Atlas cluster & collections (manpowerlink_db)', category: 'System' },
  { method: 'POST', path: '/api/db/reconnect', description: 'Test and trigger active connection to MongoDB Atlas cluster', category: 'System' },
  { method: 'POST', path: '/api/auth/send-otp', description: 'Send SMS OTP verification code (1234)', category: 'Auth', samplePayload: '{\n  "phone": "+91 98450 11223",\n  "role": "customer"\n}' },
  { method: 'POST', path: '/api/auth/verify-otp', description: 'Verify OTP code and issue session token', category: 'Auth', samplePayload: '{\n  "phone": "+91 98450 11223",\n  "otp": "1234",\n  "role": "customer",\n  "name": "Kiran Transport & Co."\n}' },
  { method: 'POST', path: '/api/auth/login', description: 'Authenticate admin, customer, or worker session', category: 'Auth', samplePayload: '{\n  "role": "admin",\n  "emailOrPhone": "admin@manpowerlink.com",\n  "password": "admin123"\n}' },
  { method: 'POST', path: '/api/auth/logout', description: 'Terminate active session token', category: 'Auth' },
  { method: 'GET', path: '/api/stats', description: 'Aggregated marketplace analytics & volume', category: 'Stats' },
  { method: 'GET', path: '/api/categories', description: 'Fetch all service categories with active status', category: 'Categories' },
  { method: 'POST', path: '/api/categories', description: 'Add new category with hourly base rate', category: 'Categories', samplePayload: '{\n  "name": "Carpentry & Repairs",\n  "icon": "Hammer",\n  "description": "Furniture assembly & fixes",\n  "baseRatePerHour": 320\n}' },
  { method: 'PATCH', path: '/api/categories/cat-loading/toggle', description: 'Toggle category active/inactive flag', category: 'Categories' },
  { method: 'GET', path: '/api/workers', description: 'List all verified workers with ratings & skills', category: 'Workers' },
  { method: 'PATCH', path: '/api/workers/w-ramesh/availability', description: 'Toggle worker online/offline availability', category: 'Workers' },
  { method: 'GET', path: '/api/jobs', description: 'List customer job orders with filters', category: 'Orders' },
  { method: 'POST', path: '/api/jobs', description: 'Publish temporary manpower requirement (#1046)', category: 'Orders', samplePayload: '{\n  "title": "Warehouse Box Dispatch",\n  "category": "Loading & Unloading",\n  "location": "Whitefield Hub, Bangalore",\n  "scheduledDate": "Tomorrow",\n  "scheduledTime": "08:00 AM",\n  "workingHours": 6,\n  "requiredWorkers": 2,\n  "minBudget": 2000,\n  "maxBudget": 3000\n}' },
  { method: 'GET', path: '/api/bids', description: 'Retrieve worker quotes and bids', category: 'Bidding' },
  { method: 'POST', path: '/api/bids', description: 'Submit worker bid quotation for a job', category: 'Bidding', samplePayload: '{\n  "jobId": "job-1045",\n  "workerId": "w-ramesh",\n  "amount": 2100,\n  "notes": "Ready with safety shoes & gloves"\n}' },
  { method: 'POST', path: '/api/bids/bid-101/accept', description: 'Accept bid, deduct commission & assign worker', category: 'Bidding' },
  { method: 'GET', path: '/api/commission', description: 'Get platform commission policies (10% / ₹50)', category: 'Commission' },
  { method: 'PUT', path: '/api/commission', description: 'Update platform fee structure', category: 'Commission', samplePayload: '{\n  "type": "percentage",\n  "percentage": 12,\n  "fixedAmount": 60\n}' },
  { method: 'POST', path: '/api/simulate-bid', description: 'Trigger live worker bid event', category: 'Bidding' },
  { method: 'POST', path: '/api/reset', description: 'Restore database to initial seed data', category: 'System' },
];

export const BackendStatusModal: React.FC<BackendStatusModalProps> = ({ isOpen, onClose }) => {
  const { backendConnected, backendHealth, refreshBackend, syncingWithBackend } = useApp();
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDef>(ENDPOINTS[0]);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [isReconnectingMongo, setIsReconnectingMongo] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleTestEndpoint = async (endpoint: EndpointDef) => {
    setSelectedEndpoint(endpoint);
    setIsLoadingApi(true);
    setApiResponse(null);
    try {
      let options: RequestInit = {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
      };

      if ((endpoint.method === 'POST' || endpoint.method === 'PUT') && endpoint.samplePayload) {
        options.body = endpoint.samplePayload;
      }

      const res = await fetch(endpoint.path, options);
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        setApiResponse(JSON.stringify(json, null, 2));
      } catch {
        setApiResponse(text);
      }
    } catch (err: any) {
      setApiResponse(JSON.stringify({ error: err.message || 'Network request failed' }, null, 2));
    } finally {
      setIsLoadingApi(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Backend Architecture & REST API Console
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {backendConnected ? '100% Completed & Live' : 'Initializing'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Full-stack Express.js server running on port 3000 with 16 active REST endpoints
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => refreshBackend()}
              disabled={syncingWithBackend}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs flex items-center space-x-1"
              title="Ping Backend"
            >
              <RefreshCw className={`w-4 h-4 ${syncingWithBackend ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Metrics Bar */}
        <div className="bg-slate-800 border-b border-slate-700 px-6 py-3 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold text-slate-200">Runtime:</span>
              <span className="text-emerald-400 font-mono">Node.js + Express 4.21</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400">Port:</span>
              <span className="text-white font-mono bg-slate-700/80 px-2 py-0.5 rounded">3000</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400">Vite Middlewares:</span>
              <span className="text-emerald-300 font-medium">Mounted in Dev</span>
            </div>
            {backendHealth && (
              <div className="hidden md:flex items-center space-x-1.5">
                <span className="text-slate-400">Uptime:</span>
                <span className="text-white font-mono">{backendHealth.uptimeSeconds}s</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>DB: <strong className="text-white font-mono">manpowerlink_db</strong></span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-700/50">
              MongoDB Atlas
            </span>
          </div>
        </div>

        {/* MongoDB Atlas Integration Status Banner */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-2.5 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${backendHealth?.mongodb?.connected ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
            <span className="font-semibold text-white">MongoDB Atlas Cluster:</span>
            <span className="font-mono text-cyan-300 text-[11px]">cluster0.dzxw5pm.mongodb.net</span>
            <span className="text-slate-400 text-[11px]">&bull;</span>
            <span className="text-slate-300 text-[11px]">DB: <strong className="text-white">manpowerlink_db</strong></span>
            {backendHealth?.mongodb?.connected ? (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                Connected
              </span>
            ) : (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                Atlas Whitelist Required (0.0.0.0/0)
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={async () => {
                setIsReconnectingMongo(true);
                await api.reconnectDb();
                await refreshBackend();
                setIsReconnectingMongo(false);
              }}
              disabled={isReconnectingMongo}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition shadow-xs flex items-center space-x-1"
            >
              <RefreshCw className={`w-3 h-3 ${isReconnectingMongo ? 'animate-spin' : ''}`} />
              <span>{isReconnectingMongo ? 'Testing...' : 'Test Atlas Connection'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left: Endpoint List */}
          <div className="w-full md:w-5/12 border-r border-slate-200 overflow-y-auto p-4 bg-slate-50/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Available REST Endpoints ({ENDPOINTS.length})
              </h3>
              <span className="text-[11px] text-slate-400">Click to execute live</span>
            </div>

            <div className="space-y-1.5">
              {ENDPOINTS.map((ep, idx) => {
                const isSelected = selectedEndpoint.path === ep.path && selectedEndpoint.method === ep.method;
                return (
                  <button
                    key={idx}
                    onClick={() => handleTestEndpoint(ep)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between group ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 shadow-xs'
                        : 'bg-white hover:bg-slate-100/80 border-slate-200/80 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span
                        className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-extrabold uppercase ${
                          ep.method === 'GET'
                            ? 'bg-blue-100 text-blue-700'
                            : ep.method === 'POST'
                            ? 'bg-emerald-100 text-emerald-700'
                            : ep.method === 'PATCH'
                            ? 'bg-amber-100 text-amber-700'
                            : ep.method === 'PUT'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="font-mono text-slate-900 font-semibold truncate text-[11px]">
                        {ep.path}
                      </span>
                    </div>

                    <ArrowRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isSelected ? 'text-emerald-600 translate-x-0.5' : 'text-slate-300 group-hover:text-slate-500'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Live Interactive Request / Response Tester */}
          <div className="w-full md:w-7/12 flex flex-col p-4 bg-white overflow-y-auto">
            {/* Active Endpoint Info */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${
                      selectedEndpoint.method === 'GET'
                        ? 'bg-blue-100 text-blue-700'
                        : selectedEndpoint.method === 'POST'
                        ? 'bg-emerald-100 text-emerald-700'
                        : selectedEndpoint.method === 'PATCH'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {selectedEndpoint.method}
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                    {selectedEndpoint.path}
                  </span>
                </div>
                <button
                  onClick={() => handleTestEndpoint(selectedEndpoint)}
                  disabled={isLoadingApi}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition shadow-xs disabled:opacity-50"
                >
                  <Send className={`w-3 h-3 ${isLoadingApi ? 'animate-spin' : ''}`} />
                  <span>{isLoadingApi ? 'Sending...' : 'Send Request'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-600 font-medium">{selectedEndpoint.description}</p>
            </div>

            {/* Request Payload (if any) */}
            {selectedEndpoint.samplePayload && (
              <div className="mb-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Request Payload (JSON)
                </span>
                <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                  {selectedEndpoint.samplePayload}
                </pre>
              </div>
            )}

            {/* Response Console */}
            <div className="flex-1 flex flex-col min-h-[220px]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-slate-500" />
                  Live API Response
                </span>
                {apiResponse && (
                  <button
                    onClick={() => copyToClipboard(apiResponse)}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                  </button>
                )}
              </div>

              <div className="flex-1 bg-slate-950 text-slate-200 p-3.5 rounded-xl font-mono text-xs overflow-auto border border-slate-800">
                {isLoadingApi ? (
                  <div className="h-full flex items-center justify-center text-slate-400 space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Executing HTTP {selectedEndpoint.method} request...</span>
                  </div>
                ) : apiResponse ? (
                  <pre className="text-emerald-400">{apiResponse}</pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 py-8 text-center">
                    <Activity className="w-8 h-8 text-slate-600 mb-2" />
                    <p className="font-semibold text-slate-400">Ready to test</p>
                    <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                      Click "Send Request" or select an endpoint from the left column to execute a live call to the Express backend.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Integration Quick Snippet */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>CORS & JSON body parsing configured</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">curl http://localhost:3000{selectedEndpoint.path}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
