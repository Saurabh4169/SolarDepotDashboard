import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Send,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Headphones,
} from 'lucide-react';
import { companyData } from '../../data/companyData';
import { solarFaqs } from '../../data/demoData';
import Button from '../../components/common/Button';
import { useApp } from '../../context/AppContext';

export default function SupportPage() {
  const { showToast } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Quick ticket form state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      showToast('Please fill out the ticket subject and message', 'warning');
      return;
    }
    setTicketSubmitted(true);
    showToast('Support ticket logged in demo queue', 'success');
    setTimeout(() => {
      setTicketSubject('');
      setTicketMessage('');
      setTicketSubmitted(false);
    }, 3000);
  };

  return (
    <div className="p-4 pb-12 space-y-4 animate-fade-in">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-electric-600 block">
          Assistance & Engineering
        </span>
        <h1 className="font-display text-lg font-bold text-navy">
          Support & Contact
        </h1>
        <p className="text-[11px] text-slate-500">
          Official headquarters contact channels and verified engineering answers.
        </p>
      </div>

      {/* Official Headquarters Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-electric-500 text-white flex items-center justify-center shadow-glow shrink-0">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-navy">
              Solar Depot USA Headquarters
            </h3>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Engineering Support Online
            </span>
          </div>
        </div>

        {/* Contact Links */}
        <div className="space-y-2 text-xs">
          {/* Main Phone */}
          <a
            href={`tel:${companyData.phones[0].replace(/\s+/g, '')}`}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-electric-50 hover:border-electric-200 border border-slate-100 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-electric-100 text-electric-600 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Primary Office</span>
                <span className="font-bold text-navy group-hover:text-electric-600 font-mono">
                  {companyData.phones[0]}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-electric-600">Call</span>
          </a>

          {/* Secondary Phone */}
          <a
            href={`tel:${companyData.phones[1].replace(/\s+/g, '')}`}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-electric-50 hover:border-electric-200 border border-slate-100 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-electric-100 text-electric-600 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Technical Line</span>
                <span className="font-bold text-navy group-hover:text-electric-600 font-mono">
                  {companyData.phones[1]}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-electric-600">Call</span>
          </a>

          {/* Email Link */}
          <a
            href={`mailto:${companyData.email}`}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-electric-50 hover:border-electric-200 border border-slate-100 transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-xl bg-electric-100 text-electric-600 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block font-medium">Email Desk</span>
                <span className="font-bold text-navy group-hover:text-electric-600 truncate block">
                  {companyData.email}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-electric-600 shrink-0">Email</span>
          </a>

          {/* Address / Google Maps */}
          <a
            href={companyData.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-electric-50 hover:border-electric-200 border border-slate-100 transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-xl bg-electric-100 text-electric-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block font-medium">Headquarters</span>
                <span className="font-bold text-navy group-hover:text-electric-600 text-xs truncate block">
                  {companyData.address}
                </span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-electric-600 shrink-0" />
          </a>
        </div>

        {/* Operating Hours */}
        <div className="p-3 bg-slate-100 rounded-2xl text-[11px] text-slate-600 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500 shrink-0" />
          <span>Hours: {companyData.operatingHours}</span>
        </div>
      </div>

      {/* Interactive FAQs Accordion */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
        <h3 className="font-display text-sm font-bold text-navy">
          Frequently Answered Technical Questions
        </h3>

        <div className="space-y-2">
          {solarFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/80 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="text-xs font-bold text-navy pr-2 leading-snug">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-electric-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Support Ticket Form */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
        <h3 className="font-display text-sm font-bold text-navy">
          Direct Technical Ticket
        </h3>
        <p className="text-[11px] text-slate-500">
          Experiencing an inverter error code or need field wiring advice? Submit details below.
        </p>

        {ticketSubmitted ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-xs text-emerald-800">
              Support Ticket Logged
            </h4>
            <p className="text-[11px] text-emerald-700">
              Demo ticket has been added to our queue. A technician would normally contact you within 2 business hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleTicketSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-navy mb-1">
                Subject or Error Code
              </label>
              <input
                type="text"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g. SD-HY-5K Grid Voltage Trip or Commissioning Question"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:border-electric-500 bg-slate-50/50 text-xs text-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-navy mb-1">
                Details & System Serial Number
              </label>
              <textarea
                rows={3}
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="Describe what occurred, inverter LED status, or specific question..."
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-electric-500 bg-slate-50/50 text-xs text-navy focus:outline-none resize-none"
              />
            </div>

            <Button
              type="submit"
              variant="secondary"
              size="md"
              fullWidth
              icon={Send}
            >
              Submit Support Ticket
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

