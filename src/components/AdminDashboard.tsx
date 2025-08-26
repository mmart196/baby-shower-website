import React, { useState, useCallback } from 'react';
import { useWishlist } from '../hooks/useWishlist';
import { WishlistItem } from '../types';
import { LogOut, Plus, Edit, Trash2, Check, X, Users, ShoppingBag, TrendingUp, ImageIcon, Home } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

type TabType = 'overview' | 'manage' | 'claims';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { items, addItem, updateItem, deleteItem, unclaimItem } = useWishlist();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const stats = {
    total: items.length,
    claimed: items.filter(item => item.claimed).length,
    unclaimed: items.filter(item => !item.claimed).length,
    totalValue: items.reduce((sum, item) => sum + item.price, 0)
  };

  const handleSaveItem = useCallback((item: Partial<WishlistItem>) => {
    if (editingItem) {
      updateItem(editingItem.id, item);
      setEditingItem(null);
    } else {
      addItem(item as Omit<WishlistItem, 'id'>);
      setIsAddingItem(false);
    }
  }, [editingItem, updateItem, addItem]);

  const handleDeleteItem = useCallback((itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteItem(itemId);
    }
  }, [deleteItem]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <div className="flex gap-3">
            <button 
              onClick={() => window.location.hash = ''}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(
            [
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'manage', label: 'Manage Items', icon: ShoppingBag },
              { id: 'claims', label: 'Claims', icon: Users }
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white/60 text-gray-700 hover:bg-white/80'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewTab stats={stats} />}
        {activeTab === 'manage' && (
          <ManageItemsTab 
            items={items}
            onEdit={setEditingItem}
            onDelete={handleDeleteItem}
            onAdd={() => setIsAddingItem(true)}
          />
        )}
        {activeTab === 'claims' && (
          <ClaimsTab 
            items={items.filter(item => item.claimed)}
            onUnclaim={unclaimItem}
          />
        )}

        {/* Edit/Add Item Modal */}
        {(editingItem || isAddingItem) && (
          <ItemEditModal
            item={editingItem}
            onSave={handleSaveItem}
            onCancel={() => {
              setEditingItem(null);
              setIsAddingItem(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Overview Tab Component
interface OverviewTabProps {
  stats: {
    total: number;
    claimed: number;
    unclaimed: number;
    totalValue: number;
  };
}

const OverviewTab: React.FC<OverviewTabProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total Items</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-full">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Claimed</p>
            <p className="text-2xl font-bold text-gray-800">{stats.claimed}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-100 rounded-full">
            <X className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Available</p>
            <p className="text-2xl font-bold text-gray-800">{stats.unclaimed}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total Value</p>
            <p className="text-2xl font-bold text-gray-800">${stats.totalValue.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Manage Items Tab Component
interface ManageItemsTabProps {
  items: WishlistItem[];
  onEdit: (item: WishlistItem) => void;
  onDelete: (itemId: string) => void;
  onAdd: () => void;
}

const ManageItemsTab: React.FC<ManageItemsTabProps> = ({ items, onEdit, onDelete, onAdd }) => {
  return (
    <div>
      {/* Add Button */}
      <div className="mb-6">
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Add New Item
        </button>
      </div>

      {/* Items List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.retailer}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.claimed ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Claimed
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Available
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Claims Tab Component
interface ClaimsTabProps {
  items: WishlistItem[];
  onUnclaim: (itemId: string) => void;
}

const ClaimsTab: React.FC<ClaimsTabProps> = ({ items, onUnclaim }) => {
  return (
    <div>
      {items.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No items have been claimed yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                <button
                  onClick={() => onUnclaim(item.id)}
                  className="text-red-600 hover:text-red-700"
                  title="Unclaim item"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Claimed by:</strong> {item.claimedBy || 'Anonymous'}</p>
                <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
                <p><strong>Category:</strong> {item.category}</p>
                {item.claimedAt && (
                  <p><strong>Claimed on:</strong> {item.claimedAt.toLocaleDateString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Item Edit Modal Component
interface ItemEditModalProps {
  item: WishlistItem | null;
  onSave: (item: Partial<WishlistItem>) => void;
  onCancel: () => void;
}

const ItemEditModal: React.FC<ItemEditModalProps> = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<WishlistItem>>({
    name: item?.name || '',
    price: item?.price || 0,
    category: item?.category || 'Safety',
    retailer: item?.retailer || '',
    link: item?.link || '',
    image: item?.image || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: keyof WishlistItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">
          {item ? 'Edit Item' : 'Add New Item'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price || ''}
              onChange={(e) => handleChange('price', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category || 'Safety'}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Safety">Safety</option>
              <option value="Travel">Travel</option>
              <option value="Furniture">Furniture</option>
              <option value="Clothing">Clothing</option>
              <option value="Feeding">Feeding</option>
              <option value="Bedding">Bedding</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Retailer
            </label>
            <input
              type="text"
              value={formData.retailer || ''}
              onChange={(e) => handleChange('retailer', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Link
            </label>
            <input
              type="url"
              value={formData.link || ''}
              onChange={(e) => handleChange('link', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL (optional)
            </label>
            <input
              type="url"
              value={formData.image || ''}
              onChange={(e) => handleChange('image', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://..."
            />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              {item ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
