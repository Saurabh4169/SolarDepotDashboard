import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getProjectBySlug,
  projects,
} from '../../data/projectsData';
import { getProductById } from '../../data/productsData';
import { getSolutionBySlug } from '../../data/solutionsData';
import {
  MapPin,
  Calendar,
  Zap,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  FolderGit2,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import ProductCard from '../../components/products/ProductCard';

export default function ProjectDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const project = getProjectBySlug(slug);

  if (!project) {
    return (
      <div className="p-4">
        <EmptyState
          icon={FolderGit2}
          title="Case study not found"
          description="The requested project installation record is not available."
          actionText="View Projects"
          onAction={() => navigate('/projects')}
        />
      </div>
    );
  }

  const associatedProducts = (project.associatedProductIds || [])
    .map((id) => getProductById(id))
    .filter(Boolean);

  const relatedSolution = project.relatedSolutionSlug
    ? getSolutionBySlug(project.relatedSolutionSlug)
    : null;

  return (
    <div className="flex-1 flex flex-col min-h-full animate-fade-in relative">
      <div className="p-4 space-y-5 flex-1 pb-6">
        {/* Main Image */}
        <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-md bg-slate-900 border border-slate-200">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/40 to-transparent" />

          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <Badge variant="electric" size="sm">
              {project.category}
            </Badge>
            <Badge variant="dark" size="sm">
              {project.year}
            </Badge>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-1 text-xs text-electric-300 font-semibold mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{project.location}</span>
            </div>
            <h1 className="font-display text-base font-bold leading-tight">
              {project.title}
            </h1>
          </div>
        </div>

        {/* Narrative Description */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-2">
          <h3 className="font-display text-sm font-bold text-navy">
            Installation Overview
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Technical Specifications Grid */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
          <h3 className="font-display text-sm font-bold text-navy flex items-center justify-between">
            <span>Project Engineering Specs</span>
            <span className="font-mono text-xs font-bold text-electric-600">
              {project.capacity}
            </span>
          </h3>

          <div className="grid grid-cols-2 gap-2">
            {project.details.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
                  {item.label}
                </span>
                <span className="font-display text-xs font-bold text-navy mt-0.5 block leading-tight">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Associated Inverters */}
        {associatedProducts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-navy">
                Inverters & Hardware Deployed
              </h3>
              <Link
                to="/products"
                className="text-xs font-bold text-electric-600 hover:text-electric-700"
              >
                All hardware
              </Link>
            </div>
            <div className="space-y-2.5">
              {associatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} layout="horizontal" />
              ))}
            </div>
          </div>
        )}

        {/* Related Solution link */}
        {relatedSolution && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-iceblue to-paleblue/50 border border-electric-200/70 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-electric-600">
                Underlying Architecture
              </span>
              <h4 className="text-xs font-bold text-navy mt-0.5">
                {relatedSolution.name}
              </h4>
            </div>
            <Button
              variant="secondary"
              size="xs"
              onClick={() => navigate(`/solutions/${relatedSolution.slug}`)}
            >
              Explore Architecture
            </Button>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center justify-between gap-3 z-30 shrink-0">
        <div className="min-w-0 pr-2">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
            Similar Requirements?
          </span>
          <span className="text-xs font-bold text-navy truncate block">
            Custom Site Sizing
          </span>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={MessageSquare}
          onClick={() =>
            navigate(
              `/request-quote?type=${encodeURIComponent(
                'Custom Project Proposal'
              )}&product=${encodeURIComponent(project.title)}`
            )
          }
        >
          Request Quote
        </Button>
      </div>
    </div>
  );
}
