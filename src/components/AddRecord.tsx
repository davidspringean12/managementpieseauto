import { supabase } from '../lib/supabase';
import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, X, Save, AlertCircle, Loader2 } from 'lucide-react';

interface AddRecordProps {
  onRecordAdded?: () => void;
}

export function AddRecord({ onRecordAdded }: AddRecordProps) {
  const [vinNumber, setVinNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [parts, setParts] = useState<string[]>(['']);
  const [serials, setSerials] = useState<string[]>(['']);
  const [prices, setPrices] = useState<string[]>(['']);
  const [licensePlate, setLicensePlate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPartField = () => {
    setParts([...parts, '']);
    setSerials([...serials, '']);
    setPrices([...prices, '']);
  };

  const removePartField = (index: number) => {
    if (parts.length > 1) {
      setParts(parts.filter((_, i) => i !== index));
      setSerials(serials.filter((_, i) => i !== index));
      setPrices(prices.filter((_, i) => i !== index));
    }
  };

  const updatePart = (index: number, value: string) => {
    const newParts = [...parts];
    newParts[index] = value;
    setParts(newParts);
  };

  const updateSerial = (index: number, value: string) => {
    const newSerials = [...serials];
    newSerials[index] = value;
    setSerials(newSerials);
  };

  const updatePrice = (index: number, value: string) => {
    const newPrices = [...prices];
    newPrices[index] = value;
    setPrices(newPrices);
  };

  const resetForm = () => {
    setVinNumber('');
    setClientName('');
    setParts(['']);
    setSerials(['']);
    setPrices(['']);
    setLicensePlate('');
    setError(null);
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

    const filteredParts = parts.filter((p) => p.trim() !== '');
    const filteredSerials = serials.filter((s) => s.trim() !== '');
    const filteredPrices = prices
      .filter((p) => p.trim() !== '')
      .map(price => Number(price)); // Convert strings to numbers

    // Validate prices
    if (filteredPrices.some(price => isNaN(price))) {
      setError('All prices must be valid numbers');
      return;
    }

    if (filteredParts.length === 0) {
      setError('At least one part is required');
      return;
    }

    if (filteredSerials.length === 0) {
      setError('At least one serial number is required');
      return;
    }

    // Add price validation
    if (filteredPrices.length === 0) {
      setError('At least one price is required');
      return;
    }

    if (filteredParts.length !== filteredSerials.length) {
      setError('Number of parts must match number of serial numbers');
      return;
    }

    if (filteredParts.length !== filteredPrices.length) {
      setError('Each part must have a price');
      return;
    }

    setIsLoading(true);

    try {
      // Log the data being sent
      const recordData = {
        vin_number: vinNumber.trim().toUpperCase(),
        license_plate: licensePlate.trim().toUpperCase(),
        client_name: clientName.trim(),
        parts_bought: filteredParts,
        part_serial_numbers: filteredSerials,
        part_prices: filteredPrices, // Now this is an array of numbers
      };
      
      console.log('Sending data:', recordData);

      const { data, error: insertError } = await supabase
        .from('vin_records')
        .insert(recordData)
        .select()
        .single();

      if (insertError) {
        console.error('Supabase error:', insertError);
        if (insertError.code === '23505') {
          throw new Error('VIN number already exists in the system');
        }
        throw new Error(`Database error: ${insertError.message}`);
      }

      console.log('Success response:', data);
      toast.success('Client adaugat cu succes');
      resetForm();
      onRecordAdded?.();
    } catch (err) {
      console.error('Full error:', err);
      const message = err instanceof Error ? err.message : 'O eroare a aparut. Incearca din nou.';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border-2 border-black rounded-lg shadow-lg overflow-hidden">
        <div className="bg-black text-white px-6 py-4">
          <h3 className="text-lg font-bold">Adauga Client Nou</h3>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="vin" className="block text-sm font-medium text-gray-700 mb-2">
              Serie de Sasiu <span className="text-red-600">*</span>
            </label>
            <input
              id="vin"
              type="text"
              value={vinNumber}
              onChange={(e) => setVinNumber(e.target.value)}
              placeholder="Enter 17-character VIN..."
              maxLength={17}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent font-mono"
              required
            />
          </div>

          <div>
            <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-2">
              Nume Client <span className="text-red-600">*</span>
            </label>
            <input
              id="client"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter client name..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              required
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              maxLength={10}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Parts & Serial Numbers <span className="text-red-600">*</span>
              </label>
              <button
                type="button"
                onClick={addPartField}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Part
              </button>
            </div>

            <div className="space-y-3">
              {parts.map((part, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={part}
                      onChange={(e) => updatePart(index, e.target.value)}
                      placeholder="Part name..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={serials[index]}
                      onChange={(e) => updateSerial(index, e.target.value)}
                      placeholder="Serial number..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent font-mono"
                      required
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      value={prices[index]}
                      onChange={(e) => updatePrice(index, e.target.value)}
                      placeholder="Price..."
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      required
                    />
                  </div>
                  {parts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePartField(index)}
                      className="px-3 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      title="Remove part"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
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
                  Save Record
                </>
              )}
            </button>
            <button
              type="button"
              onClick={resetForm}
              disabled={isLoading}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
