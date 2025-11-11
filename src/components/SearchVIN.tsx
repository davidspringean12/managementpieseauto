import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, AlertCircle, Plus, Minus, Edit, FileDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { VinRecord } from '../lib/database.types';
import { AddPartModal } from './AddPartModal';
import { RemovePartModal } from './RemovePartModal';
import { EditRecordModal } from './EditRecordModal';
import { exportToPDF } from '../lib/pdfExport';
import { Card, CardTitle, CardContent, Button, Input } from './ui';

interface SearchVINProps {
  onDeleteSuccess?: () => void;
}

export function SearchVIN({ onDeleteSuccess }: SearchVINProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<VinRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showAddPartModal, setShowAddPartModal] = useState(false);
  const [showRemovePartModal, setShowRemovePartModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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
      <Card animated>
        <form onSubmit={handleSearch} className="space-y-4">
          <Input
            id="vin-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Introduceti seria de sasiu..."
            label="Cauta Serie de Sasiu:"
            maxLength={17}
            icon={<Search className="w-5 h-5" />}
          />
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            icon={!isLoading && <Search className="w-5 h-5" />}
            className="w-full sm:w-auto"
          >
            {isLoading ? 'Se cauta...' : 'Cauta'}
          </Button>
        </form>
      </Card>

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

        {notFound && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card variant="light" className="border-2 border-yellow-500 bg-yellow-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-yellow-800 font-medium">Nu a fost gasit nici-un rezultat pentru: <span className="font-bold">{searchQuery}</span></p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {searchResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="light" className="border-4 border-brand-charcoal overflow-hidden">
              {/* Header with Actions */}
              <div className="bg-gradient-to-r from-brand-charcoal to-brand-charcoal-light text-white px-6 py-5 -m-6 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <CardTitle className="text-white text-xl">Detalii Rezultat</CardTitle>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => exportToPDF(searchResult)}
                      variant="secondary"
                      size="sm"
                      icon={<FileDown className="w-4 h-4" />}
                      className="bg-purple-600 border-purple-600 hover:bg-purple-700"
                    >
                      Export PDF
                    </Button>
                    <Button
                      onClick={() => setShowEditModal(true)}
                      variant="secondary"
                      size="sm"
                      icon={<Edit className="w-4 h-4" />}
                      className="bg-blue-600 border-blue-600 hover:bg-blue-700"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => setShowAddPartModal(true)}
                      variant="secondary"
                      size="sm"
                      icon={<Plus className="w-4 h-4" />}
                      className="bg-green-600 border-green-600 hover:bg-green-700"
                    >
                      Adauga Piesa
                    </Button>
                    <Button
                      onClick={() => setShowRemovePartModal(true)}
                      variant="secondary"
                      size="sm"
                      icon={<Minus className="w-4 h-4" />}
                      className="bg-yellow-600 border-yellow-600 hover:bg-yellow-700"
                    >
                      Elimina Piesa
                    </Button>
                    <Button
                      onClick={() => handleDelete(searchResult.id)}
                      variant="danger"
                      size="sm"
                      isLoading={isLoading}
                      icon={<Trash2 className="w-4 h-4" />}
                    >
                      Sterge Client
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <CardContent className="space-y-6">
                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200"
                  >
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Serie de Sasiu:</p>
                    <p className="text-lg font-mono font-bold text-brand-charcoal">{searchResult.vin_number}</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200"
                  >
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Numar Inmatriculare:</p>
                    <p className="text-lg font-mono font-bold text-brand-charcoal">
                      {searchResult.license_plate || 'N/A'}
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200"
                  >
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nume Client:</p>
                    <p className="text-lg font-bold text-brand-charcoal">{searchResult.client_name}</p>
                  </motion.div>
                </div>

                {/* Parts Details */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Detalii Piese:</h4>
                  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-brand-charcoal to-brand-charcoal-light">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-bold text-white uppercase tracking-wider">Nr.</th>
                          <th className="text-left px-4 py-3 text-xs font-bold text-white uppercase tracking-wider">Nume Piesa</th>
                          <th className="text-left px-4 py-3 text-xs font-bold text-white uppercase tracking-wider">Numar Serie</th>
                          <th className="text-left px-4 py-3 text-xs font-bold text-white uppercase tracking-wider">Pret</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parseJsonArray(searchResult.parts_bought).map((part, index) => {
                          const serials = parseJsonArray(searchResult.part_serial_numbers);
                          const prices = Array.isArray(searchResult.part_prices) 
                            ? searchResult.part_prices 
                            : [];
                          
                          return (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                              }`}
                            >
                              <td className="px-4 py-3 text-sm font-semibold text-gray-700">{index + 1}.</td>
                              <td className="px-4 py-3 text-sm font-bold text-brand-charcoal">{part}</td>
                              <td className="px-4 py-3 text-sm font-mono text-gray-700">{serials[index] || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm font-bold text-green-600">
                                {prices[index] ? `${prices[index].toFixed(2)} RON` : 'N/A'}
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Notes Section */}
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5"
                >
                  <p className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Notite:</p>
                  <p className="text-base text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {searchResult.notes || 'Nu exista note pentru acest client'}
                  </p>
                </motion.div>

                {/* Timestamp */}
                <div className="pt-4 border-t-2 border-gray-200">
                  <p className="text-xs text-gray-500 font-medium">
                    Creat: {searchResult.created_at ? new Date(searchResult.created_at).toLocaleString('ro-RO') : 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {showAddPartModal && searchResult && (
        <AddPartModal
          vinRecord={searchResult}
          onClose={() => setShowAddPartModal(false)}
          onSuccess={() => {
            handleSearch({ preventDefault: () => {} } as React.FormEvent);
          }}
        />
      )}

      {showRemovePartModal && searchResult && (
        <RemovePartModal
          vinRecord={searchResult}
          onClose={() => setShowRemovePartModal(false)}
          onSuccess={() => {
            handleSearch({ preventDefault: () => {} } as React.FormEvent);
          }}
        />
      )}
      {showEditModal && searchResult && (
        <EditRecordModal
          vinRecord={searchResult}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            handleSearch({ preventDefault: () => {} } as React.FormEvent);
          }}
        />
      )}
    </div>
  );
}