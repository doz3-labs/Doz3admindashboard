import { Header } from './Header';
import { StockOverview } from './StockOverview';
import { OrdersWorkflow } from './OrdersWorkflow';
import { QuickStats } from './QuickStats';
import type { Order, TabType } from '../App';

type MasterDashboardProps = {
  onVerifyPrescription: (order: Order) => void;
  onReviewQC: (order: Order) => void;
  onDispatch: (order: Order) => void;
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
};

export function MasterDashboard({ onVerifyPrescription, onReviewQC, onDispatch, currentTab, onTabChange }: MasterDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentTab={currentTab} onTabChange={onTabChange} />

      {/* Main Dashboard Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Quick Stats */}
        <QuickStats />

        {/* Main Grid: Stock Overview + Orders Workflow */}
        <div className="grid grid-cols-12 gap-6">
          {/* Stock Overview - Left Sidebar */}
          <div className="col-span-3">
            <StockOverview />
          </div>

          {/* Orders Workflow - Main Area */}
          <div className="col-span-9">
            <OrdersWorkflow 
              onVerifyPrescription={onVerifyPrescription}
              onReviewQC={onReviewQC}
              onDispatch={onDispatch}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
