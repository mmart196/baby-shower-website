import React, { useState } from 'react';
import { ArrowLeft, Check, X, Users, MessageCircle, Utensils, Mail, Phone, User, Church, Cross, Heart } from 'lucide-react';
import { RSVP } from '../types';

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
    mealPreferences: ['beef'] as ('beef' | 'chicken')[],
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGuestCountChange = (count: number) => {
    const newPreferences = [...formData.mealPreferences];
    if (count > newPreferences.length) {
      // Add more beef preferences
      while (newPreferences.length < count) {
        newPreferences.push('beef');
      }
    } else if (count < newPreferences.length) {
      // Remove extras
      newPreferences.splice(count);
    }
    setFormData(prev => ({ ...prev, guestCount: count, mealPreferences: newPreferences }));
  };

  const handleMealPreferenceChange = (index: number, preference: 'beef' | 'chicken') => {
    const newPreferences = [...formData.mealPreferences];
    newPreferences[index] = preference;
    setFormData(prev => ({ ...prev, mealPreferences: newPreferences }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (formData.guestCount < 1) {
      setError('Guest count must be at least 1');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Count meals
      const beefCount = formData.mealPreferences.filter(m => m === 'beef').length;
      const chickenCount = formData.mealPreferences.filter(m => m === 'chicken').length;
      const mealSummary = `${beefCount} Beef, ${chickenCount} Chicken`;

      await onSubmit({
        ...formData,
        dietaryRestrictions: mealSummary
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
    const beefCount = formData.mealPreferences.filter(m => m === 'beef').length;
    const chickenCount = formData.mealPreferences.filter(m => m === 'chicken').length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center border border-amber-100">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Cross className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">RSVP Confirmed!</h2>
            <p className="text-gray-600 mb-4">
              Thank you, {formData.name}! We're {formData.attending ? 'blessed to have you join us' : 'sorry you can\'t make it'} for Eric's baptism.
            </p>
            {formData.attending && (
              <div className="bg-gradient-to-r from-amber-50 to-blue-50 rounded-2xl p-5 mb-6">
                <p className="text-gray-700 font-medium mb-3">Meal Selections:</p>
                <div className="flex justify-center gap-4">
                  {beefCount > 0 && (
                    <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full">
                      <span className="text-2xl">🥩</span>
                      <span className="text-red-700 font-bold">{beefCount} Beef</span>
                    </div>
                  )}
                  {chickenCount > 0 && (
                    <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full">
                      <span className="text-2xl">🍗</span>
                      <span className="text-amber-700 font-bold">{chickenCount} Chicken</span>
                    </div>
                  )}
                </div>
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 p-4">
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
            <h1 className="text-xl font-bold text-gray-800">RSVP</h1>
          </div>
          <div className="w-24"></div>
        </div>

        {/* Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 border border-amber-100">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-blue-100 rounded-full mb-4">
              <Church className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Baptism of Eric Martinez
            </h2>
            <p className="text-gray-600 text-lg">
              Saturday, May 16, 2026
            </p>
            <div className="inline-block mt-3 px-4 py-1 bg-amber-100 rounded-full">
              <p className="text-amber-800 font-medium text-sm">
                Kindly respond by May 7, 2026
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name */}
            <div className="bg-gray-50 rounded-2xl p-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
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

                {/* Meal Preferences */}
                <div className="bg-gradient-to-br from-amber-50 via-white to-blue-50 rounded-2xl p-6 border border-amber-100">
                  <div className="flex items-center gap-2 mb-5">
                    <Utensils className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-gray-800">Select Meal for Each Guest</h3>
                  </div>
                  
                  <div className="grid gap-4">
                    {formData.mealPreferences.map((preference, index) => (
                      <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 mb-3">Guest {index + 1}</p>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => handleMealPreferenceChange(index, 'beef')}
                            className={`flex items-center justify-center gap-3 py-4 px-4 rounded-xl font-medium transition-all duration-200 ${
                              preference === 'beef'
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
                            className={`flex items-center justify-center gap-3 py-4 px-4 rounded-xl font-medium transition-all duration-200 ${
                              preference === 'chicken'
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
                        {formData.mealPreferences.filter(m => m === 'beef').length} Beef
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full">
                      <span className="text-lg">🍗</span>
                      <span className="text-amber-700 font-semibold">
                        {formData.mealPreferences.filter(m => m === 'chicken').length} Chicken
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
              className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-blue-500 hover:from-amber-600 hover:via-amber-700 hover:to-blue-600 disabled:bg-gray-400 text-white font-bold py-5 px-8 rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg"
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
