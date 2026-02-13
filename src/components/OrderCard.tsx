import { Package, Camera, Send } from 'lucide-react';
import type { Order } from '../App';

type OrderCardProps = {
  order: Order;
  onReviewPhotos: (order: Order) => void;
  onDispatch: (order: Order) => void;
};

export function OrderCard({ order, onReviewPhotos, onDispatch }: OrderCardProps) {
  const getStatusColor = () => {
    if (order.status === 'Paid') return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (order.status.includes('Machine')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (order.status.includes('Awaiting')) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    if (order.status.includes('Ready')) return 'bg-green-500/20 text-green-400 border-green-500/30';
    return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold">{order.customerName}</h3>
          {order.orderNumber && (
            <p className="text-xs text-slate-400 mt-0.5">{order.orderNumber}</p>
          )}
        </div>
        <Package className="w-4 h-4 text-slate-400" />
      </div>

      <div className={`inline-block px-2.5 py-1 rounded text-xs font-medium border ${getStatusColor()} mb-3`}>
        {order.status}
      </div>

      {order.medications && (
        <div className="bg-slate-900/50 border border-slate-700 rounded p-2.5 mb-3">
          <p className="text-xs text-slate-400 mb-1">Inventory Reserved</p>
          <div className="flex flex-wrap gap-1.5">
            {order.medications.map((med, idx) => (
              <span key={idx} className="text-xs bg-slate-700 px-2 py-0.5 rounded">
                {med}
              </span>
            ))}
          </div>
        </div>
      )}

      {order.progress && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400">Printing Sachets</span>
            <span className="text-blue-400 font-medium">
              {order.progress.current}/{order.progress.total}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${(order.progress.current / order.progress.total) * 100}%` }}
            />
          </div>
          {order.machine && (
            <p className="text-xs text-slate-400 mt-1.5">{order.machine}</p>
          )}
        </div>
      )}

      {order.column === 'qc' && (
        <button
          onClick={() => onReviewPhotos(order)}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Camera className="w-4 h-4" />
          Review Photos
        </button>
      )}

      {order.column === 'dispatch' && (
        <button
          onClick={() => onDispatch(order)}
          className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Send className="w-4 h-4" />
          Broadcast to Aggregators
        </button>
      )}
    </div>
  );
}
