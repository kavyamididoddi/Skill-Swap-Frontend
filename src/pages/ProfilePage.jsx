import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { skillApi, userApi } from '../api/client';
import { SkillBadge } from '../components/SkillBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  User,
  BookOpen,
  Sparkles,
  Plus,
  Trash2,
  Star,
  CheckCircle,
  Building,
  Mail,
  Edit3
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [catalogSkills, setCatalogSkills] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Profile Edit State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [collegeDepartment, setCollegeDepartment] = useState(user?.collegeDepartment || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Skill Add Modal / Form State
  const [skillType, setSkillType] = useState('TEACHING'); // 'TEACHING' | 'LEARNING'
  const [selectedCatalogSkillId, setSelectedCatalogSkillId] = useState('');
  const [customSkillName, setCustomSkillName] = useState('');
  const [category, setCategory] = useState('Programming & Tech');
  const [proficiencyLevel, setProficiencyLevel] = useState('INTERMEDIATE');
  const [skillNotes, setSkillNotes] = useState('');
  const [addingSkill, setAddingSkill] = useState(false);

  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setCollegeDepartment(user.collegeDepartment || '');
      setBio(user.bio || '');

      // Load catalog skills
      skillApi.getAll()
        .then((res) => { if (res.success) setCatalogSkills(res.data || []); })
        .catch((err) => console.error('Catalog load error:', err));

      // Load user reviews
      userApi.getReviews(user.id)
        .then((res) => { if (res.success) setReviews(res.data || []); })
        .catch((err) => console.error('Reviews load error:', err))
        .finally(() => setLoadingReviews(false));
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await userApi.updateProfile({ fullName, collegeDepartment, bio });
      await refreshUser();
      setNotification('Profile details updated successfully');
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    setAddingSkill(true);
    try {
      const payload = {
        skillType,
        proficiencyLevel,
        notes: skillNotes.trim(),
      };

      if (selectedCatalogSkillId) {
        payload.skillId = Number(selectedCatalogSkillId);
      } else if (customSkillName.trim()) {
        payload.skillName = customSkillName.trim();
        payload.category = category;
      } else {
        alert('Please choose an existing skill or enter a custom skill name.');
        setAddingSkill(false);
        return;
      }

      await skillApi.addMySkill(payload);
      await refreshUser();

      // Reset add form
      setSelectedCatalogSkillId('');
      setCustomSkillName('');
      setSkillNotes('');
      setNotification(`Added to ${skillType.toLowerCase()} skills!`);
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to add skill');
    } finally {
      setAddingSkill(false);
    }
  };

  const handleRemoveSkill = async (userSkillId) => {
    if (!window.confirm('Are you sure you want to remove this skill from your profile?')) return;
    try {
      await skillApi.removeMySkill(userSkillId);
      await refreshUser();
      setNotification('Skill removed from profile');
      setTimeout(() => setNotification(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to remove skill');
    }
  };

  const teachingSkills = user?.teachingSkills || [];
  const learningSkills = user?.learningSkills || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <User className="w-3.5 h-3.5 text-indigo-600" />
            <span>Profile &amp; Skill Inventory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Skills &amp; Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Keep your skills up to date so the matching engine finds the best peer partners for you.
          </p>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
          {notification}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card & Edit Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs text-center">
            <img
              src={user?.avatarUrl}
              alt={user?.fullName}
              className="w-24 h-24 rounded-3xl mx-auto border-2 border-indigo-200 shadow-md bg-indigo-50 mb-4"
            />
            <h2 className="text-xl font-extrabold text-slate-900">{user?.fullName}</h2>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">{user?.collegeDepartment || 'Student'}</p>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center space-x-2 text-sm font-bold text-amber-600">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{user?.averageRating > 0 ? user.averageRating.toFixed(1) : 'New User'}</span>
              <span className="text-slate-400 font-normal text-xs">({user?.reviewCount || 0} reviews)</span>
            </div>
          </div>

          {/* Profile Edit Form */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center">
              <Edit3 className="w-4 h-4 mr-2 text-indigo-600" />
              Edit Profile Details
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Department / Major
                </label>
                <input
                  type="text"
                  value={collegeDepartment}
                  onChange={(e) => setCollegeDepartment(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  About Me / Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a brief introduction..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {savingProfile ? 'Saving...' : 'Save Profile Details'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Columns: Skills Management & Reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add New Skill Section */}
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl border border-indigo-100 p-6 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center">
              <Plus className="w-5 h-5 mr-2 text-indigo-600" />
              Add a Skill to Your Profile
            </h3>

            <form onSubmit={handleAddSkill} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Skill Role
                  </label>
                  <select
                    value={skillType}
                    onChange={(e) => setSkillType(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="TEACHING">Skills I Can Teach (Offering)</option>
                    <option value="LEARNING">Skills I Want to Learn (Desired)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Proficiency Level
                  </label>
                  <select
                    value={proficiencyLevel}
                    onChange={(e) => setProficiencyLevel(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="BEGINNER">Beginner (Foundations)</option>
                    <option value="INTERMEDIATE">Intermediate (Practitioner)</option>
                    <option value="ADVANCED">Advanced (Expert / Mentor)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Choose from Catalog
                  </label>
                  <select
                    value={selectedCatalogSkillId}
                    onChange={(e) => {
                      setSelectedCatalogSkillId(e.target.value);
                      if (e.target.value) setCustomSkillName('');
                    }}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Choose from standard catalog --</option>
                    {catalogSkills.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Or Enter Custom Skill
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Docker, Blender 3D, Japanese..."
                    value={customSkillName}
                    onChange={(e) => {
                      setCustomSkillName(e.target.value);
                      if (e.target.value) setSelectedCatalogSkillId('');
                    }}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Experience Notes or Goals (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Built 2 production apps, or want to learn basics for semester project"
                  value={skillNotes}
                  onChange={(e) => setSkillNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={addingSkill}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-indigo-200 transition-all disabled:opacity-50"
                >
                  {addingSkill ? 'Adding...' : 'Add Skill to Profile'}
                </button>
              </div>
            </form>
          </div>

          {/* Current Skills Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Teaching Skills */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2 text-indigo-600" />
                  Skills I Can Teach
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs">
                  {teachingSkills.length}
                </span>
              </div>

              {teachingSkills.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4">No teaching skills listed yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {teachingSkills.map((s) => (
                    <SkillBadge
                      key={s.id}
                      skill={s}
                      type="TEACHING"
                      onRemove={handleRemoveSkill}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Learning Skills */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-amber-600" />
                  Skills I Want to Learn
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-xs">
                  {learningSkills.length}
                </span>
              </div>

              {learningSkills.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4">No desired learning skills listed yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {learningSkills.map((s) => (
                    <SkillBadge
                      key={s.id}
                      skill={s}
                      type="LEARNING"
                      onRemove={handleRemoveSkill}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Peer Reviews Received */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center">
              <Star className="w-4 h-4 mr-2 text-amber-500 fill-amber-500" />
              Peer Reviews &amp; Ratings Received ({reviews.length})
            </h3>

            {loadingReviews ? (
              <LoadingSpinner text="Loading reviews..." />
            ) : reviews.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-3">
                No reviews yet. Complete skill swaps with fellow students to build your peer reputation!
              </p>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={rev.reviewerAvatar}
                          alt={rev.reviewerName}
                          className="w-7 h-7 rounded-full bg-slate-200"
                        />
                        <span className="text-xs font-bold text-slate-900">{rev.reviewerName}</span>
                      </div>
                      <div className="flex items-center text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    {rev.comment && (
                      <p className="text-xs text-slate-700 italic">
                        "{rev.comment}"
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(rev.createdAt).toLocaleDateString([], { dateStyle: 'medium' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
