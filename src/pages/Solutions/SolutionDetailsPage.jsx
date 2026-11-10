import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getSolutionBySlug,
  solutions,
} from '../../data/solutionsData';
import { getProductById } from '../../data/productsData';
import { getProjectBySlug } from '../../data/projectsData';
import {
  CheckCircle2,
  ShieldCheck,
  Layers,
  ArrowRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import ProductCard from '../../components/products/ProductCard';
import ProjectCard from '../../components/projects/ProjectCard';

export default function SolutionDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const solution = getSolutionBySlug(slug);

  if (!solution) {
    return (
      <div className="p-4">
        <EmptyState
          icon={Layers}
          title="Solution not found"
          description="The requested solar architecture plan could not be located."
          actionText="All Solutions"
          onAction={() => navigate('/solutions')}
        />
      </div>
    );
  }

  // Get matching products
  const matchedProducts = (solution.suitableProductIds || [])
    .map((id) => getProductById(id))
    .filter(Boolean);

  // Get matching projects
  const matchedProjects = (solution.relatedProjectSlugs || [])
    .map((s) => getProjectBySlug(s))
    .filter(Boolean);

  return (
    <div className="flex-1 flex flex-col min-h-full animate-fade-in relative">
      <div className="p-4 space-y-5 flex-1 pb-6">
        {/* Hero Banner */}
        <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-md bg-slate-900 border border-slate-200">
          <img
            src={solution.image}
            alt={solution.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-transparent" />

          <div className="absolute top-3 left-3">
            <Badge variant="dark" size="sm">
              {solution.shortName}
            </Badge>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h1 className="font-display text-base font-bold leading-tight">
              {solution.name}
            </h1>
          </div>
        </div>

        {/* Overview */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-2">
          <h3 className="font-display text-sm font-bold text-navy">
            System Overview
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {solution.description}
          </p>
        </div>

        {/* Benefits List */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
          <h3 className="font-display text-sm font-bold text-navy">
            Key Architectural Advantages
          </h3>
          <div className="space-y-2">
            {solution.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-cantaloupe-50 text-cantaloupe-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Highlights */}
        <div className="bg-gradient-to-br from-navy to-midnight rounded-2xl p-4 text-white shadow-md border border-electric-500/30 space-y-2.5">
          <div className="flex items-center gap-1.5 text-cantaloupe-400">
            <Sparkles className="w-4 h-4" />
            <span className="font-display text-xs font-bold uppercase tracking-wider">
              Engineering Specs
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-300 block">Typical Range</span>
              <span className="font-bold text-electric-300">1.5kW – 150kW</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-300 block">Grid Standards</span>
              <span className="font-bold text-electric-300">IEC 62109 / VDE</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-300 block">Backup Transfer</span>
              <span className="font-bold text-electric-300">&lt; 10ms UPS grade</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-300 block">Monitoring</span>
              <span className="font-bold text-electric-300">Cloud App / RS485</span>
            </div>
          </div>
        </div>

        {/* Recommended Inverters */}
        {matchedProducts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-navy">
                Compatible Inverters & Hardware
              </h3>
              <Link
                to="/products"
                className="text-xs font-bold text-electric-600 hover:text-electric-700"
              >
                View all
              </Link>
            </div>
            <div className="space-y-2.5">
              {matchedProducts.map((p) => (
                <ProductCard key={p.id} product={p} layout="horizontal" />
              ))}
            </div>
          </div>
        )}

        {/* Case Studies */}
        {matchedProjects.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-navy">
                Reference Installations
              </h3>
              <Link
                to="/projects"
                className="text-xs font-bold text-electric-600 hover:text-electric-700"
              >
                View portfolio
              </Link>
            </div>
            <div className="space-y-2.5">
              {matchedProjects.map((pr) => (
                <ProjectCard key={pr.id} project={pr} compact={true} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Quote CTA */}
      <div className="sticky bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center justify-between gap-3 z-30 shrink-0">
        <div className="min-w-0 pr-2">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
            Custom Engineering
          </span>
          <span className="text-xs font-bold text-navy truncate block">
            {solution.shortName} Proposal
          </span>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={MessageSquare}
          onClick={() =>
            navigate(
              `/request-quote?type=${encodeURIComponent(
                solution.name
              )}&solution=${encodeURIComponent(solution.name)}`
            )
          }
        >
          Request Quote
        </Button>
      </div>
    </div>
  );
}
