import { Search, Bell, User, Activity, Pill, Settings, LogOut, HelpCircle, DollarSign, Package2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { TabType } from '../App';

type HeaderProps = {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
};

type Notification = {
  id: string;
  type: 'alert' | 'info' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Low Stock Alert',
    message: 'Metformin stock below minimum threshold',
    time: '5 mins ago',
    read: false,
  },
  {
    id: '2',
    type: 'info',
    title: 'New Order Received',
    message: 'Order #10240 requires prescription verification',
    time: '12 mins ago',
    read: false,
  },
  {
    id: '3',
    type: 'success',
    title: 'Dispatch Complete',
    message: 'Order #10232 delivered successfully',
    time: '1 hour ago',
    read: true,
  },
  {
    id: '4',
    type: 'alert',
    title: 'Machine Error',
    message: 'Machine 3 requires maintenance check',
    time: '2 hours ago',
    read: true,
  },
];

export function Header({ currentTab, onTabChange }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const currentDate = new Date().toLocaleDateString('en-IN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DOZ3 Pharmacy Operations</h1>
                <p className="text-xs text-gray-500">{currentDate}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
              <Activity className="w-4 h-4 text-green-600 animate-pulse" />
              <span className="text-sm font-medium text-green-700">Indiranagar Hub: Operational</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onTabChange('operations')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                  currentTab === 'operations'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Package2 className="w-4 h-4" />
                Operations
              </button>
              <button
                onClick={() => onTabChange('finance')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                  currentTab === 'finance'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                Finance
              </button>
            </div>

            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders, medications, patients..."
                className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-14 w-96 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3">
                    <h3 className="font-bold text-white">Notifications</h3>
                    <p className="text-xs text-blue-100">{unreadCount} unread messages</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {mockNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`border-b border-gray-100 px-4 py-3 hover:bg-gray-50 transition-colors ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                              notification.type === 'alert'
                                ? 'bg-red-500'
                                : notification.type === 'success'
                                ? 'bg-green-500'
                                : 'bg-blue-500'
                            }`}
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-gray-900">{notification.title}</h4>
                            <p className="text-xs text-gray-600 mt-0.5">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
                    <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 pl-4 border-l border-gray-200 hover:bg-gray-50 rounded-r-lg pr-2 py-1 transition-colors"
              >
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-sm text-left">
                  <div className="font-medium text-gray-900">Dr. Sharma</div>
                  <div className="text-xs text-gray-500">Head Pharmacist</div>
                </div>
              </button>

              {showProfile && (
                <div className="absolute right-0 top-14 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Dr. Sharma</h3>
                        <p className="text-xs text-blue-100">sharma@doz3.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-left">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">My Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-left">
                      <Settings className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-left">
                      <HelpCircle className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Help & Support</span>
                    </button>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors text-left">
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-600">Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
