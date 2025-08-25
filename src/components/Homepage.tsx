import React from 'react';
import { eventDetails } from '../data/initialData';
import { Calendar, Clock, MapPin, Mail, Gift, Heart } from 'lucide-react';

interface HomepageProps {
  onNavigate: (section: 'wishlist' | 'gifts') => void;
}

export const Homepage: React.FC<HomepageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Heart className="w-16 h-16 mx-auto mb-4 text-pink-500" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            {eventDetails.couple}'s
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-purple-600 mb-4">
            Baby Shower Registry
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Join us to celebrate our upcoming arrival with love, laughter, and tiny everything!
          </p>
        </div>

        {/* Event Details Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Event Details
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-pink-500" />
              <span className="text-gray-700 font-medium">{eventDetails.date}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-pink-500" />
              <span className="text-gray-700 font-medium">{eventDetails.time}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-pink-500" />
              <span className="text-gray-700 font-medium">{eventDetails.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-pink-500" />
              <a 
                href={`mailto:${eventDetails.contact}`}
                className="text-purple-600 hover:text-purple-700 font-medium underline"
              >
                {eventDetails.contact}
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => onNavigate('wishlist')}
            className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Gift className="w-5 h-5" />
            View Wishlist
          </button>
          <button 
            onClick={() => onNavigate('gifts')}
            className="flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Heart className="w-5 h-5" />
            Give a Gift
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">
            © 2025 {eventDetails.couple} Baby Shower
          </p>
          <p className="text-xs mt-1">
            Made with love for our growing family
          </p>
        </div>
      </div>
    </div>
  );
};
