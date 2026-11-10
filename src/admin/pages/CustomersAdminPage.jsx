import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Edit2, Trash2, Building2, Eye, Mail, Phone, MapPin, UserCheck, ShieldCheck } from 'lucide-react';
import DataTable from '../components/DataTable';
import ActionMenu from '../components/ActionMenu';
import Drawer, { DrawerSection } from '../components/Drawer';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Select from '../components/Select';
import { useAdmin } from '../context/AdminContext';
import { customersService } from '../services/customersService';

export default function CustomersAdminPage() {
  const { showAdminToast } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('view'); // 'view' | 'edit' | 'add'
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    tier: 'Tier 1 Verified EPC',
    status: 'Active',
    location: 'Austin, TX',
    assignedEngineer: 'Alexandre Mercer',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await customersService.getAll({
        search,
        tier: tierFilter,
        status: statusFilter,
      });
      setCustomers(data);
      return data;
    } catch (err) {
      showAdminToast('Failed to load customers', 'error');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [search, tierFilter, statusFilter, showAdminToast]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  // URL Sync
  useEffect(() => {
    const drawerParam = searchParams.get('drawer');
    const idParam = searchParams.get('id');

    if (customers.length === 0) return;

    if (drawerParam === 'add') {
      setDrawerMode('add');
      setActiveCustomer(null);
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        tier: 'Tier 1 Verified EPC',
        status: 'Active',
        location: 'Austin, TX',
        assignedEngineer: 'Alexandre Mercer',
      });
      setIsDirty(false);
      setIsDrawerOpen(true);
    } else if ((drawerParam === 'view' || drawerParam === 'edit') && idParam) {
      const found = customers.find((c) => String(c.id) === String(idParam));
      if (found) {
        setActiveCustomer(found);
        setFormData({
          companyName: found.companyName || '',
          contactPerson: found.contactPerson || '',
          email: found.email || '',
          phone: found.phone || '',
          tier: found.tier || 'Tier 1 Verified EPC',
          status: found.status || 'Active',
          location: found.location || '',
          assignedEngineer: found.assignedEngineer || 'Alexandre Mercer',
        });
        setDrawerMode(drawerParam);
        setIsDirty(false);
        setIsDrawerOpen(true);
      }
    }
  }, [searchParams, customers]);

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

  const handleOpenAdd = () => {
    setDrawerMode('add');
    setActiveCustomer(null);
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      tier: 'Tier 1 Verified EPC',
      status: 'Active',
      location: 'Austin, TX',
      assignedEngineer: 'Alexandre Mercer',
    });
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('add');
  };

  const handleOpenView = (customer) => {
    setActiveCustomer(customer);
    setDrawerMode('view');
    setFormData({
      companyName: customer.companyName || '',
      contactPerson: customer.contactPerson || '',
      email: customer.email || '',
      phone: customer.phone || '',
      tier: customer.tier || 'Tier 1 Verified EPC',
      status: customer.status || 'Active',
      location: customer.location || '',
      assignedEngineer: customer.assignedEngineer || 'Alexandre Mercer',
    });
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('view', customer.id);
  };

  const handleOpenEdit = (customer) => {
    setActiveCustomer(customer);
    setDrawerMode('edit');
    setFormData({
      companyName: customer.companyName || '',
      contactPerson: customer.contactPerson || '',
      email: customer.email || '',
      phone: customer.phone || '',
      tier: customer.tier || 'Tier 1 Verified EPC',
      status: customer.status || 'Active',
      location: customer.location || '',
      assignedEngineer: customer.assignedEngineer || 'Alexandre Mercer',
    });
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('edit', customer.id);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setIsDirty(false);
    updateDrawerUrl(null);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    const errors = {};
    if (!formData.companyName.trim()) errors.companyName = 'Company name is required';
    if (!formData.email.trim()) errors.email = 'Email address is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showAdminToast('Please correct highlighted fields', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      if (drawerMode === 'edit' && activeCustomer) {
        await customersService.update(activeCustomer.id, formData);
        showAdminToast(`Updated partner "${formData.companyName}"`, 'success');
      } else {
        await customersService.create(formData);
        showAdminToast(`Registered partner "${formData.companyName}"`, 'success');
      }
      setIsDirty(false);
      handleCloseDrawer();
      loadCustomers();
    } catch (err) {
      showAdminToast(err.message || 'Error saving customer', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await customersService.remove(deleteTarget.id);
      showAdminToast(`Partner "${deleteTarget.companyName}" deleted`, 'success');
      setDeleteTarget(null);
      if (activeCustomer?.id === deleteTarget.id) {
        handleCloseDrawer();
      }
      loadCustomers();
    } catch (err) {
      showAdminToast(err.message || 'Error deleting partner', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Company / Organization',
      accessor: 'companyName',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-iceblue border border-[#0297DE]/20 flex items-center justify-center text-electric-600 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-navy text-[14px]">{row.companyName}</div>
            <div className="text-[12px] text-slate-400">{row.contactPerson || 'Primary Contact'}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Partner Tier',
      accessor: 'tier',
      cell: (row) => (
        <Badge
          variant={
            row.tier?.includes('Tier 1')
              ? 'electric'
              : row.tier?.includes('Tier 2')
              ? 'cantaloupe'
              : 'outline'
          }
          size="sm"
        >
          {row.tier}
        </Badge>
      ),
    },
    {
      header: 'Direct Email',
      accessor: 'email',
      cell: (row) => (
        <span className="text-[13px] text-electric-600 font-medium tabular-nums">{row.email}</span>
      ),
    },
    {
      header: 'Location',
      accessor: 'location',
      cell: (row) => <span className="text-[13px] text-slate-600">{row.location}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => <StatusBadge status={row.status} size="sm" />,
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
                label: 'View Partner',
                icon: Eye,
                onClick: () => handleOpenView(row),
              },
              {
                label: 'Edit Partner',
                icon: Edit2,
                onClick: () => handleOpenEdit(row),
              },
              {
                divider: true,
              },
              {
                label: 'Delete Partner',
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
            Customers
          </h2>
          <p className="text-[14px] text-slate-500 mt-1">
            EPC partners, certified installers, and commercial solar clients
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Add Customer
        </Button>
      </div>

      {/* Main Content starts 32px below header */}
      <div className="mt-8">
        <DataTable
          columns={columns}
          data={customers}
          isLoading={isLoading}
          searchPlaceholder="Search customers by company, contact person, or email..."
          searchValue={search}
          onSearchChange={setSearch}
          onRowClick={handleOpenView}
          filterControls={
            <div className="flex items-center gap-3">
              <div className="w-44">
                <Select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                  options={[
                    { value: 'All', label: 'All Tiers' },
                    { value: 'Tier 1 Verified EPC', label: 'Tier 1 Verified' },
                    { value: 'Tier 2 Certified Installer', label: 'Tier 2 Certified' },
                    { value: 'Standard Installer', label: 'Standard Partner' },
                  ]}
                />
              </div>

              <div className="w-36">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: 'All', label: 'All Statuses' },
                    { value: 'Active', label: 'Active' },
                    { value: 'Pending Verification', label: 'Pending' },
                    { value: 'Inactive', label: 'Inactive' },
                  ]}
                />
              </div>
            </div>
          }
        />
      </div>

      {/* Full-Height Highlander Slide-Over Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        isDirty={isDirty}
        size="md"
        chip={
          drawerMode === 'view'
            ? `PARTNER • ${activeCustomer?.tier?.toUpperCase() || 'EPC NETWORK'}`
            : drawerMode === 'edit'
            ? 'EDIT PARTNER'
            : 'REGISTER PARTNER'
        }
        title={
          drawerMode === 'view'
            ? activeCustomer?.companyName || 'Partner Profile'
            : drawerMode === 'edit'
            ? `Edit: ${activeCustomer?.companyName || ''}`
            : 'Register New EPC Partner'
        }
        subtitle={
          drawerMode === 'view'
            ? `${activeCustomer?.contactPerson || 'Contact'} • ${activeCustomer?.location || 'USA'}`
            : 'Configure EPC customer profile, assigned engineering lead, and tier status'
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
                icon={Edit2}
                onClick={() => {
                  setDrawerMode('edit');
                  updateDrawerUrl('edit', activeCustomer?.id);
                }}
              >
                Edit Partner
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCloseDrawer}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Saving...'
                  : drawerMode === 'edit'
                  ? 'Save Changes'
                  : 'Register Partner'}
              </Button>
            </div>
          )
        }
      >
        {/* VIEW MODE */}
        {drawerMode === 'view' && activeCustomer && (
          <div className="space-y-5 animate-fade-in">
            {/* Key Figures Highlight Card (Iceblue) */}
            <div className="p-4 rounded-2xl bg-iceblue border border-[#0297DE]/20 flex items-center justify-around text-center">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Verification
                </div>
                <div className="mt-1 flex justify-center">
                  <StatusBadge status={activeCustomer.status} size="sm" />
                </div>
              </div>
              <div className="w-px h-8 bg-[#0297DE]/20" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Partner Tier
                </div>
                <div className="text-[15px] font-bold text-navy mt-0.5">
                  {activeCustomer.tier}
                </div>
              </div>
              <div className="w-px h-8 bg-[#0297DE]/20" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Location
                </div>
                <div className="text-[14px] font-bold text-electric-600 mt-0.5">
                  {activeCustomer.location}
                </div>
              </div>
            </div>

            {/* Profile Specifications */}
            <DrawerSection title="ORGANIZATION & CONTACT DATA">
              <div className="divide-y divide-slate-100 text-[13px]">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Company Name</span>
                  <span className="text-navy font-semibold text-right">{activeCustomer.companyName}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Primary Contact</span>
                  <span className="text-navy font-semibold">{activeCustomer.contactPerson || '—'}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Email Address</span>
                  <span className="text-electric-600 font-semibold tabular-nums">{activeCustomer.email}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Direct Phone</span>
                  <span className="text-navy font-semibold tabular-nums">{activeCustomer.phone || 'N/A'}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Assigned Engineer</span>
                  <span className="text-navy font-semibold">{activeCustomer.assignedEngineer || 'Alexandre Mercer'}</span>
                </div>
              </div>
            </DrawerSection>
          </div>
        )}

        {/* EDIT / ADD MODE */}
        {drawerMode !== 'view' && (
          <form onSubmit={handleSave} className="space-y-5 animate-fade-in">
            <DrawerSection title="ORGANIZATION PROFILE">
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Company Name <span className="text-cantaloupe-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="e.g. Solaria Energy Systems LLC"
                    className={`
                      w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium
                      border border-slate-200 hover:border-slate-300
                      focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500
                      transition-all
                      ${formErrors.companyName ? 'border-rose-400 focus:border-rose-500' : ''}
                    `}
                  />
                  {formErrors.companyName && (
                    <p className="mt-1 text-[12px] text-rose-600 font-medium">{formErrors.companyName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Key Contact Person
                    </label>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                      placeholder="e.g. David Vance"
                      className="w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Headquarters / Territory
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g. Austin, TX"
                      className="w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </DrawerSection>

            <DrawerSection title="CONTACT INFORMATION">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Official Email <span className="text-cantaloupe-500 font-bold">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="partner@solaria.com"
                    className={`
                      w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium tabular-nums
                      border border-slate-200 hover:border-slate-300
                      focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500
                      transition-all
                      ${formErrors.email ? 'border-rose-400 focus:border-rose-500' : ''}
                    `}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-[12px] text-rose-600 font-medium">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Direct Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 512 800 9200"
                    className="w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium tabular-nums border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
                  />
                </div>
              </div>
            </DrawerSection>

            <DrawerSection title="PARTNERSHIP CLASSIFICATION">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Partner Tier"
                  value={formData.tier}
                  onChange={(e) => handleInputChange('tier', e.target.value)}
                  options={[
                    { value: 'Tier 1 Verified EPC', label: 'Tier 1 Verified EPC' },
                    { value: 'Tier 2 Certified Installer', label: 'Tier 2 Certified Installer' },
                    { value: 'Standard Installer', label: 'Standard Partner' },
                  ]}
                />

                <Select
                  label="Account Status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  options={[
                    { value: 'Active', label: 'Active Partner' },
                    { value: 'Pending Verification', label: 'Pending Verification' },
                    { value: 'Inactive', label: 'Inactive / Suspended' },
                  ]}
                />
              </div>

              <div className="pt-2">
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                  Assigned Engineering Lead
                </label>
                <input
                  type="text"
                  value={formData.assignedEngineer}
                  onChange={(e) => handleInputChange('assignedEngineer', e.target.value)}
                  placeholder="e.g. Alexandre Mercer"
                  className="w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
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
        title="Delete Customer Partner?"
        message={`Are you sure you want to remove "${deleteTarget?.companyName}"? Any ongoing quotes will be unlinked.`}
        confirmText="Delete Customer"
      />
    </div>
  );
}
