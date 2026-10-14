import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Link as LinkIcon, FileText } from 'lucide-react';
import { sessionApi } from '../api/client';

export const SessionModal = ({ swapRequest, isOpen, onClose, onSuccess }) => {
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [meetingLink, setMeetingLink] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setScheduledDate('');
      setScheduledTime('');
      setDurationMinutes(60);
      setMeetingLink('');
      setNotes('');
      setError('');
      setSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen || !swapRequest) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduledDate || !scheduledTime) {
      setError('Please provide date and time');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const combinedDateTime = `${scheduledDate}T${scheduledTime}:00`;
      await sessionApi.schedule(swapRequest.id, {
        scheduledTime: combinedDateTime,
        durationMinutes: Number(durationMinutes),
        meetingLink: meetingLink.trim(),
        notes: notes.trim(),
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to schedule session');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Schedule Session</h3>
            <p className="text-xs text-slate-500">Pick a time to exchange skills and learn together</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="sess-date" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Date
              </label>
              <input
                id="sess-date"
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="sess-time" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Time
              </label>
              <input
                id="sess-time"
                type="time"
                required
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="sess-duration" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Duration
            </label>
            <select
              id="sess-duration"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes</option>
              <option value={60}>60 Minutes (1 Hour)</option>
              <option value={90}>90 Minutes (1.5 Hours)</option>
              <option value={120}>120 Minutes (2 Hours)</option>
            </select>
          </div>

          <div>
            <label htmlFor="sess-location" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Meeting Link or Location
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="sess-location"
                type="text"
                placeholder="https://meet.google.com/xyz or Library Room 204"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="sess-notes" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Agenda & Preparation Notes
            </label>
            <textarea
              id="sess-notes"
              rows={2}
              placeholder="What will we cover in this session? (e.g. Chapter 1 review, setup code repo)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all disabled:opacity-50"
            >
              {submitting ? 'Scheduling...' : 'Confirm Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
