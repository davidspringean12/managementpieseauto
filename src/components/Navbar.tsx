import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { logout } from '../lib/auth';
import { Button } from './ui';

interface NavbarProps {
  onLogout: () => void;
}

export function Navbar({ onLogout }: NavbarProps) {
  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white text-grey shadow-2xl border-b-4 border-brand-red"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center space-x-4"
          >
            <motion.img
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
              src="./images/logo.png"
              alt="Focus Part Logo"
              className="w-16 h-16 object-contain"
            />
            <div>
              <motion.h1 
                className="text-2xl font-bold tracking-tight"
                whileHover={{ scale: 1.02 }}
              >
                Focus <span className="text-brand-red">Part</span>
              </motion.h1>
              <p className="text-xs text-gray-400 tracking-wide uppercase font-medium">
                Management Piese Auto
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Button
              onClick={handleLogout}
              variant="primary"
              size="md"
              icon={<LogOut className="w-4 h-4" />}
            >
              Iesi din Cont
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
