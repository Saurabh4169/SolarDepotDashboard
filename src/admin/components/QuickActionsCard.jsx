import React from 'react';
import { PlusCircle, FolderPlus, UploadCloud, UserPlus, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickActionsCard({
  onAddProduct,
  onAddProject,
  onUploadDatasheet,
  onAddCustomer,
}) {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Add Product',
      desc: 'Register solar inverter or battery unit',
      icon: PlusCircle,
      iconColor: 'text-electric-600',
      bgColor: 'bg-iceblue',
      action: onAddProduct || (() => navigate('/admin/products?action=create')),
    },
    {
      title: 'Add Project',
      desc: 'Publish verified installation case study',
      icon: FolderPlus,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      action: onAddProject || (() => navigate('/admin/projects?action=create')),
    },
    {
      title: 'Upload Datasheet',
      desc: 'Publish PDF manual or technical certificate',
      icon: UploadCloud,
      iconColor: 'text-cantaloupe-500',
      bgColor: 'bg-[#FC734D]/10',
      action: onUploadDatasheet || (() => navigate('/admin/downloads?action=upload')),
    },
    {
      title: 'Add Customer',
      desc: 'Register new EPC commercial partner',
      icon: UserPlus,
      iconColor: 'text-navy',
      bgColor: 'bg-slate-100',
      action: onAddCustomer || (() => navigate('/admin/customers?action=create')),
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#0297DE]/12 shadow-soft flex flex-col justify-between h-full">
      {/* Header */}
      <div className="pb-4 border-b border-slate-100">
        <h3 className="font-display text-[18px] font-semibold text-navy leading-tight">
          Quick Actions
        </h3>
        <p className="text-[14px] text-slate-500 mt-1">
          Publish catalog items and configure records
        </p>
      </div>

      {/* Action Rows */}
      <div className="space-y-2.5 my-3">
        {actions.map((act, index) => {
          const Icon = act.icon;
          return (
            <button
              key={index}
              type="button"
              onClick={act.action}
              className="w-full group flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-[#F7FAFC] hover:bg-iceblue/50 hover:border-[#0297DE]/25 transition-all text-left"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${act.bgColor}`}
                >
                  <Icon className={`w-5 h-5 ${act.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[14px] font-semibold text-navy group-hover:text-electric-600 transition-colors truncate">
                    {act.title}
                  </h4>
                  <p className="text-[13px] text-slate-500 truncate mt-0.5">
                    {act.desc}
                  </p>
                </div>
              </div>

              {/* Subtle Chevron instead of '+' */}
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-navy group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
