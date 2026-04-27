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

  // Count meal preferences — prefer the per-guest array; fall back to
  // the legacy "X Beef, Y Chicken" text for older RSVPs.
  const mealCounts = rsvps
    .filter(r => r.attending)
    .reduce((acc, rsvp) => {
      if (rsvp.guests && rsvp.guests.length > 0) {
        acc.beef += rsvp.guests.filter(g => g.meal === 'beef').length;
        acc.chicken += rsvp.guests.filter(g => g.meal === 'chicken').length;
      } else {
        const mealText = rsvp.dietaryRestrictions || '';
        const beefMatch = mealText.match(/(\d+)\s*Beef/i);
        const chickenMatch = mealText.match(/(\d+)\s*Chicken/i);
        if (beefMatch) acc.beef += parseInt(beefMatch[1]) || 0;
        if (chickenMatch) acc.chicken += parseInt(chickenMatch[1]) || 0;
      }
      return acc;
    }, { beef: 0, chicken: 0 });

  const handleExport = () => {
    // One row per guest so a kitchen/seating list can be filtered easily.
    const rows: string[][] = [];
    rows.push([
      'RSVP Contact', 'Email', 'Phone', 'Attending',
      'Guest Name', 'Meal', 'Message', 'Submitted'
    ]);

    for (const rsvp of filteredRSVPs) {
      const submitted = new Date(rsvp.submittedAt).toLocaleDateString();
      const guestRows = (rsvp.guests && rsvp.guests.length > 0)
        ? rsvp.guests.map(g => [g.name, g.meal === 'beef' ? 'Beef' : 'Chicken'])
        : [['', rsvp.dietaryRestrictions || '']];

      for (const [guestName, meal] of guestRows) {
        rows.push([
          rsvp.name,
          rsvp.email || '',
          rsvp.phone || '',
          rsvp.attending ? 'Yes' : 'No',
          guestName,
          meal,
          rsvp.message || '',
          submitted,
        ]);
      }
    }

    const csvContent = rows
      .map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

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
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Baptism RSVP Dashboard</h1>
              <p className="text-gray-500">Eric Martinez • May 16, 2026</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => window.location.hash = ''}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-amber-100">
            <p className="text-sm text-gray-500 mb-1">Total RSVPs</p>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 shadow-lg border border-green-200">
            <p className="text-sm text-green-600 mb-1 font-medium">Attending</p>
            <p className="text-3xl font-bold text-green-700">{stats.attending}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 shadow-lg border border-blue-200">
            <p className="text-sm text-blue-600 mb-1 font-medium">Total Guests</p>
            <p className="text-3xl font-bold text-blue-700">{stats.totalGuests}</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-5 shadow-lg border border-red-200">
            <p className="text-sm text-red-600 mb-1 font-medium">Declined</p>
            <p className="text-3xl font-bold text-red-700">{stats.notAttending}</p>
          </div>
        </div>

        {/* Meal Counts */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-amber-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Utensils className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-bold text-gray-800 text-lg">Meal Preferences</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-5 text-center border border-red-200">
              <div className="flex justify-center mb-2">
                <span className="text-3xl">🥩</span>
              </div>
              <p className="text-red-700 font-bold text-2xl">{mealCounts.beef}</p>
              <p className="text-red-600 text-sm font-medium">Beef</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-5 text-center border border-amber-200">
              <div className="flex justify-center mb-2">
                <span className="text-3xl">🍗</span>
              </div>
              <p className="text-amber-700 font-bold text-2xl">{mealCounts.chicken}</p>
              <p className="text-amber-600 text-sm font-medium">Chicken</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 text-center border border-gray-200 md:col-span-2">
              <p className="text-gray-600 text-sm font-medium mb-1">Total Meals</p>
              <p className="text-gray-800 font-bold text-2xl">{mealCounts.beef + mealCounts.chicken}</p>
              <p className="text-gray-500 text-xs">for {stats.attending} families</p>
            </div>
          </div>
        </div>

        {/* Filters & Export */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-6 border border-amber-100">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              {(['all', 'attending', 'not-attending'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                    filter === f 
                      ? f === 'attending' ? 'bg-green-500 text-white shadow-lg' :
                        f === 'not-attending' ? 'bg-red-500 text-white shadow-lg' :
                        'bg-amber-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f === 'all' ? 'All' : f === 'attending' ? 'Attending' : 'Declined'}
                </button>
              ))}
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* RSVPs Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
                <tr>
                  <th className="text-left px-5 py-4 text-sm font-bold text-gray-700">Name</th>
                  <th className="text-left px-5 py-4 text-sm font-bold text-gray-700">Contact</th>
                  <th className="text-center px-5 py-4 text-sm font-bold text-gray-700">Status</th>
                  <th className="text-center px-5 py-4 text-sm font-bold text-gray-700">Guests</th>
                  <th className="text-center px-5 py-4 text-sm font-bold text-gray-700">Meals</th>
                  <th className="text-left px-5 py-4 text-sm font-bold text-gray-700">Message</th>
                  <th className="text-center px-5 py-4 text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRSVPs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <Users className="w-12 h-12 text-gray-300" />
                        <p className="text-lg">No RSVPs found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRSVPs.map((rsvp) => (
                    <tr key={rsvp.id} className="hover:bg-amber-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                            {rsvp.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{rsvp.name}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(rsvp.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {rsvp.email && <p className="text-sm text-gray-600">{rsvp.email}</p>}
                        {rsvp.phone && <p className="text-sm text-gray-500">{rsvp.phone}</p>}
                      </td>
                      <td className="px-5 py-4 text-center">
                        {rsvp.attending ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            <Check className="w-4 h-4" />
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                            <X className="w-4 h-4" />
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-bold">
                          {rsvp.guestCount}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {rsvp.guests && rsvp.guests.length > 0 ? (
                          <ul className="space-y-1 min-w-[180px]">
                            {rsvp.guests.map((g, i) => (
                              <li key={i} className="flex items-center justify-between gap-3 text-sm">
                                <span className="text-gray-800 truncate">{g.name || <em className="text-gray-400">unnamed</em>}</span>
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium flex-none ${
                                    g.meal === 'beef'
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-amber-100 text-amber-700'
                                  }`}
                                >
                                  {g.meal === 'beef' ? '🥩 Beef' : '🍗 Chicken'}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : rsvp.dietaryRestrictions ? (
                          <div className="flex flex-wrap gap-1">
                            {rsvp.dietaryRestrictions.includes('Beef') && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium">
                                🥩 {rsvp.dietaryRestrictions.match(/(\d+)\s*Beef/)?.[1] || ''}
                              </span>
                            )}
                            {rsvp.dietaryRestrictions.includes('Chicken') && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium">
                                🍗 {rsvp.dietaryRestrictions.match(/(\d+)\s*Chicken/)?.[1] || ''}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-600 max-w-xs truncate">
                          {rsvp.message || '-'}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => {
                            if (confirm('Delete this RSVP?')) {
                              deleteRSVP(rsvp.id);
                            }
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all hover:scale-110"
                        >
                          <Trash2 className="w-5 h-5" />
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
