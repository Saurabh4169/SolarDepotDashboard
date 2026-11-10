import React from 'react';
import { PlusCircle, FolderPlus, Cpu, UserPlus, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickActionsCard({
  onAddProduct,
  onAddProject,
  onAddSolution,
  onAddCustomer,
}) {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Add Product',
      desc: 'Register solar inverter or battery unit',
      icon: PlusCircle,
      iconColor: 'text-[#0297DE]',
      bgColor: 'bg-[#E6F3FB] border border-[#0297DE]/20',
      action: onAddProduct || (() => navigate('/admin/products?action=create')),
    },
    {
      title: 'Add Project',
      desc: 'Publish verified installation case study',
      icon: FolderPlus,
      iconColor: 'text-[#10B981]',
      bgColor: 'bg-[#E5F7EE] border border-[#10B981]/20',
      action: onAddProject || (() => navigate('/admin/projects?action=create')),
    },
    {
      title: 'Add Solution',
      desc: 'Configure commercial solar system package',
      icon: Cpu,
      iconColor: 'text-[#FC734D]',
      bgColor: 'bg-[#FFEDE6] border border-[#FC734D]/20',
      action: onAddSolution || (() => navigate('/admin/solutions?action=create')),
    },
    {
      title: 'Add Customer',
      desc: 'Register new EPC commercial partner',
      icon: UserPlus,
      iconColor: 'text-[#8B5CF6]',
      bgColor: 'bg-[#F1E8FD] border border-[#8B5CF6]/20',
      action: onAddCustomer || (() => navigate('/admin/customers?action=create')),
    },
  ];

  return (
    <div className="glass-light glass-hover rounded-[20px] p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="pb-4 border-b border-[#071B2A]/[0.06]">
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
              className="w-full group flex items-center justify-between p-3 rounded-xl border border-[#0297DE]/10 bg-white/70 hover:bg-[#EAF6FC]/70 hover:border-[#0297DE]/30 transition-all text-left"
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
