import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Button from '../../components/common/Button';
import { User, Mail, Phone, Building2, MapPin, Save } from 'lucide-react';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { userProfile, updateUserProfile } = useApp();

  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    title: userProfile?.title || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    company: userProfile?.company || '',
    address: userProfile?.address || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    navigate('/profile');
  };

  return (
    <div className="p-4 pb-12 space-y-4 animate-fade-in">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-electric-600 block">
          Settings
        </span>
        <h1 className="font-display text-lg font-bold text-navy">
          Edit Partner Profile
        </h1>
        <p className="text-[11px] text-slate-500">
          Update your professional credentials and contact details for quote submissions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3.5">
        <div>
          <label className="block text-[11px] font-bold text-navy mb-1">
            Full Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:border-electric-500 bg-slate-50/50 text-xs text-navy focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-navy mb-1">
            Job Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:border-electric-500 bg-slate-50/50 text-xs text-navy focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-navy mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:border-electric-500 bg-slate-50/50 text-xs text-navy focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-navy mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:border-electric-500 bg-slate-50/50 text-xs text-navy focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-navy mb-1">
            Company Name
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:border-electric-500 bg-slate-50/50 text-xs text-navy focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-navy mb-1">
            Office / Business Address
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:border-electric-500 bg-slate-50/50 text-xs text-navy focus:outline-none"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="secondary"
            size="md"
            fullWidth
            icon={Save}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

