import { ArrowLeft, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { Order } from '../App';

type QCPhotoReviewProps = {
  order: Order;
  onBack: () => void;
  onApprove: () => void;
};

export function QCPhotoReview({ order, onBack, onApprove }: QCPhotoReviewProps) {
  const handleReject = () => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      alert(`Package rejected: ${reason}\nSent back for repackaging.`);
      onBack();
    }
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
                <h1 className="text-2xl font-bold text-gray-900">Quality Control - Photo Verification</h1>
                <p className="text-sm text-gray-500">Review sachet photos and AI verification</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-xs text-green-600 font-medium">AI Match: {order.aiMatch}%</div>
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
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Patient Info Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{order.customerName}</h2>
                <p className="text-sm text-gray-500">{order.customerAge} years • {order.orderNumber}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Total Medications</div>
                <div className="text-2xl font-bold text-blue-600">{order.medications?.length}</div>
              </div>
            </div>
          </div>

          {/* Expected vs Actual Comparison */}
          <div className="grid grid-cols-2 gap-6">
            {/* Expected - Left Panel */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Expected Per Sachet</h2>
              <div className="space-y-4">
                {order.medications?.map((med, idx) => (
                  <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="font-semibold text-gray-900 mb-2">{med.name}</div>
                    <div className="text-sm text-gray-600 mb-3">{med.dosage}</div>
                    <div className="flex gap-2">
                      {med.morning > 0 && (
                        <div className="flex-1 bg-yellow-100 border border-yellow-300 rounded px-2 py-1 text-center">
                          <div className="text-xs text-gray-600">Morning</div>
                          <div className="text-lg font-bold text-yellow-700">{med.morning}</div>
                        </div>
                      )}
                      {med.noon > 0 && (
                        <div className="flex-1 bg-orange-100 border border-orange-300 rounded px-2 py-1 text-center">
                          <div className="text-xs text-gray-600">Noon</div>
                          <div className="text-lg font-bold text-orange-700">{med.noon}</div>
                        </div>
                      )}
                      {med.night > 0 && (
                        <div className="flex-1 bg-indigo-100 border border-indigo-300 rounded px-2 py-1 text-center">
                          <div className="text-xs text-gray-600">Night</div>
                          <div className="text-lg font-bold text-indigo-700">{med.night}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actual Photos - Right Panel */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Captured Sachet Photos</h2>
              <div className="space-y-4">
                {['Morning', 'Noon', 'Night'].map((timeSlot, idx) => {
                  const hasMeds = order.medications?.some(med => {
                    if (timeSlot === 'Morning') return med.morning > 0;
                    if (timeSlot === 'Noon') return med.noon > 0;
                    if (timeSlot === 'Night') return med.night > 0;
                    return false;
                  });

                  if (!hasMeds) return null;

                  return (
                    <div key={idx} className="border-2 border-green-300 rounded-lg overflow-hidden bg-green-50">
                      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{timeSlot} Sachet</span>
                        <span className="text-xs font-bold text-green-400">✓ AI Verified</span>
                      </div>
                      <div className="p-4 bg-gray-100 relative" style={{ height: '200px' }}>
                        {/* Sachet Photo Mockup */}
                        <div className="w-full h-full bg-white rounded flex items-center justify-center relative border-2 border-dashed border-gray-300">
                          {/* Pills representation */}
                          <div className="flex gap-3">
                            {order.medications?.map((med, medIdx) => {
                              const count = timeSlot === 'Morning' ? med.morning : timeSlot === 'Noon' ? med.noon : med.night;
                              if (count === 0) return null;
                              
                              return Array.from({ length: count }).map((_, pillIdx) => (
                                <div
                                  key={`${medIdx}-${pillIdx}`}
                                  className="w-10 h-10 rounded-full shadow-lg"
                                  style={{
                                    backgroundColor: medIdx === 0 ? '#f3f4f6' : '#fbbf24',
                                  }}
                                />
                              ));
                            })}
                          </div>
                          
                          {/* AI Bounding Box */}
                          <div className="absolute inset-8 border-4 border-green-500 rounded-lg">
                            <div className="absolute -top-6 -right-6 bg-green-500 text-white text-xs px-3 py-1 rounded font-bold shadow-lg">
                              {order.aiMatch}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Alert for Manual Review */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-yellow-900 mb-1">Manual Verification Required</h3>
                <p className="text-sm text-yellow-800">
                  Please carefully compare the expected medications with the captured photos. Verify pill count, color, and packaging integrity before approving.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-6 sticky bottom-6 bg-white border-2 border-gray-300 rounded-xl shadow-2xl p-8">
            <button
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl py-5 text-lg font-bold flex items-center justify-center gap-3 transition-colors shadow-lg hover:shadow-xl"
            >
              <XCircle className="w-6 h-6" />
              Reject & Repack
            </button>
            <button
              onClick={onApprove}
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl py-5 text-lg font-bold flex items-center justify-center gap-3 transition-colors shadow-lg hover:shadow-xl"
            >
              <CheckCircle2 className="w-6 h-6" />
              Approve & Move to Dispatch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
