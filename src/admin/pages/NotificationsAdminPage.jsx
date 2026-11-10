import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Bell,
  Send,
  Trash2,
  CheckCheck,
  Eye,
  FileText,
  Package,
  AlertCircle,
  Radio,
} from 'lucide-react';
import DataTable from '../components/DataTable';
import ActionMenu from '../components/ActionMenu';
import Drawer, { DrawerSection } from '../components/Drawer';
import ConfirmDialog from '../components/ConfirmDialog';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Select from '../components/Select';
import { useAdmin } from '../context/AdminContext';
import { notificationsService } from '../services/notificationsService';

export default function NotificationsAdminPage() {
  const { showAdminToast, refreshNotifications } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('compose'); // 'compose' | 'view'
  const [activeNotif, setActiveNotif] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    type: 'system',
    targetRoute: '/my-enquiries',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSending, setIsSending] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await notificationsService.getAll();
      setNotifications(data);
      return data;
    } catch (err) {
      showAdminToast('Failed to load notifications', 'error');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [showAdminToast]);

  useEffect(() => {
    loadNotifications();

    const handleSync = (e) => {
      if (e.key === 'solardepot_notifications' || (e.detail && e.detail.key === 'solardepot_notifications')) {
        loadNotifications();
      }
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('solardepot_storage_update', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('solardepot_storage_update', handleSync);
    };
  }, [loadNotifications]);

  // URL Sync
  useEffect(() => {
    const drawerParam = searchParams.get('drawer');
    const idParam = searchParams.get('id');

    if (drawerParam === 'compose') {
      setDrawerMode('compose');
      setActiveNotif(null);
      setFormData({
        title: '',
        body: '',
        type: 'system',
        targetRoute: '/my-enquiries',
      });
      setIsDirty(false);
      setIsDrawerOpen(true);
    } else if (drawerParam === 'view' && idParam && notifications.length > 0) {
      const found = notifications.find((n) => String(n.id) === String(idParam));
      if (found) {
        setActiveNotif(found);
        setDrawerMode('view');
        setIsDirty(false);
        setIsDrawerOpen(true);
      }
    }
  }, [searchParams, notifications]);

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

  const handleOpenCompose = () => {
    setDrawerMode('compose');
    setActiveNotif(null);
    setFormData({
      title: '',
      body: '',
      type: 'system',
      targetRoute: '/my-enquiries',
    });
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('compose');
  };

  const handleOpenView = (notif) => {
    setActiveNotif(notif);
    setDrawerMode('view');
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('view', notif.id);
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

  const handleSendNotification = async (e) => {
    if (e) e.preventDefault();

    const errors = {};
    if (!formData.title.trim()) errors.title = 'Notification title is required';
    if (!formData.body.trim()) errors.body = 'Notification message body is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showAdminToast('Please correct highlighted fields', 'error');
      return;
    }

    try {
      setIsSending(true);
      await notificationsService.send(formData);
      showAdminToast('Broadcast published to mobile application bell!', 'success');
      setIsDirty(false);
      handleCloseDrawer();
      loadNotifications();
      refreshNotifications();
    } catch (err) {
      showAdminToast(err.message || 'Failed to dispatch notification', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      showAdminToast('All notifications marked as read', 'info');
      loadNotifications();
      refreshNotifications();
    } catch (err) {
      showAdminToast('Failed to update notifications', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await notificationsService.remove(deleteTarget.id);
      showAdminToast('Notification removed', 'success');
      setDeleteTarget(null);
      if (activeNotif?.id === deleteTarget.id) {
        handleCloseDrawer();
      }
      loadNotifications();
      refreshNotifications();
    } catch (err) {
      showAdminToast(err.message || 'Failed to delete notification', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredNotifs = useMemo(() => {
    return notifications.filter(
      (n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.body.toLowerCase().includes(search.toLowerCase())
    );
  }, [notifications, search]);

  const columns = [
    {
      header: 'Notification Notice',
      accessor: 'title',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              row.type === 'quote'
                ? 'bg-cantaloupe-50 text-cantaloupe-600 border border-cantaloupe-200'
                : row.type === 'product'
                ? 'bg-electric-50 text-electric-600 border border-electric-200'
                : 'bg-iceblue text-electric-600 border border-[#0297DE]/20'
            }`}
          >
            {row.type === 'quote' ? (
              <FileText className="w-5 h-5" />
            ) : row.type === 'product' ? (
              <Package className="w-5 h-5" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="font-semibold text-navy text-[14px] flex items-center gap-2">
              <span>{row.title}</span>
              {row.unread && (
                <span className="w-2 h-2 rounded-full bg-cantaloupe-500 shadow-orange" />
              )}
            </div>
            <div className="text-[12px] text-slate-500 line-clamp-1 max-w-[340px] mt-0.5">
              {row.body}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'type',
      cell: (row) => (
        <Badge
          variant={
            row.type === 'quote'
              ? 'cantaloupe'
              : row.type === 'product'
              ? 'electric'
              : 'outline'
          }
          size="sm"
        >
          {row.type}
        </Badge>
      ),
    },
    {
      header: 'Target Route',
      accessor: 'targetRoute',
      cell: (row) => (
        <span className="text-[13px] text-slate-500 tabular-nums">
          {row.targetRoute || '/'}
        </span>
      ),
    },
    {
      header: 'Timestamp',
      accessor: 'timestamp',
      cell: (row) => (
        <span className="text-[13px] text-slate-400 tabular-nums">
          {row.timestamp ? new Date(row.timestamp).toLocaleDateString() : 'Recent'}
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
                label: 'View Details',
                icon: Eye,
                onClick: () => handleOpenView(row),
              },
              {
                divider: true,
              },
              {
                label: 'Delete Notification',
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
            Notifications Center
          </h2>
          <p className="text-[14px] text-slate-500 mt-1">
            Dispatch announcements and quote updates to client mobile apps and review transmission history
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" icon={CheckCheck} onClick={handleMarkAllRead}>
            Mark All Read
          </Button>
          <Button variant="primary" icon={Send} onClick={handleOpenCompose}>
            Compose Announcement
          </Button>
        </div>
      </div>

      {/* Main Content starts 32px below header */}
      <div className="mt-8">
        <DataTable
          columns={columns}
          data={filteredNotifs}
          isLoading={isLoading}
          searchPlaceholder="Search dispatched notifications by title or text..."
          searchValue={search}
          onSearchChange={setSearch}
          onRowClick={handleOpenView}
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
            ? `NOTIFICATION • ${activeNotif?.type?.toUpperCase() || 'ALERT'}`
            : 'BROADCAST DISPATCH'
        }
        title={
          drawerMode === 'view'
            ? activeNotif?.title || 'Notification Record'
            : 'Compose Announcement'
        }
        subtitle={
          drawerMode === 'view'
            ? `Dispatched ${activeNotif?.timestamp ? new Date(activeNotif.timestamp).toLocaleString() : 'recently'}`
            : 'Broadcast notification to EPC installer network and customer mobile application bells'
        }
        footer={
          drawerMode === 'view' ? (
            <div className="flex items-center justify-end w-full">
              <Button variant="outline" size="sm" onClick={handleCloseDrawer}>
                Close
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCloseDrawer}
                disabled={isSending}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Send}
                onClick={handleSendNotification}
                disabled={isSending}
              >
                {isSending ? 'Transmitting...' : 'Send Broadcast'}
              </Button>
            </div>
          )
        }
      >
        {/* VIEW MODE */}
        {drawerMode === 'view' && activeNotif && (
          <div className="space-y-5 animate-fade-in">
            {/* Key Figures Highlight Card (Iceblue) */}
            <div className="p-4 rounded-2xl bg-iceblue border border-[#0297DE]/20 flex items-center justify-around text-center">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Channel
                </div>
                <div className="text-[16px] font-bold text-navy mt-0.5 capitalize">
                  {activeNotif.type}
                </div>
              </div>
              <div className="w-px h-8 bg-[#0297DE]/20" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Destination
                </div>
                <div className="text-[14px] font-bold text-electric-600 tabular-nums mt-0.5">
                  {activeNotif.targetRoute || '/'}
                </div>
              </div>
              <div className="w-px h-8 bg-[#0297DE]/20" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Read State
                </div>
                <div className="text-[14px] font-bold text-navy mt-0.5">
                  {activeNotif.unread ? 'Unread' : 'Read'}
                </div>
              </div>
            </div>

            {/* Notification Details */}
            <DrawerSection title="DISPATCH RECORD">
              <div className="divide-y divide-slate-100 text-[13px]">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Subject</span>
                  <span className="text-navy font-semibold text-right max-w-xs">{activeNotif.title}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Broadcast Time</span>
                  <span className="text-navy font-semibold tabular-nums">
                    {activeNotif.timestamp ? new Date(activeNotif.timestamp).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>
            </DrawerSection>

            {/* Message Body */}
            <DrawerSection title="TRANSMITTED MESSAGE BODY">
              <p className="text-[14px] text-slate-700 leading-relaxed bg-[#F7FAFC] p-4 rounded-xl border border-slate-200">
                {activeNotif.body}
              </p>
            </DrawerSection>
          </div>
        )}

        {/* COMPOSE MODE */}
        {drawerMode === 'compose' && (
          <form onSubmit={handleSendNotification} className="space-y-5 animate-fade-in">
            <DrawerSection title="ANNOUNCEMENT CONTENT">
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Notification Subject <span className="text-cantaloupe-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g. Q4 Inverter Inventory Restocked"
                    className={`
                      w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium
                      border border-slate-200 hover:border-slate-300
                      focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500
                      transition-all
                      ${formErrors.title ? 'border-rose-400 focus:border-rose-500' : ''}
                    `}
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-[12px] text-rose-600 font-medium">{formErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Message Body <span className="text-cantaloupe-500 font-bold">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.body}
                    onChange={(e) => handleInputChange('body', e.target.value)}
                    placeholder="Enter the push notification text to display on mobile devices..."
                    className={`
                      w-full p-3.5 rounded-xl bg-white text-navy text-[14px]
                      border border-slate-200 hover:border-slate-300
                      focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500
                      transition-all resize-y min-h-[110px] max-h-[220px]
                      ${formErrors.body ? 'border-rose-400 focus:border-rose-500' : ''}
                    `}
                  />
                  {formErrors.body && (
                    <p className="mt-1 text-[12px] text-rose-600 font-medium">{formErrors.body}</p>
                  )}
                </div>
              </div>
            </DrawerSection>

            <DrawerSection title="BROADCAST TARGETING">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Notification Channel"
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  options={[
                    { value: 'system', label: 'System Notice' },
                    { value: 'quote', label: 'Quotation Update' },
                    { value: 'product', label: 'Product Restock' },
                  ]}
                />

                <Select
                  label="In-App Target Route"
                  value={formData.targetRoute}
                  onChange={(e) => handleInputChange('targetRoute', e.target.value)}
                  options={[
                    { value: '/my-enquiries', label: 'My Enquiries' },
                    { value: '/products', label: 'Inverters Catalog' },
                    { value: '/downloads', label: 'Technical Downloads' },
                    { value: '/solutions', label: 'Solutions Hub' },
                  ]}
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
        title="Delete Notification?"
        message={`Are you sure you want to remove "${deleteTarget?.title}" from transmission history?`}
        confirmText="Delete Record"
      />
    </div>
  );
}
