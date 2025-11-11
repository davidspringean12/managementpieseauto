import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { Search, FileText, UserPlus, User } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { SearchVIN } from './components/SearchVIN';
import { AddRecord } from './components/AddRecord';
import { SearchLicensePlate } from './components/SearchLicensePlate';
import { SearchClientName } from './components/SearchClientName';
import { LoginForm } from './components/LoginForm';
import { isAuthenticated } from './lib/auth';

type Tab = 'search-vin' | 'search-plate' | 'search-name' | 'add';

interface TabConfig {
  id: Tab;
  label: string;
  icon: React.ReactNode;
}

const tabs: TabConfig[] = [
  { id: 'search-vin', label: 'Cautare Serie Sasiu', icon: <Search className="w-5 h-5" /> },
  { id: 'search-plate', label: 'Cautare Numar Inmatriculare', icon: <FileText className="w-5 h-5" /> },
  { id: 'search-name', label: 'Cautare Nume Client', icon: <User className="w-5 h-5" /> },
  { id: 'add', label: 'Adaugare Client Nou', icon: <UserPlus className="w-5 h-5" /> },
];

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Navbar onLogout={() => setIsLoggedIn(false)} />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Modern Tab Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-white rounded-2xl shadow-card p-2">
              <nav className="flex gap-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium rounded-xl transition-all duration-300 relative ${
                      activeTab === tab.id
                        ? 'text-white'
                        : 'text-gray-600 hover:text-brand-charcoal hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: activeTab === tab.id ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-brand-red to-brand-red-dark rounded-xl shadow-lg"
                        initial={false}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      {tab.icon}
                      <span className="hidden sm:inline">{tab.label}</span>
                    </span>
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Animated Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'search-vin' && <SearchVIN />}
              {activeTab === 'search-plate' && <SearchLicensePlate />}
              {activeTab === 'search-name' && <SearchClientName />}
              {activeTab === 'add' && (
                <AddRecord onRecordAdded={() => setActiveTab('search-vin')} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}

export default App;
