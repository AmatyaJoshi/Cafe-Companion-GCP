import React, { useState } from 'react';
import { MenuItem } from '../types';
import { Play, X, Plus, Sparkles } from 'lucide-react';

interface StoryReelsProps {
  items: MenuItem[];
  onQuickOrder: (item: MenuItem) => void;
}

export const StoryReels: React.FC<StoryReelsProps> = ({ items, onQuickOrder }) => {
  const [selectedStory, setSelectedStory] = useState<MenuItem | null>(null);

  const stories = items.filter(i => i.story_video_url);

  return (
    <div className="py-3">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Barista Live Drops & Daily Roasts</span>
        </div>
        <span className="text-[11px] text-amber-700 font-medium">Stories expire in 8h</span>
      </div>

      {/* Reel Circles */}
      <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar py-2 px-1">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => setSelectedStory(story)}
            className="flex-shrink-0 flex flex-col items-center space-y-1.5 group focus:outline-none"
          >
            <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-400 group-hover:scale-105 transition-transform duration-200 shadow-md">
              <div className="w-full h-full rounded-full border-2 border-stone-900 overflow-hidden bg-stone-800 relative">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 text-white/90 fill-white" />
                </div>
              </div>
            </div>
            <span className="text-[11px] font-medium text-stone-700 max-w-[70px] truncate text-center">
              {story.name.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Instagram Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm h-[580px] bg-stone-950 rounded-3xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
            
            {/* Story Top Bar */}
            <div className="absolute top-0 inset-x-0 p-4 z-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
              <div className="w-full h-1 bg-white/30 rounded-full mb-3 overflow-hidden">
                <div className="w-3/4 h-full bg-amber-400 rounded-full animate-pulse"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full border border-amber-400 overflow-hidden">
                    <img src={selectedStory.image} alt="Barista" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-white text-xs font-semibold">{selectedStory.story_barista || 'Head Barista'}</h4>
                    <p className="text-stone-300 text-[10px]">{selectedStory.story_title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStory(null)}
                  className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Reel Content */}
            <div className="absolute inset-0 z-10">
              <img
                src={selectedStory.story_video_url || selectedStory.image}
                alt={selectedStory.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30"></div>
            </div>

            {/* Bottom Actions & Order Button */}
            <div className="relative z-20 p-5 mt-auto text-left">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500 text-stone-950 mb-2">
                Fresh Roast Drop
              </span>
              <h3 className="text-white text-lg font-bold mb-1">{selectedStory.name}</h3>
              <p className="text-stone-300 text-xs mb-4 line-clamp-2">{selectedStory.description}</p>
              
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-amber-400 font-bold text-lg">${selectedStory.price.toFixed(2)}</span>
                <button
                  onClick={() => {
                    onQuickOrder(selectedStory);
                    setSelectedStory(null);
                  }}
                  className="flex items-center space-x-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Order This Now</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
