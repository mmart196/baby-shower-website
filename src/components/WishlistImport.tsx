import React, { useState } from 'react';
import { Download, AlertCircle, CheckCircle, Loader2, Link, DollarSign } from 'lucide-react';
import { WishlistItem } from '../types';

interface WishlistImportProps {
  onImport: (items: Omit<WishlistItem, 'id'>[]) => Promise<void>;
  onClose: () => void;
}

interface ScrapedItem {
  name: string;
  price: number;
  retailer: string;
  link: string;
  image: string;
  category: WishlistItem['category'];
}

export const WishlistImport: React.FC<WishlistImportProps> = ({ onImport, onClose }) => {
  const [wishlistUrl, setWishlistUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedItems, setScrapedItems] = useState<ScrapedItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleScrapeWishlist = async () => {
    if (!wishlistUrl.trim()) {
      setError('Please enter a valid Amazon wishlist URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setScrapedItems([]);
    setSelectedItems(new Set());

    try {
      const response = await fetch('http://localhost:3001/api/scrape-wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wishlistUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape wishlist');
      }

      if (data.items && data.items.length > 0) {
        setScrapedItems(data.items);
        // Select all items by default
        setSelectedItems(new Set(data.items.map((_: any, index: number) => index)));
        setSuccess(`Found ${data.items.length} items in the wishlist`);
      } else {
        setError('No items found in the wishlist. Make sure the wishlist is public.');
      }
    } catch (err) {
      console.error('Error scraping wishlist:', err);
      setError(err instanceof Error ? err.message : 'Failed to scrape wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleItem = (index: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
  };

  const handleToggleAll = () => {
    if (selectedItems.size === scrapedItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(scrapedItems.map((_, index) => index)));
    }
  };

  const handleImportSelected = async () => {
    const itemsToImport = scrapedItems
      .filter((_, index) => selectedItems.has(index))
      .map(item => ({
        name: item.name,
        price: item.price,
        category: item.category,
        retailer: item.retailer,
        link: item.link,
        image: item.image,
        claimed: false
      }));

    if (itemsToImport.length === 0) {
      setError('Please select at least one item to import');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(`Importing ${itemsToImport.length} items...`);

    try {
      console.log('Starting import of', itemsToImport.length, 'items');
      await onImport(itemsToImport);
      setSuccess(`Successfully imported ${itemsToImport.length} items! Check the Manage Items tab to see them.`);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      setError('Some items may have failed to import. Check the console for details.');
      console.error('Import error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (index: number, newCategory: WishlistItem['category']) => {
    const updatedItems = [...scrapedItems];
    updatedItems[index] = { ...updatedItems[index], category: newCategory };
    setScrapedItems(updatedItems);
  };

  const handlePriceChange = (index: number, newPrice: number) => {
    const updatedItems = [...scrapedItems];
    updatedItems[index] = { ...updatedItems[index], price: newPrice };
    setScrapedItems(updatedItems);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Import Amazon Wishlist</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* URL Input Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amazon Wishlist URL
          </label>
          <div className="flex gap-3">
            <input
              type="url"
              value={wishlistUrl}
              onChange={(e) => setWishlistUrl(e.target.value)}
              placeholder="https://www.amazon.com/hz/wishlist/ls/YOUR_WISHLIST_ID"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            />
            <button
              onClick={handleScrapeWishlist}
              disabled={isLoading || !wishlistUrl.trim()}
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isLoading ? 'Scraping...' : 'Import'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Make sure your Amazon wishlist is set to public before importing
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {success}
          </div>
        )}

        {/* Scraped Items */}
        {scrapedItems.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">
                Found Items ({scrapedItems.length})
              </h4>
              <div className="flex gap-3">
                <button
                  onClick={handleToggleAll}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  {selectedItems.size === scrapedItems.length ? 'Deselect All' : 'Select All'}
                </button>
                <button
                  onClick={handleImportSelected}
                  disabled={selectedItems.size === 0 || isLoading}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium text-sm"
                >
                  Import Selected ({selectedItems.size})
                </button>
              </div>
            </div>

            <div className="grid gap-4 max-h-96 overflow-y-auto">
              {scrapedItems.map((item, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 transition-all duration-200 ${
                    selectedItems.has(index)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(index)}
                      onChange={() => handleToggleItem(index)}
                      className="mt-1 w-4 h-4 text-purple-600 rounded"
                    />
                    
                    {item.image && (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {item.name}
                      </h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <input
                            type="number"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => handlePriceChange(index, parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                        </div>
                        
                        <select
                          value={item.category}
                          onChange={(e) => handleCategoryChange(index, e.target.value as WishlistItem['category'])}
                          className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                        >
                          <option value="Safety">Safety</option>
                          <option value="Travel">Travel</option>
                          <option value="Furniture">Furniture</option>
                          <option value="Clothing">Clothing</option>
                          <option value="Feeding">Feeding</option>
                          <option value="Bedding">Bedding</option>
                        </select>
                        
                        <div className="flex items-center gap-2">
                          <Link className="w-4 h-4 text-gray-500" />
                          <span className="text-xs text-gray-600 truncate">
                            {item.retailer}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {scrapedItems.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            <Download className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-lg font-medium mb-2">Import Items from Amazon</p>
            <p className="text-sm">
              Enter your Amazon wishlist URL above to automatically import all items with their details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
