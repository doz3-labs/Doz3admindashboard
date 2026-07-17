import { Header } from './Header';
import { TrendingUp, TrendingDown, IndianRupee, CreditCard, Wallet, ArrowUpRight, ArrowDownRight, Calendar, Download } from 'lucide-react';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import type { TabType } from '../App';
import type { AppPage } from './Header';

type FinancialDashboardProps = {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onNavigateToPage?: (page: AppPage) => void;
};

type Transaction = {
  id: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
  date: string;
  type: 'income' | 'expense';
};

const mockTransactions: Transaction[] = [
  {
    id: '1',
    orderNumber: '#10238',
    customerName: 'Lakshmi Reddy',
    amount: 450,
    status: 'completed',
    paymentMethod: 'UPI',
    date: '2026-02-06 10:30 AM',
    type: 'income',
  },
  {
    id: '2',
    orderNumber: '#10237',
    customerName: 'Suresh Patil',
    amount: 890,
    status: 'completed',
    paymentMethod: 'Card',
    date: '2026-02-06 09:15 AM',
    type: 'income',
  },
  {
    id: '3',
    orderNumber: '#10236',
    customerName: 'Anita Bangalore',
    amount: 320,
    status: 'pending',
    paymentMethod: 'COD',
    date: '2026-02-06 08:45 AM',
    type: 'income',
  },
  {
    id: '4',
    orderNumber: 'INV-2024',
    customerName: 'Medication Refill - Metformin',
    amount: 15000,
    status: 'completed',
    paymentMethod: 'Bank Transfer',
    date: '2026-02-05 04:30 PM',
    type: 'expense',
  },
  {
    id: '5',
    orderNumber: '#10235',
    customerName: 'Priya Sharma',
    amount: 620,
    status: 'completed',
    paymentMethod: 'UPI',
    date: '2026-02-05 02:20 PM',
    type: 'income',
  },
];

const revenueByDay = [
  { day: 'Mon', amount: 5200 },
  { day: 'Tue', amount: 6800 },
  { day: 'Wed', amount: 7400 },
  { day: 'Thu', amount: 8100 },
  { day: 'Fri', amount: 9200 },
  { day: 'Sat', amount: 6900 },
  { day: 'Sun', amount: 1660 },
];

export function FinancialDashboard({ currentTab, onTabChange, onNavigateToPage }: FinancialDashboardProps) {
  const todayRevenue = 1660;
  const monthlyRevenue = 45280;
  const pendingPayments = 320;
  const expenses = 28400;

  const handleExportPdf = () => {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    let y = 20;

    doc.setFontSize(18);
    doc.text('DOZ3 Finance Report', pageW / 2, y, { align: 'center' });
    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}`, pageW / 2, y, { align: 'center' });
    y += 16;
    doc.setTextColor(0, 0, 0);

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Summary', 14, y);
    y += 8;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(`Today's Revenue:     Rs ${todayRevenue.toLocaleString()}`, 14, y); y += 6;
    doc.text(`Monthly Revenue:     Rs ${monthlyRevenue.toLocaleString()}`, 14, y); y += 6;
    doc.text(`Pending Payments:   Rs ${pendingPayments.toLocaleString()}`, 14, y); y += 6;
    doc.text(`Monthly Expenses:   Rs ${expenses.toLocaleString()}`, 14, y); y += 14;

    doc.setFont(undefined, 'bold');
    doc.text('Revenue (Last 7 days)', 14, y); y += 6;
    doc.setFont(undefined, 'normal');
    revenueByDay.forEach((d) => {
      doc.text(`${d.day}: Rs ${d.amount.toLocaleString()}`, 14, y); y += 5;
    });
    y += 8;

    doc.setFont(undefined, 'bold');
    doc.text('Payment methods', 14, y); y += 6;
    doc.setFont(undefined, 'normal');
    doc.text('UPI: 52% (Rs 23,546 this month)', 14, y); y += 5;
    doc.text('Card: 31% (Rs 14,037 this month)', 14, y); y += 5;
    doc.text('COD: 17% (Rs 7,697 this month)', 14, y); y += 14;

    doc.setFont(undefined, 'bold');
    doc.text('Recent Transactions', 14, y); y += 6;
    doc.setFont(undefined, 'normal');
    const colW = [22, 45, 28, 35, 28, 38];
    const headers = ['Order', 'Customer', 'Amount', 'Method', 'Status', 'Date'];
    headers.forEach((h, i) => {
      doc.setFont(undefined, 'bold');
      doc.text(h, 14 + colW.slice(0, i).reduce((a, b) => a + b, 0), y);
    });
    doc.setFont(undefined, 'normal');
    y += 6;
    mockTransactions.forEach((t) => {
      if (y > 270) { doc.addPage(); y = 20; }
      const amountStr = (t.type === 'income' ? '+' : '-') + 'Rs ' + t.amount.toLocaleString();
      const row = [t.orderNumber, t.customerName.slice(0, 18), amountStr, t.paymentMethod, t.status, t.date.slice(0, 16)];
      row.forEach((cell, i) => {
        doc.text(cell, 14 + colW.slice(0, i).reduce((a, b) => a + b, 0), y);
      });
      y += 6;
    });

    doc.save(`DOZ3-Finance-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success('Report exported as PDF');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentTab={currentTab} onTabChange={onTabChange} onNavigateToPage={onNavigateToPage} />

      {/* Main Dashboard Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Financial Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
              <ArrowUpRight className="w-5 h-5 opacity-70" />
            </div>
            <div className="text-3xl font-bold mb-1">₹{todayRevenue.toLocaleString()}</div>
            <div className="text-sm opacity-90">Today's Revenue</div>
            <div className="mt-3 text-xs opacity-75">+12% from yesterday</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <IndianRupee className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 opacity-70" />
            </div>
            <div className="text-3xl font-bold mb-1">₹{monthlyRevenue.toLocaleString()}</div>
            <div className="text-sm opacity-90">Monthly Revenue</div>
            <div className="mt-3 text-xs opacity-75">Feb 1-6, 2026</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 shadow-lg text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Wallet className="w-6 h-6" />
              </div>
              <Calendar className="w-5 h-5 opacity-70" />
            </div>
            <div className="text-3xl font-bold mb-1">₹{pendingPayments.toLocaleString()}</div>
            <div className="text-sm opacity-90">Pending Payments</div>
            <div className="mt-3 text-xs opacity-75">1 COD order awaiting</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 shadow-lg text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <ArrowDownRight className="w-6 h-6" />
              </div>
              <TrendingDown className="w-5 h-5 opacity-70" />
            </div>
            <div className="text-3xl font-bold mb-1">₹{expenses.toLocaleString()}</div>
            <div className="text-sm opacity-90">Monthly Expenses</div>
            <div className="mt-3 text-xs opacity-75">Inventory & Operations</div>
          </div>
        </div>

        {/* Revenue Chart and Payment Methods */}
        <div className="grid grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Revenue Overview</h2>
                <p className="text-sm text-gray-500">Last 7 days performance</p>
              </div>
              <button
                onClick={handleExportPdf}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
              >
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>

            {/* Simple Bar Chart */}
            <div className="space-y-4">
              {revenueByDay.map((data, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-medium text-gray-600">{data.day}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-end pr-3 transition-all"
                      style={{ width: `${(data.amount / 10000) * 100}%` }}
                    >
                      <span className="text-xs font-bold text-white">₹{data.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods Breakdown */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Payment Methods</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">UPI</div>
                    <div className="text-xs text-gray-500">Most popular</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">52%</div>
                <div className="text-xs text-gray-600 mt-1">₹23,546 this month</div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Card</div>
                    <div className="text-xs text-gray-500">Credit/Debit</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-600">31%</div>
                <div className="text-xs text-gray-600 mt-1">₹14,037 this month</div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-100 rounded">
                    <Wallet className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">COD</div>
                    <div className="text-xs text-gray-500">Cash on delivery</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-orange-600">17%</div>
                <div className="text-xs text-gray-600 mt-1">₹7,697 this month</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
            <p className="text-sm text-gray-500">Latest payment activity</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Customer/Description</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{transaction.orderNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{transaction.customerName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-bold flex items-center gap-1 ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        <IndianRupee className="w-4 h-4" />
                        {transaction.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{transaction.paymentMethod}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : transaction.status === 'pending'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {transaction.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-500">{transaction.date}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
