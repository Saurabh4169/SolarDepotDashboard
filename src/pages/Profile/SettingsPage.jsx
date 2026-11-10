import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../../components/common/Button';
import {
  Bell,
  Sliders,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Info,
  ShieldCheck,
} from 'lucide-react';

export default function SettingsPage() {
  const { showToast, clearCompare } = useApp();
  const [pushNotifs, setPushNotifs] = useState(true);
  const [quoteAlerts, setQuoteAlerts] = useState(true);
  const [preferredUnit, setPreferredUnit] = useState('kW');

  const handleClearCache = () => {
    localStorage.removeItem('solardepot_favorites');
    localStorage.removeItem('solardepot_notifications');
    localStorage.removeItem('solardepot_enquiries');
    clearCompare();
    showToast('Local application cache cleared', 'success');
  };

  return (
    <div className="p-4 pb-12 space-y-4 animate-fade-in">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          Configuration
        </span>
        <h1 className="font-display text-lg font-bold text-navy">
          App Settings
        </h1>
        <p className="text-[11px] text-slate-500">
          Telemetry units, notification triggers, and offline storage.
        </p>
      </div>

      {/* Units Preferences */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
        <h3 className="font-display text-xs font-bold text-navy uppercase tracking-wider">
          Measurement Units
        </h3>

        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-navy block">Power Rating Display</span>
            <span className="text-[11px] text-slate-400">Kilowatt (kW) vs Watt (W)</span>
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-mono">
            <button
              onClick={() => setPreferredUnit('kW')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                preferredUnit === 'kW'
                  ? 'bg-electric-500 text-white shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              kW
            </button>
            <button
              onClick={() => setPreferredUnit('W')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                preferredUnit === 'W'
                  ? 'bg-electric-500 text-white shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              W
            </button>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
        <h3 className="font-display text-xs font-bold text-navy uppercase tracking-wider">
          Notification Preferences
        </h3>

        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-navy block">New Hardware Releases</span>
            <span className="text-[11px] text-slate-400">Alerts when inverters are launched</span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={pushNotifs}
              onChange={(e) => setPushNotifs(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-electric-500" />
          </label>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
          <div>
            <span className="font-bold text-navy block">Quote Status Updates</span>
            <span className="text-[11px] text-slate-400">Engineering proposal alerts</span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={quoteAlerts}
              onChange={(e) => setQuoteAlerts(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-electric-500" />
          </label>
        </div>
      </div>

      {/* Cache & Data Management */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
        <h3 className="font-display text-xs font-bold text-navy uppercase tracking-wider">
          Local Storage & Cache
        </h3>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          The app stores saved products, demo enquiries, and comparison lists in browser localStorage for offline reliability.
        </p>

        <Button
          variant="outline"
          size="sm"
          fullWidth
          icon={Trash2}
          onClick={handleClearCache}
        >
          Clear Local Application Data
        </Button>
      </div>

      {/* App Version Info */}
      <div className="p-4 bg-slate-100 rounded-2xl text-center text-xs text-slate-500 space-y-1">
        <div className="font-display font-bold text-navy">
          Solar Depot Mobile Application
        </div>
        <div>Version 1.0.0 • React Mobile UI Edition</div>
        <div className="text-[10px] text-slate-400 font-mono">
          Engineered for High-Yield Photovoltaics
        </div>
      </div>
    </div>
  );
}

