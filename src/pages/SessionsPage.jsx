import React, { useState, useEffect } from 'react';
import { sessionApi } from '../api/client';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Calendar,
  Clock,
  ExternalLink,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Sparkles
} from 'lucide-react';

const getSafeMeetingUrl = (link) => {
  if (!link || typeof link !== 'string') return null;
  const candidate = (link.trim().startsWith('http://') || link.trim().startsWith('https://'))
    ? link.trim()
    : `https://${link.trim()}`;
  try {
    const url = new URL(candidate);
    return (url.protocol === 'http:' || url.protocol === 'https:') ? url.href : null;
  } catch {
    return null;
  }
};

export const SessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  const loadSessions = async () => {
    try {
      setLoading(true);
      const res = await sessionApi.getMySessions();
      if (res.success) {
        setSessions(res.data || []);
      }
    } catch (err) {
      console.error("Sessions fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleStatusUpdate = async (sessionId, status) => {
    try {
      await sessionApi.updateStatus(sessionId, status);
      setNotification(`Session marked as ${status.toLowerCase()}`);
      loadSessions();
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      alert(err.message || 'Error updating session status');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your scheduled sessions..." />;
  }

  const upcoming = sessions.filter((s) => s.status === 'SCHEDULED');
  const past = sessions.filter((s) => s.status !== 'SCHEDULED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
          <span>Interactive Calendar</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Learning Sessions &amp; Calendar
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Coordinate upcoming 1-on-1 tutoring sessions, join video rooms, and track completed lessons.
        </p>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
          {notification}
        </div>
      )}

      {/* Upcoming Sessions Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
          <span>Upcoming Sessions</span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-extrabold">
            {upcoming.length}
          </span>
        </h2>

        {upcoming.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center max-w-md mx-auto">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No upcoming sessions right now</p>
            <p className="text-xs text-slate-400 mt-1">Accept or finalize a skill swap to schedule lessons.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map((sess) => (
              <div
                key={sess.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={sess.partnerAvatar}
                        alt={sess.partnerName}
                        className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200"
                      />
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{sess.partnerName}</h3>
                        <p className="text-xs font-semibold text-indigo-600">{sess.skillName}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                      Scheduled
                    </span>
                  </div>

                  <div className="space-y-2 mb-4 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-800">
                        {new Date(sess.scheduledTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>
                        {new Date(sess.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({sess.durationMinutes} minutes)
                      </span>
                    </div>
                    {sess.notes && (
                      <div className="flex items-start space-x-2 pt-1 border-t border-slate-200/50">
                        <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <span className="italic text-slate-700">{sess.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  {getSafeMeetingUrl(sess.meetingLink) ? (
                    <a
                      href={getSafeMeetingUrl(sess.meetingLink)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                      Join Meeting Link
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">No valid link provided</span>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(sess.id, 'CANCELLED')}
                      className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(sess.id, 'COMPLETED')}
                      className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
                    >
                      Mark Completed
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past / Completed Sessions Section */}
      {past.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Past &amp; Completed Sessions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {past.map((sess) => (
              <div
                key={sess.id}
                className="bg-white rounded-3xl border border-slate-200/70 p-5 opacity-80 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={sess.partnerAvatar}
                      alt={sess.partnerName}
                      className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{sess.partnerName}</h4>
                      <p className="text-xs text-slate-500">{sess.skillName}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${
                    sess.status === 'COMPLETED'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {sess.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {new Date(sess.scheduledTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
