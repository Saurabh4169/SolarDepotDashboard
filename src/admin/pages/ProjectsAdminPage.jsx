import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Edit2, Trash2, FolderKanban, Eye, MapPin, Calendar, Zap, ImageIcon } from 'lucide-react';
import DataTable from '../components/DataTable';
import ActionMenu from '../components/ActionMenu';
import Drawer, { DrawerSection } from '../components/Drawer';
import ConfirmDialog from '../components/ConfirmDialog';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Select from '../components/Select';
import { useAdmin } from '../context/AdminContext';
import { useAdminData } from '../context/AdminDataContext';
import { projectsService } from '../services/projectsService';

export default function ProjectsAdminPage() {
  const { showAdminToast } = useAdmin();
  const { getCachedData, setCachedData, getPageState, setPageState } = useAdminData();
  const [searchParams, setSearchParams] = useSearchParams();

  const savedState = getPageState('projects', { search: '', selectedCategory: 'All' });
  const cachedProjects = getCachedData('projects');
  const [projects, setProjects] = useState(cachedProjects || []);
  const [isLoading, setIsLoading] = useState(!cachedProjects);
  const [search, setSearch] = useState(savedState.search);
  const [selectedCategory, setSelectedCategory] = useState(savedState.selectedCategory);

  useEffect(() => {
    setPageState('projects', { search, selectedCategory });
  }, [search, selectedCategory, setPageState]);

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('view'); // 'view' | 'edit' | 'add'
  const [activeProject, setActiveProject] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Commercial',
    location: 'California, USA',
    year: '2024',
    capacity: '60 kW',
    image: '/images/projects/project-office-50kw.jpg',
    excerpt: '',
    description: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      if (!getCachedData('projects')) {
        setIsLoading(true);
      }
      const data = await projectsService.getAll({
        search,
        category: selectedCategory,
      });
      setProjects(data);
      setCachedData('projects', data);
      return data;
    } catch (err) {
      showAdminToast('Failed to load projects', 'error');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedCategory, showAdminToast, getCachedData, setCachedData]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // URL Sync
  useEffect(() => {
    const drawerParam = searchParams.get('drawer') || (searchParams.get('action') === 'create' ? 'add' : null);
    const idParam = searchParams.get('id');

    if (projects.length === 0) return;

    if (drawerParam === 'add') {
      setDrawerMode('add');
      setActiveProject(null);
      setFormData({
        title: '',
        category: 'Commercial',
        location: 'California, USA',
        year: new Date().getFullYear().toString(),
        capacity: '60 kW',
        image: '/images/projects/project-office-50kw.jpg',
        excerpt: '',
        description: '',
      });
      setIsDirty(false);
      setIsDrawerOpen(true);
    } else if ((drawerParam === 'view' || drawerParam === 'edit') && idParam) {
      const found = projects.find(
        (p) => String(p.id) === String(idParam) || String(p.slug) === String(idParam)
      );
      if (found) {
        setActiveProject(found);
        setFormData({
          title: found.title || '',
          category: found.category || 'Commercial',
          location: found.location || '',
          year: found.year || '2024',
          capacity: found.capacity || '',
          image: found.image || '/images/projects/project-office-50kw.jpg',
          excerpt: found.excerpt || '',
          description: found.description || '',
        });
        setDrawerMode(drawerParam);
        setIsDirty(false);
        setIsDrawerOpen(true);
      }
    }
  }, [searchParams, projects]);

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
    setActiveProject(null);
    setFormData({
      title: '',
      category: 'Commercial',
      location: 'California, USA',
      year: new Date().getFullYear().toString(),
      capacity: '60 kW',
      image: '/images/projects/project-office-50kw.jpg',
      excerpt: '',
      description: '',
    });
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('add');
  };

  const handleOpenView = (proj) => {
    setActiveProject(proj);
    setDrawerMode('view');
    setFormData({
      title: proj.title || '',
      category: proj.category || 'Commercial',
      location: proj.location || '',
      year: proj.year || '2024',
      capacity: proj.capacity || '',
      image: proj.image || '/images/projects/project-office-50kw.jpg',
      excerpt: proj.excerpt || '',
      description: proj.description || '',
    });
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('view', proj.id || proj.slug);
  };

  const handleOpenEdit = (proj) => {
    setActiveProject(proj);
    setDrawerMode('edit');
    setFormData({
      title: proj.title || '',
      category: proj.category || 'Commercial',
      location: proj.location || '',
      year: proj.year || '2024',
      capacity: proj.capacity || '',
      image: proj.image || '/images/projects/project-office-50kw.jpg',
      excerpt: proj.excerpt || '',
      description: proj.description || '',
    });
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('edit', proj.id || proj.slug);
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
    if (!formData.title.trim()) errors.title = 'Project title is required';
    if (!formData.capacity.trim()) errors.capacity = 'Capacity is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showAdminToast('Please correct highlighted fields', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      if (drawerMode === 'edit' && activeProject) {
        await projectsService.update(activeProject.id, formData);
        showAdminToast(`Updated project "${formData.title}"`, 'success');
      } else {
        await projectsService.create(formData);
        showAdminToast(`Created project "${formData.title}"`, 'success');
      }
      setIsDirty(false);
      handleCloseDrawer();
      loadProjects();
    } catch (err) {
      showAdminToast(err.message || 'Error saving project', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await projectsService.remove(deleteTarget.id);
      showAdminToast(`Project "${deleteTarget.title}" deleted`, 'success');
      setDeleteTarget(null);
      if (activeProject?.id === deleteTarget.id) {
        handleCloseDrawer();
      }
      loadProjects();
    } catch (err) {
      showAdminToast(err.message || 'Error deleting project', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Case Study Project',
      accessor: 'title',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
            <img
              src={row.image || '/images/projects/project-office-50kw.jpg'}
              alt={row.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=120&q=80';
              }}
            />
          </div>
          <div>
            <div className="font-semibold text-navy text-[14px] line-clamp-1">{row.title}</div>
            <div className="text-[12px] text-slate-400 mt-0.5 flex items-center gap-1.5">
              <span>{row.location}</span>
              <span>•</span>
              <span className="tabular-nums">{row.year}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      cell: (row) => (
        <Badge variant={row.category === 'Utility' ? 'electric' : 'emerald'} size="sm">
          {row.category}
        </Badge>
      ),
    },
    {
      header: 'Capacity',
      accessor: 'capacity',
      cell: (row) => (
        <span className="text-[14px] font-semibold text-navy tabular-nums">
          {row.capacity}
        </span>
      ),
    },
    {
      header: 'Location',
      accessor: 'location',
      cell: (row) => <span className="text-[13px] text-slate-600">{row.location}</span>,
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
                label: 'View Project',
                icon: Eye,
                onClick: () => handleOpenView(row),
              },
              {
                label: 'Edit Project',
                icon: Edit2,
                onClick: () => handleOpenEdit(row),
              },
              {
                divider: true,
              },
              {
                label: 'Delete Project',
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
            Projects
          </h2>
          <p className="text-[14px] text-slate-500 mt-1">
            Commercial and residential solar installations, EPC case studies, and performance data
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Add Project
        </Button>
      </div>

      {/* Main Content starts 32px below header */}
      <div className="mt-8">
        <DataTable
          columns={columns}
          data={projects}
          isLoading={isLoading}
          searchPlaceholder="Search case studies by name, location, or capacity..."
          searchValue={search}
          onSearchChange={setSearch}
          onRowClick={handleOpenView}
          filterControls={
            <div className="w-48">
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={[
                  { value: 'All', label: 'All Categories' },
                  { value: 'Commercial', label: 'Commercial' },
                  { value: 'Residential', label: 'Residential' },
                  { value: 'Utility', label: 'Utility Scale' },
                  { value: 'Industrial', label: 'Industrial' },
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
            ? `CASE STUDY • ${activeProject?.category?.toUpperCase() || 'PROJECT'}`
            : drawerMode === 'edit'
            ? 'EDIT CASE STUDY'
            : 'NEW CASE STUDY'
        }
        title={
          drawerMode === 'view'
            ? activeProject?.title || 'Project Details'
            : drawerMode === 'edit'
            ? `Edit: ${activeProject?.title || ''}`
            : 'Add Solar Case Study'
        }
        subtitle={
          drawerMode === 'view'
            ? `${activeProject?.capacity || ''} • ${activeProject?.location || ''}`
            : 'Configure EPC project installation data, capacity, and field photo'
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
                  updateDrawerUrl('edit', activeProject?.id || activeProject?.slug);
                }}
              >
                Edit Project
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
                  : 'Add Project'}
              </Button>
            </div>
          )
        }
      >
        {/* VIEW MODE */}
        {drawerMode === 'view' && activeProject && (
          <div className="space-y-5 animate-fade-in">
            {/* Project Photo Card */}
            <DrawerSection title="FIELD PHOTO & DEPLOYMENT">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={activeProject.image || '/images/projects/project-office-50kw.jpg'}
                  alt={activeProject.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-navy/70 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide tabular-nums">
                  1 of 1 Photo
                </div>
              </div>
            </DrawerSection>

            {/* Key Figures Highlight Card (Iceblue) */}
            <div className="p-4 rounded-2xl bg-iceblue border border-[#0297DE]/20 flex items-center justify-around text-center">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Installed Scale
                </div>
                <div className="text-[20px] font-bold text-navy tabular-nums mt-0.5">
                  {activeProject.capacity}
                </div>
              </div>
              <div className="w-px h-8 bg-[#0297DE]/20" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Commission Year
                </div>
                <div className="text-[18px] font-bold text-electric-600 tabular-nums mt-0.5">
                  {activeProject.year}
                </div>
              </div>
              <div className="w-px h-8 bg-[#0297DE]/20" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Sector
                </div>
                <div className="text-[16px] font-bold text-navy mt-0.5">
                  {activeProject.category}
                </div>
              </div>
            </div>

            {/* Project Specs Table */}
            <DrawerSection title="INSTALLATION SPECIFICATIONS">
              <div className="divide-y divide-slate-100 text-[13px]">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Project Name</span>
                  <span className="text-navy font-semibold text-right">{activeProject.title}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Location</span>
                  <span className="text-navy font-semibold">{activeProject.location}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">System Capacity</span>
                  <span className="text-navy font-semibold tabular-nums">{activeProject.capacity}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Project Classification</span>
                  <span className="text-navy font-semibold">{activeProject.category}</span>
                </div>
              </div>
            </DrawerSection>

            {/* Scope / Excerpt */}
            {(activeProject.excerpt || activeProject.description) && (
              <DrawerSection title="CASE STUDY NARRATIVE">
                {activeProject.excerpt && (
                  <p className="text-[14px] font-medium text-navy mb-2">
                    {activeProject.excerpt}
                  </p>
                )}
                {activeProject.description && (
                  <p className="text-[13px] text-slate-600 leading-relaxed">
                    {activeProject.description}
                  </p>
                )}
              </DrawerSection>
            )}
          </div>
        )}

        {/* EDIT / ADD MODE */}
        {drawerMode !== 'view' && (
          <form onSubmit={handleSave} className="space-y-5 animate-fade-in">
            <DrawerSection title="BASIC INFORMATION">
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Project Title <span className="text-cantaloupe-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g. Modern Office Rooftop Solar 50kW"
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
                    label="Installation Category"
                    required
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    options={[
                      { value: 'Commercial', label: 'Commercial' },
                      { value: 'Residential', label: 'Residential' },
                      { value: 'Utility', label: 'Utility Scale' },
                      { value: 'Industrial', label: 'Industrial' },
                    ]}
                  />

                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      System Scale / Capacity <span className="text-cantaloupe-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange('capacity', e.target.value)}
                      placeholder="e.g. 50 kW or 2.5 MW"
                      className={`
                        w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium tabular-nums
                        border border-slate-200 hover:border-slate-300
                        focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500
                        transition-all
                        ${formErrors.capacity ? 'border-rose-400 focus:border-rose-500' : ''}
                      `}
                    />
                    {formErrors.capacity && (
                      <p className="mt-1 text-[12px] text-rose-600 font-medium">{formErrors.capacity}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Location / Region
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g. San Diego, California"
                      className="w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Commission Year
                    </label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      placeholder="2024"
                      className="w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium tabular-nums border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </DrawerSection>

            {/* Section 2: Media */}
            <DrawerSection title="PROJECT PHOTOGRAPHY">
              <div className="space-y-3">
                <label className="block text-[13px] font-semibold text-slate-700">
                  Field Photo URL
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder="/images/projects/project-office-50kw.jpg or https://..."
                    className="flex-1 h-11 px-3.5 rounded-xl bg-white text-navy text-[13px] tabular-nums border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
                  />
                </div>
              </div>
            </DrawerSection>

            {/* Section 3: Narrative */}
            <DrawerSection title="NARRATIVE & METRICS">
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Executive Summary / Excerpt
                  </label>
                  <input
                    type="text"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="Short key takeaways of this solar deployment..."
                    className="w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Case Study Details
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Complete breakdown of equipment used, inverters deployed, grid tie details..."
                    className="w-full p-3.5 rounded-xl bg-white text-navy text-[14px] border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all resize-y min-h-[100px] max-h-[220px]"
                  />
                </div>
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
        title="Delete Case Study Project?"
        message={`Are you sure you want to remove "${deleteTarget?.title}"? This case study will be unlisted from the platform.`}
        confirmText="Delete Project"
      />
    </div>
  );
}
