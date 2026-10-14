import React, { useState } from 'react';
import { X, ArrowRightLeft, Sparkles, Send } from 'lucide-react';
import { requestApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const SwapModal = ({ partner, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [offeredSkillId, setOfferedSkillId] = useState('');
  const [requestedSkillId, setRequestedSkillId] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !partner) return null;

  const myTeachingSkills = user?.teachingSkills || [];
  const partnerTeachingSkills = partner.teachingSkills || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offeredSkillId || !requestedSkillId) {
      setError('Please select both a skill to offer and a skill to learn.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await requestApi.create({
        receiverId: partner.id,
        offeredSkillId: Number(offeredSkillId),
        requestedSkillId: Number(requestedSkillId),
        message: message.trim(),
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to send swap request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Request Skill Swap</h3>
            <p className="text-sm text-slate-500">Propose a 1-on-1 peer exchange with {partner.fullName}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Offered Skill */}
          <div>
            <label htmlFor="swap-offered-skill" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              1. Skill You Will Teach ({partner.fullName} Learns)
            </label>
            {myTeachingSkills.length === 0 ? (
              <p className="text-sm text-amber-600 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                You haven't added any teaching skills to your profile yet! Go to your profile to list what you can teach.
              </p>
            ) : (
              <select
                id="swap-offered-skill"
                value={offeredSkillId}
                onChange={(e) => setOfferedSkillId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm"
              >
                <option value="">-- Select a skill from your profile --</option>
                {myTeachingSkills.map((s) => (
                  <option key={s.skillId} value={s.skillId}>
                    {s.skillName} ({s.proficiencyLevel} • {s.category})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Requested Skill */}
          <div>
            <label htmlFor="swap-requested-skill" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              2. Skill You Want to Learn ({partner.fullName} Teaches)
            </label>
            {partnerTeachingSkills.length === 0 ? (
              <p className="text-sm text-slate-500 italic">This user has not listed teaching skills yet.</p>
            ) : (
              <select
                id="swap-requested-skill"
                value={requestedSkillId}
                onChange={(e) => setRequestedSkillId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm"
              >
                <option value="">-- Select what you want them to teach you --</option>
                {partnerTeachingSkills.map((s) => (
                  <option key={s.skillId} value={s.skillId}>
                    {s.skillName} ({s.proficiencyLevel} • {s.category})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Proposal Message */}
          <div>
            <label htmlFor="swap-message" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              3. Personalized Message & Goals
            </label>
            <textarea
              id="swap-message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Hi ${partner.fullName}! I'd love to swap skills with you. Let me know what days work best for you...`}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || myTeachingSkills.length === 0 || partnerTeachingSkills.length === 0}
              className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4 mr-2" />
              {submitting ? 'Sending Request...' : 'Send Swap Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
