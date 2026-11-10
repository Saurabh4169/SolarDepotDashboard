import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Zap, Cpu, Layers, BatteryCharging, Grid, Wind, Activity } from 'lucide-react';

const iconMap = {
  Zap,
  Cpu,
  Layers,
  BatteryCharging,
  Grid,
  Wind,
  Activity,
};

export default function ProductCategoryCard({ category, compact = false }) {
  const navigate = useNavigate();
  const IconComponent = iconMap[category.icon] || Zap;

  const handleClick = () => {
    navigate(`/products?category=${category.slug}`);
  };

  if (compact) {
    return (
      <button
        onClick={handleClick}
        className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-electric-200 transition-all active:scale-95 group text-center shrink-0 w-24"
      >
        <div className="w-10 h-10 rounded-xl bg-electric-50 text-electric-600 flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:bg-electric-500 group-hover:text-white transition-all">
          <IconComponent className="w-5 h-5" />
        </div>
        <span className="text-[11px] font-bold text-navy line-clamp-1 group-hover:text-electric-600">
          {category.short}
        </span>
        <span className="text-[9px] text-slate-400 font-mono">
          {category.count} models
        </span>
      </button>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-electric-300 transition-all active:scale-[0.99] cursor-pointer group flex flex-col"
    >
      <div className="relative h-28 w-full overflow-hidden bg-slate-100">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-midnight/30 to-transparent" />
        
        <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
          <IconComponent className="w-4 h-4" />
        </div>

        <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between text-white">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-electric-500/80 backdrop-blur-sm px-2 py-0.5 rounded">
            {category.count} Products
          </span>
        </div>
      </div>

      <div className="p-3.5 flex items-center justify-between">
        <div>
          <h3 className="font-display text-xs font-bold text-navy group-hover:text-electric-600 transition-colors">
            {category.name}
          </h3>
          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
            {category.description}
          </p>
        </div>
        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-electric-500 group-hover:text-white transition-colors shrink-0 ml-2">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

