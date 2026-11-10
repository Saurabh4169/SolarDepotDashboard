import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Edit2, Trash2, FileText, Eye, Download, UploadCloud, FileCode } from 'lucide-react';
import DataTable from '../components/DataTable';
import ActionMenu from '../components/ActionMenu';
import Drawer, { DrawerSection } from '../components/Drawer';
import ConfirmDialog from '../components/ConfirmDialog';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Select from '../components/Select';
import { useAdmin } from '../context/AdminContext';
import { downloadsService } from '../services/downloadsService';

export default function DownloadsAdminPage() {
  const { showAdminToast } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  const [downloads, setDownloads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Documents');

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('view'); // 'view' | 'edit' | 'add'
  const [activeItem, setActiveItem] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Product Datasheets',
    format: 'PDF',
    size: '2.4 MB',
    version: 'Rev 1.0',
    model: 'Universal',
    description: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadDownloads = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await downloadsService.getAll({
        search,
        category: selectedCategory,
      });
      setDownloads(data);
      return data;
    } catch (err) {
      showAdminToast('Failed to load technical resources', 'error');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedCategory, showAdminToast]);

  useEffect(() => {
    loadDownloads();
  }, [loadDownloads]);

  // URL Sync
  useEffect(() => {
    const drawerParam = searchParams.get('drawer') || (searchParams.get('action') === 'upload' ? 'add' : null);
    const idParam = searchParams.get('id');

    if (downloads.length === 0) return;

    if (drawerParam === 'add') {
      setDrawerMode('add');
      setActiveItem(null);
      setFormData({
        title: '',
        category: 'Product Datasheets',
        format: 'PDF',
        size: '2.4 MB',
        version: 'Rev 1.0',
        model: 'SD-Series',
        description: '',
      });
      setIsDirty(false);
      setIsDrawerOpen(true);
    } else if ((drawerParam === 'view' || drawerParam === 'edit') && idParam) {
      const found = downloads.find((d) => String(d.id) === String(idParam));
      if (found) {
        setActiveItem(found);
        setFormData({
          title: found.title || '',
          category: found.category || 'Product Datasheets',
          format: found.format || 'PDF',
          size: found.size || '2.0 MB',
          version: found.version || 'Rev 1.0',
          model: found.model || 'Universal',
          description: found.description || '',
        });
        setDrawerMode(drawerParam);
        setIsDirty(false);
        setIsDrawerOpen(true);
      }
    }
  }, [searchParams, downloads]);

  const updateDrawerUrl = (mode, id = null) => {
    const params = new URLSearchParams(searchParams);
    if (!mode) {
      params.delete('drawer');
      params.delete('id');
      params.delete('action');
    } else {
      params.set('drawer', mode);
      if (id) params.set('id', id);
      else params.delete('id');
      params.delete('action');
    }
    setSearchParams(params, { replace: true });
  };

  const handleOpenAdd = () => {
    setDrawerMode('add');
    setActiveItem(null);
    setFormData({
      title: '',
      category: 'Product Datasheets',
      format: 'PDF',
      size: '2.4 MB',
      version: 'Rev 1.0',
      model: 'SD-Series',
      description: '',
    });
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('add');
  };

  const handleOpenView = (item) => {
    setActiveItem(item);
    setDrawerMode('view');
    setFormData({
      title: item.title || '',
      category: item.category || 'Product Datasheets',
      format: item.format || 'PDF',
      size: item.size || '2.0 MB',
      version: item.version || 'Rev 1.0',
      model: item.model || 'Universal',
      description: item.description || '',
    });
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('view', item.id);
  };

  const handleOpenEdit = (item) => {
    setActiveItem(item);
    setDrawerMode('edit');
    setFormData({
      title: item.title || '',
      category: item.category || 'Product Datasheets',
      format: item.format || 'PDF',
      size: item.size || '2.0 MB',
      version: item.version || 'Rev 1.0',
      model: item.model || 'Universal',
      description: item.description || '',
    });
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('edit', item.id);
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
    if (!formData.title.trim()) errors.title = 'Document title is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showAdminToast('Please correct highlighted fields', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      if (drawerMode === 'edit' && activeItem) {
        await downloadsService.update(activeItem.id, formData);
        showAdminToast(`Updated resource "${formData.title}"`, 'success');
      } else {
        await downloadsService.create(formData);
        showAdminToast(`Published resource "${formData.title}"`, 'success');
      }
      setIsDirty(false);
      handleCloseDrawer();
      loadDownloads();
    } catch (err) {
      showAdminToast(err.message || 'Error saving document', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await downloadsService.remove(deleteTarget.id);
      showAdminToast(`Resource "${deleteTarget.title}" deleted`, 'success');
      setDeleteTarget(null);
      if (activeItem?.id === deleteTarget.id) {
        handleCloseDrawer();
      }
      loadDownloads();
    } catch (err) {
      showAdminToast(err.message || 'Error deleting resource', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Resource Title',
      accessor: 'title',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-iceblue border border-[#0297DE]/20 flex items-center justify-center text-electric-600 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-navy text-[14px] line-clamp-1">{row.title}</div>
            <div className="text-[12px] text-slate-400 mt-0.5 tabular-nums">
              {row.version} • {row.model}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      cell: (row) => (
        <span className="text-[13px] text-slate-600 font-medium">{row.category}</span>
      ),
    },
    {
      header: 'Format',
      accessor: 'format',
      cell: (row) => (
        <Badge variant={row.format === 'PDF' ? 'danger' : 'electric'} size="sm">
          {row.format}
        </Badge>
      ),
    },
    {
      header: 'File Size',
      accessor: 'size',
      cell: (row) => (
        <span className="text-[13px] text-slate-500 tabular-nums font-medium">{row.size}</span>
      ),
    },
    {
      header: 'Version',
      accessor: 'version',
      cell: (row) => (
        <span className="text-[13px] text-slate-600 font-medium tabular-nums">{row.version}</span>
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
                label: 'View Resource',
                icon: Eye,
                onClick: () => handleOpenView(row),
              },
              {
                label: 'Edit Resource',
                icon: Edit2,
                onClick: () => handleOpenEdit(row),
              },
              {
                divider: true,
              },
              {
                label: 'Delete Resource',
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
            Technical Downloads
          </h2>
          <p className="text-[14px] text-slate-500 mt-1">
            Product datasheets, user manuals, engineering whitepapers, and firmware files
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Upload Document
        </Button>
      </div>

      {/* Main Content starts 32px below header */}
      <div className="mt-8">
        <DataTable
          columns={columns}
          data={downloads}
          isLoading={isLoading}
          searchPlaceholder="Search downloads by title, model, or document type..."
          searchValue={search}
          onSearchChange={setSearch}
          onRowClick={handleOpenView}
          filterControls={
            <div className="w-52">
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={[
                  { value: 'All Documents', label: 'All Documents' },
                  { value: 'Product Datasheets', label: 'Product Datasheets' },
                  { value: 'User Manuals', label: 'User Manuals' },
                  { value: 'Certificates & Compliance', label: 'Certificates' },
                  { value: 'Firmware & Software', label: 'Firmware & Software' },
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
        size="md"
        chip={
          drawerMode === 'view'
            ? `DOCUMENT • ${activeItem?.format?.toUpperCase() || 'PDF'}`
            : drawerMode === 'edit'
            ? 'EDIT RESOURCE'
            : 'UPLOAD RESOURCE'
        }
        title={
          drawerMode === 'view'
            ? activeItem?.title || 'Resource Details'
            : drawerMode === 'edit'
            ? `Edit: ${activeItem?.title || ''}`
            : 'Publish Technical Resource'
        }
        subtitle={
          drawerMode === 'view'
            ? `${activeItem?.category || 'Technical Document'} • ${activeItem?.size || 'PDF'}`
            : 'Upload or configure technical documentation, user manuals, and specifications'
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
                  updateDrawerUrl('edit', activeItem?.id);
                }}
              >
                Edit Resource
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
                  ? 'Publishing...'
                  : drawerMode === 'edit'
                  ? 'Save Changes'
                  : 'Publish Document'}
              </Button>
            </div>
          )
        }
      >
        {/* VIEW MODE */}
        {drawerMode === 'view' && activeItem && (
          <div className="space-y-5 animate-fade-in">
            {/* Key Figures Highlight Card (Iceblue) */}
            <div className="p-4 rounded-2xl bg-iceblue border border-[#0297DE]/20 flex items-center justify-around text-center">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  File Format
                </div>
                <div className="text-[20px] font-bold text-rose-600 mt-0.5">
                  {activeItem.format || 'PDF'}
                </div>
              </div>
              <div className="w-px h-8 bg-[#0297DE]/20" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  File Size
                </div>
                <div className="text-[18px] font-bold text-navy tabular-nums mt-0.5">
                  {activeItem.size || '2.4 MB'}
                </div>
              </div>
              <div className="w-px h-8 bg-[#0297DE]/20" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Revision
                </div>
                <div className="text-[16px] font-bold text-electric-600 tabular-nums mt-0.5">
                  {activeItem.version || 'Rev 1.0'}
                </div>
              </div>
            </div>

            {/* Document Details Table */}
            <DrawerSection title="DOCUMENT PARAMETERS">
              <div className="divide-y divide-slate-100 text-[13px]">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Document Title</span>
                  <span className="text-navy font-semibold text-right max-w-xs">{activeItem.title}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Classification</span>
                  <span className="text-navy font-semibold">{activeItem.category}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Applicable Inverters</span>
                  <span className="text-navy font-semibold">{activeItem.model || 'Universal'}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Revision Version</span>
                  <span className="text-navy font-semibold tabular-nums">{activeItem.version}</span>
                </div>
              </div>
            </DrawerSection>

            {/* Document Description */}
            <DrawerSection title="DOCUMENT CONTENT & AUDIENCE">
              <p className="text-[14px] text-slate-600 leading-relaxed">
                {activeItem.description || 'Full engineering datasheet containing technical specifications, electrical schematic diagrams, and compliance certificates for EPC installers.'}
              </p>
            </DrawerSection>
          </div>
        )}

        {/* EDIT / ADD MODE */}
        {drawerMode !== 'view' && (
          <form onSubmit={handleSave} className="space-y-5 animate-fade-in">
            <DrawerSection title="RESOURCE METADATA">
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Document Title <span className="text-cantaloupe-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g. Single-Phase Inverter Technical Datasheet 2024"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Resource Category"
                    required
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    options={[
                      { value: 'Product Datasheets', label: 'Product Datasheets' },
                      { value: 'User Manuals', label: 'User Manuals' },
                      { value: 'Certificates & Compliance', label: 'Certificates' },
                      { value: 'Firmware & Software', label: 'Firmware & Software' },
                    ]}
                  />

                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Target Equipment Model
                    </label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      placeholder="e.g. SD-SP-Series or Universal"
                      className="w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </DrawerSection>

            <DrawerSection title="FILE SPECIFICATIONS">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select
                  label="File Format"
                  required
                  value={formData.format}
                  onChange={(e) => handleInputChange('format', e.target.value)}
                  options={[
                    { value: 'PDF', label: 'PDF Document' },
                    { value: 'ZIP', label: 'ZIP Archive' },
                    { value: 'DOCX', label: 'Word Document' },
                    { value: 'BIN', label: 'Firmware Binary' },
                  ]}
                />

                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    File Size
                  </label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                    placeholder="e.g. 2.4 MB"
                    className="w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium tabular-nums border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Revision Tag
                  </label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => handleInputChange('version', e.target.value)}
                    placeholder="Rev 1.2"
                    className="w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium tabular-nums border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
                  />
                </div>
              </div>
            </DrawerSection>

            <DrawerSection title="SCOPE & DESCRIPTION">
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                  Document Scope & Content
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Summary of engineering diagrams, wiring tables, or firmware changelog..."
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
        title="Delete Technical Resource?"
        message={`Are you sure you want to remove "${deleteTarget?.title}"? EPC partners will no longer be able to download it.`}
        confirmText="Delete Document"
      />
    </div>
  );
}
