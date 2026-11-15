import React, { useState } from 'react';
import { Sparkles, Mic, ArrowRight, Loader2, ShieldAlert } from 'lucide-react';
import { postConversationalOrder } from '../services/api';
import { MenuItem, Customizations } from '../types';

interface ConversationalBarProps {
  onAddExtractedItems: (items: Array<{ menuItem: MenuItem; customizations: Customizations; quantity: number }>) => void;
  availableMenu: MenuItem[];
}

export const ConversationalBar: React.FC<ConversationalBarProps> = ({
  onAddExtractedItems,
  availableMenu
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);

  const samplePrompts = [
    "Iced vanilla oat latte, 50% sweet, and a croissant",
    "Piping hot pour-over with oat milk",
    "Something refreshing with high caffeine",
    "Vegan breakfast with green tea"
  ];

  const toggleDiet = (diet: string) => {
    setSelectedDiets(prev =>
      prev.includes(diet) ? prev.filter(d => d !== diet) : [...prev, diet]
    );
  };

  const handleSimulateVoice = () => {
    setIsListening(true);
    setPrompt("Listening to voice...");
    setTimeout(() => {
      setPrompt("Large iced oat flat white with zero sugar and a mushroom melt");
      setIsListening(false);
    }, 1500);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setWarnings([]);
    setAiMessage(null);

    try {
      const res = await postConversationalOrder(prompt, selectedDiets);
      if (res && res.items) {
        setAiMessage(res.ai_response_message);
        if (res.dietary_warnings && res.dietary_warnings.length > 0) {
          setWarnings(res.dietary_warnings);
        }

        // Map to internal cart structure
        const mappedItems = res.items.map((item: any) => {
          const found = availableMenu.find(m => m.id === item.item_id || m.name.toLowerCase() === item.name.toLowerCase()) || availableMenu[0];
          return {
            menuItem: found,
            quantity: item.quantity || 1,
            customizations: {
              milk: item.customizations?.milk || 'Standard',
              sweetness: item.customizations?.sweetness || 'Normal',
              temperature: item.customizations?.temperature || 'Hot',
              size: item.customizations?.size || 'Regular',
              notes: item.customizations?.notes || ''
            }
          };
        });

        onAddExtractedItems(mappedItems);
        setPrompt('');
      }
    } catch (err) {
      console.error(err);
      setAiMessage("Sorry, I had a momentary hiccup parsing that. Could you try rephrasing?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-stone-900 to-stone-950 p-4 sm:p-5 rounded-2xl text-white shadow-xl border border-stone-800 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-100 flex items-center space-x-1.5">
              <span>Conversational Smart Barista</span>
              <span className="text-[10px] text-amber-400 font-normal">Gemini 2.0</span>
            </h3>
            <p className="text-[11px] text-stone-400">Order naturally in plain English or voice</p>
          </div>
        </div>

        {/* Dietary Safety Filters */}
        <div className="hidden sm:flex items-center space-x-1.5">
          {['Vegan', 'Gluten-Free', 'Nut-Allergy'].map((diet) => (
            <button
              key={diet}
              onClick={() => toggleDiet(diet)}
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-all ${
                selectedDiets.includes(diet)
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {diet}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="relative flex items-center mb-2.5">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='e.g. "Get me an iced oat vanilla latte and a fresh pastry..."'
          className="w-full bg-stone-800/90 text-stone-100 placeholder-stone-500 text-xs sm:text-sm pl-4 pr-24 py-3 rounded-xl border border-stone-700/80 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
        />

        <div className="absolute right-2 flex items-center space-x-1.5">
          <button
            type="button"
            onClick={handleSimulateVoice}
            title="Speak Order"
            className={`p-2 rounded-lg transition-colors ${
              isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-stone-700 hover:bg-stone-600 text-stone-300'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
          </button>

          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="p-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </form>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 text-[11px]">
        <span className="text-stone-400 flex-shrink-0">Try:</span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setPrompt(p)}
            className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors border border-stone-700/50"
          >
            "{p}"
          </button>
        ))}
      </div>

      {/* AI Response Bubble */}
      {aiMessage && (
        <div className="mt-3 p-3 bg-stone-800/60 rounded-xl border border-amber-500/30 text-xs text-amber-200 flex items-start space-x-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Gemini Barista: </span>
            {aiMessage}
          </div>
        </div>
      )}

      {/* Dietary Warnings */}
      {warnings.length > 0 && (
        <div className="mt-2 p-3 bg-rose-950/40 rounded-xl border border-rose-500/40 text-xs text-rose-300 flex items-start space-x-2 animate-in fade-in">
          <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white">Allergy Guardrail: </span>
            {warnings.join(' • ')}
          </div>
        </div>
      )}
    </div>
  );
};
