import React, { useState } from 'react';
import { CafePatron } from '../types';
import { generateIcebreaker } from '../services/api';
import { Users, Coffee, Sparkles, MessageCircle, Heart, X, Check, ShieldCheck, MapPin } from 'lucide-react';

interface CafeModeDeckProps {
  patrons: CafePatron[];
}

export const CafeModeDeck: React.FC<CafeModeDeckProps> = ({ patrons }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchedPatron, setMatchedPatron] = useState<CafePatron | null>(null);
  const [icebreaker, setIcebreaker] = useState<string | null>(null);
  const [loadingIcebreaker, setLoadingIcebreaker] = useState(false);
  const [coffeeGiftSent, setCoffeeGiftSent] = useState(false);
  const [cafeModeEnabled, setCafeModeEnabled] = useState(true);

  const currentUser: CafePatron = {
    id: 'user-self',
    name: 'You (Alex)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
    role: 'Full-Stack Developer',
    current_project: 'Building Cafe Companion on Google Cloud',
    interests: ['Generative AI', 'Specialty Coffee', 'Next.js', 'Figma Systems'],
    status_badge: 'Open to Coffee Chats ☕',
    table: 'Table 04',
    looking_for: 'Looking to meet designers and founders'
  };

  const currentPatron = patrons[currentIndex % patrons.length];

  const handleConnect = async (patron: CafePatron) => {
    setMatchedPatron(patron);
    setLoadingIcebreaker(true);
    setCoffeeGiftSent(false);

    try {
      const res = await generateIcebreaker(currentUser, patron);
      setIcebreaker(res.icebreaker_text);
    } catch (e) {
      console.error(e);
      setIcebreaker(`You both love ${patron.interests[0]}! Wave to ${patron.name} at ${patron.table} to break the ice.`);
    } finally {
      setLoadingIcebreaker(false);
    }
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % patrons.length);
  };

  return (
    <div className="space-y-6">

      {/* Opt-in Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-stone-900 to-stone-950 text-white rounded-3xl p-6 shadow-xl border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <h2 className="text-base font-bold text-rose-100 flex items-center space-x-1.5">
              <span>Cafe Mode: Proximity Coworking</span>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30 font-semibold">
                Table 04 Geofence
              </span>
            </h2>
          </div>
          <p className="text-xs text-stone-300 max-w-xl">
            Tinder & Bumble-inspired serendipitous networking. Connect with founders, writers, and designers working in this cafe right now.
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center space-x-2 bg-stone-800/80 px-3 py-1.5 rounded-2xl border border-stone-700">
          <span className="text-xs font-semibold text-stone-300">
            {cafeModeEnabled ? 'Visible in Room' : 'Ghost Mode'}
          </span>
          <button
            onClick={() => setCafeModeEnabled(!cafeModeEnabled)}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              cafeModeEnabled ? 'bg-rose-600' : 'bg-stone-600'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                cafeModeEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>
      </div>

      {/* Privacy Guarantee Alert */}
      <div className="flex items-center space-x-2 px-2 text-[11px] text-stone-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Strict privacy guard: Your profile automatically expires 15 minutes after leaving cafe Wi-Fi. Double opt-in only.</span>
      </div>

      {/* Swipeable Patron Card Deck */}
      {currentPatron && (
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-stone-200/90 relative flex flex-col">
            
            {/* Patron Image */}
            <div className="relative h-72 w-full bg-stone-900">
              <img
                src={currentPatron.avatar}
                alt={currentPatron.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent"></div>

              {/* Status Badge */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/30 text-[11px] font-bold px-3 py-1 rounded-full shadow-lg">
                {currentPatron.status_badge}
              </div>

              {/* Table Pin */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-stone-200 text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-rose-400" />
                <span>{currentPatron.table}</span>
              </div>

              {/* Identity on photo */}
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <h3 className="text-white text-xl font-bold flex items-center space-x-2">
                  <span>{currentPatron.name}</span>
                </h3>
                <p className="text-stone-300 text-xs font-medium">{currentPatron.role}</p>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-6 text-left space-y-4 flex-1">
              {/* Working on */}
              <div>
                <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Currently Building
                </h4>
                <p className="text-stone-800 text-xs font-semibold">
                  "{currentPatron.current_project}"
                </p>
              </div>

              {/* Looking for */}
              <div>
                <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Open To
                </h4>
                <p className="text-stone-600 text-xs">
                  {currentPatron.looking_for}
                </p>
              </div>

              {/* Interests Chips */}
              <div>
                <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                  Shared Passions
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {currentPatron.interests.map((interest) => (
                    <span
                      key={interest}
                      className="text-[11px] font-medium bg-rose-50 text-rose-800 border border-rose-200/60 px-2.5 py-0.5 rounded-lg"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar (Tinder / Bumble Style) */}
            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-around">
              <button
                onClick={handleNext}
                title="Pass"
                className="w-12 h-12 rounded-full bg-white border border-stone-200 shadow-md text-stone-400 hover:text-stone-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleConnect(currentPatron)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-900/20 active:scale-95 transition-all flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Say Hi & Spark</span>
              </button>

              <button
                onClick={() => {
                  handleConnect(currentPatron);
                  setCoffeeGiftSent(true);
                }}
                title="Send a Coffee"
                className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
              >
                <Coffee className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Gemini AI Icebreaker Modal */}
      {matchedPatron && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100 animate-in fade-in zoom-in-95 duration-200 text-left">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center space-x-2 text-rose-600">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-stone-900 text-base">Mutual Cafe Spark!</h3>
              </div>
              <button
                onClick={() => setMatchedPatron(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Avatars meeting */}
            <div className="flex items-center justify-center space-x-4 py-3">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-stone-900 shadow-md">
                <img src={currentUser.avatar} alt="You" className="w-full h-full object-cover" />
              </div>
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">
                ☕
              </div>
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-rose-500 shadow-md">
                <img src={matchedPatron.avatar} alt={matchedPatron.name} className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="text-center mb-4">
              <h4 className="font-bold text-stone-900 text-sm">{currentUser.name} & {matchedPatron.name}</h4>
              <p className="text-[11px] text-stone-500">Connected at {matchedPatron.table}</p>
            </div>

            {/* Generated Icebreaker Box */}
            <div className="p-4 bg-rose-50/80 rounded-2xl border border-rose-200 text-xs text-rose-950 mb-4">
              <div className="flex items-center space-x-1.5 font-bold text-rose-700 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gemini Contextual Icebreaker:</span>
              </div>
              {loadingIcebreaker ? (
                <p className="text-stone-500 italic">Brewing a personalized icebreaker...</p>
              ) : (
                <p className="font-medium italic leading-relaxed">
                  "{icebreaker}"
                </p>
              )}
            </div>

            {coffeeGiftSent && (
              <div className="mb-4 p-3 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-900 flex items-center space-x-2">
                <Coffee className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span>
                  <strong>Coffee Gift Sent:</strong> A fresh pour-over coupon was delivered to {matchedPatron.name}'s table screen!
                </span>
              </div>
            )}

            <button
              onClick={() => setMatchedPatron(null)}
              className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition-all active:scale-98"
            >
              Ready to Walk Over & Say Hi
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
