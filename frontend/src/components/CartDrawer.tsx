import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (customerName: string, tableNumber: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const [customerName, setCustomerName] = useState('Alex Rivera');
  const [tableNumber, setTableNumber] = useState('Table 04');

  if (!isOpen) return null;

  const total = items.reduce((acc, item) => acc + (item.itemPrice * item.quantity), 0);
  const tax = total * 0.0825;
  const grandTotal = total + tax;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-stone-900 text-base">Your Cafe Cart</h3>
            <span className="text-xs font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-left">
          {items.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 stroke-1 text-stone-300" />
              <p className="text-sm font-semibold text-stone-600">Your cart is currently empty</p>
              <p className="text-xs text-stone-400 mt-1">
                Add an espresso or bakery item to get brewing!
              </p>
            </div>
          ) : (
            items.map((cartItem) => (
              <div
                key={cartItem.id}
                className="p-3 rounded-2xl border border-stone-100 bg-stone-50/60 flex items-start justify-between space-x-3"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-200 flex-shrink-0">
                  <img
                    src={cartItem.menuItem.image}
                    alt={cartItem.menuItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-stone-900 text-xs">{cartItem.menuItem.name}</h4>
                  <p className="text-[11px] font-semibold text-amber-700">
                    ${cartItem.itemPrice.toFixed(2)} each
                  </p>

                  {/* Customization Details */}
                  <div className="text-[10px] text-stone-500 mt-1 space-y-0.5">
                    {cartItem.customizations.milk && <span>• {cartItem.customizations.milk}</span>}
                    {cartItem.customizations.sweetness && <span> • {cartItem.customizations.sweetness}</span>}
                    {cartItem.customizations.temperature && <span> • {cartItem.customizations.temperature}</span>}
                    {cartItem.customizations.size && <span> • {cartItem.customizations.size}</span>}
                    {cartItem.customizations.notes && <p className="italic">Note: "{cartItem.customizations.notes}"</p>}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => onUpdateQuantity(cartItem.id, -1)}
                      className="w-5 h-5 rounded-md bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center hover:bg-stone-300"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-stone-800">{cartItem.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(cartItem.id, 1)}
                      className="w-5 h-5 rounded-md bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center hover:bg-stone-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveItem(cartItem.id)}
                  className="p-1 text-stone-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}

          {/* Table & Guest Input */}
          {items.length > 0 && (
            <div className="pt-3 border-t border-stone-100 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">Your Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">Table / Seating Location</label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout Button */}
        {items.length > 0 && (
          <div className="p-5 border-t border-stone-100 bg-stone-50/50 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Estimated Tax (8.25%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-stone-900 text-sm pt-1 border-t border-stone-200">
                <span>Total</span>
                <span className="text-amber-800">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => onCheckout(customerName, tableNumber)}
              className="w-full py-3 px-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-900/20 active:scale-98 transition-all flex items-center justify-center space-x-2"
            >
              <span>Place Order • Start Wait Tracker</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center space-x-1.5 text-[10px] text-stone-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Apple Pay & Google Pay One-Tap Handshake</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
