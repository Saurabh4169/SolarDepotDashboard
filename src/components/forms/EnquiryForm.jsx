import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Upload, CheckCircle2, AlertCircle, FileCheck, ArrowRight, Home } from 'lucide-react';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';
import { validateEnquiryForm } from '../../utils/validators';
import { products } from '../../data/productsData';
import { solutions } from '../../data/solutionsData';

export default function EnquiryForm({ initialSelection = '', initialType = 'Product Quote' }) {
  const navigate = useNavigate();
  const { userProfile, submitEnquiry, showToast } = useApp();

  const [formData, setFormData] = useState({
    firstName: userProfile?.name?.split(' ')[0] || '',
    lastName: userProfile?.name?.split(' ')[1] || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    company: userProfile?.company || '',
    enquiryType: initialType,
    productOrSolution: initialSelection || 'SD-HY-5K (Hybrid Inverter 5kW)',
    capacity: '5 kW',
    quantity: '1',
    projectType: 'Residential Rooftop',
    message: '',
    attachment: null,
  });

  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const enquiryTypes = [
    'Product Quote',
    'System Design Consultation',
    'Commercial Project Proposal',
    'Technical Support',
    'EPC / Distributor Partnership',
  ];

  const projectTypes = [
    'Residential Rooftop',
    'Commercial Warehouse / Office',
    'Agricultural & Farm Storage',
    'Utility-Scale Ground Mount',
    'Off-Grid / Islanded Site',
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('File size must be under 10MB', 'warning');
        return;
      }
      setFormData((prev) => ({
        ...prev,
        attachment: {
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        },
      }));
      showToast(`Attached: ${file.name}`, 'info');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateEnquiryForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const createdRecord = submitEnquiry(formData);
      setSubmittedData(createdRecord);
      setIsSubmitting(false);
      showToast('Demo Enquiry submitted successfully!', 'success');
    }, 800);
  };

  // Demo Confirmation View
  if (submittedData) {
    return (
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-md text-center animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50/50">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
          Demo Submission Recorded
        </span>

        <h3 className="font-display text-lg font-bold text-navy mt-2 mb-1">
          Thank you, {submittedData.contact.name}!
        </h3>

        <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed mb-4">
          Your quote enquiry has been processed into the local mobile application demo record.
        </p>

        {/* Reference Box */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-left text-xs mb-5 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-400 font-medium">Demo Reference ID:</span>
            <span className="font-mono font-bold text-electric-600">{submittedData.id}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Selected Item:</span>
            <span className="font-semibold text-navy truncate max-w-[180px]">{submittedData.productOrSolution}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Project Type:</span>
            <span className="font-semibold text-navy">{submittedData.projectType}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Capacity / Qty:</span>
            <span className="font-mono text-navy">{submittedData.capacity} • {submittedData.quantity}</span>
          </div>
        </div>

        {/* Demo Disclaimer notice */}
        <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-[11px] text-amber-800 text-left mb-5 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Frontend Simulation Notice:</strong> This project is currently running in client-side preview mode without a live backend API. No actual email or external request was transmitted to Solar Depot.
          </p>
        </div>

        {/* Navigation CTAs */}
        <div className="space-y-2">
          <Button
            variant="secondary"
            size="md"
            fullWidth
            icon={ArrowRight}
            onClick={() => navigate('/my-enquiries')}
          >
            View in My Enquiries History
          </Button>

          <Button
            variant="outline"
            size="md"
            fullWidth
            icon={Home}
            onClick={() => navigate('/')}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
      {/* Notice header */}
      <div className="bg-electric-50/70 p-3 rounded-2xl border border-electric-100 text-xs text-electric-900 flex items-start gap-2.5">
        <Send className="w-4 h-4 text-electric-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Engineering & Quote Consultation</span>
          <span className="text-[11px] text-electric-700">
            Provide system parameters below. All enquiries are validated client-side for demonstration.
          </span>
        </div>
      </div>

      {/* Name fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-navy mb-1">
            First Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="John"
            className={`w-full h-10 px-3 rounded-xl border text-xs text-navy focus:outline-none transition-all ${
              errors.firstName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 focus:border-electric-500 bg-slate-50/50'
            }`}
          />
          {errors.firstName && (
            <span className="text-[10px] text-rose-500 font-medium mt-1 block">
              {errors.firstName}
            </span>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-bold text-navy mb-1">
            Last Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="Doe"
            className={`w-full h-10 px-3 rounded-xl border text-xs text-navy focus:outline-none transition-all ${
              errors.lastName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 focus:border-electric-500 bg-slate-50/50'
            }`}
          />
          {errors.lastName && (
            <span className="text-[10px] text-rose-500 font-medium mt-1 block">
              {errors.lastName}
            </span>
          )}
        </div>
      </div>

      {/* Contact fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-navy mb-1">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="johndoe@example.com"
            className={`w-full h-10 px-3 rounded-xl border text-xs text-navy focus:outline-none transition-all ${
              errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 focus:border-electric-500 bg-slate-50/50'
            }`}
          />
          {errors.email && (
            <span className="text-[10px] text-rose-500 font-medium mt-1 block">
              {errors.email}
            </span>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-bold text-navy mb-1">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 000-0000"
            className={`w-full h-10 px-3 rounded-xl border text-xs text-navy focus:outline-none transition-all ${
              errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 focus:border-electric-500 bg-slate-50/50'
            }`}
          />
          {errors.phone && (
            <span className="text-[10px] text-rose-500 font-medium mt-1 block">
              {errors.phone}
            </span>
          )}
        </div>
      </div>

      {/* Company Name */}
      <div>
        <label className="block text-[11px] font-bold text-navy mb-1">
          Company / Organization <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => handleChange('company', e.target.value)}
          placeholder="Apex Clean Energy"
          className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:border-electric-500 bg-slate-50/50 text-xs text-navy focus:outline-none"
        />
      </div>

      {/* Enquiry Type Dropdown */}
      <div>
        <label className="block text-[11px] font-bold text-navy mb-1">
          Enquiry Purpose <span className="text-rose-500">*</span>
        </label>
        <select
          value={formData.enquiryType}
          onChange={(e) => handleChange('enquiryType', e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:border-electric-500 bg-slate-50/50 text-xs text-navy focus:outline-none cursor-pointer"
        >
          {enquiryTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Product or Solution Selection */}
      <div>
        <label className="block text-[11px] font-bold text-navy mb-1">
          Target Product or Solution
        </label>
        <select
          value={formData.productOrSolution}
          onChange={(e) => handleChange('productOrSolution', e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:border-electric-500 bg-slate-50/50 text-xs text-navy focus:outline-none cursor-pointer"
        >
          <optgroup label="Inverters & Hardware">
            {products.map((p) => (
              <option key={p.id} value={`${p.model} (${p.name})`}>
                {p.model} — {p.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Integrated Solar Solutions">
            {solutions.map((s) => (
              <option key={s.id} value={s.name}>
                Solution: {s.name}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Capacity & Quantity & Project Type */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-[10px] font-bold text-navy mb-1">
            Capacity
          </label>
          <input
            type="text"
            value={formData.capacity}
            onChange={(e) => handleChange('capacity', e.target.value)}
            placeholder="e.g. 10 kW"
            className="w-full h-10 px-2 rounded-xl border border-slate-200 focus:border-electric-500 bg-slate-50/50 text-xs text-navy focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-navy mb-1">
            Quantity
          </label>
          <input
            type="text"
            value={formData.quantity}
            onChange={(e) => handleChange('quantity', e.target.value)}
            placeholder="1"
            className="w-full h-10 px-2 rounded-xl border border-slate-200 focus:border-electric-500 bg-slate-50/50 text-xs text-navy focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-navy mb-1">
            Project
          </label>
          <select
            value={formData.projectType}
            onChange={(e) => handleChange('projectType', e.target.value)}
            className="w-full h-10 px-1 rounded-xl border border-slate-200 focus:border-electric-500 bg-slate-50/50 text-[11px] text-navy focus:outline-none cursor-pointer"
          >
            {projectTypes.map((pt) => (
              <option key={pt} value={pt}>
                {pt.split(' ')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message / Requirements */}
      <div>
        <label className="block text-[11px] font-bold text-navy mb-1">
          Requirements / Scope <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={3}
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder="Describe your site parameters, grid voltage (e.g. 240V or 480V), storage requirements..."
          className={`w-full p-3 rounded-xl border text-xs text-navy focus:outline-none transition-all resize-none ${
            errors.message ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 focus:border-electric-500 bg-slate-50/50'
          }`}
        />
        {errors.message && (
          <span className="text-[10px] text-rose-500 font-medium mt-1 block">
            {errors.message}
          </span>
        )}
      </div>

      {/* Attachment Upload Simulation */}
      <div>
        <label className="block text-[11px] font-bold text-navy mb-1">
          Single-Line Diagram or Site Plan <span className="text-slate-400 font-normal">(Optional, max 10MB)</span>
        </label>
        {formData.attachment ? (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <div className="flex items-center gap-2 truncate">
              <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-navy truncate">{formData.attachment.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">({formData.attachment.size})</span>
            </div>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, attachment: null }))}
              className="text-[11px] font-bold text-rose-500 hover:text-rose-600"
            >
              Remove
            </button>
          </div>
        ) : (
          <label className="flex items-center justify-center gap-2 h-11 px-3 rounded-xl border border-dashed border-slate-300 hover:border-electric-400 bg-slate-50/50 text-xs text-slate-600 hover:text-electric-600 cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-slate-400" />
            <span>Select PDF, DWG or image</span>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.dwg"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={isSubmitting}
        icon={Send}
      >
        {isSubmitting ? 'Validating & Submitting...' : 'Submit Quote Request'}
      </Button>
    </form>
  );
}

