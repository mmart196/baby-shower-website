import React, { useState, useEffect } from 'react';
import { eventDetails, ceremonyDetails, receptionDetails, rsvpDeadline } from '../data/initialData';
import { Calendar, Clock, MapPin, Mail, UserCheck, Church, Cross, Sparkles, ExternalLink, Users, Utensils } from 'lucide-react';
import { useRSVP } from '../hooks/useRSVP';

interface HomepageProps {
  onNavigate: (section: 'rsvp') => void;
}

const handleAdminAccess = () => {
  window.location.hash = '#admin';
  window.location.reload();
};

// Public RSVPs View Component
const PublicRSVPs: React.FC = () => {
  const { rsvps, stats } = useRSVP();
  const attendingRSVPs = rsvps.filter(r => r.attending);

  if (attendingRSVPs.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-100 text-center">
        <p className="text-gray-600">Be the first to RSVP!</p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-amber-100">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Users className="w-5 h-5 text-amber-500" />
        <h3 className="text-xl font-bold text-gray-800">
          {stats.attending} Guests Attending
        </h3>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {attendingRSVPs.slice(0, 10).map((rsvp) => (
          <div key={rsvp.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                <span className="text-amber-700 font-medium text-sm">
                  {rsvp.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="font-medium text-gray-800">{rsvp.name}</span>
            </div>
            {rsvp.dietaryRestrictions && (
              <span className="text-xs bg-white px-2 py-1 rounded-full text-amber-700">
                {rsvp.dietaryRestrictions.replace('Meal: ', '')}
              </span>
            )}
          </div>
        ))}
        {attendingRSVPs.length > 10 && (
          <p className="text-center text-sm text-gray-500 pt-2">
            +{attendingRSVPs.length - 10} more guests
          </p>
        )}
      </div>
    </div>
  );
};

export const Homepage: React.FC<HomepageProps> = ({ onNavigate }) => {
  const [showRSVPs, setShowRSVPs] = useState(false);

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
        <div className="max-w-5xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-10 pt-6">
            <p className="text-sm md:text-base text-blue-600 font-medium tracking-widest uppercase mb-3">
              Please Join Us For The
            </p>
            
            {/* Cross Icon */}
            <div className="mb-6">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="w-5 h-5 text-amber-400 mr-3" />
                <Cross className="w-14 h-14 text-amber-500 drop-shadow-lg" />
                <Sparkles className="w-5 h-5 text-amber-400 ml-3" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-500 via-blue-600 to-amber-500 bg-clip-text text-transparent mb-3 drop-shadow-sm leading-tight">
              Baptism
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              of Eric Martinez
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              With great joy, <span className="font-semibold text-blue-700">Michael & Rachel</span> invite you to celebrate the Baptism of their beloved son
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            
            {/* Left Column - Ceremony */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-amber-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-500 rounded-full">
                  <Church className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-amber-600 font-bold uppercase tracking-wider">Religious Ceremony</p>
                  <h3 className="text-xl font-bold text-gray-800">{ceremonyDetails.name}</h3>
                </div>
              </div>
              
              <div className="space-y-3 pl-1">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-800 font-medium">{ceremonyDetails.address}</p>
                    <a 
                      href={ceremonyDetails.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 underline inline-flex items-center gap-1 mt-1"
                    >
                      Get Directions
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <p className="text-gray-800 font-bold">Saturday, May 16, 2026</p>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <p className="text-gray-800 font-medium">{ceremonyDetails.time}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Reception */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500 rounded-full">
                  <Utensils className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Reception</p>
                  <h3 className="text-xl font-bold text-gray-800">{receptionDetails.name}</h3>
                </div>
              </div>
              
              <div className="space-y-3 pl-1">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-800 font-medium">{receptionDetails.address}</p>
                    <a 
                      href={receptionDetails.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 underline inline-flex items-center gap-1 mt-1"
                    >
                      Get Directions
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <p className="text-gray-800 font-bold">{receptionDetails.time}</p>
                </div>
                <div className="mt-4 p-3 bg-amber-50 rounded-xl">
                  <p className="text-sm text-amber-800">
                    <span className="font-semibold">Menu:</span> Beef or Chicken
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Public RSVPs Toggle */}
          <div className="mb-8">
            <button
              onClick={() => setShowRSVPs(!showRSVPs)}
              className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-amber-100 flex items-center justify-between hover:bg-white transition-all"
            >
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-amber-500" />
                <span className="font-semibold text-gray-800">See Who's Attending</span>
              </div>
              <span className="text-amber-500 font-bold">
                {showRSVPs ? 'Hide' : 'Show'}
              </span>
            </button>
            
            {showRSVPs && (
              <div className="mt-4">
                <PublicRSVPs />
              </div>
            )}
          </div>

          {/* RSVP Section */}
          <div className="bg-gradient-to-br from-amber-400 to-blue-500 rounded-3xl p-8 shadow-2xl text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <UserCheck className="w-10 h-10 text-white" />
            </div>
            <p className="text-white/90 text-sm uppercase tracking-wider mb-2">
              RSVP
            </p>
            <h3 className="text-3xl font-bold text-white mb-2">Kindly Respond</h3>
            <p className="text-amber-100 font-medium mb-6">
              By {rsvpDeadline}
            </p>
            <p className="text-white/90 mb-8">
              Please let us know your preference for the reception: <span className="font-bold">Beef or Chicken</span>
            </p>
            <button 
              onClick={() => onNavigate('rsvp')}
              className="bg-white text-amber-600 hover:bg-amber-50 font-bold py-4 px-10 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
            >
              RSVP Now
            </button>
          </div>

          {/* Contact */}
          <div className="text-center mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-100">
              <p className="text-gray-600 mb-2">Questions?</p>
              <a 
                href={`mailto:${eventDetails.contact}`}
                className="text-blue-600 hover:text-blue-700 font-medium underline flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                {eventDetails.contact}
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-amber-100">
              <div className="flex items-center justify-center mb-2">
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
                className="mt-4 text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 mx-auto opacity-50 hover:opacity-100"
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
