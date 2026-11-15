import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, Navigation, Flame, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import { OrderTicket } from '../types';

interface WaitTrackerProps {
  currentOrder: OrderTicket | null;
  onSimulateGeofence: (orderId: string) => void;
}

export const WaitTracker: React.FC<WaitTrackerProps> = ({
  currentOrder,
  onSimulateGeofence
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(currentOrder?.estimatedSecondsRemaining || 140);
  const [geofenceTriggered, setGeofenceTriggered] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progressPercent = Math.max(0, Math.min(100, Math.round(((180 - secondsLeft) / 180) * 100)));

  const handleTriggerGeofence = () => {
    if (currentOrder) {
      setGeofenceTriggered(true);
      onSimulateGeofence(currentOrder.id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Active Order Progress Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
              <h3 className="font-bold text-stone-900 text-base">
                {currentOrder ? `Order #${currentOrder.id.replace('ord-', '')}` : 'Live Prep Queue'}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wide">
                {secondsLeft === 0 ? 'Ready for Pickup' : 'Brewing Station'}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Barista Maya is crafting your drink • Station 2
            </p>
          </div>

          {/* Time Remaining Badge */}
          <div className="flex items-center space-x-2 bg-stone-900 text-white px-4 py-2 rounded-2xl shadow-inner">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="font-mono font-bold text-lg">
              {secondsLeft === 0 ? 'READY' : `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
            </span>
          </div>
        </div>

        {/* Progress Bar with Steps */}
        <div className="py-6">
          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden mb-4">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${secondsLeft === 0 ? 100 : progressPercent}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-3 text-center text-xs">
            <div className={`flex flex-col items-center ${progressPercent >= 10 ? 'text-amber-800 font-bold' : 'text-stone-400'}`}>
              <CheckCircle2 className="w-4 h-4 mb-1" />
              <span>Ticket Received</span>
            </div>
            <div className={`flex flex-col items-center ${progressPercent >= 50 ? 'text-amber-800 font-bold' : 'text-stone-400'}`}>
              <Flame className="w-4 h-4 mb-1" />
              <span>Espresso & Steaming</span>
            </div>
            <div className={`flex flex-col items-center ${secondsLeft === 0 ? 'text-emerald-700 font-bold' : 'text-stone-400'}`}>
              <ShieldCheck className="w-4 h-4 mb-1" />
              <span>Ready at Counter</span>
            </div>
          </div>
        </div>

        {/* Geofence Freshness Trigger */}
        <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3 text-left">
            <div className="p-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold flex-shrink-0">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">Crema-Protection Geofence</h4>
              <p className="text-[11px] text-stone-600">
                Pulls your espresso shot only when you are 300m away so crema never dies.
              </p>
            </div>
          </div>

          <button
            onClick={handleTriggerGeofence}
            disabled={geofenceTriggered}
            className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              geofenceTriggered
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-stone-900 hover:bg-stone-800 text-white active:scale-95'
            }`}
          >
            {geofenceTriggered ? '✓ Approaching (300m Alert Sent)' : 'Simulate Walking to Cafe'}
          </button>
        </div>
      </div>

      {/* Best Time to Visit & Crowd Forecaster */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-stone-100 text-stone-800">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Best Time to Visit & Crowd Radar</h3>
              <p className="text-[11px] text-stone-500">Live seat availability & ambient crowd forecast</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Cozy & Focused Right Now
          </span>
        </div>

        {/* Hourly Heatmap Chart */}
        <div className="space-y-2 pt-2">
          {[
            { hour: '8:00 AM', level: 'High', pct: '85%', label: 'Morning Commute Rush' },
            { hour: '10:00 AM', level: 'Low', pct: '30%', label: 'Quiet Focus Window (Plentiful Outlets)' },
            { hour: '12:30 PM', level: 'Peak', pct: '95%', label: 'Lunch & Networking Peak' },
            { hour: '2:30 PM', level: 'Low', pct: '40%', label: 'Cozy Afternoon Study Vibe' },
            { hour: '4:30 PM', level: 'Medium', pct: '60%', label: 'Casual Wind-Down' },
          ].map((slot, idx) => (
            <div key={idx} className="flex items-center text-xs py-1.5 border-b border-stone-50 last:border-none">
              <span className="w-20 font-mono text-stone-600 font-semibold">{slot.hour}</span>
              <div className="flex-1 mx-3 bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    slot.level === 'Low' ? 'bg-emerald-500' : slot.level === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: slot.pct }}
                ></div>
              </div>
              <span className="w-48 text-[11px] text-stone-500 text-right truncate">{slot.label}</span>
            </div>
          ))}
        </div>

        {/* AI Seating Advice */}
        <div className="mt-4 p-3 rounded-2xl bg-stone-50 border border-stone-200/60 text-xs text-stone-700 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Gemini Seating Forecast:</strong> 2 quiet booth tables near the bookshelf are expected to open up around <strong>11:15 AM</strong>.
          </span>
        </div>
      </div>

    </div>
  );
};
