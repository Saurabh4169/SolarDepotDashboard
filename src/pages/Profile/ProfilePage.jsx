import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Heart,
  Scale,
  MessageSquare,
  FileDown,
  Headphones,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  Edit3,
  Camera,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/common/Badge';
import ScrollReveal from '../../components/common/ScrollReveal';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { userProfile, favorites, compareList, enquiries, showToast } = useApp();

  const handleLogout = () => {
    showToast('Demo session reset. Still logged in as preview partner.', 'info');
  };

  const menuSections = [
    {
      title: 'Activity & Workspace',
      items: [
        {
          label: 'Saved Inverters',
          icon: Heart,
          count: favorites.length,
          link: '/saved',
          color: 'text-cantaloupe-500 bg-orange-50',
        },
        {
          label: 'Product Comparisons',
          icon: Scale,
          count: compareList.length,
          link: '/compare',
          color: 'text-electric-500 bg-electric-50',
        },
        {
          label: 'My Enquiries & Quotes',
          icon: MessageSquare,
          count: enquiries.length,
          link: '/my-enquiries',
          color: 'text-purple-500 bg-purple-50',
        },
        {
          label: 'Technical Downloads',
          icon: FileDown,
          link: '/downloads',
          color: 'text-emerald-500 bg-emerald-50',
        },
      ],
    },
    {
      title: 'Preferences & Support',
      items: [
        {
          label: 'Notifications',
          icon: Bell,
          link: '/notifications',
          color: 'text-amber-500 bg-amber-50',
        },
        {
          label: 'Support & Verification Desk',
          icon: Headphones,
          link: '/support',
          color: 'text-blue-500 bg-blue-50',
        },
        {
          label: 'App Settings & Cache',
          icon: Settings,
          link: '/settings',
          color: 'text-slate-500 bg-slate-100',
        },
        {
          label: 'Admin Console (Desktop)',
          icon: ShieldCheck,
          link: '/admin',
          color: 'text-cantaloupe-600 bg-orange-50',
        },
      ],
    },
  ];

  return (
    <div className="p-4 pb-12 space-y-4 animate-fade-in">
      {/* Profile Card Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-electric-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-electric-600 to-electric-400 p-0.5 shadow-glow">
                <div className="w-full h-full rounded-[14px] bg-navy flex items-center justify-center text-white text-xl font-bold font-display">
                  {userProfile?.name?.charAt(0) || 'A'}
                </div>
              </div>

              {/* Camera icon in bottom right corner (design only) */}
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-tr from-cantaloupe-600 to-cantaloupe-500 text-white flex items-center justify-center shadow-md ring-2 ring-white"
                aria-hidden="true"
              >
                <Camera className="w-2.5 h-2.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-display text-base font-bold text-navy">
                  {userProfile?.name || 'Alex Morgan'}
                </h2>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-xs text-slate-500">
                {userProfile?.title || 'Lead Solar Solutions Engineer'}
              </p>
              <Badge variant="electric" size="xs" className="mt-1">
                {userProfile?.accountTier || 'Verified EPC Partner'}
              </Badge>
            </div>
          </div>

          <Link
            to="/edit-profile"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Edit Profile"
          >
            <Edit3 className="w-4 h-4" />
          </Link>
        </div>

        {/* Company & contact info */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-navy truncate">
              {userProfile?.company || 'Apex Energy Partners'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{userProfile?.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{userProfile?.phone}</span>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      {menuSections.map((section, sIdx) => (
        <ScrollReveal key={sIdx} delay={sIdx * 80}>
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
              {section.title}
            </span>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
              {section.items.map((item, iIdx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={iIdx}
                    to={item.link}
                    className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center shrink-0`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-navy group-hover:text-electric-600 transition-colors">
                        {item.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.count !== undefined && (
                        <span className="font-mono text-xs font-bold text-slate-400">
                          {item.count}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-electric-500 transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      ))}

      {/* Logout / Reset Demo */}
      <div className="pt-2">
        <button
          onClick={handleLogout}
          className="w-full p-3 rounded-2xl bg-white border border-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center gap-2 hover:bg-rose-50 active:scale-98 transition-all shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Reset Demo Session</span>
        </button>
      </div>
    </div>
  );
}

