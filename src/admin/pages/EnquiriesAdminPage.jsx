import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MessageSquareQuote,
  Eye,
  Trash2,
  Plus,
  Mail,
  Phone,
  Calendar,
  Building,
  CheckCircle,
  FileCheck2,
} from 'lucide-react';
import DataTable from '../components/DataTable';
import ActionMenu from '../components/ActionMenu';
import Drawer, { DrawerSection } from '../components/Drawer';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Select from '../components/Select';
import Toggle from '../components/Toggle';
import { useAdmin } from '../context/AdminContext';
import { useAdminData } from '../context/AdminDataContext';
import { enquiriesService } from '../services/enquiriesService';

export default function EnquiriesAdminPage() {
  const { showAdminToast } = useAdmin();
  const { getCachedData, setCachedData, getPageState, setPageState } = useAdminData();
  const [searchParams, setSearchParams] = useSearchParams();

  const savedState = getPageState('enquiries', { search: '', statusFilter: 'All' });
  const cachedEnqs = getCachedData('enquiries');
  const [enquiries, setEnquiries] = useState(cachedEnqs || []);
  const [isLoading, setIsLoading] = useState(!cachedEnqs);
  const [search, setSearch] = useState(savedState.search);
  const [statusFilter, setStatusFilter] = useState(savedState.statusFilter);

  useEffect(() => {
    setPageState('enquiries', { search, statusFilter });
  }, [search, statusFilter, setPageState]);

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('view'); // 'view' | 'add'
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [statusDraft, setStatusDraft] = useState('');
  const [replyNoteDraft, setReplyNoteDraft] = useState('');
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // New Enquiry Form State
  const [newEnquiryData, setNewEnquiryData] = useState({
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    type: 'Product Quote',
    productOrSolution: 'Single-Phase String Inverter 5kW',
    capacity: '10 kW',
    quantity: '2 units',
    projectType: 'Commercial Rooftop',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadEnquiries = useCallback(async () => {
    try {
      if (!getCachedData('enquiries')) {
        setIsLoading(true);
      }
      const data = await enquiriesService.getAll({
        search,
        status: statusFilter,
      });
      setEnquiries(data);
      setCachedData('enquiries', data);
      return data;
    } catch (err) {
      showAdminToast('Failed to load enquiries', 'error');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, showAdminToast, getCachedData, setCachedData]);

  useEffect(() => {
    loadEnquiries();

    // Listen to storage sync events
    const handleSync = (e) => {
      if (e.key === 'solardepot_enquiries' || (e.detail && e.detail.key === 'solardepot_enquiries')) {
        loadEnquiries();
      }
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('solardepot_storage_update', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('solardepot_storage_update', handleSync);
    };
  }, [loadEnquiries]);

  // URL Sync
  useEffect(() => {
    const drawerParam = searchParams.get('drawer');
    const idParam = searchParams.get('id');

    if (enquiries.length === 0) return;

    if (drawerParam === 'add') {
      setDrawerMode('add');
      setSelectedEnquiry(null);
      setNewEnquiryData({
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        type: 'Product Quote',
        productOrSolution: 'Single-Phase String Inverter 5kW',
        capacity: '10 kW',
        quantity: '2 units',
        projectType: 'Commercial Rooftop',
        notes: '',
      });
      setIsDirty(false);
      setIsDrawerOpen(true);
    } else if (drawerParam === 'view' && idParam) {
      const found = enquiries.find((e) => String(e.id) === String(idParam));
      if (found) {
        setSelectedEnquiry(found);
        setStatusDraft(found.status || 'New');
        setReplyNoteDraft(found.replyNote || '');
        setNotifyCustomer(true);
        setDrawerMode('view');
        setIsDirty(false);
        setIsDrawerOpen(true);
      }
    }
  }, [searchParams, enquiries]);

  const updateDrawerUrl = (mode, id = null) => {
    const params = new URLSearchParams(searchParams);
    if (!mode) {
      params.delete('drawer');
      params.delete('id');
    } else {
      params.set('drawer', mode);
      if (id) params.set('id', id);
      else params.delete('id');
    }
    setSearchParams(params, { replace: true });
  };

  const handleOpenDetail = (enq) => {
    setSelectedEnquiry(enq);
    setStatusDraft(enq.status || 'New');
    setReplyNoteDraft(enq.replyNote || '');
    setNotifyCustomer(true);
    setDrawerMode('view');
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('view', enq.id);
  };

  const handleOpenAdd = () => {
    setDrawerMode('add');
    setSelectedEnquiry(null);
    setNewEnquiryData({
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      type: 'Product Quote',
      productOrSolution: 'Single-Phase String Inverter 5kW',
      capacity: '10 kW',
      quantity: '2 units',
      projectType: 'Commercial Rooftop',
      notes: '',
    });
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('add');
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setIsDirty(false);
    updateDrawerUrl(null);
  };

  const handleSaveStatus = async () => {
    if (!selectedEnquiry) return;

    try {
      setIsSavingStatus(true);
      const updated = await enquiriesService.updateStatus(selectedEnquiry.id, {
        status: statusDraft,
        replyNote: replyNoteDraft,
        notifyCustomer,
      });

      setSelectedEnquiry(updated);
      showAdminToast(`Updated #${selectedEnquiry.id} to "${statusDraft}"`, 'success');
      setIsDirty(false);
      handleCloseDrawer();
      loadEnquiries();
    } catch (err) {
      showAdminToast(err.message || 'Failed to update status', 'error');
    } finally {
      setIsSavingStatus(false);
    }
  };

  const handleCreateEnquiry = async (e) => {
    if (e) e.preventDefault();

    const errors = {};
    if (!newEnquiryData.contactName.trim()) errors.contactName = 'Customer name is required';
    if (!newEnquiryData.contactEmail.trim()) errors.contactEmail = 'Customer email is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showAdminToast('Please correct highlighted fields', 'error');
      return;
    }

    try {
      setIsSavingStatus(true);
      const payload = {
        contact: {
          name: newEnquiryData.contactName,
          email: newEnquiryData.contactEmail,
          phone: newEnquiryData.contactPhone,
        },
        type: newEnquiryData.type,
        productOrSolution: newEnquiryData.productOrSolution,
        capacity: newEnquiryData.capacity,
        quantity: newEnquiryData.quantity,
        projectType: newEnquiryData.projectType,
        notes: newEnquiryData.notes,
        status: 'New',
      };

      const created = await enquiriesService.create(payload);
      showAdminToast(`Quote request #${created.id} created`, 'success');
      setIsDirty(false);
      handleCloseDrawer();
      loadEnquiries();
    } catch (err) {
      showAdminToast(err.message || 'Failed to create enquiry', 'error');
    } finally {
      setIsSavingStatus(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await enquiriesService.remove(deleteTarget.id);
      showAdminToast(`Inquiry #${deleteTarget.id} removed`, 'success');
      setDeleteTarget(null);
      if (selectedEnquiry?.id === deleteTarget.id) {
        handleCloseDrawer();
      }
      loadEnquiries();
    } catch (err) {
      showAdminToast(err.message || 'Error deleting enquiry', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const searchTarget = `${e.id || ''} ${e.contact?.name || ''} ${e.contact?.email || ''} ${
        e.productOrSolution || ''
      }`.toLowerCase();
      const matchesSearch = searchTarget.includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [enquiries, search, statusFilter]);

  const columns = [
    {
      header: 'Reference #',
      accessor: 'id',
      cell: (row) => (
        <span className="font-semibold text-electric-600 tabular-nums text-[13px]">
          {row.id}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessor: 'contact.name',
      cell: (row) => (
        <div>
          <div className="font-semibold text-navy text-[14px]">
            {row.contact?.name || 'Anonymous Client'}
          </div>
          <div className="text-[12px] text-slate-400 tabular-nums">
            {row.contact?.email || row.contact?.phone || 'No direct email'}
          </div>
        </div>
      ),
    },
    {
      header: 'Product / Solution',
      accessor: 'productOrSolution',
      cell: (row) => (
        <span className="text-[13px] text-slate-700 font-medium line-clamp-1 max-w-[200px]">
          {row.productOrSolution}
        </span>
      ),
    },
    {
      header: 'Capacity',
      accessor: 'capacity',
      cell: (row) => (
        <span className="text-[13px] text-slate-500 tabular-nums font-medium">
          {row.capacity || '—'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      cell: (row) => (
        <span className="text-[13px] text-slate-400 tabular-nums">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'Recent'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      className: 'text-center w-24',
      cellClassName: 'text-center',
      cell: (row) => (
        <div className="flex items-center justify-center">
          <ActionMenu
            items={[
              {
                label: 'Review & Update',
                icon: Eye,
                onClick: () => handleOpenDetail(row),
              },
              {
                divider: true,
              },
              {
                label: 'Delete Enquiry',
                icon: Trash2,
                danger: true,
                onClick: () => setDeleteTarget(row),
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Top Header Pattern */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-[28px] font-semibold text-navy leading-tight">
            Enquiries & Quotes
          </h2>
          <p className="text-[14px] text-slate-500 mt-1">
            Quotation requests, engineering reviews, and client inquiries from the mobile app
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          New Quote Request
        </Button>
      </div>

      {/* Main Content starts 32px below header */}
      <div className="mt-8">
        <DataTable
          columns={columns}
          data={filteredEnquiries}
          isLoading={isLoading}
          searchPlaceholder="Search enquiries by Ref #, customer, or equipment..."
          searchValue={search}
          onSearchChange={setSearch}
          onRowClick={handleOpenDetail}
          filterControls={
            <div className="w-44">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'All', label: 'All Statuses' },
                  { value: 'New', label: 'New' },
                  { value: 'In Review', label: 'In Review' },
                  { value: 'Quote Prepared', label: 'Quote Prepared' },
                  { value: 'Replied', label: 'Replied' },
                  { value: 'Closed', label: 'Closed' },
                ]}
              />
            </div>
          }
        />
      </div>

      {/* Full-Height Highlander Slide-Over Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        isDirty={isDirty}
        size="lg"
        chip={
          drawerMode === 'view'
            ? `ENQUIRY • ${selectedEnquiry?.id || 'REF'}`
            : 'MANUAL QUOTE CREATION'
        }
        title={
          drawerMode === 'view'
            ? selectedEnquiry?.contact?.name || 'Inquiry Review'
            : 'Create Quote Request'
        }
        subtitle={
          drawerMode === 'view'
            ? `${selectedEnquiry?.productOrSolution || 'Solar System'} • ${selectedEnquiry?.type || 'Quote'}`
            : 'Manually register an incoming quote or EPC partnership inquiry'
        }
        footer={
          drawerMode === 'view' ? (
            <div className="flex items-center justify-between gap-3 w-full">
              <Button variant="outline" size="sm" onClick={handleCloseDrawer}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={FileCheck2}
                disabled={isSavingStatus}
                onClick={handleSaveStatus}
              >
                {isSavingStatus ? 'Updating...' : 'Save & Sync Status'}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCloseDrawer}
                disabled={isSavingStatus}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={isSavingStatus}
                onClick={handleCreateEnquiry}
              >
                {isSavingStatus ? 'Creating...' : 'Create Quote Request'}
              </Button>
            </div>
          )
        }
      >
        {/* VIEW & UPDATE MODE */}
        {drawerMode === 'view' && selectedEnquiry && (
          <div className="space-y-5 animate-fade-in">
            {/* Key Figures Highlight Card (Iceblue) */}
            <div className="p-4 rounded-2xl bg-iceblue border border-[#0297DE]/20 flex items-center justify-around text-center">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Current Status
                </div>
                <div className="mt-1 flex justify-center">
                  <StatusBadge status={selectedEnquiry.status} size="sm" />
                </div>
              </div>
              <div className="w-px h-8 bg-[#0297DE]/20" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Target Capacity
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

            {/* Customer Details */}
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
                  <span className="text-navy font-semibold tabular-nums">{selectedEnquiry.contact?.phone || '—'}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Submission Date</span>
                  <span className="text-navy font-semibold tabular-nums">
                    {selectedEnquiry.createdAt ? new Date(selectedEnquiry.createdAt).toLocaleString() : 'Recent'}
                  </span>
                </div>
              </div>
            </DrawerSection>

            {/* Requirements Section */}
            <DrawerSection title="EQUIPMENT & SIZING REQUIREMENTS">
              <div className="divide-y divide-slate-100 text-[13px]">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Requested Equipment</span>
                  <span className="text-navy font-semibold text-right max-w-xs">{selectedEnquiry.productOrSolution}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">System Capacity</span>
                  <span className="text-navy font-semibold tabular-nums">{selectedEnquiry.capacity || 'N/A'}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Requested Quantity</span>
                  <span className="text-navy font-semibold tabular-nums">{selectedEnquiry.quantity || '1 unit'}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Project Classification</span>
                  <span className="text-navy font-semibold">{selectedEnquiry.projectType || 'Standard Commercial'}</span>
                </div>
              </div>
            </DrawerSection>

            {/* Customer Project Notes */}
            <DrawerSection title="CLIENT PROJECT NOTES">
              <p className="text-[14px] text-slate-600 leading-relaxed">
                {selectedEnquiry.notes || 'No custom notes provided by client with this inquiry.'}
              </p>
            </DrawerSection>

            {/* Workflow Action & Status Updater */}
            <DrawerSection title="WORKFLOW STATUS & PROPOSAL RESPONSE">
              <div className="space-y-4">
                <Select
                  label="Update Pipeline Status"
                  value={statusDraft}
                  onChange={(e) => {
                    setStatusDraft(e.target.value);
                    setIsDirty(true);
                  }}
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
                    Engineering Reply Note / Proposal Summary
                  </label>
                  <textarea
                    rows={3}
                    value={replyNoteDraft}
                    onChange={(e) => {
                      setReplyNoteDraft(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="e.g. Bill of materials and electrical schematic generated. Quotation delivery within 14 business days..."
                    className="w-full p-3.5 rounded-xl bg-white text-navy text-[14px] border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all resize-y min-h-[90px]"
                  />
                </div>

                <Toggle
                  label="Push Live Notification"
                  description="Broadcast notification update to customer's mobile app bell"
                  checked={notifyCustomer}
                  onChange={(val) => {
                    setNotifyCustomer(val);
                    setIsDirty(true);
                  }}
                />
              </div>
            </DrawerSection>
          </div>
        )}

        {/* CREATE MODE */}
        {drawerMode === 'add' && (
          <form onSubmit={handleCreateEnquiry} className="space-y-5 animate-fade-in">
            <DrawerSection title="CUSTOMER INFORMATION">
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Customer / EPC Contact Name <span className="text-cantaloupe-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={newEnquiryData.contactName}
                    onChange={(e) => {
                      setNewEnquiryData({ ...newEnquiryData, contactName: e.target.value });
                      setIsDirty(true);
                    }}
                    placeholder="e.g. Alex Morgan"
                    className={`
                      w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium
                      border border-slate-200 hover:border-slate-300
                      focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500
                      transition-all
                      ${formErrors.contactName ? 'border-rose-400 focus:border-rose-500' : ''}
                    `}
                  />
                  {formErrors.contactName && (
                    <p className="mt-1 text-[12px] text-rose-600 font-medium">{formErrors.contactName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Contact Email <span className="text-cantaloupe-500 font-bold">*</span>
                    </label>
                    <input
                      type="email"
                      value={newEnquiryData.contactEmail}
                      onChange={(e) => {
                        setNewEnquiryData({ ...newEnquiryData, contactEmail: e.target.value });
                        setIsDirty(true);
                      }}
                      placeholder="alex@epcpartner.com"
                      className={`
                        w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium tabular-nums
                        border border-slate-200 hover:border-slate-300
                        focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500
                        transition-all
                        ${formErrors.contactEmail ? 'border-rose-400 focus:border-rose-500' : ''}
                      `}
                    />
                    {formErrors.contactEmail && (
                      <p className="mt-1 text-[12px] text-rose-600 font-medium">{formErrors.contactEmail}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={newEnquiryData.contactPhone}
                      onChange={(e) => {
                        setNewEnquiryData({ ...newEnquiryData, contactPhone: e.target.value });
                        setIsDirty(true);
                      }}
                      placeholder="+1 555 234 5678"
                      className="w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium tabular-nums border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </DrawerSection>

            <DrawerSection title="EQUIPMENT SIZING & SYSTEM REQUIREMENTS">
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Target Inverter or System
                  </label>
                  <input
                    type="text"
                    value={newEnquiryData.productOrSolution}
                    onChange={(e) => {
                      setNewEnquiryData({ ...newEnquiryData, productOrSolution: e.target.value });
                      setIsDirty(true);
                    }}
                    placeholder="e.g. Three-Phase Hybrid Inverter 10kW"
                    className="w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Capacity
                    </label>
                    <input
                      type="text"
                      value={newEnquiryData.capacity}
                      onChange={(e) => {
                        setNewEnquiryData({ ...newEnquiryData, capacity: e.target.value });
                        setIsDirty(true);
                      }}
                      placeholder="10 kW or 50 kWh"
                      className="w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium tabular-nums border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Quantity
                    </label>
                    <input
                      type="text"
                      value={newEnquiryData.quantity}
                      onChange={(e) => {
                        setNewEnquiryData({ ...newEnquiryData, quantity: e.target.value });
                        setIsDirty(true);
                      }}
                      placeholder="2 units"
                      className="w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium tabular-nums border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
                    />
                  </div>
                </div>

                <Select
                  label="Project Classification"
                  value={newEnquiryData.projectType}
                  onChange={(e) => {
                    setNewEnquiryData({ ...newEnquiryData, projectType: e.target.value });
                    setIsDirty(true);
                  }}
                  options={[
                    { value: 'Commercial Rooftop', label: 'Commercial Rooftop' },
                    { value: 'Residential Energy Storage', label: 'Residential Energy Storage' },
                    { value: 'Industrial Microgrid', label: 'Industrial Microgrid' },
                    { value: 'Utility Scale', label: 'Utility Scale Ground Mount' },
                  ]}
                />
              </div>
            </DrawerSection>

            <DrawerSection title="CLIENT SPECIFICATIONS & NOTES">
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                  Project Notes & Sizing Constraints
                </label>
                <textarea
                  rows={4}
                  value={newEnquiryData.notes}
                  onChange={(e) => {
                    setNewEnquiryData({ ...newEnquiryData, notes: e.target.value });
                    setIsDirty(true);
                  }}
                  placeholder="Notes from customer discussion, interconnection details, or delivery timeframe..."
                  className="w-full p-3.5 rounded-xl bg-white text-navy text-[14px] border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all resize-y min-h-[100px] max-h-[200px]"
                />
              </div>
            </DrawerSection>
          </form>
        )}
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Delete Customer Inquiry?"
        message={`Are you sure you want to remove inquiry #${deleteTarget?.id} from ${deleteTarget?.contact?.name}?`}
        confirmText="Delete Inquiry"
      />
    </div>
  );
}
