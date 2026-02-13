import { ArrowLeft, User, Phone, Calendar, FileText, CheckCircle2, XCircle, AlertCircle, Pill, Clock } from 'lucide-react';
import type { Order } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Placeholder for prescription image (Figma asset not in repo)
const prescriptionImg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSIjZjNmNGY2Ij48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzliYTBhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+UHJlc2NyaXB0aW9uIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

type PrescriptionReviewProps = {
  order: Order;
  onBack: () => void;
  onApprove: () => void;
};

export function PrescriptionReview({ order, onBack, onApprove }: PrescriptionReviewProps) {
  const handleReject = () => {
    alert('Prescription rejected. Customer will be notified.');
    onBack();
  };

  const handleRequestClarification = () => {
    alert('Clarification request sent to customer');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Prescription Verification</h1>
                <p className="text-sm text-gray-500">Review and approve medication order</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="text-xs text-orange-600 font-medium">Awaiting Your Review</div>
              </div>
              <div className="text-sm text-gray-600">
                Order: <span className="font-bold text-gray-900">{order.orderNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left: Prescription Image */}
          <div className="col-span-5">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Prescription Document</h2>
                <FileText className="w-5 h-5 text-gray-400" />
              </div>

              <div className="bg-gray-100 border-2 border-gray-300 rounded-lg overflow-hidden mb-4">
                <ImageWithFallback
                  src={prescriptionImg}
                  alt="Prescription"
                  className="w-full h-[500px] object-contain"
                />
              </div>

              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">Prescription Details</span>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Issued by:</span>
                      <span className="font-medium text-gray-900">{order.doctorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium text-gray-900">
                        {order.prescriptionDate && new Date(order.prescriptionDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valid until:</span>
                      <span className="font-medium text-gray-900">
                        {order.prescriptionDate && new Date(new Date(order.prescriptionDate).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleRequestClarification}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <AlertCircle className="w-4 h-4" />
                  Request Clarification from Patient
                </button>
              </div>
            </div>
          </div>

          {/* Right: Patient Info + Medications */}
          <div className="col-span-7 space-y-6">
            {/* Patient Information */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Patient Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-500">Patient Name</span>
                  </div>
                  <div className="font-semibold text-gray-900">{order.customerName}</div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-500">Age</span>
                  </div>
                  <div className="font-semibold text-gray-900">{order.customerAge} years</div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-500">Contact</span>
                  </div>
                  <div className="font-semibold text-gray-900">{order.customerPhone}</div>
                </div>
              </div>
            </div>

            {/* Medications Review */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Prescribed Medications</h2>
                <div className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
                  <span className="text-sm font-semibold text-blue-700">
                    {order.medications?.length} medications
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {order.medications?.map((med, idx) => (
                  <div key={idx} className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Pill className="w-5 h-5 text-blue-600" />
                          <h3 className="font-bold text-gray-900 text-lg">{med.name}</h3>
                        </div>
                        <div className="text-sm text-gray-600">{med.dosage}</div>
                      </div>
                      <div className="px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                        <span className="text-xs font-semibold text-green-700">In Stock</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="text-xs font-medium text-gray-500 mb-3">Dosage Schedule</div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className={`text-center p-3 rounded-lg ${med.morning > 0 ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-white border border-gray-200'}`}>
                          <div className="text-xs font-medium text-gray-600 mb-1">Morning</div>
                          <div className={`text-2xl font-bold ${med.morning > 0 ? 'text-yellow-700' : 'text-gray-300'}`}>
                            {med.morning}
                          </div>
                        </div>
                        <div className={`text-center p-3 rounded-lg ${med.noon > 0 ? 'bg-orange-100 border-2 border-orange-400' : 'bg-white border border-gray-200'}`}>
                          <div className="text-xs font-medium text-gray-600 mb-1">Noon</div>
                          <div className={`text-2xl font-bold ${med.noon > 0 ? 'text-orange-700' : 'text-gray-300'}`}>
                            {med.noon}
                          </div>
                        </div>
                        <div className={`text-center p-3 rounded-lg ${med.night > 0 ? 'bg-indigo-100 border-2 border-indigo-400' : 'bg-white border border-gray-200'}`}>
                          <div className="text-xs font-medium text-gray-600 mb-1">Night</div>
                          <div className={`text-2xl font-bold ${med.night > 0 ? 'text-indigo-700' : 'text-gray-300'}`}>
                            {med.night}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-600 italic">{med.frequency}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pharmacist Notes */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Pharmacist Notes</h2>
              <textarea
                placeholder="Add any notes about drug interactions, contraindications, or special instructions..."
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                rows={4}
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 sticky bottom-6 bg-white border border-gray-200 rounded-xl shadow-lg p-6">
              <button
                onClick={handleReject}
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg py-4 text-base font-bold flex items-center justify-center gap-3 transition-colors shadow-md hover:shadow-lg"
              >
                <XCircle className="w-5 h-5" />
                Reject Prescription
              </button>
              <button
                onClick={onApprove}
                className="bg-green-600 hover:bg-green-700 text-white rounded-lg py-4 text-base font-bold flex items-center justify-center gap-3 transition-colors shadow-md hover:shadow-lg"
              >
                <CheckCircle2 className="w-5 h-5" />
                Approve & Send to Packaging
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}