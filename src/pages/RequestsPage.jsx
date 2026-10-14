import React, { useState, useEffect } from 'react';
import { requestApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { SessionModal } from '../components/SessionModal';
import { ReviewModal } from '../components/ReviewModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  GitPullRequest,
  ArrowRightLeft,
  Calendar,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Inbox
} from 'lucide-react';

export const RequestsPage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('received'); // 'received' | 'sent'
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [sessionModalReq, setSessionModalReq] = useState(null);
  const [reviewModalReq, setReviewModalReq] = useState(null);
  const [notification, setNotification] = useState('');

  const loadRequests = async () => {
    try {
      setLoading(true);
      setLoadError('');
      const [recRes, sentRes] = await Promise.all([
        requestApi.getReceived(),
        requestApi.getSent(),
      ]);
      if (recRes.success) {
        setReceivedRequests(recRes.data || []);
      } else {
        setLoadError(recRes.message || 'Failed to load received requests');
      }

      if (sentRes.success) {
        setSentRequests(sentRes.data || []);
      } else {
        setLoadError(sentRes.message || 'Failed to load sent requests');
      }
    } catch (err) {
      console.error("Requests load error:", err);
      setLoadError(err.message || 'Failed to load swap requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await requestApi.updateStatus(id, status);
      setNotification(`Request status updated to ${status.toLowerCase()}`);
      loadRequests();
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      alert(err.message || 'Error updating request');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
      ACCEPTED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
      COMPLETED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      CANCELLED: 'bg-slate-50 text-slate-600 border-slate-200',
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border ${styles[status] || 'bg-slate-100 text-slate-700'}`}>
        {status}
      </span>
    );
  };

  const activeList = tab === 'received' ? receivedRequests : sentRequests;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <GitPullRequest className="w-3.5 h-3.5 text-indigo-600" />
            <span>Exchange Lifecycle</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Skill Swap Proposals &amp; Requests
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Accept proposals, schedule sessions, and rate completed peer learning exchanges.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start">
          <button
            onClick={() => setTab('received')}
            className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'received'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Inbox className="w-4 h-4 mr-2" />
            Incoming ({receivedRequests.length})
          </button>
          <button
            onClick={() => setTab('sent')}
            className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'sent'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4 mr-2" />
            Sent by Me ({sentRequests.length})
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
          {notification}
        </div>
      )}

      {loadError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between">
          <span>{loadError}</span>
          <button
            onClick={loadRequests}
            className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Loading your swap requests..." />
      ) : activeList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <ArrowRightLeft className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            {tab === 'received' ? 'No incoming swap requests' : 'You have not sent any swap proposals yet'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {tab === 'received'
              ? 'When other students find your skills and request an exchange, they will appear here.'
              : 'Browse Explore or Matches to propose an exchange with a fellow student.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeList.map((req) => {
            const isSender = req.senderId === user?.id;
            const partnerName = isSender ? req.receiverName : req.senderName;
            const partnerAvatar = isSender ? req.receiverAvatar : req.senderAvatar;

            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={partnerAvatar}
                    alt={partnerName}
                    className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-base font-bold text-slate-900">{partnerName}</h3>
                      {getStatusBadge(req.status)}
                    </div>

                    {/* Skill Exchange Pair */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-semibold text-slate-600">
                        {isSender ? 'You teach:' : 'They teach:'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-800 font-bold border border-indigo-200">
                        {req.offeredSkill.name}
                      </span>

                      <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />

                      <span className="font-semibold text-slate-600">
                        {isSender ? 'You learn:' : 'They learn:'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-800 font-bold border border-amber-200">
                        {req.requestedSkill.name}
                      </span>
                    </div>

                    {req.message && (
                      <p className="text-xs italic text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 max-w-xl">
                        "{req.message}"
                      </p>
                    )}

                    <p className="text-[11px] text-slate-400">
                      Requested on {new Date(req.createdAt).toLocaleDateString([], { dateStyle: 'long' })}
                    </p>
                  </div>
                </div>

                {/* Actions depending on Status & Role */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 justify-end">
                  {/* Incoming PENDING actions */}
                  {!isSender && req.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(req.id, 'REJECTED')}
                        className="px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(req.id, 'ACCEPTED')}
                        className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                      >
                        Accept Swap
                      </button>
                    </>
                  )}

                  {/* Outgoing PENDING action */}
                  {isSender && req.status === 'PENDING' && (
                    <button
                      onClick={() => handleStatusUpdate(req.id, 'CANCELLED')}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      Cancel Request
                    </button>
                  )}

                  {/* ACCEPTED actions (both can schedule or mark completed) */}
                  {req.status === 'ACCEPTED' && (
                    <>
                      <button
                        onClick={() => setSessionModalReq(req)}
                        className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs border border-blue-200 transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        Schedule Session
                      </button>
                      <button
                        onClick={() => setReviewModalReq(req)}
                        className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                      >
                        <Star className="w-3.5 h-3.5 mr-1.5 fill-white" />
                        Complete &amp; Review
                      </button>
                    </>
                  )}

                  {/* COMPLETED interaction */}
                  {req.status === 'COMPLETED' && (
                    <button
                      onClick={() => setReviewModalReq(req)}
                      className="inline-flex items-center px-4 py-2 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold text-xs border border-amber-200 transition-colors"
                    >
                      <Star className="w-3.5 h-3.5 mr-1.5 fill-amber-500 text-amber-500" />
                      Add / View Review
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Session Modal */}
      <SessionModal
        isOpen={!!sessionModalReq}
        swapRequest={sessionModalReq}
        onClose={() => setSessionModalReq(null)}
        onSuccess={() => {
          setNotification('Session scheduled successfully! Check your calendar in the Sessions tab.');
          setTimeout(() => setNotification(''), 4500);
        }}
      />

      {/* Leave Review Modal */}
      <ReviewModal
        isOpen={!!reviewModalReq}
        swapRequest={reviewModalReq}
        onClose={() => setReviewModalReq(null)}
        onSuccess={() => {
          setNotification('Thank you! Your peer review and rating have been recorded.');
          loadRequests();
          setTimeout(() => setNotification(''), 4500);
        }}
      />
    </div>
  );
};
