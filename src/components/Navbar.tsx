import { Settings } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Settings className="w-8 h-8 text-red-600" />
            <div>
              <h1 className="text-2xl font-bold text-white">
                Focus <span className="text-red-600">Part</span>
              </h1>
              <p className="text-xs text-gray-400">Auto Parts Management</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
