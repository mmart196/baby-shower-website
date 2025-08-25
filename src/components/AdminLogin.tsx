import React, { useState } from 'react';
import { ArrowLeft, Lock } from 'lucide-react';

interface AdminLoginProps {
  onBack: () => void;
  onLogin: (password: string) => void;
  error?: string;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBack, onLogin, error }) => {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onLogin(password);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="p-4 bg-white/60 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Lock className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Admin Login
          </h1>
          <p className="text-gray-600">
            Enter the admin password to manage the registry
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
          <div className="mb-6">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter admin password"
              disabled={isSubmitting}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !password.trim()}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Back Button */}
        <div className="text-center mt-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Main Site
          </button>
        </div>
      </div>
    </div>
  );
};
