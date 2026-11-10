import React, { useState, useMemo } from 'react';
import { projects, projectCategories } from '../../data/projectsData';
import ProjectCard from '../../components/projects/ProjectCard';
import EmptyState from '../../components/common/EmptyState';
import ScrollReveal from '../../components/common/ScrollReveal';
import { FolderGit2 } from 'lucide-react';

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="p-4 pb-12 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-electric-600 block">
            Case Studies
          </span>
          <h1 className="font-display text-lg font-bold text-navy">
            Project Portfolio
          </h1>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {filteredProjects.length} Projects
        </span>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {projectCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              activeCategory === cat
                ? 'bg-electric-500 text-white shadow-glow'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Project Cards List */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No case studies found"
          description="Try selecting a different project category to view case studies."
          actionText="Show All Projects"
          onAction={() => setActiveCategory('All')}
        />
      ) : (
        <div className="space-y-3.5">
          {filteredProjects.map((proj, idx) => (
            <ScrollReveal key={proj.id} delay={idx * 80}>
              <ProjectCard project={proj} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}

