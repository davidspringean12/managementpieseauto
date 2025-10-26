import { useState } from 'react';
import { Search, Trash2, AlertCircle, Loader2, Plus, Minus, Edit, FileDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { VinRecord } from '../lib/database.types';
import { AddPartModal } from './AddPartModal';
import { RemovePartModal } from './RemovePartModal';
import { EditRecordModal } from './EditRecordModal';
import { exportToPDF } from '../lib/pdfExport';

interface SearchLicensePlateProps {
  onDeleteSuccess?: () => void;
}

export function SearchLicensePlate({ onDeleteSuccess }: SearchLicensePlateProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<VinRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showAddPartModal, setShowAddPartModal] = useState<string | null>(null); // Store record ID
  const [showRemovePartModal, setShowRemovePartModal] = useState<string | null>(null); // Store record ID

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError('Introdu un numar de inmatriculare');
      return;
    }

    setIsLoading(true);
    setError(null);
    setNotFound(false);
    setSearchResults([]);

    try {
      const { data, error: searchError } = await supabase
        .from('vin_records')
        .select('*')
        .ilike('license_plate', searchQuery.trim().toUpperCase());

      if (searchError) {
        throw searchError;
      }

      if (data && data.length > 0) {
        setSearchResults(data);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('vin_records')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      setSearchResults(prev => prev.filter(record => record.id !== id));
      onDeleteSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete record');
    } finally {
      setIsLoading(false);
    }
  };

  const parseJsonArray = (json: unknown): string[] => {
    if (Array.isArray(json)) {
      return json.map(String);
    }
    return [];
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label htmlFor="license-plate-search" className="block text-sm font-medium text-gray-700 mb-2">
            Cauta Numar de Inmatriculare:
          </label>
          <div className="flex gap-2">
            <input
              id="license-plate-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Introduceti Numarul de Inmatriculare..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              maxLength={10}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              Cauta
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {notFound && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-800">Nu a fost gasit nici-un rezultat pentru: {searchQuery}</p>
        </div>
      )}

      {searchResults.map((result) => (
        <div key={result.id} className="bg-white border-2 border-black rounded-lg shadow-lg overflow-hidden">
          {/* Rest of the record display is identical to SearchVIN */}
          <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">Detalii Rezultat</h3>
            <div className="flex gap-2">
              <button
                onClick={() => exportToPDF(result)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm"
              >
                <FileDown className="w-4 h-4" />
                Export PDF
              </button>
              <button
                onClick={() => setShowEditModal(result.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => setShowAddPartModal(result.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Adauga Piesa
              </button>
              <button
                onClick={() => setShowRemovePartModal(result.id)}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2 text-sm"
              >
                <Minus className="w-4 h-4" />
                Elimina Piesa
              </button>
              <button
                onClick={() => handleDelete(result.id)}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Sterge Client
              </button>
            </div>
          </div>

          {/* Record details section */}
          <div className="p-6 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Numar de Inmatriculare:</p>
              <p className="text-lg font-mono font-bold text-black">
                {result.license_plate || 'N/A'}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600">Serie de Sasiu:</p>
              <p className="text-lg font-mono font-bold text-black">{result.vin_number}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600">Nume Client:</p>
              <p className="text-lg text-black">{result.client_name}</p>
            </div>

            {/* Parts section */}
            <div>
              <p className="text-sm font-medium text-gray-600 mb-3">Detalii:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {parseJsonArray(result.parts_bought).map((part, index) => {
                  const serials = parseJsonArray(result.part_serial_numbers);
                  const prices = Array.isArray(result.part_prices) 
                    ? result.part_prices 
                    : [];
                  
                  return (
                    <div
                      key={index}
                      className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 hover:border-red-600 transition-colors"
                    >
                      <div className="mb-2">
                        <p className="text-xs font-medium text-gray-500 uppercase">Piesa:</p>
                        <p className="text-base font-semibold text-black mt-1">{part}</p>
                      </div>
                      <div className="mb-2">
                        <p className="text-xs font-medium text-gray-500 uppercase">Cod de Identificare:</p>
                        <p className="text-sm font-mono text-gray-800 mt-1">{serials[index] || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Pret:</p>
                        <p className="text-sm font-semibold text-green-600 mt-1">
                          {prices[index] ? `${prices[index].toFixed(2)} RON` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Creat: {new Date(result.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ))}

      {showAddPartModal && (
        <AddPartModal
          vinRecord={searchResults.find(r => r.id === showAddPartModal)!}
          onClose={() => setShowAddPartModal(null)}
          onSuccess={() => {
            handleSearch(new Event('submit') as any);
          }}
        />
      )}

      {showRemovePartModal && (
        <RemovePartModal
          vinRecord={searchResults.find(r => r.id === showRemovePartModal)!}
          onClose={() => setShowRemovePartModal(null)}
          onSuccess={() => {
            handleSearch(new Event('submit') as any);
          }}
        />
      )}
    </div>
  );
}