import React, { useState } from 'react';
import { ArrowLeft, Check, X, Users, Utensils, Mail, Phone, User, Church, Cross, Heart } from 'lucide-react';
import { RSVP, Guest } from '../types';

interface RSVPFormProps {
  onBack: () => void;
  onSubmit: (rsvp: Omit<RSVP, 'id' | 'submittedAt'>) => Promise<RSVP | void>;
}

export const RSVPForm: React.FC<RSVPFormProps> = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    attending: true,
    guestCount: 1,
    guests: [{ name: '', meal: 'beef' }] as Guest[],
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGuestCountChange = (count: number) => {
    const newGuests = [...formData.guests];
    if (count > newGuests.length) {
      while (newGuests.length < count) {
        newGuests.push({ name: '', meal: 'beef' });
      }
    } else if (count < newGuests.length) {
      newGuests.splice(count);
    }
    setFormData(prev => ({ ...prev, guestCount: count, guests: newGuests }));
  };

  const handleGuestNameChange = (index: number, name: string) => {
    const newGuests = [...formData.guests];
    newGuests[index] = { ...newGuests[index], name };
    setFormData(prev => ({ ...prev, guests: newGuests }));
  };

  const handleMealPreferenceChange = (index: number, meal: 'beef' | 'chicken') => {
    const newGuests = [...formData.guests];
    newGuests[index] = { ...newGuests[index], meal };
    setFormData(prev => ({ ...prev, guests: newGuests }));
  };

  // Auto-fill guest 1's name from the contact name when the contact name
  // changes AND guest 1's name was either empty or matched the previous
  // contact name (so manual edits to guest 1 are preserved).
  const handleContactNameChange = (newName: string) => {
    setFormData(prev => {
      const firstGuest = prev.guests[0];
      const shouldSync =
        !firstGuest?.name?.trim() ||
        firstGuest.name.trim() === prev.name.trim();
      const newGuests = shouldSync
        ? prev.guests.map((g, i) => (i === 0 ? { ...g, name: newName } : g))
        : prev.guests;
      return { ...prev, name: newName, guests: newGuests };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Your name is required');
      return;
    }

    if (formData.attending) {
      if (formData.guestCount < 1) {
        setError('Guest count must be at least 1');
        return;
      }
      const missingNameIndex = formData.guests.findIndex(g => !g.name.trim());
      if (missingNameIndex !== -1) {
        setError(`Please enter a name for Guest ${missingNameIndex + 1}`);
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const cleanedGuests: Guest[] = formData.attending
        ? formData.guests.map(g => ({ name: g.name.trim(), meal: g.meal }))
        : [];

      await onSubmit({
        name: formData.name.trim(),
        email: formData.email,
        phone: formData.phone,
        attending: formData.attending,
        guestCount: formData.attending ? formData.guestCount : 0,
        guests: formData.attending ? cleanedGuests : undefined,
        message: formData.message
      });
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit RSVP. Please try again.');
      console.error('RSVP submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    const beefCount = formData.guests.filter(g => g.meal === 'beef').length;
    const chickenCount = formData.guests.filter(g => g.meal === 'chicken').length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fbf6ec] via-white to-[#f1f5fa] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="engraved-card bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 text-center border border-amber-100">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-amber-200/60">
              <Cross className="w-10 h-10 text-amber-600" />
            </div>
            <p className="font-script text-4xl text-amber-700 mb-2">Thank you</p>
            <h2 className="font-serif-display text-3xl font-medium text-gray-800 mb-3">RSVP Confirmed</h2>
            <p className="text-gray-600 mb-4 font-serif-display italic text-lg">
              {formData.name}, {formData.attending ? "we're blessed to have you join us" : "we're sorry you can't make it"} for Eric's baptism.
            </p>
            {formData.attending && (
              <div className="bg-gradient-to-r from-amber-50 to-blue-50 rounded-2xl p-5 mb-6 text-left">
                <p className="text-gray-700 font-medium mb-3 text-center">Your Guests &amp; Meals:</p>
                <ul className="space-y-2">
                  {formData.guests.map((g, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between bg-white/80 px-4 py-2 rounded-xl border border-amber-100"
                    >
                      <span className="font-medium text-gray-800 truncate">{g.name}</span>
                      <span className="flex items-center gap-1 text-sm">
                        <span className="text-lg">{g.meal === 'beef' ? '🥩' : '🍗'}</span>
                        <span className={g.meal === 'beef' ? 'text-red-700 font-semibold' : 'text-amber-700 font-semibold'}>
                          {g.meal === 'beef' ? 'Beef' : 'Chicken'}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-center text-xs text-gray-500 mt-3">
                  {beefCount} Beef · {chickenCount} Chicken
                </p>
              </div>
            )}
            <p className="text-sm text-gray-500 mb-6">
              Saturday, May 16, 2026 • We can't wait to celebrate with you!
            </p>
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-amber-500 to-blue-500 hover:from-amber-600 hover:to-blue-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200"
            >
              Back to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbf6ec] via-white to-[#f1f5fa] p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium bg-white/80 px-4 py-2 rounded-full shadow-sm hover:shadow transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm">
            <Cross className="w-5 h-5 text-amber-500" />
            <h1 className="font-serif-display text-xl font-medium text-gray-800 tracking-wide">RSVP</h1>
          </div>
          <div className="w-24"></div>
        </div>

        {/* Form */}
        <div className="engraved-card bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 border border-amber-100">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-blue-100 rounded-full mb-4 ring-1 ring-amber-200/60">
              <Church className="w-8 h-8 text-amber-600" />
            </div>
            <p className="text-xs tracking-[0.4em] uppercase text-amber-700/80 mb-2">Baptism of</p>
            <h2 className="font-script text-5xl md:text-6xl text-amber-700 leading-none mb-3">
              Eric Martinez
            </h2>
            <p className="font-serif-display italic text-gray-600 text-lg">
              Saturday, May 16, 2026
            </p>
            <div className="inline-block mt-3 px-4 py-1 bg-amber-100 rounded-full">
              <p className="text-amber-800 font-medium text-sm tracking-wide">
                Kindly respond by May 7, 2026
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name */}
            <div className="bg-gray-50 rounded-2xl p-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Your Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleContactNameChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                  placeholder="your@email.com"
                />
              </div>
              <div className="bg-gray-50 rounded-2xl p-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* Attendance */}
            <div className="bg-gradient-to-r from-amber-50 to-blue-50 rounded-2xl p-6">
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Will you be attending? *
              </label>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => handleInputChange('attending', true)}
                  className={`flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    formData.attending
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  <Check className="w-5 h-5" />
                  Joyfully Accept
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('attending', false)}
                  className={`flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    !formData.attending
                      ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  <X className="w-5 h-5" />
                  Regretfully Decline
                </button>
              </div>
            </div>

            {/* Guest Count & Meal Preferences (only if attending) */}
            {formData.attending && (
              <div className="space-y-6">
                {/* Guest Count */}
                <div className="bg-gray-50 rounded-2xl p-5">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Users className="w-4 h-4 inline mr-1" />
                    Number of Guests (including yourself) *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleGuestCountChange(num)}
                        className={`w-12 h-12 rounded-xl font-semibold transition-all duration-200 ${
                          formData.guestCount === num
                            ? 'bg-gradient-to-r from-amber-500 to-blue-500 text-white shadow-lg scale-110'
                            : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Per-guest name + meal */}
                <div className="bg-gradient-to-br from-amber-50 via-white to-blue-50 rounded-2xl p-6 border border-amber-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Utensils className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-gray-800">Each Guest's Name &amp; Meal</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-5">
                    So we know who's eating what when we set the tables.
                  </p>

                  <div className="grid gap-4">
                    {formData.guests.map((guest, index) => (
                      <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs uppercase tracking-wider text-amber-700 font-bold">
                            Guest {index + 1}
                          </span>
                          {index === 0 && (
                            <span className="text-xs text-gray-400 italic">that's you, by default</span>
                          )}
                        </div>

                        <input
                          type="text"
                          value={guest.name}
                          onChange={(e) => handleGuestNameChange(index, e.target.value)}
                          className="w-full px-4 py-3 mb-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                          placeholder={index === 0 ? 'Your full name' : `Guest ${index + 1} full name`}
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => handleMealPreferenceChange(index, 'beef')}
                            className={`flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                              guest.meal === 'beef'
                                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                                : 'bg-gray-50 text-gray-600 hover:bg-red-50'
                            }`}
                          >
                            <span className="text-2xl">🥩</span>
                            <span>Beef</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMealPreferenceChange(index, 'chicken')}
                            className={`flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                              guest.meal === 'chicken'
                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                                : 'bg-gray-50 text-gray-600 hover:bg-amber-50'
                            }`}
                          >
                            <span className="text-2xl">🍗</span>
                            <span>Chicken</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Meal Summary */}
                  <div className="mt-4 flex justify-center gap-4">
                    <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full">
                      <span className="text-lg">🥩</span>
                      <span className="text-red-700 font-semibold">
                        {formData.guests.filter(g => g.meal === 'beef').length} Beef
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full">
                      <span className="text-lg">🍗</span>
                      <span className="text-amber-700 font-semibold">
                        {formData.guests.filter(g => g.meal === 'chicken').length} Chicken
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Message */}
            <div className="bg-gray-50 rounded-2xl p-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Heart className="w-4 h-4 inline mr-1 text-pink-500" />
                Message for the Family (Optional)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none bg-white"
                placeholder="Share your blessings and well wishes for Eric!"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-blue-500 hover:from-amber-600 hover:via-amber-700 hover:to-blue-600 disabled:bg-gray-400 text-white font-serif-display font-medium tracking-wider py-5 px-8 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-xl"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="w-6 h-6" />
                  Submit RSVP
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
