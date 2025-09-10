import React from 'react';
import { RSVP } from '../types';
import { UserCheck, Check, X, Users, MessageCircle, Mail, Phone, Trash2 } from 'lucide-react';

interface RSVPTabProps {
  rsvps: RSVP[];
  stats: {
    total: number;
    attending: number;
    notAttending: number;
    totalGuests: number;
    withDietaryRestrictions: number;
  };
  onDelete: (rsvpId: string) => void;
}

export const RSVPTab: React.FC<RSVPTabProps> = ({ rsvps, stats, onDelete }) => {
  return (
    <div>
      {/* RSVP Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total RSVPs</p>
              <p className="text-xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Attending</p>
              <p className="text-xl font-bold text-gray-800">{stats.attending}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <X className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Not Attending</p>
              <p className="text-xl font-bold text-gray-800">{stats.notAttending}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-full">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Guests</p>
              <p className="text-xl font-bold text-gray-800">{stats.totalGuests}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-full">
              <MessageCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Dietary Needs</p>
              <p className="text-xl font-bold text-gray-800">{stats.withDietaryRestrictions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* RSVP List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
        {rsvps.length === 0 ? (
          <div className="text-center py-12">
            <UserCheck className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No RSVPs received yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dietary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rsvps.map(rsvp => (
                  <tr key={rsvp.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{rsvp.name}</div>
                        <div className="text-sm text-gray-500">
                          {rsvp.email && (
                            <span className="inline-flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {rsvp.email}
                            </span>
                          )}
                          {rsvp.phone && (
                            <span className="inline-flex items-center gap-1 ml-2">
                              <Phone className="w-3 h-3" />
                              {rsvp.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {rsvp.attending ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Attending
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Not Attending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rsvp.attending ? rsvp.guestCount : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rsvp.dietaryRestrictions ? (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                          {rsvp.dietaryRestrictions}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rsvp.submittedAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onDelete(rsvp.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete RSVP"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Messages Section */}
      {rsvps.some(rsvp => rsvp.message) && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Messages from Guests</h3>
          <div className="space-y-4">
            {rsvps
              .filter(rsvp => rsvp.message)
              .map(rsvp => (
                <div key={rsvp.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{rsvp.name}</p>
                      <p className="text-gray-600 italic mt-1">"{rsvp.message}"</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {rsvp.submittedAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
