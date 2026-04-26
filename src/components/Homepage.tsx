import React, { useState, useEffect } from 'react';
import { eventDetails, ceremonyDetails, receptionDetails, rsvpDeadline } from '../data/initialData';
import { Calendar, Clock, MapPin, Mail, UserCheck, Church, Cross, Sparkles, ExternalLink, Users, Utensils, Heart, ChevronDown } from 'lucide-react';
import { useRSVP } from '../hooks/useRSVP';

interface HomepageProps {
  onNavigate: (section: 'rsvp') => void;
}

const handleAdminAccess = () => {
  window.location.hash = '#admin';
  window.location.reload();
};

// Animated Counter Component
const AnimatedCounter: React.FC<{ target: number; duration?: number }> = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);
  
  return <span>{count}</span>;
};

// Floating Cross Animation
const FloatingCross: React.FC<{ delay?: number; className?: string }> = ({ delay = 0, className = '' }) => (
  <div 
    className={`absolute opacity-20 animate-float ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <Cross className="w-8 h-8 text-amber-400" />
  </div>
);

// Public RSVPs View Component
const PublicRSVPs: React.FC = () => {
  const { rsvps, stats } = useRSVP();
  const attendingRSVPs = rsvps.filter(r => r.attending);

  if (attendingRSVPs.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-amber-100 text-center shadow-xl">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-amber-500" />
        </div>
        <p className="text-gray-600 text-lg">Be the first to RSVP!</p>
        <p className="text-gray-400 text-sm mt-2">Join us in celebrating this special day</p>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-amber-100">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full shadow-lg">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800">
            <AnimatedCounter target={stats.totalGuests} /> Guests
          </h3>
          <p className="text-gray-500 text-sm">{stats.attending} families attending</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
        {attendingRSVPs.slice(0, 12).map((rsvp, index) => (
          <div 
            key={rsvp.id} 
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-white rounded-2xl border border-amber-100 hover:shadow-md transition-all duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">
                {rsvp.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-gray-800 block truncate">{rsvp.name}</span>
              <span className="text-xs text-gray-500">
                {rsvp.guestCount} {rsvp.guestCount === 1 ? 'guest' : 'guests'}
              </span>
            </div>
            {rsvp.dietaryRestrictions && (
              <div className="flex gap-1">
                {rsvp.dietaryRestrictions.includes('Beef') && (
                  <span className="text-lg" title="Beef">🥩</span>
                )}
                {rsvp.dietaryRestrictions.includes('Chicken') && (
                  <span className="text-lg" title="Chicken">🍗</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {attendingRSVPs.length > 12 && (
        <p className="text-center text-gray-400 text-sm pt-4">
          +{attendingRSVPs.length - 12} more guests
        </p>
      )}
    </div>
  );
};

export const Homepage: React.FC<HomepageProps> = ({ onNavigate }) => {
  const [showRSVPs, setShowRSVPs] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-amber-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse-slow"></div>
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating crosses */}
        <FloatingCross delay={0} className="top-20 left-[10%]" />
        <FloatingCross delay={2} className="top-40 right-[15%]" />
        <FloatingCross delay={4} className="bottom-40 left-[20%]" />
        <FloatingCross delay={1} className="top-1/3 right-[8%]" />
        <FloatingCross delay={3} className="bottom-1/3 right-[25%]" />
        
        {/* Sparkle effects */}
        <div className="absolute top-32 left-1/4 w-2 h-2 bg-amber-300 rounded-full animate-twinkle"></div>
        <div className="absolute top-48 right-1/3 w-1.5 h-1.5 bg-blue-300 rounded-full animate-twinkle" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-48 left-1/3 w-2 h-2 bg-amber-400 rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-twinkle" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative min-h-screen p-4">
        <div className="max-w-5xl mx-auto">
          
          {/* Hero Section */}
          <div className={`text-center pt-8 pb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-sm md:text-base text-blue-600 font-medium tracking-[0.3em] uppercase mb-6 animate-fade-in">
              Please Join Us For The
            </p>
            
            {/* Cross Icon with glow */}
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-amber-400 blur-3xl opacity-20 rounded-full"></div>
              <div className="relative flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-400 mr-4 animate-pulse" />
                <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full shadow-xl">
                  <Cross className="w-12 h-12 text-amber-500" />
                </div>
                <Sparkles className="w-6 h-6 text-amber-400 ml-4 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-amber-500 via-blue-600 to-amber-500 bg-clip-text text-transparent mb-4 drop-shadow-sm leading-tight">
              Baptism
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              of <span className="text-blue-600">Eric Martinez</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              With great joy, <span className="font-semibold text-amber-600">Michael & Rachel</span> invite you to celebrate the Baptism of their beloved son
            </p>
          </div>

          {/* Event Cards */}
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Ceremony Card */}
            <div className="group bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-amber-100 hover:shadow-3xl hover:scale-[1.02] transition-all duration-500">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-4 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                  <Church className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-xs text-amber-600 font-bold uppercase tracking-wider">Religious Ceremony</p>
                  <h3 className="text-xl font-bold text-gray-800">{ceremonyDetails.name}</h3>
                </div>
              </div>
              
              <div className="space-y-4 pl-2">
                <div className="flex items-start gap-4 group/item hover:bg-amber-50 p-3 rounded-xl transition-colors">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{ceremonyDetails.address}</p>
                    <a 
                      href={ceremonyDetails.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium mt-1 hover:underline"
                    >
                      Get Directions
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 group/item hover:bg-amber-50 p-3 rounded-xl transition-colors">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <p className="text-gray-800 font-bold">{ceremonyDetails.date}</p>
                </div>
                
                <div className="flex items-center gap-4 group/item hover:bg-amber-50 p-3 rounded-xl transition-colors">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-gray-800 font-medium">{ceremonyDetails.time}</p>
                </div>
              </div>
            </div>

            {/* Reception Card */}
            <div className="group bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-blue-100 hover:shadow-3xl hover:scale-[1.02] transition-all duration-500">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                  <Utensils className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Reception</p>
                  <h3 className="text-xl font-bold text-gray-800">{receptionDetails.name}</h3>
                </div>
              </div>
              
              <div className="space-y-4 pl-2">
                <div className="flex items-start gap-4 group/item hover:bg-blue-50 p-3 rounded-xl transition-colors">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{receptionDetails.address}</p>
                    <a 
                      href={receptionDetails.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium mt-1 hover:underline"
                    >
                      Get Directions
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 group/item hover:bg-blue-50 p-3 rounded-xl transition-colors">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-gray-800 font-bold">{receptionDetails.time}</p>
                </div>
                
                <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
                  <p className="text-amber-800 font-medium flex items-center gap-2">
                    <Utensils className="w-4 h-4" />
                    Reception Menu: <span className="font-bold">Beef or Chicken</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Public RSVPs Toggle */}
          <div className={`mb-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <button
              onClick={() => setShowRSVPs(!showRSVPs)}
              className="w-full bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-amber-100 flex items-center justify-between hover:bg-white hover:shadow-xl transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-gray-800 text-lg block">See Who's Attending</span>
                  <span className="text-gray-500 text-sm">View the guest list in real-time</span>
                </div>
              </div>
              <div className={`p-2 bg-amber-100 rounded-full transition-transform ${showRSVPs ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-6 h-6 text-amber-600" />
              </div>
            </button>
            
            <div className={`overflow-hidden transition-all duration-500 ${showRSVPs ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              <PublicRSVPs />
            </div>
          </div>

          {/* RSVP Section */}
          <div className={`bg-gradient-to-br from-amber-400 via-amber-500 to-blue-500 rounded-3xl p-8 md:p-10 shadow-2xl text-center mb-8 relative overflow-hidden transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <Cross className="absolute top-4 right-8 w-8 h-8 text-white/20" />
              <Cross className="absolute bottom-4 left-8 w-6 h-6 text-white/20" />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-5 backdrop-blur-sm">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <p className="text-white/90 text-sm uppercase tracking-wider mb-2 font-medium">
                RSVP
              </p>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">Kindly Respond</h3>
              <div className="inline-block px-4 py-2 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
                <p className="text-white font-semibold">
                  By {rsvpDeadline}
                </p>
              </div>
              <p className="text-white/90 mb-8 text-lg max-w-lg mx-auto">
                Please let us know your preference for the reception: <span className="font-bold">Beef or Chicken</span>
              </p>
              <button 
                onClick={() => onNavigate('rsvp')}
                className="bg-white text-amber-600 hover:text-amber-700 font-bold py-4 px-12 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg hover:shadow-3xl"
              >
                RSVP Now
              </button>
            </div>
          </div>

          {/* Contact */}
          <div className={`text-center mb-8 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-5 shadow-lg border border-amber-100">
              <p className="text-gray-600 mb-2">Questions?</p>
              <a 
                href={`mailto:${eventDetails.contact}`}
                className="text-blue-600 hover:text-blue-700 font-semibold underline flex items-center justify-center gap-2 text-lg"
              >
                <Mail className="w-5 h-5" />
                {eventDetails.contact}
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className={`text-center pb-8 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block bg-white/70 backdrop-blur-sm rounded-3xl px-10 py-6 shadow-lg border border-amber-100">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
                <p className="text-gray-600 font-medium text-lg">
                  With love and blessings
                </p>
                <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
              </div>
              <p className="text-gray-500">
                The Martinez Family
              </p>
              
              {/* Discrete Admin Access */}
              <button
                onClick={handleAdminAccess}
                className="mt-4 text-xs text-gray-400 hover:text-gray-600 transition-colors opacity-50 hover:opacity-100"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d4a574;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #b8935f;
        }
      `}</style>
    </div>
  );
};
