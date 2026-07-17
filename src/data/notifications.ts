export type Notification = {
  id: string;
  type: 'alert' | 'info' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
};

export const mockNotifications: Notification[] = [
  { id: '1', type: 'alert', title: 'Low Stock Alert', message: 'Metformin stock below minimum threshold', time: '5 mins ago', read: false },
  { id: '2', type: 'info', title: 'New Order Received', message: 'Order #10240 requires prescription verification', time: '12 mins ago', read: false },
  { id: '3', type: 'success', title: 'Dispatch Complete', message: 'Order #10232 delivered successfully', time: '1 hour ago', read: true },
  { id: '4', type: 'alert', title: 'Machine Error', message: 'Machine 3 requires maintenance check', time: '2 hours ago', read: true },
];
