import type { LucideIcon } from 'lucide-react';
import { OrderWorkflowCard } from './OrderWorkflowCard';
import type { Order } from '../App';

type Column = {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  iconColor: string;
};

type WorkflowColumnProps = {
  column: Column;
  orders: Order[];
  onVerifyPrescription: (order: Order) => void;
  onReviewQC: (order: Order) => void;
  onDispatch: (order: Order) => void;
};

export function WorkflowColumn({ column, orders, onVerifyPrescription, onReviewQC, onDispatch }: WorkflowColumnProps) {
  const Icon = column.icon;

  return (
    <div className="flex flex-col h-full">
      <div className={`border-l-4 ${column.color} ${column.bgColor} rounded-lg p-4 mb-4 shadow-sm`}>
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`w-5 h-5 ${column.iconColor}`} />
          <h3 className="font-bold text-gray-900">{column.title}</h3>
        </div>
        <p className="text-xs text-gray-600">{column.subtitle}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-500">Orders</span>
          <span className={`text-sm font-bold ${column.iconColor}`}>{orders.length}</span>
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {orders.map((order) => (
          <OrderWorkflowCard
            key={order.id}
            order={order}
            onVerifyPrescription={onVerifyPrescription}
            onReviewQC={onReviewQC}
            onDispatch={onDispatch}
          />
        ))}
      </div>
    </div>
  );
}
