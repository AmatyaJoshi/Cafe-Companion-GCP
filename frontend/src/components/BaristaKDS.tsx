import React, { useState } from 'react';
import { OrderTicket, RoomTelemetry } from '../types';
import { Radio, CheckCircle, Clock, AlertTriangle, Sparkles, Thermometer, Music, Wifi, Gift } from 'lucide-react';

interface BaristaKDSProps {
  orders: OrderTicket[];
  telemetry: RoomTelemetry;
  onUpdateStatus: (orderId: string, status: 'QUEUED' | 'BREWING' | 'READY' | 'COMPLETED') => void;
}

export const BaristaKDS: React.FC<BaristaKDSProps> = ({
  orders,
  telemetry,
  onUpdateStatus
}) => {
  const [apologySent, setApologySent] = useState<string | null>(null);

  const handleSendApology = (orderId: string) => {
    setApologySent(orderId);
    setTimeout(() => setApologySent(null), 4000);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* KDS Header Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 border border-stone-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Barista Station KDS & Room Copilot</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Live Kitchen Dispatch
              </span>
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Manage incoming drinks, monitor room sentiment, and maintain prompt hospitality.
          </p>
        </div>

        {/* Ambient Room Vibe Badge */}
        <div className="flex items-center space-x-3 bg-stone-800/90 px-4 py-2.5 rounded-2xl border border-stone-700">
          <div className="text-right">
            <p className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">Room Sentiment</p>
            <p className="text-xs font-bold text-emerald-400">
              {Math.round(telemetry.overall_sentiment_score * 100)}% Positive Vibe
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
            {telemetry.active_patron_count}👥
          </div>
        </div>
      </div>

      {/* Understand the Room: Gemini Barista Operational Alerts */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Gemini Ambient Room Copilot</h3>
              <p className="text-[11px] text-stone-500">Autonomous guest comfort telemetry & operational suggestions</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {telemetry.immediate_alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border text-xs flex items-start space-x-3 ${
                alert.urgency === 'HIGH'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-amber-50/70 border-amber-200 text-amber-900'
              }`}
            >
              <div className="p-2 rounded-xl bg-white shadow-xs flex-shrink-0">
                {alert.category === 'TEMPERATURE' ? (
                  <Thermometer className="w-4 h-4 text-rose-600" />
                ) : alert.category === 'MUSIC' ? (
                  <Music className="w-4 h-4 text-amber-600" />
                ) : (
                  <Wifi className="w-4 h-4 text-emerald-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold uppercase tracking-wider text-[10px]">
                    {alert.category} • {alert.urgency} PRIORITY
                  </span>
                </div>
                <p className="font-medium mb-1.5">{alert.message}</p>
                <div className="p-2 bg-white/80 rounded-xl border border-stone-200/60 font-semibold text-[11px] text-stone-800">
                  👉 Recommended Action: {alert.suggested_action}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Orders Ticket Queue */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-bold text-stone-900 text-sm flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Active Tickets ({orders.length})</span>
          </h3>
          <span className="text-xs text-stone-500">Station 1: Espresso & Steam Bar</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      #{ord.id.replace('ord-', '')}
                    </span>
                    <h4 className="font-bold text-stone-900 text-sm">{ord.customerName}</h4>
                  </div>
                  <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-xl">
                    {ord.tableNumber}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2 mb-4">
                  {ord.items.map((item, iIdx) => (
                    <div key={iIdx} className="text-xs">
                      <div className="flex justify-between font-semibold text-stone-800">
                        <span>{item.quantity}x {item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      {item.customizations && (
                        <p className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md mt-0.5 inline-block font-medium">
                          {Object.entries(item.customizations)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(' • ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="pt-3 border-t border-stone-100 space-y-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-stone-500 font-medium">Current Status:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full text-[10px] uppercase ${
                      ord.status === 'READY'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ord.status === 'BREWING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onUpdateStatus(ord.id, 'BREWING')}
                    disabled={ord.status === 'BREWING' || ord.status === 'READY'}
                    className="py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-bold text-xs transition-colors"
                  >
                    Mark Brewing
                  </button>

                  <button
                    onClick={() => onUpdateStatus(ord.id, 'READY')}
                    disabled={ord.status === 'READY'}
                    className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs transition-colors"
                  >
                    Mark Ready
                  </button>
                </div>

                {/* Proactive Service Recovery Button */}
                <button
                  onClick={() => handleSendApology(ord.id)}
                  className="w-full py-1.5 rounded-lg border border-dashed border-stone-300 hover:border-amber-500 text-stone-500 hover:text-amber-800 text-[11px] font-medium flex items-center justify-center space-x-1 transition-colors"
                >
                  <Gift className="w-3 h-3 text-amber-600" />
                  <span>
                    {apologySent === ord.id ? '✓ Delay Cookie Token Sent' : 'Send Proactive Apology Token'}
                  </span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
