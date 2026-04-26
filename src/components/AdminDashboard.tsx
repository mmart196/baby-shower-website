import React, { useState } from 'react';
import { useRSVP } from '../hooks/useRSVP';
import { LogOut, Home, Users, Check, X, Trash2, Download, Utensils } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { rsvps, stats, deleteRSVP } = useRSVP();
  const [filter, setFilter] = useState<'all' | 'attending' | 'not-attending'>('all');

  const filteredRSVPs = rsvps.filter(rsvp => {
    if (filter === 'attending') return rsvp.attending;
    if (filter === 'not-attending') return !rsvp.attending;
    return true;
  });

  // Count meal preferences
  const mealCounts = rsvps
    .filter(r => r.attending)
    .reduce((acc, rsvp) => {
      const meal = rsvp.dietaryRestrictions?.replace('Meal: ', '') || 'Unknown';
      acc[meal] = (acc[meal] || 0) + rsvp.guestCount;
      return acc;
    }, {} as Record<string, number>);

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Attending', 'Guests', 'Meal', 'Message', 'Submitted'].join(','),
      ...filteredRSVPs.map(rsvp => [
        `"${rsvp.name}"`,
        `"${rsvp.email || ''}"`,
        `"${rsvp.phone || ''}"`,
        rsvp.attending ? 'Yes' : 'No',
        rsvp.guestCount,
        `"${rsvp.dietaryRestrictions?.replace('Meal: ', '') || ''}"`,
        `"${rsvp.message || ''}"`,
        new Date(rsvp.submittedAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `baptism-rsvps-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Baptism RSVP Dashboard
            </h1>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => window.location.hash = ''}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-all"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl font-medium transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-amber-100">
            <p className="text-sm text-gray-600 mb-1">Total RSVPs</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-5 shadow-lg border border-green-100">
            <p className="text-sm text-green-600 mb-1">Attending</p>
            <p className="text-2xl font-bold text-green-700">{stats.attending}</p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-5 shadow-lg border border-blue-100">
            <p className="text-sm text-blue-600 mb-1">Total Guests</p>
            <p className="text-2xl font-bold text-blue-700">{stats.totalGuests}</p>
          </div>
          <div className="bg-red-50 rounded-2xl p-5 shadow-lg border border-red-100">
            <p className="text-sm text-red-600 mb-1">Declined</p>
            <p className="text-2xl font-bold text-red-700">{stats.notAttending}</p>
          </div>
        </div>

        {/* Meal Counts */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 border border-amber-100">
          <div className="flex items-center gap-2 mb-3">
            <Utensils className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-gray-800">Meal Preferences</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(mealCounts).map(([meal, count]) => (
              <div key={meal} className={`rounded-xl p-3 text-center ${
                meal === 'Beef' ? 'bg-red-50 border border-red-100' :
                meal === 'Chicken' ? 'bg-amber-50 border border-amber-100' :
                'bg-gray-50 border border-gray-100'
              }`}>
                <p className={`text-sm font-medium ${
                  meal === 'Beef' ? 'text-red-700' :
                  meal === 'Chicken' ? 'text-amber-700' :
                  'text-gray-700'
                }`}>{meal}</p>
                <p className={`text-xl font-bold ${
                  meal === 'Beef' ? 'text-red-800' :
                  meal === 'Chicken' ? 'text-amber-800' :
                  'text-gray-800'
                }`}>{count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters & Export */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 border border-amber-100">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'all' 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('attending')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'attending' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Attending
              </button>
              <button
                onClick={() => setFilter('not-attending')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'not-attending' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Declined
              </button>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-all"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* RSVPs Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Contact</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">Guests</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">Meal</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Message</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRSVPs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No RSVPs found
                    </td>
                  </tr>
                ) : (
                  filteredRSVPs.map((rsvp) => (
                    <tr key={rsvp.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{rsvp.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(rsvp.submittedAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {rsvp.email && <p className="text-sm text-gray-600">{rsvp.email}</p>}
                        {rsvp.phone && <p className="text-sm text-gray-600">{rsvp.phone}</p>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {rsvp.attending ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            <Check className="w-3 h-3" />
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                            <X className="w-3 h-3" />
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-medium text-gray-800">{rsvp.guestCount}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {rsvp.dietaryRestrictions ? (
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            rsvp.dietaryRestrictions.includes('Beef') 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {rsvp.dietaryRestrictions.replace('Meal: ', '')}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-600 max-w-xs truncate">
                          {rsvp.message || '-'}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            if (confirm('Delete this RSVP?')) {
                              deleteRSVP(rsvp.id);
                            }
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
