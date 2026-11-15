import React, { useState } from 'react';
import { postFeedback } from '../services/api';
import { ThumbsUp, Volume2, Snowflake, Wifi, Heart, CheckCircle2 } from 'lucide-react';

export const RoomFeedbackWidget: React.FC = () => {
  const [submittedTag, setSubmittedTag] = useState<string | null>(null);

  const tags = [
    { category: 'TEMPERATURE', tag: 'TOO_COLD', label: '❄️ AC Too Cold', comment: 'Table draft' },
    { category: 'MUSIC', tag: 'TOO_LOUD', label: '🔊 Music Too Loud', comment: 'Focus volume' },
    { category: 'WIFI', tag: 'GREAT', label: '📶 Wi-Fi is Great', comment: 'Fast speeds' },
    { category: 'VIBE', tag: 'COZY', label: '☕ Vibe is Cozy', comment: 'Loved it' },
  ];

  const handleTapFeedback = async (t: typeof tags[0]) => {
    setSubmittedTag(t.label);
    await postFeedback(t.category, t.tag, t.comment);
    setTimeout(() => {
      setSubmittedTag(null);
    }, 4000);
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm text-left">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-xs font-bold text-stone-900">How's the Cafe Space Right Now?</h4>
          <p className="text-[11px] text-stone-500">1-tap ambient feedback helps the barista team tune the room</p>
        </div>
        <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {tags.map((t) => (
          <button
            key={t.tag}
            onClick={() => handleTapFeedback(t)}
            className="py-2 px-3 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 text-stone-700 text-xs font-medium text-center transition-all active:scale-95 flex items-center justify-center space-x-1"
          >
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {submittedTag && (
        <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium flex items-center space-x-1.5 animate-in fade-in">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>Thanks for letting us know ({submittedTag})! Barista team notified.</span>
        </div>
      )}
    </div>
  );
};
