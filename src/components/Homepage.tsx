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

const EVENT_DATE = new Date('2026-05-16T10:00:00-04:00');

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

// Ornamental section divider — gold rules around a small cross
const OrnamentDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`ornament-divider ${className}`}>
    <Cross className="w-4 h-4 flex-none" />
  </div>
);

// Live countdown to the celebration
const Countdown: React.FC = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 60); // tick once a minute
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, EVENT_DATE.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  if (diff === 0) {
    return (
      <p className="font-serif-display italic text-xl text-amber-700 text-center">
        Today is the day — we're so glad you're here.
      </p>
    );
  }

  const Cell: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center px-5 md:px-7">
      <span className="font-serif-display text-4xl md:text-5xl font-medium text-gray-800 tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-amber-700/80 mt-1">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex items-center justify-center divide-x divide-amber-200">
      <Cell value={days} label="Days" />
      <Cell value={hours} label="Hours" />
      <Cell value={minutes} label="Minutes" />
    </div>
  );
};

// Decorative SVG corner flourish — a small filigree
const CornerFlourish: React.FC<{ className?: string; flip?: boolean }> = ({ className = '', flip = false }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    className={`${className} ${flip ? 'scale-x-[-1]' : ''}`}
    aria-hidden="true"
  >
    <g stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none">
      <path d="M2 32 C 12 32, 18 26, 22 18 C 25 11, 32 8, 40 10" />
      <path d="M2 32 C 14 30, 22 22, 26 14" opacity="0.6" />
      <circle cx="40" cy="10" r="2.4" fill="currentColor" />
      <circle cx="22" cy="18" r="1.6" fill="currentColor" opacity="0.7" />
      <circle cx="6" cy="32" r="1.2" fill="currentColor" opacity="0.5" />
      <path d="M30 18 C 33 16, 36 16, 38 18" opacity="0.5" />
    </g>
  </svg>
);

// Save-the-Date centerpiece — the visual focal point of the page
const FormalDate: React.FC = () => (
  <div className="relative inline-block w-full max-w-2xl">
    {/* Outer parchment card with double gold border */}
    <div
      className="relative px-6 py-9 md:px-16 md:py-12 rounded-[2rem] shadow-2xl"
      style={{
        background:
          'linear-gradient(135deg, #fffaf0 0%, #fdf6e3 50%, #faf0d7 100%)',
        boxShadow:
          '0 25px 50px -12px rgba(86, 64, 21, 0.25), inset 0 0 0 1px rgba(201, 161, 74, 0.5), inset 0 0 0 7px #fffaf0, inset 0 0 0 8px rgba(201, 161, 74, 0.35)',
      }}
    >
      {/* Corner flourishes */}
      <CornerFlourish className="absolute top-3 left-3 w-8 h-8 md:w-12 md:h-12 text-amber-600/70" />
      <CornerFlourish className="absolute top-3 right-3 w-8 h-8 md:w-12 md:h-12 text-amber-600/70" flip />
      <CornerFlourish className="absolute bottom-3 left-3 w-8 h-8 md:w-12 md:h-12 text-amber-600/70 rotate-[270deg]" />
      <CornerFlourish className="absolute bottom-3 right-3 w-8 h-8 md:w-12 md:h-12 text-amber-600/70 rotate-180" />

      {/* Eyebrow */}
      <p className="text-center text-[10px] md:text-xs tracking-[0.5em] uppercase text-amber-700/80 mb-3 font-medium">
        Save the Date
      </p>

      {/* Day of week — script */}
      <p className="text-center font-script text-3xl md:text-4xl text-amber-700 leading-none mb-4">
        Saturday
      </p>

      {/* The big day — 05 | 16 | 2026 in horizontal layout with rules */}
      <div className="flex items-end justify-center gap-3 md:gap-6 mb-5">
        {/* Month */}
        <div className="text-right flex-1 min-w-0">
          <p className="font-serif-display text-3xl md:text-5xl font-medium text-gray-700 leading-none tabular-nums">
            05
          </p>
        </div>

        {/* Day — massive centerpiece */}
        <div className="relative flex-none px-3">
          <div className="h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent absolute top-1 md:top-2 left-0 right-0" />
          <p className="font-serif-display text-7xl md:text-9xl font-medium text-gray-900 leading-none tabular-nums engraved-text">
            16
          </p>
          <div className="h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent absolute bottom-1 md:bottom-2 left-0 right-0" />
        </div>

        {/* Year */}
        <div className="text-left flex-1 min-w-0">
          <p className="font-serif-display text-3xl md:text-5xl font-medium text-gray-700 leading-none tabular-nums">
            2026
          </p>
        </div>
      </div>

      {/* Time */}
      <div className="flex items-center justify-center gap-2 md:gap-3">
        <span className="h-px w-8 md:w-14 bg-amber-400/50" />
        <p className="font-serif-display text-xl md:text-2xl text-amber-800 tabular-nums whitespace-nowrap">
          10:00 AM
        </p>
        <span className="h-px w-8 md:w-14 bg-amber-400/50" />
      </div>
    </div>
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
        <p className="text-gray-600 text-lg font-serif-display italic">Be the first to RSVP</p>
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
          <h3 className="font-serif-display text-3xl font-medium text-gray-800">
            <AnimatedCounter target={stats.totalGuests} /> Guests
          </h3>
          <p className="text-gray-500 text-sm tracking-wide">{stats.attending} families attending</p>
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
        <p className="text-center text-gray-400 text-sm pt-4 italic">
          and {attendingRSVPs.length - 12} more
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
    <div className="min-h-screen bg-gradient-to-br from-[#fbf6ec] via-[#fdfaf3] to-[#f1f5fa] relative overflow-hidden">
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
          <div className={`text-center pt-12 pb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-xs md:text-sm text-amber-700/80 font-medium tracking-[0.4em] uppercase mb-6 animate-fade-in">
              Together with their family
            </p>

            <p className="font-serif-display italic text-2xl md:text-3xl text-gray-700 mb-2">
              Michael <span className="text-amber-700">&amp;</span> Rachel
            </p>
            <p className="text-xs md:text-sm text-gray-500 tracking-[0.3em] uppercase mb-8">
              joyfully invite you to celebrate the
            </p>

            {/* Cross Icon with glow */}
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-amber-400 blur-3xl opacity-20 rounded-full"></div>
              <div className="relative flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400 mr-4 animate-pulse" />
                <div className="p-5 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full shadow-xl ring-1 ring-amber-200/60">
                  <Cross className="w-12 h-12 text-amber-600" />
                </div>
                <Sparkles className="w-5 h-5 text-amber-400 ml-4 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>

            <h1 className="font-serif-display text-6xl md:text-8xl font-light tracking-wide text-gray-900 leading-none mb-2 engraved-text">
              Holy Baptism
            </h1>
            <p className="text-xs md:text-sm text-gray-500 tracking-[0.4em] uppercase mb-4">— of —</p>
            <h2 className="font-script text-6xl md:text-8xl text-amber-700 leading-none mb-8 engraved-text">
              Eric Martinez
            </h2>

            <OrnamentDivider className="mb-8" />

            <div className="flex justify-center mb-8">
              <FormalDate />
            </div>

            <p className="font-serif-display italic text-base md:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
              "Behold, children are a heritage from the Lord."
              <span className="block text-xs not-italic tracking-[0.25em] uppercase text-amber-700/80 mt-2">Psalm 127:3</span>
            </p>
          </div>

          {/* Countdown */}
          <div className={`mb-14 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-center text-xs tracking-[0.4em] uppercase text-amber-700/80 mb-4">
              Counting the days
            </p>
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl py-6 px-4 shadow-md border border-amber-100 max-w-xl mx-auto">
              <Countdown />
            </div>
          </div>

          <OrnamentDivider className="mb-14" />

          {/* Event Cards */}
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-14 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

            {/* Ceremony Card */}
            <div className="engraved-card group bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-amber-100 hover:shadow-3xl hover:scale-[1.02] transition-all duration-500">
              <div className="text-center mb-5">
                <div className="inline-flex p-4 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform mb-4">
                  <Church className="w-7 h-7 text-white" />
                </div>
                <p className="text-[10px] text-amber-700 font-bold uppercase tracking-[0.3em]">The Ceremony</p>
                <h3 className="font-serif-display text-2xl font-medium text-gray-800 mt-1">{ceremonyDetails.name}</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-4 group/item hover:bg-amber-50 p-3 rounded-xl transition-colors">
                  <div className="p-2 bg-blue-100 rounded-lg flex-none">
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
                  <div className="p-2 bg-amber-100 rounded-lg flex-none">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <p className="text-gray-800 font-medium">{ceremonyDetails.date}</p>
                </div>

                <div className="flex items-center gap-4 group/item hover:bg-amber-50 p-3 rounded-xl transition-colors">
                  <div className="p-2 bg-blue-100 rounded-lg flex-none">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-gray-800 font-medium">{ceremonyDetails.time}</p>
                </div>
              </div>
            </div>

            {/* Reception Card */}
            <div className="engraved-card group bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-blue-100 hover:shadow-3xl hover:scale-[1.02] transition-all duration-500">
              <div className="text-center mb-5">
                <div className="inline-flex p-4 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform mb-4">
                  <Utensils className="w-7 h-7 text-white" />
                </div>
                <p className="text-[10px] text-blue-700 font-bold uppercase tracking-[0.3em]">The Reception</p>
                <h3 className="font-serif-display text-2xl font-medium text-gray-800 mt-1">{receptionDetails.name}</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-4 group/item hover:bg-blue-50 p-3 rounded-xl transition-colors">
                  <div className="p-2 bg-blue-100 rounded-lg flex-none">
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
                  <div className="p-2 bg-blue-100 rounded-lg flex-none">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-gray-800 font-medium">{receptionDetails.time}</p>
                </div>

                <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
                  <p className="text-amber-800 font-medium flex items-center gap-2">
                    <Utensils className="w-4 h-4 flex-none" />
                    Menu: <span className="font-bold">Beef or Chicken</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <OrnamentDivider className="mb-10" />

          {/* Public RSVPs Toggle */}
          <div className={`mb-10 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <button
              onClick={() => setShowRSVPs(!showRSVPs)}
              className="w-full bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-amber-100 flex items-center justify-between hover:bg-white hover:shadow-xl transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <span className="font-serif-display font-medium text-gray-800 text-xl block">See Who's Attending</span>
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
          <div className={`bg-gradient-to-br from-amber-400 via-amber-500 to-blue-500 rounded-3xl p-10 md:p-14 shadow-2xl text-center mb-10 relative overflow-hidden transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <Cross className="absolute top-6 right-10 w-8 h-8 text-white/20" />
              <Cross className="absolute bottom-6 left-10 w-6 h-6 text-white/20" />
            </div>

            <div className="relative z-10">
              <p className="font-script text-4xl md:text-5xl text-white/95 mb-2">Kindly</p>
              <p className="text-white/80 text-xs uppercase tracking-[0.5em] mb-6 font-medium">
                Respond
              </p>
              <div className="inline-flex items-center justify-center gap-3 px-5 py-2 bg-white/15 rounded-full mb-8 backdrop-blur-sm border border-white/20">
                <UserCheck className="w-4 h-4 text-white/90" />
                <p className="text-white font-medium tracking-wide text-sm">
                  By {rsvpDeadline}
                </p>
              </div>
              <p className="font-serif-display italic text-white/95 mb-8 text-xl max-w-lg mx-auto">
                Reception menu — please choose <span className="font-semibold not-italic">Beef</span> or <span className="font-semibold not-italic">Chicken</span> for each guest
              </p>
              <button
                onClick={() => onNavigate('rsvp')}
                className="bg-white text-amber-700 hover:text-amber-800 font-serif-display text-xl tracking-wide py-4 px-14 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-3xl border border-white/40"
              >
                RSVP Now
              </button>
            </div>
          </div>

          {/* Contact */}
          <div className={`text-center mb-10 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-5 shadow-lg border border-amber-100">
              <p className="text-xs tracking-[0.3em] uppercase text-amber-700/80 mb-2">Questions?</p>
              <a
                href={`mailto:${eventDetails.contact}`}
                className="text-blue-600 hover:text-blue-700 font-medium underline flex items-center justify-center gap-2 text-base"
              >
                <Mail className="w-4 h-4" />
                {eventDetails.contact}
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className={`text-center pb-10 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <OrnamentDivider className="mb-6" />
            <p className="font-script text-3xl text-amber-700 mb-1">With love and blessings</p>
            <p className="text-xs tracking-[0.3em] uppercase text-gray-500">The Martinez Family</p>

            {/* Discrete Admin Access */}
            <button
              onClick={handleAdminAccess}
              className="mt-6 text-xs text-gray-400 hover:text-gray-600 transition-colors opacity-50 hover:opacity-100"
            >
              Admin
            </button>
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
          background: #f5efe1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c9a14a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a98538;
        }
      `}</style>
    </div>
  );
};
