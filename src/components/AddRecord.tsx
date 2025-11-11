import { supabase } from '../lib/supabase';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, X, Save, AlertCircle, User, Hash, FileText } from 'lucide-react';
import { Card, CardTitle, Button, Input } from './ui';

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
        part_prices: filteredPrices,
      };
      
      console.log('Sending data:', recordData);

      const { data, error: insertError } = await supabase
        .from('vin_records')
        // @ts-expect-error - Supabase type inference issue with array fields
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
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card variant="light" className="border-2 border-brand-red bg-red-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card animated className="border-4 border-brand-charcoal overflow-hidden">
        <div className="bg-gradient-to-r from-brand-charcoal to-brand-charcoal-light text-white px-6 py-5 -m-6 mb-6">
          <CardTitle className="text-white text-xl">Adauga Client Nou</CardTitle>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="space-y-6">
            <Input
              id="vin"
              type="text"
              value={vinNumber}
              onChange={(e) => setVinNumber(e.target.value)}
              placeholder="Introduceti seria de sasiu din 17 caractere..."
              maxLength={17}
              label="Serie de Sasiu *"
              icon={<Hash className="w-5 h-5" />}
              required
            />

            <Input
              id="client"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Introduceti numele clientului..."
              label="Nume Client *"
              icon={<User className="w-5 h-5" />}
              required
            />

            <Input
              id="license-plate"
              type="text"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              placeholder="Introduceti numarul de inmatriculare..."
              label="Numar de Inmatriculare"
              icon={<FileText className="w-5 h-5" />}
              maxLength={10}
            />

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Piesa si Cod de Identificare <span className="text-brand-red">*</span>
                </label>
                <Button
                  type="button"
                  onClick={addPartField}
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                >
                  Adauga Piesa
                </Button>
              </div>

              <div className="space-y-3">
                {parts.map((part, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-2 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-brand-red transition-all"
                  >
                    <div className="flex-1">
                      <input
                        type="text"
                        value={part}
                        onChange={(e) => updatePart(index, e.target.value)}
                        placeholder="Nume piesa..."
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={serials[index]}
                        onChange={(e) => updateSerial(index, e.target.value)}
                        placeholder="Cod de identificare..."
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="w-32">
                      <input
                        type="number"
                        value={prices[index]}
                        onChange={(e) => updatePrice(index, e.target.value)}
                        placeholder="Pret..."
                        min="0"
                        step="0.01"
                        className="input-field"
                        required
                      />
                    </div>
                    {parts.length > 1 && (
                      <motion.button
                        type="button"
                        onClick={() => removePartField(index)}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        className="px-3 py-3 bg-red-100 text-brand-red rounded-lg hover:bg-red-200 transition-colors"
                        title="Remove part"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                icon={!isLoading && <Save className="w-5 h-5" />}
                className="flex-1"
              >
                {isLoading ? 'Se salveaza...' : 'Salveaza Client'}
              </Button>
              <Button
                type="button"
                onClick={resetForm}
                variant="ghost"
                size="lg"
                disabled={isLoading}
              >
                Sterge
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
