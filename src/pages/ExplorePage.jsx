import React, { useState, useEffect, useRef } from 'react';
import { userApi } from '../api/client';
import { SkillBadge } from '../components/SkillBadge';
import { SwapModal } from '../components/SwapModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Search, Compass, Star, ArrowRightLeft, Filter, BookOpen } from 'lucide-react';

export const ExplorePage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const requestIdRef = useRef(0);

  const categories = [
    'ALL',
    'Programming & Tech',
    'Design & Creative',
    'Languages',
    'Business & Communication',
    'Music & Arts',
  ];

  const fetchUsers = async () => {
    const currentId = ++requestIdRef.current;
    try {
      setLoading(true);
      setFetchError('');
      const params = {};
      if (search.trim()) params.skill = search.trim();
      if (selectedCategory !== 'ALL') params.category = selectedCategory;

      const res = await userApi.explore(params);
      if (currentId === requestIdRef.current) {
        if (res.success) {
          setUsers(res.data || []);
        } else {
          setFetchError(res.message || 'Failed to search students');
        }
      }
    } catch (err) {
      if (currentId === requestIdRef.current) {
        console.error("Explore fetch error:", err);
        setFetchError(err.message || 'Failed to load students');
      }
    } finally {
      if (currentId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Compass className="w-3.5 h-3.5 text-indigo-600" />
          <span>Peer Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore Student Mentors &amp; Learners
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Search students by specific technologies, languages, design disciplines, or academic fields.
        </p>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
          {notification}
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by skill name (e.g. React, UI/UX, Spanish, Python)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-colors shrink-0"
          >
            Search
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {fetchError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between">
          <span>{fetchError}</span>
          <button
            onClick={fetchUsers}
            className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Users Grid */}
      {loading ? (
        <LoadingSpinner text="Searching student directory..." />
      ) : fetchError ? null : users.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <p className="text-slate-500 text-sm">No students matched your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((peer) => (
            <div
              key={peer.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                {/* Header */}
                <div className="flex items-start space-x-3.5 mb-4">
                  <img
                    src={peer.avatarUrl}
                    alt={peer.fullName}
                    className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <h3 className="text-base font-bold text-slate-900 truncate">{peer.fullName}</h3>
                    <p className="text-xs text-slate-500 truncate">{peer.collegeDepartment || 'Student'}</p>
                    <div className="flex items-center space-x-1 mt-1 text-xs text-amber-600 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{peer.averageRating > 0 ? peer.averageRating.toFixed(1) : 'New'}</span>
                      <span className="text-slate-400 font-normal">({peer.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {peer.bio && (
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 italic">
                    "{peer.bio}"
                  </p>
                )}

                {/* Teaching Skills */}
                <div className="mb-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 mb-1.5 flex items-center">
                    <BookOpen className="w-3.5 h-3.5 mr-1" /> Teaches ({peer.teachingSkills.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {peer.teachingSkills.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">None listed</span>
                    ) : (
                      peer.teachingSkills.map((s) => (
                        <SkillBadge key={s.id} skill={s} type="TEACHING" />
                      ))
                    )}
                  </div>
                </div>

                {/* Learning Skills */}
                <div className="mb-5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700 mb-1.5">
                    Wants to Learn ({peer.learningSkills.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {peer.learningSkills.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">None listed</span>
                    ) : (
                      peer.learningSkills.map((s) => (
                        <SkillBadge key={s.id} skill={s} type="LEARNING" />
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  setSelectedPartner(peer);
                  setModalOpen(true);
                }}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs tracking-wide uppercase transition-colors"
              >
                <ArrowRightLeft className="w-4 h-4 mr-2" />
                Connect &amp; Request Swap
              </button>
            </div>
          ))}
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
