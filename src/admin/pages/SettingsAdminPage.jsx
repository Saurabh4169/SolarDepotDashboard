import React, { useState, useEffect, useCallback } from 'react';
import {
  Building,
  User,
  Database,
  Save,
  RotateCcw,
  Download,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import Button from '../../components/common/Button';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAdmin } from '../context/AdminContext';
import { settingsService } from '../services/settingsService';

export default function SettingsAdminPage() {
  const { showAdminToast, adminUser } = useAdmin();

  const [activeTab, setActiveTab] = useState('company'); // 'company' | 'profile' | 'system'
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Company Settings
  const [companySettings, setCompanySettings] = useState({
    companyName: 'Solar Depot',
    tagline: 'Powering Tomorrow Through Intelligent Solar Innovation',
    description: '',
    address: '121 A East 89 Street, New York NY 10128',
    primaryEmail: 'Contact@solardepot-us.com',
    supportEmail: 'support@solardepot-us.com',
    phone: '+1 212 300 4115',
    website: 'solardepot-us.com',
    operatingHours: 'Mon - Fri: 8:00 AM – 6:00 PM EST',
    emergencySupport: '24/7 Remote Monitoring & Dispatch',
    systemStatus: 'Operational',
  });

  // Admin Profile Settings
  const [profileSettings, setProfileSettings] = useState({
    name: adminUser?.name || 'Alexandre Mercer',
    email: adminUser?.email || 'admin@solardepot.com',
    title: adminUser?.title || 'Principal Systems Administrator',
    department: 'Executive Operations',
  });

  // System Diagnostics
  const [storageStats, setStorageStats] = useState({ totalKb: '0', keyStats: {} });

  // Reset Data Confirm Dialog
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const [settings, stats] = await Promise.all([
        settingsService.getSettings(),
        settingsService.getStorageStats(),
      ]);
      setCompanySettings((prev) => ({ ...prev, ...settings }));
      setStorageStats(stats);
    } catch (err) {
      showAdminToast('Failed to load settings', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showAdminToast]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSaveCompany = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await settingsService.updateSettings(companySettings);
      showAdminToast('Company configuration updated successfully', 'success');
    } catch (err) {
      showAdminToast(err.message || 'Error saving settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showAdminToast('Admin profile details updated', 'success');
  };

  const handleExportData = () => {
    try {
      const exportObject = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('solardepot_')) {
          try {
            exportObject[key] = JSON.parse(localStorage.getItem(key));
          } catch {
            exportObject[key] = localStorage.getItem(key);
          }
        }
      }

      const blob = new Blob([JSON.stringify(exportObject, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `solar-depot-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showAdminToast('System backup exported successfully', 'success');
    } catch (err) {
      showAdminToast('Failed to export data backup', 'error');
    }
  };

  const handleResetData = async () => {
    try {
      setIsResetting(true);
      await settingsService.resetAllData();
      showAdminToast('All data successfully restored to fresh demo state', 'info');
      setIsResetConfirmOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      showAdminToast(err.message || 'Failed to reset system data', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-5xl">
      {/* Top Header Pattern */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-[28px] font-semibold text-navy leading-tight">
            Settings
          </h2>
          <p className="text-[14px] text-slate-500 mt-1">
            Corporate identity, operating parameters, administrator profile, and storage diagnostics
          </p>
        </div>
      </div>

      {/* Content starts 32px below header */}
      <div className="mt-8 space-y-6">
        {/* Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit border border-slate-200">
          <button
            onClick={() => setActiveTab('company')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[14px] font-semibold transition-all ${
              activeTab === 'company'
                ? 'bg-white text-navy shadow-sm'
                : 'text-slate-600 hover:text-navy'
            }`}
          >
            <Building className="w-4 h-4 text-electric-600" />
            <span>Company Info</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[14px] font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-white text-navy shadow-sm'
                : 'text-slate-600 hover:text-navy'
            }`}
          >
            <User className="w-4 h-4 text-emerald-600" />
            <span>Admin Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[14px] font-semibold transition-all ${
              activeTab === 'system'
                ? 'bg-white text-navy shadow-sm'
                : 'text-slate-600 hover:text-navy'
            }`}
          >
            <Database className="w-4 h-4 text-cantaloupe-500" />
            <span>Storage & Diagnostics</span>
          </button>
        </div>

        {/* Tab 1: Company Info */}
        {activeTab === 'company' && (
          <form onSubmit={handleSaveCompany} className="bg-white rounded-2xl p-6 border border-[#0297DE]/12 shadow-soft space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-display text-[18px] font-semibold text-navy leading-tight">Corporate Identity & Contact</h3>
              <p className="text-[14px] text-slate-500 mt-1">Details reflected across documentation, datasheets, and client applications</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                  Company Brand Name
                </label>
                <input
                  type="text"
                  value={companySettings.companyName}
                  onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-[14px] font-medium text-navy focus:outline-none focus:border-electric-500"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                  Website Domain
                </label>
                <input
                  type="text"
                  value={companySettings.website}
                  onChange={(e) => setCompanySettings({ ...companySettings, website: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-[14px] font-medium text-navy focus:outline-none focus:border-electric-500 tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                Corporate Tagline
              </label>
              <input
                type="text"
                value={companySettings.tagline}
                onChange={(e) => setCompanySettings({ ...companySettings, tagline: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-[14px] font-medium text-navy focus:outline-none focus:border-electric-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                  Primary Contact Email
                </label>
                <input
                  type="email"
                  value={companySettings.primaryEmail}
                  onChange={(e) => setCompanySettings({ ...companySettings, primaryEmail: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-[14px] font-medium text-navy focus:outline-none focus:border-electric-500 tabular-nums"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                  Engineering Support Email
                </label>
                <input
                  type="email"
                  value={companySettings.supportEmail}
                  onChange={(e) => setCompanySettings({ ...companySettings, supportEmail: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-[14px] font-medium text-navy focus:outline-none focus:border-electric-500 tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                  Headquarters Address
                </label>
                <input
                  type="text"
                  value={companySettings.address}
                  onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-[14px] font-medium text-navy focus:outline-none focus:border-electric-500"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                  Direct Phone
                </label>
                <input
                  type="text"
                  value={companySettings.phone}
                  onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-[14px] font-medium text-navy focus:outline-none focus:border-electric-500 tabular-nums"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-slate-100">
              <Button type="submit" variant="primary" icon={Save} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        )}

        {/* Tab 2: Admin Profile */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl p-6 border border-[#0297DE]/12 shadow-soft space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-display text-[18px] font-semibold text-navy leading-tight">Administrator Profile</h3>
              <p className="text-[14px] text-slate-500 mt-1">Your credentials and assigned administrative title</p>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={adminUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt="Avatar"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#0297DE]/30"
              />
              <div>
                <h4 className="font-display font-semibold text-[18px] text-navy">{profileSettings.name}</h4>
                <p className="text-[13px] text-electric-600 font-semibold">{adminUser?.role || 'Super Admin'}</p>
                <p className="text-[12px] text-slate-400 tabular-nums mt-0.5">{profileSettings.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={profileSettings.name}
                  onChange={(e) => setProfileSettings({ ...profileSettings, name: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-[14px] font-medium text-navy focus:outline-none focus:border-electric-500"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileSettings.email}
                  onChange={(e) => setProfileSettings({ ...profileSettings, email: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-[14px] font-medium text-navy focus:outline-none focus:border-electric-500 tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                  Job Title
                </label>
                <input
                  type="text"
                  value={profileSettings.title}
                  onChange={(e) => setProfileSettings({ ...profileSettings, title: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-[14px] text-navy focus:outline-none focus:border-electric-500"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  value={profileSettings.department}
                  onChange={(e) => setProfileSettings({ ...profileSettings, department: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-[14px] text-navy focus:outline-none focus:border-electric-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-slate-100">
              <Button type="submit" variant="primary" icon={Save}>
                Save Profile
              </Button>
            </div>
          </form>
        )}

        {/* Tab 3: Storage & Diagnostics */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#0297DE]/12 shadow-soft space-y-4">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-[18px] font-semibold text-navy leading-tight">LocalStorage Persistence Layer</h3>
                  <p className="text-[14px] text-slate-500 mt-1">Real-time memory footprint across all storage partitions</p>
                </div>

                <span className="text-[12px] font-semibold px-3 py-1 rounded-full bg-electric-50 text-electric-600 border border-electric-200 tabular-nums">
                  {storageStats.totalKb} KB Total Used
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(storageStats.keyStats || {}).map(([k, v]) => (
                  <div key={k} className="p-3.5 rounded-xl border border-slate-200 bg-[#F7FAFC] flex items-center justify-between text-[13px]">
                    <div>
                      <span className="font-semibold text-navy truncate block max-w-[200px]">{k}</span>
                      <span className="text-[12px] text-slate-400 tabular-nums">{v.count} records stored</span>
                    </div>
                    <span className="text-slate-600 font-semibold tabular-nums">{(v.bytes / 1024).toFixed(1)} KB</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button variant="outline" size="sm" icon={Download} onClick={handleExportData}>
                  Export Backup (JSON)
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  icon={RotateCcw}
                  onClick={() => setIsResetConfirmOpen(true)}
                >
                  Reset Demo Data
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetData}
        title="Reset All System Data?"
        message="This will clear all edited products, inquiries, and notifications, and re-seed the system with fresh factory defaults."
        confirmText="Reset Everything"
        isLoading={isResetting}
      />
    </div>
  );
}

