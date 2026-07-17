import { Package, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export function QuickStats() {
  const stats = [
    {
      label: 'Pending Review',
      value: '12',
      icon: Clock,
      color: 'bg-orange-50 text-orange-600',
    },
    {
      label: 'In Packaging',
      value: '8',
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Ready to Ship',
      value: '5',
      icon: CheckCircle2,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Low Stock',
      value: '4',
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`${stat.color} rounded-xl p-5 shadow-sm border border-gray-200`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm font-medium">{stat.label}</div>
            </div>
            <stat.icon className="w-8 h-8 opacity-50" />
          </div>
        </div>
      ))}
    </div>
  );
}
