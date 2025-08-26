import React, { useState, useCallback } from 'react';
import { WishlistItem } from '../types';
import { useWishlistDatabase as useWishlist } from '../hooks/useWishlistDatabase';
import { ArrowLeft, Filter, ExternalLink, Check, X, ShoppingBag, ImageIcon, Clock, User } from 'lucide-react';

interface WishlistProps {
  onBack: () => void;
  isAdmin?: boolean;
}

const categories = ['All', 'Safety', 'Travel', 'Furniture', 'Clothing', 'Feeding', 'Bedding'];

export const Wishlist: React.FC<WishlistProps> = ({ onBack, isAdmin = false }) => {
  const { items, loading, error, claimItem, unclaimItem } = useWishlist();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showClaimDialog, setShowClaimDialog] = useState<string | null>(null);
  const [claimerName, setClaimerName] = useState('');
  const [claimMessage, setClaimMessage] = useState('');

  const filteredItems = items.filter(item => 
    selectedCategory === 'All' || item.category === selectedCategory
  );

  const handleClaimItem = useCallback((itemId: string) => {
    if (isAdmin) {
      // Admin can claim without dialog
      claimItem(itemId, 'Admin');
    } else {
      setShowClaimDialog(itemId);
    }
  }, [claimItem, isAdmin]);

  const confirmClaim = useCallback(() => {
    if (showClaimDialog) {
      claimItem(showClaimDialog, claimerName || undefined, claimMessage || undefined);
      setShowClaimDialog(null);
      setClaimerName('');
      setClaimMessage('');
    }
  }, [claimItem, showClaimDialog, claimerName, claimMessage]);

  const cancelClaim = useCallback(() => {
    setShowClaimDialog(null);
    setClaimerName('');
    setClaimMessage('');
  }, []);

  const handleUnclaim = useCallback((itemId: string) => {
    if (isAdmin) {
      unclaimItem(itemId);
    }
  }, [unclaimItem, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto">
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
            Baby Registry
          </h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-orange-100 border border-orange-400 text-orange-700 rounded-lg">
            <p className="font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-pink-500 text-white shadow-lg'
                  : 'bg-white/60 text-gray-700 hover:bg-white/80'
              }`}
            >
              <Filter className="w-4 h-4 inline mr-1" />
              {category}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <WishlistItemCard 
              key={item.id} 
              item={item} 
              isAdmin={isAdmin}
              onClaim={() => handleClaimItem(item.id)}
              onUnclaim={() => handleUnclaim(item.id)}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No items in this category yet.</p>
          </div>
        )}

        {/* Enhanced Claim Dialog with Message */}
        {showClaimDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4">Claim This Item</h3>
              <p className="text-gray-600 mb-4">
                Let Rachel & Michael know you're getting this gift! Share your name and a personal message.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={claimerName}
                    onChange={(e) => setClaimerName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message to the Couple (Optional)
                  </label>
                  <textarea
                    placeholder="Write a sweet message, share why you picked this gift, or just say congratulations!"
                    value={claimMessage}
                    onChange={(e) => setClaimMessage(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This message will be visible to Rachel & Michael in their admin panel
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={cancelClaim}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmClaim}
                  className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors duration-200"
                >
                  Claim Item
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Wishlist Item Card Component
interface WishlistItemCardProps {
  item: WishlistItem;
  isAdmin: boolean;
  onClaim: () => void;
  onUnclaim: () => void;
}

const WishlistItemCard: React.FC<WishlistItemCardProps> = ({ item, isAdmin, onClaim, onUnclaim }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 ${
      item.claimed ? 'opacity-75 ring-2 ring-green-400' : ''
    }`}>
      {/* Enhanced: Product Image */}
      <div className="aspect-square relative bg-gray-100">
        {item.image && !imageError ? (
          <>
            <img
              src={item.image}
              alt={item.name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              } ${item.claimed ? 'grayscale' : ''}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        {/* Enhanced: Claimed Badge */}
        {item.claimed && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            <Check className="w-4 h-4 inline mr-1" />
            CLAIMED
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          {item.category}
        </div>
      </div>

      <div className="p-4">
        {/* Item Details */}
        <h3 className={`font-semibold text-lg text-gray-800 mb-2 ${
          item.claimed ? 'line-through' : ''
        }`}>
          {item.name}
        </h3>
        <p className="text-2xl font-bold text-purple-600 mb-2">
          ${item.price.toFixed(2)}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Available at {item.retailer}
        </p>

        {/* Enhanced: Claim Information */}
        {item.claimed && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 text-sm">
              <User className="w-4 h-4" />
              <span>Claimed by: {item.claimedBy || 'Anonymous'}</span>
            </div>
            {item.claimedAt && (
              <div className="flex items-center gap-2 text-green-600 text-xs mt-1">
                <Clock className="w-3 h-3" />
                <span>{item.claimedAt.toLocaleDateString()}</span>
              </div>
            )}
            {item.claimMessage && (
              <div className="mt-2 p-2 bg-white rounded text-sm text-gray-700">
                <span className="font-medium">Message: </span>
                <span className="italic">"{item.claimMessage}"</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* External Purchase Link */}
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
              item.claimed 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
            }`}
            onClick={(e) => item.claimed && e.preventDefault()}
          >
            <ExternalLink className="w-4 h-4" />
            {item.claimed ? 'Already Claimed' : 'Buy This Item'}
          </a>

          {/* Enhanced: Claim/Unclaim Buttons */}
          {!item.claimed ? (
            <button
              onClick={onClaim}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all duration-200"
            >
              <Check className="w-4 h-4" />
              Mark as Claimed
            </button>
          ) : (
            isAdmin && (
              <button
                onClick={onUnclaim}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all duration-200"
              >
                <X className="w-4 h-4" />
                Unclaim Item
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
