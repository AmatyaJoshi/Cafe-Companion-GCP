import express, { Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const AI_BACKEND_URL = process.env.AI_BACKEND_URL || 'http://localhost:8000';

// In-Memory Real-time State
interface OrderTicket {
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

let activeOrders: OrderTicket[] = [
  {
    id: 'ord-101',
    customerName: 'Alex Rivera',
    tableNumber: 'Table 04',
    items: [
      { name: 'Ethiopian Yirgacheffe Pour-Over', quantity: 1, price: 5.75, customizations: { temperature: 'Hot' } }
    ],
    totalAmount: 5.75,
    status: 'BREWING',
    estimatedSecondsRemaining: 90,
    createdAt: new Date(Date.now() - 150000).toISOString()
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
];

// Active Cafe Mode Presence
interface ActivePatron {
  id: string;
  name: string;
  avatar: string;
  role: string;
  currentProject: string;
  interests: string[];
  statusBadge: string;
  table: string;
  lookingFor: string;
}

let activePatrons: ActivePatron[] = [
  {
    id: 'patron-1',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    role: 'AI Engineer & Founder',
    currentProject: 'Building an autonomous agent workflow engine',
    interests: ['Generative AI', 'Distributed Systems', 'Specialty Coffee'],
    statusBadge: 'Open to 15m Coffee Chat ☕',
    table: 'Table 04 (Mezzanine)',
    lookingFor: 'Looking for seed co-founders & feedback on agentic UI'
  },
  {
    id: 'patron-2',
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    role: 'Product Designer',
    currentProject: 'Redesigning local community micro-apps',
    interests: ['Figma Systems', 'Urbanism', 'Matcha'],
    statusBadge: 'Designing in Flow 🎨',
    table: 'Table 09 (Window Bar)',
    lookingFor: 'Collaborating with full-stack engineers'
  }
];

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    service: 'Cafe Companion Real-time Gateway',
    status: 'healthy',
    activeConnections: io.engine.clientsCount,
    aiBackendTarget: AI_BACKEND_URL,
    timestamp: new Date().toISOString()
  });
});

// Orders API
app.get('/api/orders', (req: Request, res: Response) => {
  res.json({ orders: activeOrders });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const { customerName, tableNumber, items, totalAmount, estimatedWaitSeconds } = req.body;
  const newOrder: OrderTicket = {
    id: `ord-${Math.floor(100 + Math.random() * 900)}`,
    customerName: customerName || 'Guest',
    tableNumber: tableNumber || 'Pickup Counter',
    items: items || [],
    totalAmount: totalAmount || 0,
    status: 'QUEUED',
    estimatedSecondsRemaining: estimatedWaitSeconds || 180,
    createdAt: new Date().toISOString()
  };

  activeOrders.unshift(newOrder);

  // Broadcast new order to Barista Kitchen Display System (KDS)
  io.emit('order:created', newOrder);

  res.status(201).json({ status: 'success', order: newOrder });
});

app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = activeOrders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  if (status === 'READY') {
    order.estimatedSecondsRemaining = 0;
  }

  // Notify customer app in real-time
  io.emit('order:status_updated', order);

  res.json({ status: 'success', order });
});

// Presence & Cafe Mode API
app.get('/api/presence', (req: Request, res: Response) => {
  res.json({ patrons: activePatrons });
});

app.post('/api/presence/join', (req: Request, res: Response) => {
  const patronData: ActivePatron = req.body;
  if (!patronData.id) {
    patronData.id = `patron-${Date.now()}`;
  }

  const existingIdx = activePatrons.findIndex(p => p.id === patronData.id);
  if (existingIdx >= 0) {
    activePatrons[existingIdx] = patronData;
  } else {
    activePatrons.push(patronData);
  }

  io.emit('presence:joined', patronData);
  res.json({ status: 'joined', patron: patronData });
});

app.post('/api/social/spark', (req: Request, res: Response) => {
  const { fromUserId, fromUserName, toUserId, actionType, message } = req.body;
  
  const payload = {
    fromUserId,
    fromUserName,
    toUserId,
    actionType: actionType || 'WAVE', // WAVE, SHARE_TABLE, GIFT_COFFEE
    message: message || `${fromUserName} sent you a friendly wave!`,
    timestamp: new Date().toISOString()
  };

  // Real-time ping to recipient
  io.emit(`social:spark:${toUserId}`, payload);
  res.json({ status: 'sent', payload });
});

// Ambient Room Telemetry Broadcast
app.post('/api/room/telemetry', (req: Request, res: Response) => {
  const { category, tag, comment, tableNumber } = req.body;
  const alert = {
    id: `alert-${Date.now()}`,
    category,
    tag,
    comment,
    tableNumber,
    timestamp: new Date().toISOString()
  };

  io.emit('room:ambient_alert', alert);
  res.json({ status: 'broadcasted', alert });
});

// Socket.io Handlers
io.on('connection', (socket: Socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });

  // Client triggers geofence proximity trigger for fresh crema
  socket.on('geofence:approaching', (data: { orderId: string; distanceMeters: number }) => {
    console.log(`[Geofence] Customer approaching for order ${data.orderId}: ${data.distanceMeters}m`);
    io.emit('barista:prep_crema_alert', {
      orderId: data.orderId,
      message: `Customer is ${data.distanceMeters}m away! Pull espresso shots now for fresh crema.`
    });
  });
});

// Start Express Server
server.listen(PORT, () => {
  console.log(`☕ Cafe Companion Real-time Gateway running on port ${PORT}`);
});
