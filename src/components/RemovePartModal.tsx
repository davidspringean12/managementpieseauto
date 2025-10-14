import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { VinRecord } from '../lib/database.types';

interface RemovePartModalProps {
  vinRecord: VinRecord;
  onClose: () => void;
  onSuccess: () => void;
}

export function RemovePartModal({ vinRecord, onClose, onSuccess }: RemovePartModalProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRemove = async () => {
    if (selectedIndex === null) {
      setError('Please select a part to remove');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newParts = vinRecord.parts_bought.filter((_, index) => index !== selectedIndex);
      const newSerials = vinRecord.part_serial_numbers.filter((_, index) => index !== selectedIndex);

      const { error: updateError } = await supabase
        .from('vin_records')
        .update({
          parts_bought: newParts,
          part_serial_numbers: newSerials
        })
        .eq('id', vinRecord.id);

      if (updateError) throw updateError;

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove part');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Elimina Piesa</h3>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            {vinRecord.parts_bought.map((part, index) => (
              <div
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedIndex === index ? 'border-red-600 bg-red-50' : 'hover:border-gray-400'
                }`}
              >
                <p className="font-medium">{part}</p>
                <p className="text-sm text-gray-600">
                  Cod de Identificare: {vinRecord.part_serial_numbers[index] || 'N/A'}
                </p>
              </div>
            ))}
          </div>

          {error && (
            <p className="text-red-600 text-sm" role="alert">{error}</p>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Anuleaza
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isLoading || selectedIndex === null}
              className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                'Elimina Piesa'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}