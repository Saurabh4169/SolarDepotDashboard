import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Zap } from 'lucide-react';
import Badge from '../common/Badge';

export default function ProjectCard({ project, compact = false }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/projects/${project.slug}`);
  };

  const getCategoryVariant = (cat) => {
    switch (cat) {
      case 'Commercial':
        return 'electric';
      case 'Residential':
        return 'cantaloupe';
      case 'Utility':
        return 'emerald';
      case 'Hybrid':
        return 'dark';
      default:
        return 'slate';
    }
  };

  if (compact) {
    return (
      <div
        onClick={handleClick}
        className="w-full bg-white rounded-2xl p-3 border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer flex gap-3 group"
      >
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <Badge variant={getCategoryVariant(project.category)} size="xs">
                {project.category}
              </Badge>
              <span className="text-[10px] font-mono text-slate-400">
                {project.year}
              </span>
            </div>
            <h4 className="font-display text-xs font-bold text-navy truncate group-hover:text-electric-600 transition-colors">
              {project.title}
            </h4>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{project.location}</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
            <span className="font-semibold text-electric-600 font-mono">
              {project.capacity}
            </span>
            <span className="font-bold text-electric-600 flex items-center gap-0.5">
              Details <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer group flex flex-col"
    >
      <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-midnight/25 to-transparent" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <Badge variant={getCategoryVariant(project.category)} size="xs">
            {project.category}
          </Badge>
          <span className="text-[10px] font-mono font-medium text-white/90 bg-midnight/70 backdrop-blur-md px-2 py-0.5 rounded-full">
            {project.year}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-display text-base font-bold tracking-tight text-white leading-snug drop-shadow-sm line-clamp-1">
            {project.title}
          </h3>
        </div>
      </div>

      <div className="p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1 min-w-0 pr-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{project.location}</span>
          </div>
          <span className="font-mono font-bold text-electric-600 shrink-0">
            {project.capacity}
          </span>
        </div>

        <div className="pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            Verified Installation
          </span>
          <div className="flex items-center gap-1 text-xs font-bold text-electric-600 group-hover:translate-x-1 transition-transform">
            <span>Case Study</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

