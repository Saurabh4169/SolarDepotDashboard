import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Zap,
  MessageSquare,
  Cpu,
  Info,
  ChevronRight,
  PackageOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useApp();

  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const filtered = notifications.filter((n) =>
    filter === 'unread' ? n.unread : true
  );

  const getNotifIcon = (type) => {
    switch (type) {
      case 'product':
        return <Zap className="w-4 h-4 text-electric-500" />;
      case 'quote':
        return <MessageSquare className="w-4 h-4 text-cantaloupe-500" />;
      case 'system':
        return <Cpu className="w-4 h-4 text-emerald-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const handleNotificationClick = (item) => {
    markNotificationAsRead(item.id);
    if (item.targetRoute) {
      navigate(item.targetRoute);
    }
  };

  return (
    <div className="p-4 pb-12 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-electric-600 block">
            Updates & Alerts
          </span>
          <h1 className="font-display text-lg font-bold text-navy">
            Notifications
          </h1>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="text-xs font-bold text-electric-600 hover:text-electric-700 flex items-center gap-1 active:scale-95"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark all read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
            filter === 'all'
              ? 'bg-navy text-white'
              : 'text-slate-500 hover:text-navy'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
            filter === 'unread'
              ? 'bg-navy text-white'
              : 'text-slate-500 hover:text-navy'
          }`}
        >
          Unread ({notifications.filter((n) => n.unread).length})
        </button>
      </div>

      {/* Notification items */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description={
            filter === 'unread'
              ? 'You have caught up with all unread messages!'
              : 'No notification records currently stored.'
          }
        />
      ) : (
        <div className="space-y-2.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer group flex items-start gap-3 ${
                item.unread
                  ? 'bg-white border-electric-300 shadow-sm ring-1 ring-electric-500/10'
                  : 'bg-white/80 border-slate-100 hover:bg-white'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                {getNotifIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className="font-display text-xs font-bold text-navy truncate group-hover:text-electric-600 transition-colors">
                    {item.title}
                  </h4>
                  {item.unread && (
                    <span className="w-2 h-2 rounded-full bg-cantaloupe-500 shrink-0" />
                  )}
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-1.5 line-clamp-2">
                  {item.body}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{item.time}</span>
                  <span className="font-sans font-semibold text-electric-600 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    View <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

