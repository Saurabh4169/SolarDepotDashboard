import React, { useState, useEffect, useCallback } from 'react';
import {
  Package,
  Zap,
  MessageSquare,
  FileCheck2,
  Users2,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import LatestInquiriesCard from '../components/LatestInquiriesCard';
import RecentEnquiriesTable from '../components/RecentEnquiriesTable';
import QuickActionsCard from '../components/QuickActionsCard';
import Drawer, { DrawerSection } from '../components/Drawer';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import Button from '../../components/common/Button';
import Select from '../components/Select';
import Toggle from '../components/Toggle';
import { StatCardSkeleton } from '../components/Skeleton';
import { useAdmin } from '../context/AdminContext';
import { useAdminData } from '../context/AdminDataContext';

// Services
import { productsService } from '../services/productsService';
import { categoriesService } from '../services/categoriesService';
import { enquiriesService } from '../services/enquiriesService';
import { customersService } from '../services/customersService';
import { notificationsService } from '../services/notificationsService';

export default function DashboardOverviewPage() {
  const { showAdminToast } = useAdmin();
  const { getCachedData, setCachedData } = useAdminData();

  const cachedOverview = getCachedData('dashboard_overview');
  const [isLoading, setIsLoading] = useState(!cachedOverview);
  const [stats, setStats] = useState(
    cachedOverview?.stats || {
      totalProducts: 0,
      activeProducts: 0,
      totalEnquiries: 0,
      newEnquiriesCount: 0,
      quotesPreparedCount: 0,
      totalCustomers: 0,
    }
  );

  const [categoryChartData, setCategoryChartData] = useState(cachedOverview?.categoryChartData || []);
  const [enquiriesList, setEnquiriesList] = useState(cachedOverview?.enquiriesList || []);

  // Drawer & Modal state
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [enquiryStatusDraft, setEnquiryStatusDraft] = useState('');
  const [enquiryReplyNote, setEnquiryReplyNote] = useState('');
  const [notifyCustomerCheck, setNotifyCustomerCheck] = useState(true);
  const [isUpdatingEnquiry, setIsUpdatingEnquiry] = useState(false);

  // Quick Action Modal states
  const [quickNotificationModalOpen, setQuickNotificationModalOpen] = useState(false);
  const [newNotifTitle, setNewNotifTitle] = useState('');
  const [newNotifBody, setNewNotifBody] = useState('');
  const [newNotifType, setNewNotifType] = useState('system');

  // Load dashboard data with background revalidation
  const loadDashboardData = useCallback(async () => {
    try {
      if (!getCachedData('dashboard_overview')) {
        setIsLoading(true);
      }
      const [prodsRes, cats, enqs, custs] = await Promise.all([
        productsService.getAll({ limit: 100 }),
        categoriesService.getAll(),
        enquiriesService.getAll(),
        customersService.getAll(),
      ]);

      const allProducts = prodsRes.items || [];
      const activeProds = allProducts.filter((p) => p.active !== false).length;
      const newEnqs = enqs.filter((e) => e.status === 'New' || e.status === 'Submitted (Demo)').length;
      const quotesPrep = enqs.filter((e) => e.status === 'Quote Prepared' || e.status === 'Completed').length;

      const newStats = {
        totalProducts: allProducts.length,
        activeProducts: activeProds,
        totalEnquiries: enqs.length,
        newEnquiriesCount: newEnqs,
        quotesPreparedCount: quotesPrep,
        totalCustomers: custs.length,
      };

      // Build categories chart data with short horizontal labels
      const catCounts = cats.map((cat) => {
        const count = allProducts.filter(
          (p) => p.category === cat.name || p.categorySlug === cat.slug
        ).length;
        let short = cat.short || cat.name;
        if (short.length > 9) {
          short = short.split(' ')[0];
        }
        return {
          name: cat.name,
          shortName: short,
          count,
        };
      });

      setStats(newStats);
      setEnquiriesList(enqs);
      setCategoryChartData(catCounts);

      // Save to shared cache for instant future loads
      setCachedData('dashboard_overview', {
        stats: newStats,
        categoryChartData: catCounts,
        enquiriesList: enqs,
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      showAdminToast('Failed to load dashboard metrics', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showAdminToast, getCachedData, setCachedData]);

  useEffect(() => {
    loadDashboardData();

    const handleUpdate = () => {
      loadDashboardData();
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('solardepot_storage_update', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('solardepot_storage_update', handleUpdate);
    };
  }, [loadDashboardData]);

  // Handle Enquiry Status Update
  const handleOpenEnquiryDrawer = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setEnquiryStatusDraft(enquiry.status);
    setEnquiryReplyNote(enquiry.replyNote || '');
  };

  const handleSaveEnquiryStatus = async () => {
    if (!selectedEnquiry) return;
    try {
      setIsUpdatingEnquiry(true);
      const updated = await enquiriesService.updateStatus(
        selectedEnquiry.id,
        enquiryStatusDraft,
        enquiryReplyNote,
        notifyCustomerCheck
      );
      setSelectedEnquiry(updated);
      showAdminToast(`Enquiry ${updated.id} updated to "${enquiryStatusDraft}"`, 'success');
      loadDashboardData();
    } catch (err) {
      showAdminToast(err.message || 'Failed to update enquiry', 'error');
    } finally {
      setIsUpdatingEnquiry(false);
    }
  };

  // Quick Notification Dispatch
  const handleSendQuickNotification = async (e) => {
    e.preventDefault();
    if (!newNotifTitle.trim()) return;

    try {
      await notificationsService.send({
        title: newNotifTitle,
        body: newNotifBody || 'Administrative announcement to EPC partners.',
        type: newNotifType,
        targetRoute: '/my-enquiries',
      });
      showAdminToast('Notification published to mobile app bell', 'success');
      setQuickNotificationModalOpen(false);
      setNewNotifTitle('');
      setNewNotifBody('');
    } catch (err) {
      showAdminToast(err.message || 'Failed to send notification', 'error');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header Pattern (Space Grotesk 28px/600 + 14px description) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-[28px] font-semibold text-navy leading-tight">
            Dashboard Overview
          </h2>
          <p className="text-[14px] text-slate-500 mt-1">
            Platform metrics, solar catalog inventory and quotation pipeline
          </p>
        </div>
      </div>

      {/* Main Content: Starts 32px below header (mt-8) */}
      <div className="mt-8 space-y-6">
        {/* Row of 5 KPI Cards (24px gap) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard
                title="Total Products"
                value={stats.totalProducts}
                subtext="Catalog inverters and batteries"
                icon={Package}
                chipVariant="blue"
              />
              <StatCard
                title="Active Products"
                value={stats.activeProducts}
                subtext="Operational in catalog"
                icon={Zap}
                chipVariant="green"
              />
              <StatCard
                title="Enquiries"
                value={stats.totalEnquiries}
                subtext={`${stats.newEnquiriesCount} pending engineering review`}
                icon={MessageSquare}
                chipVariant="purple"
                badgeText={stats.newEnquiriesCount > 0 ? `${stats.newEnquiriesCount} New` : null}
              />
              <StatCard
                title="Quotes Prepared"
                value={stats.quotesPreparedCount}
                subtext="Proposals sent to EPC partners"
                icon={FileCheck2}
                chipVariant="orange"
              />
              <StatCard
                title="Total Customers"
                value={stats.totalCustomers}
                subtext="Verified EPC installer network"
                icon={Users2}
                chipVariant="blue"
              />
            </>
          )}
        </div>

        {/* Primary Row: Large Chart Card beside Latest Inquiries (24px gap) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 xl:col-span-8">
            <ChartCard categoryData={categoryChartData} />
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <LatestInquiriesCard
              enquiries={enquiriesList}
              onViewEnquiry={handleOpenEnquiryDrawer}
            />
          </div>
        </div>

        {/* Secondary Row: Recent Enquiries Table beside Quick Actions Card (24px gap) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 xl:col-span-8">
            <RecentEnquiriesTable
              enquiries={enquiriesList}
              onViewEnquiry={handleOpenEnquiryDrawer}
            />
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <QuickActionsCard
              onSendNotification={() => setQuickNotificationModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Enquiry Details & Status Updater Drawer */}
      <Drawer
        isOpen={Boolean(selectedEnquiry)}
        onClose={() => setSelectedEnquiry(null)}
        size="lg"
        chip={selectedEnquiry ? `ENQUIRY • ${selectedEnquiry.id}` : ''}
        title={selectedEnquiry?.contact?.name || 'Inquiry Details'}
        subtitle={`Submitted on ${selectedEnquiry?.date || 'recent'} • ${selectedEnquiry?.productOrSolution || 'Equipment'}`}
        footer={
          <div className="flex items-center justify-between gap-3 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedEnquiry(null)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={isUpdatingEnquiry}
              onClick={handleSaveEnquiryStatus}
            >
              {isUpdatingEnquiry ? 'Saving...' : 'Save & Sync Status'}
            </Button>
          </div>
        }
      >
        {selectedEnquiry && (
          <div className="space-y-5 animate-fade-in">
            {/* Key Figures Highlight Card (Iceblue) */}
            <div className="p-4 rounded-2xl bg-iceblue border border-[#0297DE]/20 flex items-center justify-around text-center">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </div>
                <div className="mt-1 flex justify-center">
                  <StatusBadge status={selectedEnquiry.status} size="sm" />
                </div>
              </div>
              <div className="w-px h-8 bg-[#0297DE]/20" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Capacity
                </div>
                <div className="text-[18px] font-bold text-navy tabular-nums mt-0.5">
                  {selectedEnquiry.capacity || 'Standard'}
                </div>
              </div>
              <div className="w-px h-8 bg-[#0297DE]/20" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Reference #
                </div>
                <div className="text-[15px] font-bold text-electric-600 tabular-nums mt-0.5">
                  {selectedEnquiry.id}
                </div>
              </div>
            </div>

            {/* Customer Contact Details */}
            <DrawerSection title="CUSTOMER & EPC CONTACT">
              <div className="divide-y divide-slate-100 text-[13px]">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Customer Name</span>
                  <span className="text-navy font-semibold">{selectedEnquiry.contact?.name || '—'}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Contact Email</span>
                  <span className="text-electric-600 font-semibold tabular-nums">{selectedEnquiry.contact?.email || '—'}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Contact Phone</span>
                  <span className="text-navy font-semibold tabular-nums">{selectedEnquiry.contact?.phone || 'Not provided'}</span>
                </div>
              </div>
            </DrawerSection>

            {/* Specification / Proposal Details */}
            <DrawerSection title="EQUIPMENT & SIZING REQUIREMENTS">
              <div className="divide-y divide-slate-100 text-[13px]">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Target Equipment</span>
                  <span className="text-navy font-semibold text-right max-w-xs">
                    {selectedEnquiry.productOrSolution}
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">System Capacity</span>
                  <span className="text-navy font-semibold tabular-nums">{selectedEnquiry.capacity || 'N/A'}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Quantity</span>
                  <span className="text-navy font-semibold tabular-nums">{selectedEnquiry.quantity || '1'}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Project Classification</span>
                  <span className="text-navy font-semibold">{selectedEnquiry.projectType || 'Standard'}</span>
                </div>
              </div>
            </DrawerSection>

            {/* Customer Message / Notes */}
            <DrawerSection title="CLIENT MESSAGE & FIELD NOTES">
              <p className="text-[14px] text-slate-600 leading-relaxed">
                {selectedEnquiry.notes || 'No custom notes provided by client with this inquiry.'}
              </p>
            </DrawerSection>

            {/* Admin Status Changer */}
            <DrawerSection title="WORKFLOW STATUS & PROPOSAL RESPONSE">
              <div className="space-y-4">
                <Select
                  label="Update Pipeline Status"
                  value={enquiryStatusDraft}
                  onChange={(e) => setEnquiryStatusDraft(e.target.value)}
                  options={[
                    { value: 'New', label: 'New Inquiry' },
                    { value: 'In Review', label: 'In Engineering Review' },
                    { value: 'Quote Prepared', label: 'Quote Prepared & Sent' },
                    { value: 'Replied', label: 'Customer Replied' },
                    { value: 'Closed', label: 'Closed / Executed' },
                  ]}
                />

                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Proposal Note / Next Steps
                  </label>
                  <textarea
                    rows={3}
                    value={enquiryReplyNote}
                    onChange={(e) => setEnquiryReplyNote(e.target.value)}
                    placeholder="Enter details about quote preparation or next steps..."
                    className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 text-[14px] text-navy transition-all resize-y min-h-[90px]"
                  />
                </div>

                <Toggle
                  label="Push Live Notification"
                  description="Broadcast notification update to customer's mobile app bell"
                  checked={notifyCustomerCheck}
                  onChange={(val) => setNotifyCustomerCheck(val)}
                />
              </div>
            </DrawerSection>
          </div>
        )}
      </Drawer>

      {/* Quick Notification Modal */}
      <Modal
        isOpen={quickNotificationModalOpen}
        onClose={() => setQuickNotificationModalOpen(false)}
        title="Broadcast Notification"
        subtitle="Sends a live notification to client mobile application bell"
      >
        <form onSubmit={handleSendQuickNotification} className="space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
              Notification Title
            </label>
            <input
              type="text"
              required
              value={newNotifTitle}
              onChange={(e) => setNewNotifTitle(e.target.value)}
              placeholder="e.g. New Inverter Firmware Available"
              className="w-full h-11 px-3.5 rounded-xl text-[14px] border border-slate-200 focus:border-electric-500 focus:outline-none text-navy font-medium"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
              Message Body
            </label>
            <textarea
              rows={3}
              required
              value={newNotifBody}
              onChange={(e) => setNewNotifBody(e.target.value)}
              placeholder="Enter message details for customers and installers..."
              className="w-full p-3.5 rounded-xl text-[14px] border border-slate-200 focus:border-electric-500 focus:outline-none text-navy resize-y"
            />
          </div>

          <Select
            label="Category"
            value={newNotifType}
            onChange={(e) => setNewNotifType(e.target.value)}
            options={[
              { value: 'system', label: 'System Announcement' },
              { value: 'product', label: 'New Product Release' },
              { value: 'quote', label: 'Quote & Commercial' },
              { value: 'welcome', label: 'Welcome & Onboarding' },
            ]}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickNotificationModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Send Broadcast
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
