import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Zap,
  Layers,
  Scale,
  FileDown,
  MessageSquare,
  Headphones,
  ArrowRight,
  ShieldCheck,
  Sun,
  Award,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTimeGreeting } from '../../utils/formatters';
import { productCategories, getFeaturedProducts } from '../../data/productsData';
import { solutions } from '../../data/solutionsData';
import { projects } from '../../data/projectsData';
import { images } from '../../data/images';
import SectionHeader from '../../components/common/SectionHeader';
import ProductCategoryCard from '../../components/products/ProductCategoryCard';
import ProductCard from '../../components/products/ProductCard';
import SolutionCard from '../../components/solutions/SolutionCard';
import ProjectCard from '../../components/projects/ProjectCard';
import Button from '../../components/common/Button';
import ScrollReveal from '../../components/common/ScrollReveal';

export default function HomePage() {
  const navigate = useNavigate();
  const { userProfile, compareList } = useApp();
  const greeting = getTimeGreeting();
  const featuredProducts = getFeaturedProducts().slice(0, 4);
  const featuredSolutions = solutions.slice(0, 2);
  const featuredProjects = projects.slice(0, 2);

  const quickActions = [
    {
      title: 'Browse Products',
      icon: Zap,
      link: '/products',
      color: 'bg-electric-50 text-electric-600',
    },
    {
      title: 'Compare Inverters',
      icon: Scale,
      link: '/compare',
      color: 'bg-cantaloupe-50 text-cantaloupe-600',
      badge: compareList.length > 0 ? compareList.length : null,
    },
    {
      title: 'Download Datasheets',
      icon: FileDown,
      link: '/downloads',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Request a Quote',
      icon: MessageSquare,
      link: '/request-quote',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Contact Support',
      icon: Headphones,
      link: '/support',
      color: 'bg-slate-100 text-slate-700',
    },
  ];

  return (
    <div className="pb-8 space-y-6 animate-fade-in">
      {/* SECTION A: Welcome / Greeting Section */}
      <section className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-electric-600 font-semibold tracking-wide uppercase">
              <Sun className="w-3.5 h-3.5 animate-spin-slow text-cantaloupe-500" />
              <span>{greeting}</span>
            </div>
            <h1 className="font-display text-xl font-extrabold text-navy tracking-tight mt-0.5">
              {userProfile?.name || 'Solar Partner'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Powering tomorrow through intelligent solar innovation.
            </p>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-electric-600 to-electric-400 p-0.5 shadow-glow shrink-0">
            <div className="w-full h-full rounded-[14px] bg-navy flex items-center justify-center text-white font-bold text-sm font-display">
              {userProfile?.name?.charAt(0) || 'S'}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B: Featured Brand / Promotional Banner WITH GLOW & SHINE */}
      <section className="px-4">
        <ScrollReveal delay={50}>
          <div className="relative rounded-3xl overflow-hidden animate-hero-glow border border-electric-500/40 bg-midnight text-white min-h-[200px] flex flex-col justify-end p-5 group shadow-2xl">
            {/* Background Image */}
            <img
              src={images.heroInstall}
              alt="Intelligent Solar Innovation"
              className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity scale-105 group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/70 to-transparent" />

            {/* Glowing Ambient Light Orbs */}
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-electric-500/35 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div
              className="absolute -bottom-10 -left-10 w-40 h-40 bg-cantaloupe-500/25 rounded-full blur-3xl pointer-events-none animate-pulse"
              style={{ animationDelay: '2s' }}
            />

            {/* Shimmering Light Sweep Beam */}
            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
              <div className="w-[100px] h-[350%] bg-gradient-to-r from-transparent via-white/20 to-transparent absolute -top-1/2 left-0 animate-shimmer-sweep" />
            </div>

            {/* Radiant subtle border highlight */}
            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20 pointer-events-none" />

            {/* Banner content */}
            <div className="relative z-10 space-y-2.5">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-electric-500/30 backdrop-blur-md border border-electric-400/40 text-[10px] font-bold text-electric-200 uppercase tracking-widest shadow-sm">
                  15+ Years Engineering Excellence
                </span>
              </div>

              <h2 className="font-display text-lg font-bold leading-tight text-white drop-shadow-sm max-w-xs">
                Next-Gen Hybrid Inverters & Energy Storage
              </h2>

              <div className="pt-1 flex items-center gap-2.5">
                <Button
                  variant="primary"
                  size="sm"
                  iconRight={ArrowRight}
                  onClick={() => navigate('/products')}
                >
                  Explore Products
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 border border-white/20"
                  onClick={() => navigate('/solutions')}
                >
                  View Solutions
                </Button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION G: Quick Actions Carousel / Grid */}
      <section className="px-4">
        <ScrollReveal delay={100}>
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-2 py-1">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link
                  key={idx}
                  to={action.link}
                  className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md active:scale-95 transition-all text-center shrink-0 w-[72px] group relative"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mb-1 transition-transform group-hover:scale-110`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-navy leading-tight line-clamp-2">
                    {action.title.split(' ')[0]}
                  </span>
                  {action.badge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cantaloupe-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                      {action.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION C: Product Categories */}
      <section className="px-4">
        <ScrollReveal delay={120}>
          <SectionHeader
            eyebrow="Portfolio"
            title="Product Categories"
            actionText="View All"
            actionLink="/categories"
          />
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {productCategories.map((category) => (
              <ProductCategoryCard
                key={category.slug}
                category={category}
                compact={true}
              />
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION D: Featured Products with Staggered Scroll Animation */}
      <section className="px-4">
        <SectionHeader
          eyebrow="Engineered Systems"
          title="Featured Inverters"
          actionText="All Models"
          actionLink="/products"
        />
        <div className="grid grid-cols-2 gap-3">
          {featuredProducts.map((product, idx) => (
            <ScrollReveal key={product.id} delay={idx * 75}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* SECTION E: Solar Solutions with Smooth Opening Animation */}
      <section className="px-4">
        <SectionHeader
          eyebrow="Architectures"
          title="Intelligent Solar Solutions"
          actionText="Explore All"
          actionLink="/solutions"
        />
        <div className="space-y-3">
          {featuredSolutions.map((solution, idx) => (
            <ScrollReveal key={solution.id} delay={idx * 90}>
              <SolutionCard solution={solution} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* SECTION F: Featured Projects */}
      <section className="px-4">
        <SectionHeader
          eyebrow="Case Studies"
          title="Featured Installations"
          actionText="Portfolio"
          actionLink="/projects"
        />
        <div className="space-y-3">
          {featuredProjects.map((project, idx) => (
            <ScrollReveal key={project.id} delay={idx * 90}>
              <ProjectCard project={project} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Enterprise Engineering Callout */}
      <section className="px-4">
        <ScrollReveal delay={100}>
          <div className="p-4 rounded-3xl bg-gradient-to-br from-navy to-midnight text-white flex items-center justify-between border border-electric-500/20 shadow-md">
            <div className="pr-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cantaloupe-400">
                Need System Sizing?
              </span>
              <h4 className="font-display text-sm font-bold mt-0.5">
                Request a Custom Quote
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                Commercial and residential proposals prepared within 24 hours.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/request-quote')}
              className="shrink-0"
            >
              Get Quote
            </Button>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
