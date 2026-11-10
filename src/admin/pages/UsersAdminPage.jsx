import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Edit2, Trash2, Shield, Eye, Mail, CheckCircle, XCircle, UserCheck } from 'lucide-react';
import DataTable from '../components/DataTable';
import ActionMenu from '../components/ActionMenu';
import Drawer, { DrawerSection } from '../components/Drawer';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Select from '../components/Select';
import { useAdmin } from '../context/AdminContext';
import { useAdminData } from '../context/AdminDataContext';
import { usersService } from '../services/usersService';

export default function UsersAdminPage() {
  const { showAdminToast, adminUser: currentLoggedUser } = useAdmin();
  const { getCachedData, setCachedData, getPageState, setPageState } = useAdminData();
  const [searchParams, setSearchParams] = useSearchParams();

  const savedState = getPageState('users', { search: '', roleFilter: 'All', statusFilter: 'All' });
  const cachedUsers = getCachedData('users');
  const [users, setUsers] = useState(cachedUsers || []);
  const [isLoading, setIsLoading] = useState(!cachedUsers);
  const [search, setSearch] = useState(savedState.search);
  const [roleFilter, setRoleFilter] = useState(savedState.roleFilter);
  const [statusFilter, setStatusFilter] = useState(savedState.statusFilter);

  useEffect(() => {
    setPageState('users', { search, roleFilter, statusFilter });
  }, [search, roleFilter, statusFilter, setPageState]);

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('view'); // 'view' | 'edit' | 'add'
  const [activeUser, setActiveUser] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Admin',
    department: 'Engineering Operations',
    status: 'Active',
    avatar: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      if (!getCachedData('users')) {
        setIsLoading(true);
      }
      const data = await usersService.getAll({
        search,
        role: roleFilter,
        status: statusFilter,
      });
      setUsers(data);
      setCachedData('users', data);
      return data;
    } catch (err) {
      showAdminToast('Failed to load admin users', 'error');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [search, roleFilter, statusFilter, showAdminToast, getCachedData, setCachedData]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // URL Sync
  useEffect(() => {
    const drawerParam = searchParams.get('drawer');
    const idParam = searchParams.get('id');

    if (users.length === 0) return;

    if (drawerParam === 'add') {
      setDrawerMode('add');
      setActiveUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'Admin',
        department: 'Engineering Operations',
        status: 'Active',
        avatar: '',
      });
      setIsDirty(false);
      setIsDrawerOpen(true);
    } else if ((drawerParam === 'view' || drawerParam === 'edit') && idParam) {
      const found = users.find((u) => String(u.id) === String(idParam));
      if (found) {
        setActiveUser(found);
        setFormData({
          name: found.name || '',
          email: found.email || '',
          role: found.role || 'Admin',
          department: found.department || 'Operations',
          status: found.status || 'Active',
          avatar: found.avatar || '',
        });
        setDrawerMode(drawerParam);
        setIsDirty(false);
        setIsDrawerOpen(true);
      }
    }
  }, [searchParams, users]);

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
    setActiveUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'Admin',
      department: 'Engineering Operations',
      status: 'Active',
      avatar: '',
    });
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('add');
  };

  const handleOpenView = (user) => {
    setActiveUser(user);
    setDrawerMode('view');
    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'Admin',
      department: user.department || 'Operations',
      status: user.status || 'Active',
      avatar: user.avatar || '',
    });
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('view', user.id);
  };

  const handleOpenEdit = (user) => {
    setActiveUser(user);
    setDrawerMode('edit');
    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'Admin',
      department: user.department || 'Operations',
      status: user.status || 'Active',
      avatar: user.avatar || '',
    });
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('edit', user.id);
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

  const handleToggleStatus = async (user, e) => {
    e.stopPropagation();
    if (user.id === currentLoggedUser?.id) {
      showAdminToast('You cannot deactivate your own active session account', 'warning');
      return;
    }
    try {
      const updated = await usersService.toggleStatus(user.id);
      showAdminToast(
        `User "${user.name}" status updated to ${updated.status}`,
        'success'
      );
      loadUsers();
    } catch (err) {
      showAdminToast(err.message || 'Failed to update user status', 'error');
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Valid corporate email required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showAdminToast('Please correct highlighted fields', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      if (drawerMode === 'edit' && activeUser) {
        await usersService.update(activeUser.id, formData);
        showAdminToast(`Updated user "${formData.name}"`, 'success');
      } else {
        await usersService.create(formData);
        showAdminToast(`Created user account for "${formData.name}"`, 'success');
      }
      setIsDirty(false);
      handleCloseDrawer();
      loadUsers();
    } catch (err) {
      showAdminToast(err.message || 'Error saving user', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.id === currentLoggedUser?.id) {
      showAdminToast('Cannot delete the currently logged in super admin session', 'error');
      setDeleteTarget(null);
      return;
    }

    try {
      setIsDeleting(true);
      await usersService.remove(deleteTarget.id);
      showAdminToast(`User "${deleteTarget.name}" deleted`, 'success');
      setDeleteTarget(null);
      if (activeUser?.id === deleteTarget.id) {
        handleCloseDrawer();
      }
      loadUsers();
    } catch (err) {
      showAdminToast(err.message || 'Error deleting user', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Staff Member',
      accessor: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={
              row.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
            }
            alt={row.name}
            className="w-10 h-10 rounded-xl object-cover border border-slate-200"
          />
          <div>
            <div className="font-semibold text-navy text-[14px] flex items-center gap-1.5">
              <span>{row.name}</span>
              {row.id === currentLoggedUser?.id && (
                <span className="text-[11px] font-semibold px-2 py-0.2 rounded-full bg-electric-50 text-electric-600 border border-electric-200">
                  You
                </span>
              )}
            </div>
            <div className="text-[12px] text-slate-400 tabular-nums">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'System Role',
      accessor: 'role',
      cell: (row) => (
        <Badge
          variant={
            row.role === 'Super Admin'
              ? 'cantaloupe'
              : row.role === 'Admin'
              ? 'electric'
              : 'outline'
          }
          size="sm"
        >
          {row.role}
        </Badge>
      ),
    },
    {
      header: 'Department',
      accessor: 'department',
      cell: (row) => <span className="text-[14px] text-slate-600">{row.department}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <button
          type="button"
          onClick={(e) => handleToggleStatus(row, e)}
          className="hover:opacity-85 transition-opacity"
          title="Click to toggle active status"
        >
          <StatusBadge status={row.status} size="sm" />
        </button>
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
                label: 'View User',
                icon: Eye,
                onClick: () => handleOpenView(row),
              },
              {
                label: 'Edit User',
                icon: Edit2,
                onClick: () => handleOpenEdit(row),
              },
              {
                divider: true,
              },
              {
                label: 'Delete User',
                icon: Trash2,
                danger: true,
                disabled: row.id === currentLoggedUser?.id,
                title: row.id === currentLoggedUser?.id ? 'Cannot delete current logged user' : undefined,
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
            Admin
          </h2>
          <p className="text-[14px] text-slate-500 mt-1">
            Manage system administrators, support specialists, and platform permissions
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Add Admin
        </Button>
      </div>

      {/* Main Content starts 32px below header */}
      <div className="mt-8">
        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          searchPlaceholder="Search admin staff by name, email, or department..."
          searchValue={search}
          onSearchChange={setSearch}
          onRowClick={handleOpenView}
          filterControls={
            <div className="flex items-center gap-3">
              <div className="w-40">
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  options={[
                    { value: 'All', label: 'All Roles' },
                    { value: 'Super Admin', label: 'Super Admin' },
                    { value: 'Admin', label: 'Admin' },
                    { value: 'Support', label: 'Support' },
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
            ? `USER • ${activeUser?.role?.toUpperCase() || 'STAFF'}`
            : drawerMode === 'edit'
            ? 'EDIT USER'
            : 'NEW USER'
        }
        title={
          drawerMode === 'view'
            ? activeUser?.name || 'Staff Profile'
            : drawerMode === 'edit'
            ? `Edit: ${activeUser?.name || ''}`
            : 'Create Admin User'
        }
        subtitle={
          drawerMode === 'view'
            ? `${activeUser?.department || 'Operations'} • ${activeUser?.email || ''}`
            : 'Configure administrative account credentials, role permissions, and access'
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
                  updateDrawerUrl('edit', activeUser?.id);
                }}
              >
                Edit User
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
                  : 'Create User'}
              </Button>
            </div>
          )
        }
      >
        {/* VIEW MODE */}
        {drawerMode === 'view' && activeUser && (
          <div className="space-y-5 animate-fade-in">
            {/* User Avatar Card */}
            <div className="p-5 rounded-2xl bg-white border border-[#0297DE]/15 shadow-soft flex items-center gap-4">
              <img
                src={
                  activeUser.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                }
                alt={activeUser.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
              />
              <div className="min-w-0">
                <div className="text-[18px] font-display font-semibold text-navy leading-tight truncate">
                  {activeUser.name}
                </div>
                <div className="text-[13px] text-electric-600 font-medium tabular-nums mt-0.5 truncate">
                  {activeUser.email}
                </div>
                <div className="text-[12px] text-slate-400 mt-1">
                  {activeUser.department || 'Operations Team'}
                </div>
              </div>
            </div>

            {/* Key Figures Highlight Card (Iceblue) */}
            <div className="p-4 rounded-2xl bg-iceblue border border-[#0297DE]/20 flex items-center justify-around text-center">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Account Status
                </div>
                <div className="mt-1 flex justify-center">
                  <StatusBadge status={activeUser.status} size="sm" />
                </div>
              </div>
              <div className="w-px h-8 bg-[#0297DE]/20" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Access Level
                </div>
                <div className="text-[15px] font-bold text-navy mt-0.5">
                  {activeUser.role}
                </div>
              </div>
              <div className="w-px h-8 bg-[#0297DE]/20" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Department
                </div>
                <div className="text-[14px] font-bold text-electric-600 mt-0.5">
                  {activeUser.department || 'General'}
                </div>
              </div>
            </div>

            {/* Details Table */}
            <DrawerSection title="USER PERMISSIONS & METADATA">
              <div className="divide-y divide-slate-100 text-[13px]">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Full Name</span>
                  <span className="text-navy font-semibold">{activeUser.name}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Corporate Email</span>
                  <span className="text-electric-600 font-semibold tabular-nums">{activeUser.email}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">RBAC Security Role</span>
                  <span className="text-navy font-semibold">{activeUser.role}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Session Status</span>
                  <span className="text-navy font-semibold">{activeUser.status}</span>
                </div>
              </div>
            </DrawerSection>
          </div>
        )}

        {/* EDIT / ADD MODE */}
        {drawerMode !== 'view' && (
          <form onSubmit={handleSave} className="space-y-5 animate-fade-in">
            <DrawerSection title="PROFILE INFORMATION">
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Full Name <span className="text-cantaloupe-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g. Rachel Adams"
                    className={`
                      w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium
                      border border-slate-200 hover:border-slate-300
                      focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500
                      transition-all
                      ${formErrors.name ? 'border-rose-400 focus:border-rose-500' : ''}
                    `}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-[12px] text-rose-600 font-medium">{formErrors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Corporate Email <span className="text-cantaloupe-500 font-bold">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="rachel@solardepot.com"
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
                      Department
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      placeholder="Engineering Operations"
                      className="w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </DrawerSection>

            <DrawerSection title="SECURITY & ACCESS CONTROL">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Administrative Role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  options={[
                    { value: 'Super Admin', label: 'Super Admin (Full Access)' },
                    { value: 'Admin', label: 'Admin (Catalog & Sales)' },
                    { value: 'Support', label: 'Support Specialist' },
                  ]}
                />

                <Select
                  label="Account Status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  options={[
                    { value: 'Active', label: 'Active User' },
                    { value: 'Inactive', label: 'Inactive / Suspended' },
                  ]}
                />
              </div>

              <div className="pt-2">
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                  Avatar Photo URL
                </label>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => handleInputChange('avatar', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
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
        title="Delete User Account?"
        message={`Are you sure you want to remove account access for "${deleteTarget?.name}"?`}
        confirmText="Delete Account"
      />
    </div>
  );
}
