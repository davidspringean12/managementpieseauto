import { useState } from 'react';
import { Search, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { VinRecord } from '../lib/database.types';

interface SearchVINProps {
  onDeleteSuccess?: () => void;
}

export function SearchVIN({ onDeleteSuccess }: SearchVINProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<VinRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError('Please enter a VIN number');
      return;
    }

    setIsLoading(true);
    setError(null);
    setNotFound(false);
    setSearchResult(null);

    try {
      const { data, error: searchError } = await supabase
        .from('vin_records')
        .select('*')
        .eq('vin_number', searchQuery.trim().toUpperCase())
        .maybeSingle();

      if (searchError) {
        throw searchError;
      }

      if (data) {
        setSearchResult(data);
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

      setSearchResult(null);
      setSearchQuery('');
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
          <label htmlFor="vin-search" className="block text-sm font-medium text-gray-700 mb-2">
            Search by VIN Number
          </label>
          <div className="flex gap-2">
            <input
              id="vin-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter VIN number..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              maxLength={17}
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
              Search
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
          <p className="text-yellow-800">No results found for VIN: {searchQuery}</p>
        </div>
      )}

      {searchResult && (
        <div className="bg-white border-2 border-black rounded-lg shadow-lg overflow-hidden">
          <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">VIN Record Details</h3>
            <button
              onClick={() => handleDelete(searchResult.id)}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">VIN Number</p>
              <p className="text-lg font-mono font-bold text-black">{searchResult.vin_number}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600">Client Name</p>
              <p className="text-lg text-black">{searchResult.client_name}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-3">Parts & Serial Numbers</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {parseJsonArray(searchResult.parts_bought).map((part, index) => {
                  const serials = parseJsonArray(searchResult.part_serial_numbers);
                  return (
                    <div
                      key={index}
                      className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 hover:border-red-600 transition-colors"
                    >
                      <div className="mb-2">
                        <p className="text-xs font-medium text-gray-500 uppercase">Part</p>
                        <p className="text-base font-semibold text-black mt-1">{part}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Serial Number</p>
                        <p className="text-sm font-mono text-gray-800 mt-1">{serials[index] || 'N/A'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Created: {new Date(searchResult.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
