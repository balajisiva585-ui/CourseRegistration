import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, Bookmark } from 'lucide-react';

export const StatusBadge = ({ status, text }) => {
  const normalized = (status || '').toUpperCase();
  const label = text || status;

  switch (normalized) {
    case 'REGISTERED':
    case 'ACTIVE':
    case 'COMPLETED':
    case 'AVAILABLE':
      return (
        <span className="badge badge-emerald">
          <CheckCircle2 size={12} />
          {label}
        </span>
      );

    case 'DROPPED':
    case 'FULL':
    case 'SUSPENDED':
    case 'ARCHIVED':
      return (
        <span className="badge badge-rose">
          <XCircle size={12} />
          {label}
        </span>
      );

    case 'PREREQUISITE_MISSING':
    case 'SCHEDULE_CONFLICT':
    case 'WARNING':
      return (
        <span className="badge badge-amber">
          <AlertCircle size={12} />
          {label}
        </span>
      );

    case 'CORE':
      return (
        <span className="badge badge-blue">
          <Bookmark size={12} />
          {label}
        </span>
      );

    case 'ELECTIVE':
    case 'SEMINAR':
    case 'LAB':
      return (
        <span className="badge badge-indigo">
          {label}
        </span>
      );

    default:
      return (
        <span className="badge badge-slate">
          {label}
        </span>
      );
  }
};

export default StatusBadge;
