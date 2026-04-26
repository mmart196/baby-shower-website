import React from 'react';
import { eventDetails, venueLink } from '../data/initialData';
import { Calendar, Clock, MapPin, Mail, UserCheck, Church, Sparkles, Cross } from 'lucide-react';

interface HomepageProps {
  onNavigate: (section: 'rsvp') => void;
}

const handleAdminAccess = () => {
  window.location.hash = '#admin';
  window.location.reload();
};

export const Homepage: React.FC<HomepageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-amber-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-amber-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-amber-200 rounded-full opacity-60"></div>
        <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-blue-200 rounded-full opacity-40"></div>
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-amber-300 rounded-full opacity-50"></div>
      </div>

      <div className="relative min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-12 pt-8">
            {/* Cross Icon */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-amber-400 mr-3" />
                <Cross className="w-16 h-16 text-amber-500 drop-shadow-lg" />
                <Sparkles className="w-6 h-6 text-amber-400 ml-3" />
              </div>
              <p className="text-lg text-blue-600 font-medium tracking-widest uppercase mb-2">
                You are invited to celebrate the
              </p>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-500 via-blue-600 to-amber-500 bg-clip-text text-transparent mb-4 drop-shadow-sm leading-tight">
                Holy Baptism
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold text-blue-700">
                of {eventDetails.couple}
              </h2>
            </div>

            {/* Baby Photo Placeholder */}
            <div className="max-w-md mx-auto mb-10">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-amber-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                  <Church className="w-5 h-5 text-amber-500" />
                  God's Newest Blessing
                </h3>
                <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-blue-50 to-amber-50 p-8">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-amber-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
                      <Cross className="w-16 h-16 text-amber-400" />
                    </div>
                    <p className="text-gray-600 italic">
                      "Children are a gift from the Lord"
                    </p>
                    <p className="text-sm text-gray-500 mt-2">— Psalm 127:3</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Event Details Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 mb-10 border border-amber-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
              <Church className="w-6 h-6 text-amber-500" />
              Celebration Details
              <Church className="w-6 h-6 text-amber-500" />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl">
                <div className="p-3 bg-amber-500 rounded-full">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Date</p>
                  <p className="text-lg text-gray-800 font-bold">{eventDetails.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl">
                <div className="p-3 bg-blue-500 rounded-full">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Time</p>
                  <p className="text-lg text-gray-800 font-bold">{eventDetails.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl md:col-span-2 border border-amber-100">
                <div className="p-3 bg-gradient-to-r from-amber-500 to-blue-500 rounded-full">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-medium">Location</p>
                  <p className="text-lg text-gray-800 font-bold">{eventDetails.location}</p>
                </div>
                <a 
                  href={venueLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  Get Directions
                </a>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-blue-50 rounded-2xl md:col-span-2">
                <div className="p-3 bg-gradient-to-r from-amber-500 to-blue-500 rounded-full">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Questions?</p>
                  <a 
                    href={`mailto:${eventDetails.contact}`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium underline"
                  >
                    {eventDetails.contact}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-10">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-amber-100">
                <p className="text-lg text-gray-700 font-medium leading-relaxed mb-4">
                  We warmly invite you to join us as we celebrate this sacred sacrament and welcome our child into the Christian faith.
                </p>
                <p className="text-blue-600 font-bold">
                  Please RSVP by May 10th ✨
                </p>
              </div>
            </div>
          </div>

          {/* RSVP Section */}
          <div className="mb-10">
            <div className="bg-gradient-to-br from-amber-400 to-blue-500 rounded-3xl p-8 shadow-2xl text-center">
              <div className="flex items-center justify-center mb-6">
                <UserCheck className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Please RSVP</h3>
              <p className="text-white/90 text-lg mb-8">
                Let us know if you'll be joining us for this blessed occasion!
              </p>
              <button 
                onClick={() => onNavigate('rsvp')}
                className="bg-white text-amber-600 hover:bg-amber-50 font-bold py-4 px-10 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
              >
                RSVP Now
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-amber-100">
              <div className="flex items-center justify-center mb-4">
                <Cross className="w-4 h-4 text-amber-400 mr-2" />
                <p className="text-gray-600 font-medium">
                  With love and blessings
                </p>
                <Cross className="w-4 h-4 text-amber-400 ml-2" />
              </div>
              <p className="text-gray-500 text-sm">
                The Martinez Family
              </p>
              
              {/* Discrete Admin Access */}
              <button
                onClick={handleAdminAccess}
                className="mt-6 text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 mx-auto opacity-50 hover:opacity-100"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
