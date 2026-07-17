import { User, FileCheck, Package, Camera, Send, Clock, Phone, Calendar } from 'lucide-react';
import type { Order } from '../App';

type OrderWorkflowCardProps = {
  order: Order;
  onVerifyPrescription: (order: Order) => void;
  onReviewQC: (order: Order) => void;
  onDispatch: (order: Order) => void;
};

export function OrderWorkflowCard({ order, onVerifyPrescription, onReviewQC, onDispatch }: OrderWorkflowCardProps) {
  const getStatusBadge = () => {
    if (order.column === 'pending') {
      return 'bg-orange-100 text-orange-700';
    } else if (order.column === 'verified') {
      return 'bg-blue-100 text-blue-700';
    } else if (order.column === 'sorting') {
      return 'bg-purple-100 text-purple-700';
    } else if (order.column === 'qc') {
      return 'bg-green-100 text-green-700';
    } else {
      return 'bg-teal-100 text-teal-700';
    }
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-lg transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="font-bold text-gray-900 text-lg">{order.orderNumber}</div>
        <div className={`px-2 py-1 rounded text-xs font-bold ${getStatusBadge()}`}>
          {order.status.split('-')[0].trim()}
        </div>
      </div>

      {/* Patient Info */}
      <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <User className="w-4 h-4 text-gray-400" />
          {order.customerName}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          {order.customerAge} years old
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Phone className="w-3.5 h-3.5 text-gray-400" />
          {order.customerPhone}
        </div>
      </div>

      {/* Doctor Info (for pending prescriptions) */}
      {order.doctorName && (
        <div className="mb-3 text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded px-2 py-1.5">
          Prescribed by <span className="font-semibold text-blue-700">{order.doctorName}</span>
        </div>
      )}

      {/* Medications */}
      {order.medications && order.medications.length > 0 && (
        <div className="mb-3">
          <div className="text-xs font-medium text-gray-500 mb-2">Medications:</div>
          <div className="space-y-1.5">
            {order.medications.slice(0, 2).map((med, idx) => (
              <div key={idx} className="bg-blue-50 border border-blue-200 rounded px-2.5 py-1.5">
                <div className="text-xs font-semibold text-gray-900">{med.name}</div>
                <div className="text-xs text-gray-600">{med.dosage}</div>
              </div>
            ))}
            {order.medications.length > 2 && (
              <div className="text-xs text-blue-600 font-medium text-center py-1">
                +{order.medications.length - 2} more medications
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress Bar (for packaging) */}
      {order.progress && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-gray-600 font-medium">{order.machine}</span>
            <span className="text-purple-700 font-bold">
              {order.progress.current}/{order.progress.total}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-purple-600 h-2.5 rounded-full transition-all"
              style={{ width: `${(order.progress.current / order.progress.total) * 100}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.round((order.progress.current / order.progress.total) * 100)}% complete
          </div>
        </div>
      )}

      {/* AI Match (for QC) */}
      {order.aiMatch !== undefined && (
        <div className="mb-3 bg-green-50 border-2 border-green-300 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-green-700">AI Vision Match</span>
            <span className="text-2xl font-bold text-green-700">{order.aiMatch}%</span>
          </div>
          <div className="mt-1 text-xs text-green-600">Ready for manual review</div>
        </div>
      )}

      {/* Verified By */}
      {order.verifiedBy && (
        <div className="mb-3 text-xs bg-blue-50 border border-blue-200 rounded px-2 py-1.5">
          <span className="text-gray-600">Verified by </span>
          <span className="font-semibold text-blue-700">{order.verifiedBy}</span>
        </div>
      )}

      {/* Actions */}
      {order.column === 'pending' && (
        <button
          onClick={() => onVerifyPrescription(order)}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-lg py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <FileCheck className="w-4 h-4" />
          Verify Prescription
        </button>
      )}

      {order.column === 'qc' && (
        <button
          onClick={() => onReviewQC(order)}
          className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <Camera className="w-4 h-4" />
          Review QC Photos
        </button>
      )}

      {order.column === 'dispatch' && (
        <button
          onClick={() => onDispatch(order)}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-lg py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <Send className="w-4 h-4" />
          Assign Courier
        </button>
      )}

      {order.column === 'verified' && (
        <div className="text-center py-3 bg-blue-50 rounded-lg border border-blue-200">
          <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <span className="text-xs text-blue-700 font-medium">Waiting for packaging machine</span>
        </div>
      )}

      {order.column === 'sorting' && (
        <div className="text-center py-3 bg-purple-50 rounded-lg border border-purple-200">
          <Package className="w-5 h-5 text-purple-600 mx-auto mb-1 animate-pulse" />
          <span className="text-xs text-purple-700 font-medium">Packaging in progress...</span>
        </div>
      )}
    </div>
  );
}
