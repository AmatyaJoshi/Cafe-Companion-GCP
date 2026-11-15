import React, { useState } from 'react';
import { MenuItem, Customizations } from '../types';
import { Plus, Clock, Sparkles, Check, X } from 'lucide-react';

interface MenuGridProps {
  menu: MenuItem[];
  onAddToCart: (item: MenuItem, customizations: Customizations) => void;
}

export const MenuGrid: React.FC<MenuGridProps> = ({ menu, onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  // Customization state
  const [milk, setMilk] = useState('Whole Milk');
  const [sweetness, setSweetness] = useState('Normal');
  const [temperature, setTemperature] = useState('Hot');
  const [size, setSize] = useState('Regular');
  const [notes, setNotes] = useState('');

  const categories = ['All', 'Coffee', 'Tea', 'Bakery', 'Food'];

  const filtered = activeCategory === 'All'
    ? menu
    : menu.filter(m => m.category === activeCategory);

  const handleOpenCustomize = (item: MenuItem) => {
    setCustomizingItem(item);
    // Reset defaults based on item
    setTemperature(item.name.toLowerCase().includes('iced') || item.name.toLowerCase().includes('cold') ? 'Iced' : 'Hot');
    setMilk(item.dietary.includes('Vegan') ? 'Oat Milk' : 'Whole Milk');
    setSweetness('Normal');
    setSize('Regular');
    setNotes('');
  };

  const handleConfirmCustomize = () => {
    if (customizingItem) {
      onAddToCart(customizingItem, {
        milk,
        sweetness,
        temperature,
        size,
        notes
      });
      setCustomizingItem(null);
    }
  };

  return (
    <div>
      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-3 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activeCategory === cat
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-stone-200/80 text-stone-700 hover:bg-stone-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            {/* Image Header with Prep Badge */}
            <div className="relative h-44 w-full overflow-hidden bg-stone-100">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>{Math.round(item.prep_complexity_seconds / 60)}m prep</span>
              </div>
              <div className="absolute bottom-2 right-2 bg-stone-900/80 backdrop-blur-sm text-amber-400 font-bold text-xs px-2.5 py-1 rounded-lg">
                ${item.price.toFixed(2)}
              </div>
            </div>

            {/* Body */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm mb-1 group-hover:text-amber-700 transition-colors">
                  {item.name}
                </h3>
                <p className="text-stone-500 text-xs line-clamp-2 mb-3">
                  {item.description}
                </p>

                {/* Dietary Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.dietary.map((d) => (
                    <span
                      key={d}
                      className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-medium"
                    >
                      {d}
                    </span>
                  ))}
                  {item.allergens.map((a) => (
                    <span
                      key={a}
                      className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-medium"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleOpenCustomize(item)}
                className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-all active:scale-98 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Customize & Order</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Starbucks-Style Customization Modal */}
      {customizingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900">{customizingItem.name}</h3>
                <p className="text-xs text-stone-500">${customizingItem.price.toFixed(2)} base price</p>
              </div>
              <button
                onClick={() => setCustomizingItem(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customization Options */}
            <div className="space-y-4 text-xs">
              {/* Milk Option */}
              {customizingItem.category !== 'Food' && customizingItem.category !== 'Bakery' && (
                <div>
                  <label className="font-semibold text-stone-700 block mb-1.5">Milk Option</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Whole Milk', 'Oat Milk', 'Almond Milk'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMilk(m)}
                        className={`py-1.5 px-2 rounded-xl font-medium border text-center transition-all ${
                          milk === m
                            ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Temperature */}
              <div>
                <label className="font-semibold text-stone-700 block mb-1.5">Temperature</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Hot', 'Iced'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTemperature(t)}
                      className={`py-1.5 px-2 rounded-xl font-medium border text-center transition-all ${
                        temperature === t
                          ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sweetness */}
              {customizingItem.category !== 'Food' && (
                <div>
                  <label className="font-semibold text-stone-700 block mb-1.5">Sweetness</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Zero Sugar', '50% Sweet', 'Normal'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSweetness(s)}
                        className={`py-1.5 px-2 rounded-xl font-medium border text-center transition-all ${
                          sweetness === s
                            ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size */}
              <div>
                <label className="font-semibold text-stone-700 block mb-1.5">Size</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Regular', 'Large (+$0.75)'].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSize(sz.split(' ')[0])}
                      className={`py-1.5 px-2 rounded-xl font-medium border text-center transition-all ${
                        size === sz.split(' ')[0]
                          ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Notes */}
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Barista Notes (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Extra hot, splash of cinnamon on top"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Confirm */}
            <div className="mt-6 pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="font-bold text-stone-900 text-sm">
                ${(customizingItem.price + (size === 'Large' ? 0.75 : 0)).toFixed(2)}
              </span>
              <button
                onClick={handleConfirmCustomize}
                className="flex items-center space-x-1.5 py-2.5 px-5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
