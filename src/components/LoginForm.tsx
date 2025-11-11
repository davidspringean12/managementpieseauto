import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, AlertCircle, User, Lock } from 'lucide-react';
import { Button, Input } from './ui';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      if (
        username === import.meta.env.VITE_VALID_USERNAME && 
        password === import.meta.env.VITE_VALID_PASSWORD
      ) {
        if (rememberMe) {
          localStorage.setItem('focuspart_auth', 'true');
          localStorage.setItem('focuspart_remember', 'true');
        } else {
          sessionStorage.setItem('focuspart_auth', 'true');
        }
        onLoginSuccess();
      } else {
        setError('Invalid username or password');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-brand-charcoal to-red-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-brand-red opacity-10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-brand-red opacity-10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10"
      >
        {/* Header with logo */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="pt-8 pb-4 text-center bg-gradient-to-b from-gray-50 to-white"
        >
          <motion.div 
            className="flex justify-center mb-4"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <img 
              src="./images/logo.png" 
              alt="Focus Part Logo" 
              className="w-28 h-28 object-contain"
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-brand-charcoal tracking-tight"
          >
            Focus <span className="text-brand-red">Part</span>
          </motion.h1>
          <p className="text-xs text-gray-500 uppercase tracking-wide mt-1 font-medium">
            Management Piese Auto
          </p>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="p-8 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-brand-charcoal mb-2">Bine ați Revenit</h2>
            <p className="text-gray-600 text-sm">Vă rugăm intrați în cont pentru a continua</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="bg-red-50 border-2 border-brand-red rounded-xl p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                <p className="text-brand-red text-sm font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <Input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Introduceti numele de utilizator"
            label="Username"
            icon={<User className="w-5 h-5" />}
            required
            autoFocus
          />

          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Introduceti parola"
            label="Password"
            icon={<Lock className="w-5 h-5" />}
            required
          />

          <motion.div 
            className="flex items-center"
            whileHover={{ x: 2 }}
          >
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-brand-red border-gray-300 rounded focus:ring-brand-red cursor-pointer"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700 cursor-pointer select-none">
              Remember me
            </label>
          </motion.div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            icon={!isLoading && <LogIn className="w-5 h-5" />}
            className="w-full text-lg"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </Button>
        </motion.form>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-t from-gray-50 to-white px-8 py-5 text-center border-t border-gray-200"
        >
          <p className="text-xs text-gray-500 font-medium tracking-wide">
            Focus Part SRL © 2025 - Sistem Management
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
