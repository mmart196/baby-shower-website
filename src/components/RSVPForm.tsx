import React, { useState } from 'react';
import { ArrowLeft, Check, X, Users, MessageCircle, Utensils, Mail, Phone, User } from 'lucide-react';
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
    dietaryRestrictions: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      await onSubmit(formData);
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">RSVP Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your response, {formData.name}! We're {formData.attending ? 'excited to see you' : 'sorry you can\'t make it'} at the baby shower.
            </p>
            {formData.attending && (
              <p className="text-sm text-gray-500 mb-6">
                We'll see you on October 4th! 🎉
              </p>
            )}
            <button
              onClick={onBack}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
            >
              Back to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Main
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            RSVP
          </h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Rachel & Michael's Baby Shower
            </h2>
            <p className="text-gray-600">
              October 4th, 2025 • 5:00 PM - 9:00 PM EST
            </p>
            <p className="text-gray-600">
              18529 Brooke Rd, Sandy Spring, MD 20860
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* Attendance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Will you be attending? *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('attending', true)}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    formData.attending
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  Yes, I'll be there!
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('attending', false)}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    !formData.attending
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <X className="w-4 h-4" />
                  Sorry, can't make it
                </button>
              </div>
            </div>

            {/* Guest Count (only if attending) */}
            {formData.attending && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Number of Guests (including yourself) *
                </label>
                <select
                  value={formData.guestCount}
                  onChange={(e) => handleInputChange('guestCount', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'person' : 'people'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Dietary Restrictions (only if attending) */}
            {formData.attending && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Utensils className="w-4 h-4 inline mr-1" />
                  Dietary Restrictions or Allergies
                </label>
                <input
                  type="text"
                  value={formData.dietaryRestrictions}
                  onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Let us know about any dietary needs"
                />
              </div>
            )}

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageCircle className="w-4 h-4 inline mr-1" />
                Message for Rachel & Michael
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                placeholder="Share your excitement or well wishes!"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
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
