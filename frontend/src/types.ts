export interface MenuItem {
  id: string;
  name: string;
  category: 'Coffee' | 'Tea' | 'Bakery' | 'Food';
  price: number;
  prep_complexity_seconds: number;
  description: string;
  dietary: string[];
  allergens: string[];
  image: string;
  story_video_url?: string;
  story_title?: string;
  story_barista?: string;
}

export interface Customizations {
  milk: string;
  sweetness: string;
  temperature: string;
  size: string;
  notes?: string;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  customizations: Customizations;
  itemPrice: number;
}

export interface OrderTicket {
  id: string;
  customerName: string;
  tableNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    customizations?: Record<string, any>;
  }>;
  totalAmount: number;
  status: 'QUEUED' | 'BREWING' | 'READY' | 'COMPLETED';
  estimatedSecondsRemaining: number;
  createdAt: string;
}

export interface CafePatron {
  id: string;
  name: string;
  avatar: string;
  role: string;
  current_project: string;
  interests: string[];
  status_badge: string;
  table: string;
  looking_for: string;
}

export interface RoomAlert {
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  category: string;
  message: string;
  suggested_action: string;
}

export interface RoomTelemetry {
  overall_sentiment_score: number;
  vibe_summary: string;
  active_patron_count: number;
  immediate_alerts: RoomAlert[];
}
