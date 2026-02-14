import { ArrowLeft, Bell, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { mockNotifications } from '../data/notifications';

type NotificationsPageProps = {
  onBack: () => void;
};

export function NotificationsPage({ onBack }: NotificationsPageProps) {
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500">{unreadCount} unread</p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </header>
      <div className="px-6 py-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
          {mockNotifications.map((n) => {
            const Icon = n.type === 'alert' ? AlertCircle : n.type === 'success' ? CheckCircle2 : Info;
            const iconBg = n.type === 'alert' ? 'bg-red-100' : n.type === 'success' ? 'bg-green-100' : 'bg-blue-100';
            const iconColor = n.type === 'alert' ? 'text-red-600' : n.type === 'success' ? 'text-green-600' : 'text-blue-600';
            return (
              <div
                key={n.id}
                className={`px-6 py-4 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}
              >
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{n.title}</h3>
                    <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{n.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
