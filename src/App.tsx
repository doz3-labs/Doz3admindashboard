import { useState } from 'react';
import { MasterDashboard } from './components/MasterDashboard';
import { FinancialDashboard } from './components/FinancialDashboard';
import { PrescriptionReview } from './components/PrescriptionReview';
import { QCPhotoReview } from './components/QCPhotoReview';
import { DispatchView } from './components/DispatchView';

export type Medication = {
  id: string;
  name: string;
  genericName: string;
  currentStock: number;
  minStock: number;
  unit: string;
  expiryDate: string;
  batchNumber: string;
  needsRefill: boolean;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerAge: number;
  customerPhone: string;
  status: string;
  column: 'pending' | 'verified' | 'sorting' | 'qc' | 'dispatch';
  prescriptionImage?: string;
  medications?: {
    name: string;
    dosage: string;
    frequency: string;
    morning: number;
    noon: number;
    night: number;
  }[];
  doctorName?: string;
  prescriptionDate?: string;
  duration?: number;
  progress?: { current: number; total: number };
  machine?: string;
  photos?: string[];
  aiMatch?: number;
  verifiedBy?: string;
  packingNotes?: string;
};

export type TabType = 'operations' | 'finance';

function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('operations');
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'prescription' | 'qc' | 'dispatch'>('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleVerifyPrescription = (order: Order) => {
    setSelectedOrder(order);
    setCurrentScreen('prescription');
  };

  const handleReviewQC = (order: Order) => {
    setSelectedOrder(order);
    setCurrentScreen('qc');
  };

  const handleDispatch = (order: Order) => {
    setSelectedOrder(order);
    setCurrentScreen('dispatch');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
    setSelectedOrder(null);
  };

  const handleApprovePrescription = () => {
    alert('Prescription approved and sent to packaging');
    handleBackToDashboard();
  };

  const handleApproveQC = () => {
    alert('QC approved - Package ready for dispatch');
    handleBackToDashboard();
  };

  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    setCurrentScreen('dashboard');
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentTab === 'operations' && currentScreen === 'dashboard' && (
        <MasterDashboard 
          onVerifyPrescription={handleVerifyPrescription}
          onReviewQC={handleReviewQC}
          onDispatch={handleDispatch}
          currentTab={currentTab}
          onTabChange={handleTabChange}
        />
      )}
      {currentTab === 'finance' && currentScreen === 'dashboard' && (
        <FinancialDashboard 
          currentTab={currentTab}
          onTabChange={handleTabChange}
        />
      )}
      {currentScreen === 'prescription' && selectedOrder && (
        <PrescriptionReview 
          order={selectedOrder}
          onBack={handleBackToDashboard}
          onApprove={handleApprovePrescription}
        />
      )}
      {currentScreen === 'qc' && selectedOrder && (
        <QCPhotoReview 
          order={selectedOrder}
          onBack={handleBackToDashboard}
          onApprove={handleApproveQC}
        />
      )}
      {currentScreen === 'dispatch' && selectedOrder && (
        <DispatchView 
          order={selectedOrder}
          onBack={handleBackToDashboard}
        />
      )}
    </div>
  );
}

export default App;
