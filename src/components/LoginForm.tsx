import { useState } from 'react';
import { LogIn, Loader2, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-950 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
        <div className="text-center">
          <div className="flex justify-center">
            <img 
              src="/images/logo.png" 
              alt="Focus Part Logo" 
              className="w-32 h-32 object-contain"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <h2 className="text-2xl text-center font-bold text-gray-900 mb-2">Bine ati Revenit</h2>
            <p className="text-gray-600 text-center text-sm">Va rugam intrati in cont pentru a continua</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Introduceti numele de utilizator"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Introduceti parola"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-600 cursor-pointer"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700 cursor-pointer select-none">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium text-lg shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Log In
              </>
            )}
          </button>
        </form>

        <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Focus Part SRL Sistem Management
          </p>
        </div>
      </div>
    </div>
  );
}
