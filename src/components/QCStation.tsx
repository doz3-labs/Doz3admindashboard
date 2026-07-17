import { ArrowLeft, CheckCircle2, XCircle, Pill } from 'lucide-react';
import type { Order } from '../App';

type QCStationProps = {
  order: Order;
  onBack: () => void;
  onApprove: () => void;
};

export function QCStation({ order, onBack, onApprove }: QCStationProps) {
  const handleReject = () => {
    alert('Order rejected and sent for repackaging');
    onBack();
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 px-8 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">QC & Photo Proof Station</h1>
            <p className="text-sm text-slate-400">Patient: {order.customerName}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-5 gap-6 p-8">
        {/* Left Panel - Expected Standard */}
        <div className="col-span-2 bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Pill className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold">Prescription Data</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-3">Expected per Sachet</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-slate-400 mb-2">Morning</div>
                  <div className="space-y-1.5">
                    {order.prescription?.morning.map((pill, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${pill.includes('White') ? 'bg-slate-300' : 'bg-yellow-400'}`} />
                        <span className="text-sm">{pill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-400 mb-2">Noon</div>
                  <div className="space-y-1.5">
                    {order.prescription?.noon.map((pill, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${pill.includes('White') ? 'bg-slate-300' : 'bg-yellow-400'}`} />
                        <span className="text-sm">{pill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-400 mb-2">Night</div>
                  <div className="space-y-1.5">
                    {order.prescription?.night.map((pill, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${pill.includes('White') ? 'bg-slate-300' : 'bg-yellow-400'}`} />
                        <span className="text-sm">{pill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-400">AI Vision Status</span>
                <span className="text-lg font-bold text-green-400">{order.aiMatch}% Match</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel - Photo Grid */}
        <div className="col-span-3 bg-slate-800 border border-slate-700 rounded-lg p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-6">High-Resolution Photos</h2>

          <div className="flex-1 grid grid-cols-3 gap-4">
            {['Morning', 'Noon', 'Night'].map((timeSlot, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden flex flex-col">
                <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
                  <span className="text-sm font-medium">{timeSlot}</span>
                </div>
                <div className="flex-1 relative p-4">
                  {/* Sachet Photo Mockup */}
                  <div className="w-full h-full bg-slate-800 rounded flex items-center justify-center relative border-2 border-green-500/30">
                    {/* Pills representation */}
                    <div className="flex gap-3">
                      {timeSlot === 'Noon' ? (
                        <div className="w-8 h-8 rounded-full bg-yellow-400 shadow-lg" />
                      ) : (
                        <>
                          <div className="w-8 h-8 rounded-full bg-slate-300 shadow-lg" />
                          <div className="w-8 h-8 rounded-full bg-yellow-400 shadow-lg" />
                        </>
                      )}
                    </div>
                    
                    {/* AI Bounding Box */}
                    <div className="absolute inset-4 border-2 border-green-500 rounded">
                      <div className="absolute -top-6 left-0 bg-green-500 text-black text-xs px-2 py-0.5 rounded font-medium">
                        AI: 100%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-700">
            <button
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg py-3.5 text-base font-semibold flex items-center justify-center gap-3 transition-colors"
            >
              <XCircle className="w-5 h-5" />
              Reject & Repack
            </button>
            <button
              onClick={onApprove}
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg py-3.5 text-base font-semibold flex items-center justify-center gap-3 transition-colors"
            >
              <CheckCircle2 className="w-5 h-5" />
              Approve & Send Proof to Patient
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
