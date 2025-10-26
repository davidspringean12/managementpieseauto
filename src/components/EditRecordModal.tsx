import { useState } from 'react';
import { X, Save, Loader2, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { VinRecord } from '../lib/database.types';

interface EditRecordModalProps {
  vinRecord: VinRecord;
  onClose: () => void;
  onSuccess: () => void;
}

interface PartEntry {
  name: string;
  serialNumber: string;
  price: number;
}

export function EditRecordModal({ vinRecord, onClose, onSuccess }: EditRecordModalProps) {
  const parseJsonArray = (json: unknown): string[] => {
    if (Array.isArray(json)) {
      return json.map(String);
    }
    return [];
  };

  const parseNumberArray = (json: unknown): number[] => {
    if (Array.isArray(json)) {
      return json.map(Number);
    }
    return [];
  };

  const initialParts = parseJsonArray(vinRecord.parts_bought);
  const initialSerials = parseJsonArray(vinRecord.part_serial_numbers);
  const initialPrices = parseNumberArray(vinRecord.part_prices);

  const [vinNumber, setVinNumber] = useState(vinRecord.vin_number);
  const [licensePlate, setLicensePlate] = useState(vinRecord.license_plate || '');
  const [clientName, setClientName] = useState(vinRecord.client_name);
  const [notes, setNotes] = useState(vinRecord.notes || '');
  const [parts, setParts] = useState<PartEntry[]>(
    initialParts.map((name, index) => ({
      name,
      serialNumber: initialSerials[index] || '',
      price: initialPrices[index] || 0,
    }))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPart = () => {
    setParts([...parts, { name: '', serialNumber: '', price: 0 }]);
  };

  const removePart = (index: number) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  const updatePart = (index: number, field: keyof PartEntry, value: string | number) => {
    const newParts = [...parts];
    newParts[index] = { ...newParts[index], [field]: value };
    setParts(newParts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!vinNumber.trim()) {
      setError('VIN number is required');
      return;
    }

    if (!clientName.trim()) {
      setError('Client name is required');
      return;
    }

    for (let i = 0; i < parts.length; i++) {
      if (!parts[i].name.trim()) {
        setError(`Part ${i + 1}: Name is required`);
        return;
      }
      if (!parts[i].serialNumber.trim()) {
        setError(`Part ${i + 1}: Serial number is required`);
        return;
      }
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase
        .from('vin_records')
        .update({
          vin_number: vinNumber.trim().toUpperCase(),
          license_plate: licensePlate.trim().toUpperCase() || null,
          client_name: clientName.trim(),
          parts_bought: parts.map(p => p.name.trim()),
          part_serial_numbers: parts.map(p => p.serialNumber.trim()),
          part_prices: parts.map(p => p.price),
          notes: notes.trim(),
        })
        .eq('id', vinRecord.id);

      if (updateError) throw updateError;

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update record');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full my-8">
        <div className="bg-black text-white px-6 py-4 flex items-center justify-between rounded-t-lg sticky top-0 z-10">
          <h3 className="text-lg font-bold">Edit VIN Record</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="vin-number" className="block text-sm font-medium text-gray-700 mb-2">
                VIN Number <span className="text-red-600">*</span>
              </label>
              <input
                id="vin-number"
                type="text"
                value={vinNumber}
                onChange={(e) => setVinNumber(e.target.value)}
                placeholder="Enter VIN number..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent font-mono"
                required
                maxLength={17}
              />
            </div>

            <div>
              <label htmlFor="license-plate" className="block text-sm font-medium text-gray-700 mb-2">
                License Plate
              </label>
              <input
                id="license-plate"
                type="text"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                placeholder="Enter license plate..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent font-mono"
              />
            </div>
          </div>

          <div>
            <label htmlFor="client-name" className="block text-sm font-medium text-gray-700 mb-2">
              Client Name <span className="text-red-600">*</span>
            </label>
            <input
              id="client-name"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter client name..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any notes or additional information..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Parts <span className="text-red-600">*</span>
              </label>
              <button
                type="button"
                onClick={addPart}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Part
              </button>
            </div>

            <div className="space-y-3">
              {parts.map((part, index) => (
                <div key={index} className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700">Part {index + 1}</h4>
                    {parts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePart(index)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Part Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={part.name}
                        onChange={(e) => updatePart(index, 'name', e.target.value)}
                        placeholder="Part name..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Serial Number <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={part.serialNumber}
                        onChange={(e) => updatePart(index, 'serialNumber', e.target.value)}
                        placeholder="Serial number..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Price (RON)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={part.price}
                        onChange={(e) => updatePart(index, 'price', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
