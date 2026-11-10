import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Plus,
  X,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';

export default function MyEnquiriesPage() {
  const navigate = useNavigate();
  const { enquiries } = useApp();
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Quote Prepared':
        return 'emerald';
      case 'Engineering Review':
        return 'amber';
      case 'Completed':
        return 'electric';
      default:
        return 'dark';
    }
  };

  return (
    <div className="p-4 pb-12 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-electric-600 block">
            Demo History
          </span>
          <h1 className="font-display text-lg font-bold text-navy">
            My Enquiries & Quotes
          </h1>
        </div>

        <Button
          variant="primary"
          size="xs"
          icon={Plus}
          onClick={() => navigate('/request-quote')}
        >
          New Quote
        </Button>
      </div>

      {/* Demo disclaimer notice banner */}
      <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
        <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
        <span>
          These records represent local simulated demo enquiries for demonstration and workflow preview.
        </span>
      </div>

      {enquiries.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No enquiries submitted"
          description="Submit a quote request to review pricing, design feasibility, and technical specifications."
          actionText="Request a Quote"
          onAction={() => navigate('/request-quote')}
        />
      ) : (
        <div className="space-y-3">
          {enquiries.map((enq) => (
            <div
              key={enq.id}
              onClick={() => setSelectedEnquiry(enq)}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-electric-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-electric-600">
                  {enq.id}
                </span>
                <Badge variant={getStatusBadgeVariant(enq.status)} size="xs">
                  {enq.status}
                </Badge>
              </div>

              <h4 className="font-display text-xs font-bold text-navy group-hover:text-electric-600 transition-colors line-clamp-1 mb-1">
                {enq.productOrSolution}
              </h4>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <span>{enq.projectType}</span>
                <span className="font-mono text-slate-400">{enq.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-4 bg-navy text-white flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] text-electric-400 font-mono block">
                  {selectedEnquiry.id}
                </span>
                <h3 className="font-display text-sm font-bold">
                  Enquiry Record
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Status</span>
                <Badge
                  variant={getStatusBadgeVariant(selectedEnquiry.status)}
                  size="sm"
                >
                  {selectedEnquiry.status}
                </Badge>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Date:</span>
                  <span className="font-semibold text-navy">{selectedEnquiry.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Type:</span>
                  <span className="font-semibold text-navy">{selectedEnquiry.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Equipment:</span>
                  <span className="font-semibold text-navy text-right max-w-[180px] truncate">
                    {selectedEnquiry.productOrSolution}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Capacity / Qty:</span>
                  <span className="font-semibold text-navy">
                    {selectedEnquiry.capacity} • {selectedEnquiry.quantity}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-navy uppercase tracking-wider block mb-1">
                  Contact Details
                </span>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-slate-600">
                  <div className="font-bold text-navy">{selectedEnquiry.contact.name}</div>
                  <div>{selectedEnquiry.contact.email}</div>
                  <div>{selectedEnquiry.contact.phone}</div>
                </div>
              </div>

              {selectedEnquiry.notes && (
                <div>
                  <span className="text-[11px] font-bold text-navy uppercase tracking-wider block mb-1">
                    Requirements Note
                  </span>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 leading-relaxed">
                    {selectedEnquiry.notes}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200">
              <Button
                variant="navy"
                size="sm"
                fullWidth
                onClick={() => setSelectedEnquiry(null)}
              >
                Close Record
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

