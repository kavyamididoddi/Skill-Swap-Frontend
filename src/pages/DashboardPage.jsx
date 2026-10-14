import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { matchApi, requestApi, sessionApi } from '../api/client';
import { SkillBadge } from '../components/SkillBadge';
import { SwapModal } from '../components/SwapModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  BookOpen,
  Sparkles,
  ArrowRightLeft,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Star,
  Users
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, refreshUser } = useAuth();
  const [matches, setMatches] = useState([]);
  const [requests, setRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [processingReqId, setProcessingReqId] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [m, r, s] = await Promise.allSettled([
        matchApi.getRecommendations(),
        requestApi.getReceived(),
        sessionApi.getMySessions(),
      ]);

      if (m.status === 'fulfilled' && m.value?.success) setMatches(m.value.data || []);
      if (r.status === 'fulfilled' && r.value?.success) setRequests(r.value.data || []);
      if (s.status === 'fulfilled' && s.value?.success) setSessions(s.value.data || []);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRequestStatus = async (requestId, status) => {
    try {
      setProcessingReqId(requestId);
      await requestApi.updateStatus(requestId, status);
      setActionSuccess(`Request marked as ${status.toLowerCase()}`);
      loadDashboardData();
      refreshUser();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert(err.message || 'Error updating status');
    } finally {
      setProcessingReqId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your SkillSwap dashboard..." />;
  }

  const pendingRequests = requests.filter((r) => r.status === 'PENDING');
  const upcomingSessions = sessions.filter((s) => s.status === 'SCHEDULED');
  const topMatch = matches.length > 0 ? matches[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Overview Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Student Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="mt-2 text-indigo-200 text-sm sm:text-base leading-relaxed">
            {user?.collegeDepartment ? `${user.collegeDepartment} • ` : ''}
            Explore mutual exchange opportunities, coordinate sessions, and level up your skills.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/matches"
              className="inline-flex items-center px-4 py-2 rounded-xl bg-white text-indigo-900 text-sm font-bold shadow-xs hover:bg-indigo-50 transition-colors"
            >
              <Sparkles className="w-4 h-4 mr-2 text-indigo-600" />
              View {matches.length} Smart Matches
            </Link>
            <Link
              to="/profile"
              className="inline-flex items-center px-4 py-2 rounded-xl bg-white/15 hover:bg-white/20 text-white text-sm font-semibold transition-colors"
            >
              Manage My Skills
            </Link>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-emerald-600 hover:text-emerald-800 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Skills I Teach</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">
            {user?.teachingSkills?.length || 0}
          </p>
          <p className="mt-1 text-xs text-slate-500">Listed on profile</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Skills I Want</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">
            {user?.learningSkills?.length || 0}
          </p>
          <p className="mt-1 text-xs text-slate-500">Desired targets</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Incoming Requests</span>
            <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">
            {pendingRequests.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">Awaiting response</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Peer Rating</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Star className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">
            {user?.averageRating > 0 ? user.averageRating.toFixed(1) : 'New'}
          </p>
          <p className="mt-1 text-xs text-slate-500">{user?.reviewCount || 0} reviews</p>
        </div>
      </div>

      {/* Top Smart Match Highlight */}
      {topMatch && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <img
              src={topMatch.partner.avatarUrl}
              alt={topMatch.partner.fullName}
              className="w-14 h-14 rounded-2xl bg-white border border-emerald-200 shadow-xs shrink-0"
            />
            <div>
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3 h-3" />
                <span>{topMatch.matchScore}% Match • Mutual Exchange Opportunity</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{topMatch.partner.fullName}</h3>
              <p className="text-xs text-slate-600 mb-2">{topMatch.partner.collegeDepartment}</p>
              <p className="text-xs font-semibold text-emerald-800">
                {topMatch.matchReason}
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={() => {
                setSelectedPartner(topMatch.partner);
                setModalOpen(true);
              }}
              className="w-full md:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-200 transition-all hover:scale-105"
            >
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Propose Skill Swap
            </button>
          </div>
        </div>
      )}

      {/* Two Column Layout: Upcoming Sessions & Incoming Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Sessions Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Scheduled Sessions</h2>
            </div>
            <Link to="/sessions" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
              View All
            </Link>
          </div>

          {upcomingSessions.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm">No upcoming sessions scheduled yet.</p>
              <p className="text-xs text-slate-400 mt-1">Accept a swap request to schedule a 1-on-1 session.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.slice(0, 3).map((sess) => (
                <div
                  key={sess.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={sess.partnerAvatar}
                      alt={sess.partnerName}
                      className="w-10 h-10 rounded-xl bg-white border border-slate-200"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{sess.partnerName}</p>
                      <p className="text-xs text-indigo-600 font-semibold">{sess.skillName}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {new Date(sess.scheduledTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} ({sess.durationMinutes}m)
                      </p>
                    </div>
                  </div>
                  {sess.meetingLink && (
                    <a
                      href={sess.meetingLink.startsWith('http') ? sess.meetingLink : `https://${sess.meetingLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                      Join
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Incoming Swap Requests */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2">
              <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Incoming Requests</h2>
            </div>
            <Link to="/requests" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
              Manage Requests
            </Link>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <ArrowRightLeft className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm">No pending requests right now.</p>
              <p className="text-xs text-slate-400 mt-1">Explore peers to start exchanging skills!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.slice(0, 3).map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={req.senderAvatar}
                        alt={req.senderName}
                        className="w-10 h-10 rounded-xl bg-white border border-indigo-200"
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-900">{req.senderName}</p>
                        <p className="text-xs text-slate-500">
                          Teaches: <span className="font-semibold text-indigo-700">{req.offeredSkill.name}</span> | Wants: <span className="font-semibold text-amber-700">{req.requestedSkill.name}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  {req.message && (
                    <p className="text-xs italic text-slate-600 bg-white/80 p-2.5 rounded-xl border border-slate-200/50">
                      "{req.message}"
                    </p>
                  )}
                  <div className="flex justify-end space-x-2 pt-1">
                    <button
                      onClick={() => handleRequestStatus(req.id, 'REJECTED')}
                      disabled={processingReqId === req.id}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleRequestStatus(req.id, 'ACCEPTED')}
                      disabled={processingReqId === req.id}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors disabled:opacity-50"
                    >
                      {processingReqId === req.id ? 'Updating...' : 'Accept Swap'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Swap Request Modal */}
      <SwapModal
        isOpen={modalOpen}
        partner={selectedPartner}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setActionSuccess('Swap proposal sent successfully!');
          loadDashboardData();
          setTimeout(() => setActionSuccess(''), 4000);
        }}
      />
    </div>
  );
};
