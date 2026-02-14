import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Plus, Package, Calendar, Hash, X } from 'lucide-react';
import { toast } from 'sonner';
import type { Medication } from '../App';
import { Input } from './ui/input';
import { Label } from './ui/label';

const initialMedications: Medication[] = [
  { id: '1', name: 'Metformin', genericName: 'Metformin HCl', currentStock: 450, minStock: 500, unit: 'tablets', expiryDate: '2026-08-15', batchNumber: 'MF2024A', needsRefill: true },
  { id: '2', name: 'Telmisartan', genericName: 'Telmisartan 40mg', currentStock: 280, minStock: 400, unit: 'tablets', expiryDate: '2026-11-20', batchNumber: 'TL2024B', needsRefill: true },
  { id: '3', name: 'Atorvastatin', genericName: 'Atorvastatin 10mg', currentStock: 890, minStock: 300, unit: 'tablets', expiryDate: '2026-06-10', batchNumber: 'AT2024C', needsRefill: false },
  { id: '4', name: 'Pantoprazole', genericName: 'Pantoprazole 40mg', currentStock: 620, minStock: 400, unit: 'tablets', expiryDate: '2026-09-25', batchNumber: 'PN2024D', needsRefill: false },
  { id: '5', name: 'Aspirin', genericName: 'Aspirin 75mg', currentStock: 180, minStock: 500, unit: 'tablets', expiryDate: '2026-07-30', batchNumber: 'AS2024E', needsRefill: true },
  { id: '6', name: 'Omeprazole', genericName: 'Omeprazole 20mg', currentStock: 340, minStock: 350, unit: 'capsules', expiryDate: '2026-10-15', batchNumber: 'OM2024F', needsRefill: true },
];

const emptyForm = {
  name: '',
  genericName: '',
  currentStock: '',
  minStock: '',
  unit: 'tablets',
  expiryDate: '',
  batchNumber: '',
};

export function StockOverview() {
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [showRefillOnly, setShowRefillOnly] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const displayedMeds = showRefillOnly
    ? medications.filter((med) => med.needsRefill)
    : medications;

  const handleRefill = (medName: string) => {
    toast.success(`Refill request sent for ${medName}`);
  };

  const handleOpenAdd = () => {
    setForm(emptyForm);
    setAddDialogOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentStock = parseInt(form.currentStock, 10);
    const minStock = parseInt(form.minStock, 10);
    if (!form.name.trim() || isNaN(currentStock) || isNaN(minStock) || !form.expiryDate || !form.batchNumber.trim()) {
      toast.error('Please fill all required fields with valid numbers.');
      return;
    }
    const newMed: Medication = {
      id: String(medications.length + 1),
      name: form.name.trim(),
      genericName: form.genericName.trim() || form.name.trim(),
      currentStock,
      minStock,
      unit: form.unit,
      expiryDate: form.expiryDate,
      batchNumber: form.batchNumber.trim(),
      needsRefill: currentStock < minStock,
    };
    setMedications((prev) => [...prev, newMed]);
    setAddDialogOpen(false);
    setForm(emptyForm);
    toast.success(`${newMed.name} added to inventory`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm h-fit sticky top-24">
      {/* Header */}
      <div className="border-b border-gray-200 px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">Inventory Status</h2>
          <button
            onClick={handleOpenAdd}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Add medication"
          >
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
              Low Stock ({medications.filter((m) => m.needsRefill).length})
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

      {addDialogOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100]"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-med-title"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setAddDialogOpen(false)}
              aria-hidden="true"
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <div
              className="w-[min(100%-2rem,22rem)] max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl ring-1 ring-black/5"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 9999,
                margin: 0,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 id="add-med-title" className="text-lg font-semibold text-gray-900">
                  Add new medication
                </h2>
                <button
                  type="button"
                  onClick={() => setAddDialogOpen(false)}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Medicine name *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Metformin"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="genericName">Generic name</Label>
                  <Input
                    id="genericName"
                    value={form.genericName}
                    onChange={(e) => setForm((f) => ({ ...f, genericName: e.target.value }))}
                    placeholder="e.g. Metformin HCl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="currentStock">Current stock *</Label>
                    <Input
                      id="currentStock"
                      type="number"
                      min={0}
                      value={form.currentStock}
                      onChange={(e) => setForm((f) => ({ ...f, currentStock: e.target.value }))}
                      placeholder="0"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="minStock">Min. stock *</Label>
                    <Input
                      id="minStock"
                      type="number"
                      min={0}
                      value={form.minStock}
                      onChange={(e) => setForm((f) => ({ ...f, minStock: e.target.value }))}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unit">Unit</Label>
                  <select
                    id="unit"
                    value={form.unit}
                    onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                    className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="tablets">Tablets</option>
                    <option value="capsules">Capsules</option>
                    <option value="bottles">Bottles</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">Expiry date *</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="batchNumber">Batch number *</Label>
                  <Input
                    id="batchNumber"
                    value={form.batchNumber}
                    onChange={(e) => setForm((f) => ({ ...f, batchNumber: e.target.value }))}
                    placeholder="e.g. MF2024A"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAddDialogOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Add medication
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}