import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { Navbar } from './components/Navbar';
import { SearchVIN } from './components/SearchVIN';
import { AddRecord } from './components/AddRecord';
import { SearchLicensePlate } from './components/SearchLicensePlate';
import { LoginForm } from './components/LoginForm';
import { isAuthenticated } from './lib/auth';

type Tab = 'search-vin' | 'search-plate' | 'add';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('search-vin');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="min-h-screen bg-gray-100">
        <Navbar onLogout={() => setIsLoggedIn(false)} />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <div className="border-b-2 border-gray-200">
              <nav className="flex gap-2">
                <button
                  onClick={() => setActiveTab('search-vin')}
                  className={`px-6 py-3 font-medium transition-colors border-b-2 -mb-0.5 ${
                    activeTab === 'search-vin'
                      ? 'border-red-600 text-red-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Cautare Serie Sasiu
                </button>
                <button
                  onClick={() => setActiveTab('search-plate')}
                  className={`px-6 py-3 font-medium transition-colors border-b-2 -mb-0.5 ${
                    activeTab === 'search-plate'
                      ? 'border-red-600 text-red-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Cautare Numar Inmatriculare
                </button>
                <button
                  onClick={() => setActiveTab('add')}
                  className={`px-6 py-3 font-medium transition-colors border-b-2 -mb-0.5 ${
                    activeTab === 'add'
                      ? 'border-red-600 text-red-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Adaugare Client Nou
                </button>
              </nav>
            </div>
          </div>

          <div className="mt-6">
            {activeTab === 'search-vin' && <SearchVIN />}
            {activeTab === 'search-plate' && <SearchLicensePlate />}
            {activeTab === 'add' && (
              <AddRecord onRecordAdded={() => setActiveTab('search-vin')} />
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
