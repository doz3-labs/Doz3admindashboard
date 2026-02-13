import { FileText, Package2, CheckSquare, Camera, Send } from 'lucide-react';
import { WorkflowColumn } from './WorkflowColumn';
import type { Order } from '../App';

type OrdersWorkflowProps = {
  onVerifyPrescription: (order: Order) => void;
  onReviewQC: (order: Order) => void;
  onDispatch: (order: Order) => void;
};

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: '#10234',
    customerName: 'Rajesh Kumar',
    customerAge: 58,
    customerPhone: '+91 98765 43210',
    status: 'Awaiting Verification',
    column: 'pending',
    prescriptionImage: 'rx1',
    doctorName: 'Dr. Mehta',
    prescriptionDate: '2026-02-04',
    medications: [
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', morning: 1, noon: 0, night: 1 },
      { name: 'Telmisartan', dosage: '40mg', frequency: 'Once daily', morning: 1, noon: 0, night: 0 },
    ],
  },
  {
    id: '2',
    orderNumber: '#10235',
    customerName: 'Priya Sharma',
    customerAge: 42,
    customerPhone: '+91 98765 43211',
    status: 'Verified - Ready to Pack',
    column: 'verified',
    verifiedBy: 'Dr. Sharma',
    medications: [
      { name: 'Atorvastatin', dosage: '10mg', frequency: 'Once daily', morning: 0, noon: 0, night: 1 },
      { name: 'Pantoprazole', dosage: '40mg', frequency: 'Once daily', morning: 1, noon: 0, night: 0 },
    ],
  },
  {
    id: '3',
    orderNumber: '#10236',
    customerName: 'Anita Bangalore',
    customerAge: 35,
    customerPhone: '+91 98765 43212',
    status: 'Packaging in Progress',
    column: 'sorting',
    progress: { current: 18, total: 30 },
    machine: 'Machine 2',
    medications: [
      { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily', morning: 1, noon: 0, night: 0 },
    ],
  },
  {
    id: '4',
    orderNumber: '#10237',
    customerName: 'Suresh Patil',
    customerAge: 65,
    customerPhone: '+91 98765 43213',
    status: 'QC Review',
    column: 'qc',
    photos: ['photo1', 'photo2', 'photo3'],
    aiMatch: 98,
    medications: [
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', morning: 1, noon: 0, night: 1 },
      { name: 'Atorvastatin', dosage: '10mg', frequency: 'Once daily', morning: 0, noon: 0, night: 1 },
    ],
  },
  {
    id: '5',
    orderNumber: '#10238',
    customerName: 'Lakshmi Reddy',
    customerAge: 51,
    customerPhone: '+91 98765 43214',
    status: 'Ready for Dispatch',
    column: 'dispatch',
    medications: [
      { name: 'Omeprazole', dosage: '20mg', frequency: 'Once daily', morning: 1, noon: 0, night: 0 },
    ],
  },
  {
    id: '6',
    orderNumber: '#10239',
    customerName: 'Arun Nair',
    customerAge: 47,
    customerPhone: '+91 98765 43215',
    status: 'Awaiting Verification',
    column: 'pending',
    doctorName: 'Dr. Patel',
    prescriptionDate: '2026-02-05',
    medications: [
      { name: 'Telmisartan', dosage: '40mg', frequency: 'Once daily', morning: 1, noon: 0, night: 0 },
      { name: 'Pantoprazole', dosage: '40mg', frequency: 'Once daily', morning: 1, noon: 0, night: 0 },
    ],
  },
];

export function OrdersWorkflow({ onVerifyPrescription, onReviewQC, onDispatch }: OrdersWorkflowProps) {
  const columns = [
    {
      id: 'pending',
      title: 'Prescription Review',
      subtitle: 'Awaiting pharmacist verification',
      icon: FileText,
      color: 'border-orange-400',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      id: 'verified',
      title: 'Verified Orders',
      subtitle: 'Ready for packaging',
      icon: CheckSquare,
      color: 'border-blue-400',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      id: 'sorting',
      title: 'Packaging',
      subtitle: 'Sachet preparation',
      icon: Package2,
      color: 'border-purple-400',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      id: 'qc',
      title: 'Quality Check',
      subtitle: 'Photo verification',
      icon: Camera,
      color: 'border-green-400',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      id: 'dispatch',
      title: 'Ready to Ship',
      subtitle: 'Awaiting courier',
      icon: Send,
      color: 'border-teal-400',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-bold text-gray-900">Order Fulfillment Workflow</h2>
        <p className="text-sm text-gray-500">Track orders from prescription to dispatch</p>
      </div>

      <div className="p-6 overflow-x-auto">
        <div className="grid grid-cols-5 gap-4 min-w-[1200px]">
          {columns.map((column) => (
            <WorkflowColumn
              key={column.id}
              column={column}
              orders={mockOrders.filter((order) => order.column === column.id)}
              onVerifyPrescription={onVerifyPrescription}
              onReviewQC={onReviewQC}
              onDispatch={onDispatch}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
