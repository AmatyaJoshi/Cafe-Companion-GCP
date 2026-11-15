import React from 'react';
import { Coffee, Users, Clock, ShoppingBag, Radio, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'order' | 'wait' | 'cafe_mode' | 'barista_kds';
  setActiveTab: (tab: 'order' | 'wait' | 'cafe_mode' | 'barista_kds') => void;
  cartCount: number;
  openCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md text-stone-100 border-b border-stone-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand & Table Badge */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-900/40">
            <Coffee className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-amber-100 to-amber-200 bg-clip-text text-transparent">
                Cafe Companion
              </h1>
              <span className="hidden sm:inline-flex items-center text-[10px] font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                <Sparkles className="w-2.5 h-2.5 mr-1" /> Gemini AI
              </span>
            </div>
            <div className="flex items-center text-xs text-stone-400 space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>The Roastery • Table 04</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-stone-800/80 p-1 rounded-xl border border-stone-700/60">
          <button
            onClick={() => setActiveTab('order')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'order'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Smart Order</span>
          </button>

          <button
            onClick={() => setActiveTab('wait')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'wait'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Better Waits</span>
          </button>

          <button
            onClick={() => setActiveTab('cafe_mode')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'cafe_mode'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Cafe Mode</span>
          </button>

          <button
            onClick={() => setActiveTab('barista_kds')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'barista_kds'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Staff KDS</span>
          </button>
        </nav>

        {/* Cart Drawer Trigger */}
        <div className="flex items-center space-x-3">
          <button
            onClick={openCart}
            className="relative p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors border border-stone-700/80"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-stone-950 text-xs font-bold rounded-full flex items-center justify-center shadow-md animate-scale">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex border-t border-stone-800 px-2 py-1.5 justify-around bg-stone-950">
        <button
          onClick={() => setActiveTab('order')}
          className={`flex flex-col items-center py-1 px-3 text-[11px] font-medium ${
            activeTab === 'order' ? 'text-amber-500' : 'text-stone-400'
          }`}
        >
          <Coffee className="w-4 h-4 mb-0.5" />
          <span>Order</span>
        </button>

        <button
          onClick={() => setActiveTab('wait')}
          className={`flex flex-col items-center py-1 px-3 text-[11px] font-medium ${
            activeTab === 'wait' ? 'text-amber-500' : 'text-stone-400'
          }`}
        >
          <Clock className="w-4 h-4 mb-0.5" />
          <span>Waits</span>
        </button>

        <button
          onClick={() => setActiveTab('cafe_mode')}
          className={`flex flex-col items-center py-1 px-3 text-[11px] font-medium ${
            activeTab === 'cafe_mode' ? 'text-rose-400 font-bold' : 'text-stone-400'
          }`}
        >
          <Users className="w-4 h-4 mb-0.5" />
          <span>Social</span>
        </button>

        <button
          onClick={() => setActiveTab('barista_kds')}
          className={`flex flex-col items-center py-1 px-3 text-[11px] font-medium ${
            activeTab === 'barista_kds' ? 'text-emerald-400' : 'text-stone-400'
          }`}
        >
          <Radio className="w-4 h-4 mb-0.5" />
          <span>KDS Staff</span>
        </button>
      </div>
    </header>
  );
};
