import { Search, Radio } from 'lucide-react';
import { OrderCard } from './OrderCard';
import type { Order } from '../App';

type KanbanBoardProps = {
  onReviewPhotos: (order: Order) => void;
  onDispatch: (order: Order) => void;
};

const mockOrders: Order[] = [
  {
    id: '1',
    customerName: 'Rajesh Kumar',
    status: 'Paid',
    column: 'payment',
    medications: ['Metformin', 'Telmisartan'],
  },
  {
    id: '2',
    customerName: 'Anita B',
    status: 'Machine 3 Active',
    column: 'sorting',
    progress: { current: 12, total: 30 },
    machine: 'Machine 3',
  },
  {
    id: '3',
    customerName: 'Suresh P',
    status: 'Awaiting Photo Verify',
    column: 'qc',
    prescription: {
      morning: ['1 White Pill', '1 Yellow Pill'],
      noon: ['1 Yellow Pill'],
      night: ['1 White Pill', '1 Yellow Pill'],
    },
    photos: ['photo1', 'photo2', 'photo3'],
    aiMatch: 100,
  },
  {
    id: '4',
    customerName: 'Order #992',
    status: 'Ready for Pickup',
    column: 'dispatch',
    orderNumber: '#992',
  },
];

export function KanbanBoard({ onReviewPhotos, onDispatch }: KanbanBoardProps) {
  const columns = [
    { 
      id: 'payment', 
      title: 'Payment Received', 
      subtitle: 'Stock Locked',
      color: 'border-green-500'
    },
    { 
      id: 'sorting', 
      title: 'Sorting & Packaging', 
      subtitle: 'In Progress',
      color: 'border-blue-500'
    },
    { 
      id: 'qc', 
      title: 'Quality Control', 
      subtitle: 'Vision Check',
      color: 'border-orange-500'
    },
    { 
      id: 'dispatch', 
      title: 'Dispatch Queue', 
      subtitle: 'Ready',
      color: 'border-green-500'
    },
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold">DOZ3 Ops Control Center</h1>
            <div className="flex items-center gap-2 text-green-400">
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">Indiranagar Hub: Online</span>
            </div>
          </div>
          
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Order #, Patient Name..."
              className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto px-8 py-6">
        <div className="grid grid-cols-4 gap-6 min-w-[1200px]">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div className={`border-l-4 ${column.color} bg-slate-800/30 rounded-lg p-4 mb-4`}>
                <h2 className="font-semibold text-lg">{column.title}</h2>
                <p className="text-sm text-slate-400">{column.subtitle}</p>
              </div>
              
              <div className="space-y-4 flex-1">
                {mockOrders
                  .filter((order) => order.column === column.id)
                  .map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onReviewPhotos={onReviewPhotos}
                      onDispatch={onDispatch}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
