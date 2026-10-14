import React from 'react';
import { X, Award } from 'lucide-react';

export const SkillBadge = ({ skill, onRemove, type = 'TEACHING' }) => {
  const isTeaching = type === 'TEACHING';

  const levelColors = {
    BEGINNER: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    INTERMEDIATE: 'bg-blue-50 text-blue-700 border-blue-200',
    ADVANCED: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const badgeBg = isTeaching
    ? 'bg-indigo-50/80 text-indigo-900 border-indigo-200/80'
    : 'bg-amber-50/80 text-amber-900 border-amber-200/80';

  const skillName = skill.skillName || skill.name;
  const level = skill.proficiencyLevel || 'INTERMEDIATE';

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${badgeBg} shadow-xs transition-all hover:shadow-sm`}>
      <span className="font-semibold">{skillName}</span>
      {skill.proficiencyLevel && (
        <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${levelColors[level] || 'bg-slate-100 text-slate-700'}`}>
          {level.toLowerCase()}
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(skill.id)}
          className="ml-1 text-slate-400 hover:text-rose-600 transition-colors p-0.5 rounded hover:bg-white/80"
          title="Remove skill"
          aria-label={`Remove ${skillName || 'skill'}`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
