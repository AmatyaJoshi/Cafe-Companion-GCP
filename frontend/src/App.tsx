import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StoryReels } from './components/StoryReels';
import { ConversationalBar } from './components/ConversationalBar';
import { MenuGrid } from './components/MenuGrid';
import { WaitTracker } from './components/WaitTracker';
import { CafeModeDeck } from './components/CafeModeDeck';
import { RoomFeedbackWidget } from './components/RoomFeedbackWidget';
import { BaristaKDS } from './components/BaristaKDS';
import { CartDrawer } from './components/CartDrawer';
import { MenuItem, Customizations, CartItem, OrderTicket, CafePatron, RoomTelemetry } from './types';
import { fetchMenu, fetchPatrons, fetchRoomTelemetry, fallbackMenu } from './services/api';
import { Sparkles, Coffee } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'order' | 'wait' | 'cafe_mode' | 'barista_kds'>('order');
  const [menu, setMenu] = useState<MenuItem[]>(fallbackMenu);
  const [patrons, setPatrons] = useState<CafePatron[]>([]);
  const [telemetry, setTelemetry] = useState<RoomTelemetry>({
    overall_sentiment_score: 0.85,
    vibe_summary: "Warm, productive co-working atmosphere with steady caffeine flow.",
    active_patron_count: 18,
    immediate_alerts: [
      {
        urgency: "HIGH",
        category: "TEMPERATURE",
        message: "Patrons near Table 4 reported AC too cold.",
        suggested_action: "Adjust mezzanine thermostat from 19°C to 22°C."
      }
    ]
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<OrderTicket | null>({
    id: 'ord-104',
    customerName: 'Alex Rivera',
    tableNumber: 'Table 04',
    items: [
      { name: 'Ethiopian Yirgacheffe Pour-Over', quantity: 1, price: 5.75, customizations: { temperature: 'Hot' } }
    ],
    totalAmount: 5.75,
    status: 'BREWING',
    estimatedSecondsRemaining: 110,
    createdAt: new Date().toISOString()
  });

  const [allOrders, setAllOrders] = useState<OrderTicket[]>([
    {
      id: 'ord-104',
      customerName: 'Alex Rivera',
      tableNumber: 'Table 04',
      items: [
        { name: 'Ethiopian Yirgacheffe Pour-Over', quantity: 1, price: 5.75, customizations: { temperature: 'Hot' } }
      ],
      totalAmount: 5.75,
      status: 'BREWING',
      estimatedSecondsRemaining: 110,
      createdAt: new Date().toISOString()
    },
    {
      id: 'ord-102',
      customerName: 'Maya Lin',
      tableNumber: 'Table 09',
      items: [
        { name: 'Iced Vanilla Oat Latte', quantity: 1, price: 6.25, customizations: { milk: 'Oat', sweetness: '50%' } },
        { name: 'Cardamom Pistachio Croissant', quantity: 1, price: 4.95 }
      ],
      totalAmount: 11.20,
      status: 'QUEUED',
      estimatedSecondsRemaining: 180,
      createdAt: new Date(Date.now() - 45000).toISOString()
    }
  ]);

  useEffect(() => {
    async function loadData() {
      const [m, p, t] = await Promise.all([
        fetchMenu(),
        fetchPatrons(),
        fetchRoomTelemetry()
      ]);
      setMenu(m);
      setPatrons(p);
      setTelemetry(t);
    }
    loadData();
  }, []);

  // Cart operations
  const handleAddToCart = (menuItem: MenuItem, customizations: Customizations) => {
    const extraPrice = customizations.size === 'Large' ? 0.75 : 0;
    const itemPrice = menuItem.price + extraPrice;
    const newItem: CartItem = {
      id: `${menuItem.id}-${Date.now()}`,
      menuItem,
      quantity: 1,
      customizations,
      itemPrice
    };
    setCart(prev => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const handleAddExtractedItems = (items: Array<{ menuItem: MenuItem; customizations: Customizations; quantity: number }>) => {
    const newCartItems: CartItem[] = items.map(itm => {
      const extraPrice = itm.customizations.size === 'Large' ? 0.75 : 0;
      return {
        id: `${itm.menuItem.id}-${Date.now()}-${Math.random()}`,
        menuItem: itm.menuItem,
        quantity: itm.quantity,
        customizations: itm.customizations,
        itemPrice: itm.menuItem.price + extraPrice
      };
    });
    setCart(prev => [...prev, ...newCartItems]);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const handleRemoveItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = (customerName: string, tableNumber: string) => {
    const subtotal = cart.reduce((acc, i) => acc + (i.itemPrice * i.quantity), 0);
    const tax = subtotal * 0.0825;
    const newOrder: OrderTicket = {
      id: `ord-${Math.floor(100 + Math.random() * 900)}`,
      customerName,
      tableNumber,
      items: cart.map(i => ({
        name: i.menuItem.name,
        quantity: i.quantity,
        price: i.itemPrice,
        customizations: i.customizations
      })),
      totalAmount: subtotal + tax,
      status: 'QUEUED',
      estimatedSecondsRemaining: 180,
      createdAt: new Date().toISOString()
    };

    setActiveOrder(newOrder);
    setAllOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setIsCartOpen(false);
    setActiveTab('wait');
  };

  const handleUpdateOrderStatus = (orderId: string, status: 'QUEUED' | 'BREWING' | 'READY' | 'COMPLETED') => {
    setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder(prev => prev ? { ...prev, status } : null);
    }
  };

  const handleSimulateGeofence = (orderId: string) => {
    console.log(`[Geofence] Triggered 300m Crema Ping for order: ${orderId}`);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col selection:bg-amber-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        openCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        
        {/* Tab 1: Smart Order & Menu */}
        {activeTab === 'order' && (
          <div className="space-y-6">
            {/* Instagram-Style Story Highlights */}
            <StoryReels
              items={menu}
              onQuickOrder={(item) => handleAddToCart(item, {
                milk: 'Standard',
                sweetness: 'Normal',
                temperature: 'Hot',
                size: 'Regular'
              })}
            />

            {/* Gemini Conversational Order Assistant */}
            <ConversationalBar
              onAddExtractedItems={handleAddExtractedItems}
              availableMenu={menu}
            />

            {/* Menu Catalog */}
            <MenuGrid
              menu={menu}
              onAddToCart={handleAddToCart}
            />

            {/* Ambient Room Feedback Footer */}
            <RoomFeedbackWidget />
          </div>
        )}

        {/* Tab 2: Better Waits & Peak Forecaster */}
        {activeTab === 'wait' && (
          <div className="space-y-6">
            <WaitTracker
              currentOrder={activeOrder}
              onSimulateGeofence={handleSimulateGeofence}
            />
            <RoomFeedbackWidget />
          </div>
        )}

        {/* Tab 3: Connect People ("Cafe Mode" Social Lounge) */}
        {activeTab === 'cafe_mode' && (
          <div className="space-y-6">
            <CafeModeDeck
              patrons={patrons}
            />
          </div>
        )}

        {/* Tab 4: Barista Station KDS & Room Telemetry */}
        {activeTab === 'barista_kds' && (
          <div className="space-y-6">
            <BaristaKDS
              orders={allOrders}
              telemetry={telemetry}
              onUpdateStatus={handleUpdateOrderStatus}
            />
          </div>
        )}

      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 text-center text-xs text-stone-500">
        <p className="flex items-center justify-center space-x-1.5 font-medium">
          <Coffee className="w-3.5 h-3.5 text-amber-600" />
          <span>Cafe Companion • Built for Google Cloud & Gemini AI Ecosystem</span>
        </p>
      </footer>
    </div>
  );
};

export default App;
