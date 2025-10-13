import { LogOut } from 'lucide-react';
import { logout } from '../lib/auth';

interface NavbarProps {
  onLogout: () => void;
}

export function Navbar({ onLogout }: NavbarProps) {
  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <nav className="bg-white text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <img
              src="./images/logo.png"
              alt="Company Logo"
              className="w-20 h-20 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-400">
                Focus <span className="text-red-600">Part</span>
              </h1>
              <p className="text-xs text-gray-400"> Management Piese Auto</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
