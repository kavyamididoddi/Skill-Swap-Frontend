import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { matchApi } from '../api/client';
import { SkillBadge } from '../components/SkillBadge';
import { SwapModal } from '../components/SwapModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Sparkles, ArrowRightLeft, Star, Users, CheckCircle } from 'lucide-react';

export const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState('');

  const loadMatches = async () => {
    try {
      setLoading(true);
      setLoadError('');
      const res = await matchApi.getRecommendations();
      if (res.success) {
        setMatches(res.data || []);
      } else {
        setLoadError(res.message || 'Failed to calculate matches');
      }
    } catch (err) {
      console.error("Failed to load match recommendations:", err);
      setLoadError(err.message || 'Failed to load match recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Computing smart peer matches..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI &amp; Constraint Matching Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Smart Peer Matches
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Students whose teaching capabilities directly complement your desired learning skills.
          </p>
        </div>
      </div>

      {loadError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between">
          <span>{loadError}</span>
          <button
            onClick={loadMatches}
            className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification('')} className="text-emerald-600 hover:text-emerald-800 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {matches.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <Sparkles className="w-12 h-12 text-indigo-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No Direct Matches Found Yet</h3>
          <p className="text-sm text-slate-500 mt-2 mb-6">
            Make sure your profile has both <strong>Skills You Can Teach</strong> and <strong>Skills You Want to Learn</strong> listed so our matching engine can calculate overlap!
          </p>
          <Link
            to="/profile"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-colors"
          >
            Update My Skills
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map((match) => {
            const partner = match.partner;
            const isMutual = match.mutualMatch;

            return (
              <div
                key={partner.id}
                className={`bg-white rounded-3xl p-6 border transition-all hover:shadow-lg ${
                  isMutual
                    ? 'border-emerald-300 ring-2 ring-emerald-500/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header with Match Percentage */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={partner.avatarUrl}
                      alt={partner.fullName}
                      className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 shrink-0"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{partner.fullName}</h3>
                      <p className="text-xs text-slate-500">{partner.collegeDepartment || 'Student'}</p>
                      {partner.averageRating > 0 && (
                        <div className="flex items-center space-x-1 mt-1 text-xs text-amber-600 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{partner.averageRating.toFixed(1)}</span>
                          <span className="text-slate-400">({partner.reviewCount} reviews)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Match Score Badge */}
                  <div
                    className={`px-3 py-1.5 rounded-xl text-center shrink-0 ${
                      isMutual
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                    }`}
                  >
                    <p className="text-lg font-extrabold leading-none">{match.matchScore}%</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider mt-0.5">
                      {isMutual ? 'Mutual Swap' : 'Need Match'}
                    </p>
                  </div>
                </div>

                {/* Match Reason Banner */}
                <div className={`p-3 rounded-xl mb-4 text-xs font-semibold ${
                  isMutual ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-700'
                }`}>
                  {match.matchReason}
                </div>

                {/* Skills Intersection Details */}
                <div className="space-y-3 mb-6">
                  {match.skillsPartnerCanTeachMe.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 mb-1.5">
                        They Can Teach You:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {match.skillsPartnerCanTeachMe.map((s) => (
                          <span
                            key={s}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200"
                          >
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {match.skillsICanTeachPartner.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700 mb-1.5">
                        You Can Teach Them:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {match.skillsICanTeachPartner.map((s) => (
                          <span
                            key={s}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200"
                          >
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => {
                    setSelectedPartner(partner);
                    setModalOpen(true);
                  }}
                  className={`w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all ${
                    isMutual
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                  }`}
                >
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Propose Skill Swap Request
                </button>
              </div>
            );
          })}
        </div>
      )}

      <SwapModal
        isOpen={modalOpen}
        partner={selectedPartner}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setNotification('Swap request sent successfully! You can track its status in the Requests tab.');
          setTimeout(() => setNotification(''), 4500);
        }}
      />
    </div>
  );
};
