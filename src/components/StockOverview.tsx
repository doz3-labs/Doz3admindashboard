import { AlertTriangle, Plus, TrendingDown, Package, Calendar, Hash } from 'lucide-react';
import { useState } from 'react';
import type { Medication } from '../App';

const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Metformin',
    genericName: 'Metformin HCl',
    currentStock: 450,
    minStock: 500,
    unit: 'tablets',
    expiryDate: '2026-08-15',
    batchNumber: 'MF2024A',
    needsRefill: true,
  },
  {
    id: '2',
    name: 'Telmisartan',
    genericName: 'Telmisartan 40mg',
    currentStock: 280,
    minStock: 400,
    unit: 'tablets',
    expiryDate: '2026-11-20',
    batchNumber: 'TL2024B',
    needsRefill: true,
  },
  {
    id: '3',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin 10mg',
    currentStock: 890,
    minStock: 300,
    unit: 'tablets',
    expiryDate: '2026-06-10',
    batchNumber: 'AT2024C',
    needsRefill: false,
  },
  {
    id: '4',
    name: 'Pantoprazole',
    genericName: 'Pantoprazole 40mg',
    currentStock: 620,
    minStock: 400,
    unit: 'tablets',
    expiryDate: '2026-09-25',
    batchNumber: 'PN2024D',
    needsRefill: false,
  },
  {
    id: '5',
    name: 'Aspirin',
    genericName: 'Aspirin 75mg',
    currentStock: 180,
    minStock: 500,
    unit: 'tablets',
    expiryDate: '2026-07-30',
    batchNumber: 'AS2024E',
    needsRefill: true,
  },
  {
    id: '6',
    name: 'Omeprazole',
    genericName: 'Omeprazole 20mg',
    currentStock: 340,
    minStock: 350,
    unit: 'capsules',
    expiryDate: '2026-10-15',
    batchNumber: 'OM2024F',
    needsRefill: true,
  },
];

export function StockOverview() {
  const [showRefillOnly, setShowRefillOnly] = useState(false);

  const displayedMeds = showRefillOnly
    ? mockMedications.filter((med) => med.needsRefill)
    : mockMedications;

  const handleRefill = (medName: string) => {
    alert(`Refill request sent for ${medName}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm h-fit sticky top-24">
      {/* Header */}
      <div className="border-b border-gray-200 px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">Inventory Status</h2>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRefillOnly(!showRefillOnly)}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              showRefillOnly
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Low Stock ({mockMedications.filter((m) => m.needsRefill).length})
            </div>
          </button>
        </div>
      </div>

      {/* Stock List */}
      <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
        <div className="p-4 space-y-3">
          {displayedMeds.map((med) => (
            <div
              key={med.id}
              className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${
                med.needsRefill
                  ? 'border-red-200 bg-red-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{med.name}</h3>
                  <p className="text-xs text-gray-500">{med.genericName}</p>
                </div>
                {med.needsRefill && (
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                )}
              </div>

              {/* Stock Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-gray-600">Stock Level</span>
                  <span className={`font-bold ${med.needsRefill ? 'text-red-600' : 'text-green-600'}`}>
                    {med.currentStock} {med.unit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      med.needsRefill ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((med.currentStock / med.minStock) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-gray-400">Min: {med.minStock}</span>
                  <span className={med.needsRefill ? 'text-red-600 font-medium' : 'text-gray-400'}>
                    {med.needsRefill ? `Need ${med.minStock - med.currentStock} more` : 'Adequate'}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Hash className="w-3 h-3" />
                  <span>{med.batchNumber}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(med.expiryDate).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })}</span>
                </div>
              </div>

              {/* Action */}
              {med.needsRefill && (
                <button
                  onClick={() => handleRefill(med.name)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Package className="w-3.5 h-3.5" />
                  Request Refill
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}