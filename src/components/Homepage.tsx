import React from 'react';
import { eventDetails, amazonWishlistUrl } from '../data/initialData';
import { Calendar, Clock, MapPin, Mail, Gift, Heart, Settings, ExternalLink, UserCheck, Sparkles, Baby } from 'lucide-react';

interface HomepageProps {
  onNavigate: (section: 'wishlist' | 'gifts' | 'rsvp') => void;
}

const handleAdminAccess = () => {
  window.location.hash = '#admin';
  window.location.reload();
};

export const Homepage: React.FC<HomepageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-pink-300 rounded-full opacity-60"></div>
        <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-purple-300 rounded-full opacity-40"></div>
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-blue-300 rounded-full opacity-50"></div>
        <div className="absolute top-2/3 left-1/3 w-2 h-2 bg-pink-400 rounded-full opacity-30"></div>
      </div>

      <div className="relative min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Section - Title & Video */}
          <div className="text-center mb-16 pt-8">
            {/* Main Title */}
            <div className="mb-12">
              <div className="flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-pink-400 mr-4 animate-pulse" />
                <Baby className="w-20 h-20 text-pink-500 drop-shadow-lg" />
                <Sparkles className="w-8 h-8 text-pink-400 ml-4 animate-pulse" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 drop-shadow-sm leading-tight">
                {eventDetails.couple}'s
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold text-purple-700 tracking-wide">
                Baby Shower
              </h2>
            </div>

            {/* Ultrasound Video - Centered and Prominent */}
            <div className="max-w-lg mx-auto mb-12">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/50">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-3">
                  <Heart className="w-6 h-6 text-pink-500 animate-pulse" />
                  Meet Our Little One
                  <Heart className="w-6 h-6 text-pink-500 animate-pulse" />
                </h3>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-pink-100 to-purple-100 p-4">
                  <video
                    className="w-full h-auto rounded-xl shadow-lg"
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    preload="auto"
                  >
                    <source src="./babyultrasound.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute inset-0 rounded-xl ring-4 ring-pink-300/60 pointer-events-none"></div>
                </div>
                <p className="text-center text-gray-600 mt-4 italic">
                  Can't wait to meet you, little one! 💕
                </p>
              </div>
            </div>

          </div>

          {/* Event Details Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 mb-12 border border-white/50">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
              <Heart className="w-6 h-6 text-pink-500" />
              Celebration Details
              <Heart className="w-6 h-6 text-pink-500" />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-2xl">
                <div className="p-3 bg-pink-500 rounded-full">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Date</p>
                  <p className="text-lg text-gray-800 font-bold">{eventDetails.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-2xl">
                <div className="p-3 bg-purple-500 rounded-full">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Time</p>
                  <p className="text-lg text-gray-800 font-bold">{eventDetails.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl md:col-span-2">
                <div className="p-3 bg-blue-500 rounded-full">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Location</p>
                  <p className="text-lg text-gray-800 font-bold">{eventDetails.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl md:col-span-2">
                <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Questions?</p>
                  <a 
                    href={`mailto:${eventDetails.contact}`}
                    className="text-lg text-purple-600 hover:text-purple-700 font-bold underline decoration-2 decoration-purple-300 hover:decoration-purple-500 transition-colors"
                  >
                    {eventDetails.contact}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-16">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
                <p className="text-xl md:text-2xl text-gray-700 font-medium leading-relaxed mb-4">
                  Your presence is the best gift, but if you'd like to gift us or bring something, we've created a registry on Amazon.
                </p>
                <p className="text-xl text-purple-600 font-bold">
                  Please RSVP ✨
                </p>
              </div>
            </div>
          </div>

          {/* Action Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            
            {/* RSVP Section - Left Column */}
            <div className="order-1">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 shadow-2xl text-center h-full flex flex-col justify-center">
                <div className="flex items-center justify-center mb-6">
                  <UserCheck className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Please RSVP</h3>
                <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                  Let us know if you'll be joining our celebration!
                </p>
                <button 
                  onClick={() => onNavigate('rsvp')}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-8 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 text-lg mx-auto"
                >
                  RSVP Now
                </button>
              </div>
            </div>

            {/* Cash Gift Section - Right Column (More Prominent) */}
            <div className="order-2">
              <div className="bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-6">
                    <Sparkles className="w-8 h-8 text-yellow-300 mr-3 animate-pulse" />
                    <Heart className="w-12 h-12 text-white" />
                    <Sparkles className="w-8 h-8 text-yellow-300 ml-3 animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">💝 Preferred Gift</h3>
                  <p className="text-pink-100 text-lg mb-8 leading-relaxed">
                    A cash contribution helps us prepare for our little one's future!
                  </p>
                  <button 
                    onClick={() => onNavigate('gifts')}
                    className="bg-white text-purple-600 hover:bg-purple-50 font-bold py-5 px-10 rounded-2xl shadow-2xl transform hover:scale-110 transition-all duration-300 text-xl border-2 border-white/30"
                  >
                    <Heart className="w-6 h-6 inline mr-3" />
                    Give Cash Gift
                  </button>
                  <p className="text-pink-100 text-sm mt-4 italic">Quick & exactly what we need! ✨</p>
                </div>
              </div>
            </div>
          </div>

          {/* Amazon Wishlist - Full Width Secondary Option */}
          <div className="mb-16">
            <div className="bg-gradient-to-br from-orange-100 via-yellow-50 to-orange-100 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-orange-200/50 text-center">
              <h4 className="text-2xl font-bold text-orange-800 mb-4 flex items-center justify-center gap-3">
                <Gift className="w-6 h-6 text-orange-600" />
                Or Browse Our Amazon Registry
                <Gift className="w-6 h-6 text-orange-600" />
              </h4>
              <p className="text-orange-700 mb-6 text-lg">If you prefer to choose a specific item, we've curated a list on Amazon</p>
              <a
                href={amazonWishlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Gift className="w-6 h-6" />
                Shop Our Amazon Wishlist
                <ExternalLink className="w-5 h-5" />
              </a>
              <p className="text-orange-600 text-sm mt-4 italic">
                💝 Please include a gift receipt in case we need to exchange
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-16 relative">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50">
              <div className="flex items-center justify-center mb-4">
                <Heart className="w-5 h-5 text-pink-400 mr-2" />
                <p className="text-gray-600 font-medium">
                  © 2025 {eventDetails.couple} Baby Shower
                </p>
                <Heart className="w-5 h-5 text-pink-400 ml-2" />
              </div>
              <p className="text-gray-500 text-sm italic">
                Made with love for our growing family ✨
              </p>
              
              {/* Discrete Admin Access */}
              <button
                onClick={handleAdminAccess}
                className="mt-6 text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200 flex items-center gap-1 mx-auto opacity-50 hover:opacity-100"
                title="Admin Access"
              >
                <Settings className="w-3 h-3" />
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
