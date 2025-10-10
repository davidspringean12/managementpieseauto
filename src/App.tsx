import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SearchVIN } from './components/SearchVIN';
import { AddRecord } from './components/AddRecord';

type Tab = 'search' | 'add';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('search');

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="border-b-2 border-gray-200">
            <nav className="flex gap-2">
              <button
                onClick={() => setActiveTab('search')}
                className={`px-6 py-3 font-medium transition-colors border-b-2 -mb-0.5 ${
                  activeTab === 'search'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Search VIN
              </button>
              <button
                onClick={() => setActiveTab('add')}
                className={`px-6 py-3 font-medium transition-colors border-b-2 -mb-0.5 ${
                  activeTab === 'add'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Add New Record
              </button>
            </nav>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'search' ? (
            <SearchVIN />
          ) : (
            <AddRecord onRecordAdded={() => setActiveTab('search')} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
