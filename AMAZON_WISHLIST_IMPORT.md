# Amazon Wishlist Import Feature

This feature allows admins to bulk import items from public Amazon wishlists directly into the baby registry application.

## How It Works

1. **Backend Server**: A Node.js/Express server (`server.js`) handles web scraping of Amazon wishlist pages
2. **Frontend Component**: The `WishlistImport` component provides a user-friendly interface for importing items
3. **Admin Integration**: The feature is integrated into the admin dashboard's "Manage Items" tab

## Setup Instructions

### 1. Install Dependencies
The required packages are already included in `package.json`:
- `express` - Web server framework
- `cors` - Enable cross-origin requests
- `axios` - HTTP client for web requests
- `cheerio` - Server-side DOM manipulation and parsing
- `concurrently` - Run multiple commands simultaneously

### 2. Start the Application

#### Option A: Run Both Server and Client (Recommended)
```bash
pnpm run dev:full
```
This command starts both the API server (port 3001) and the Vite development server (port 5173).

#### Option B: Run Separately
Terminal 1 (API Server):
```bash
pnpm run server
```

Terminal 2 (Client):
```bash
pnpm run dev
```

## Usage

### For Admins

1. Navigate to the admin dashboard
2. Go to the "Manage Items" tab
3. Click the "Import Amazon Wishlist" button
4. Paste a public Amazon wishlist URL (e.g., `https://www.amazon.com/hz/wishlist/ls/YOUR_WISHLIST_ID`)
5. Click "Import" to scrape the wishlist
6. Review the imported items:
   - Edit prices if needed
   - Adjust categories
   - Select/deselect items to import
7. Click "Import Selected" to add the items to your registry

### Supported Amazon Wishlist URL Formats

- `https://www.amazon.com/hz/wishlist/ls/WISHLIST_ID`
- `https://www.amazon.com/gp/registry/wishlist/WISHLIST_ID`
- Any URL containing a valid Amazon wishlist ID

### Features

- **Automatic Data Extraction**: Extracts product name, price, image, and link
- **Smart Categorization**: Automatically categorizes items based on product names
- **Bulk Selection**: Select/deselect all items or individual items
- **Price Editing**: Modify prices before importing
- **Category Adjustment**: Change categories for better organization
- **Error Handling**: Clear error messages for troubleshooting

## Technical Details

### API Endpoint

**POST** `/api/scrape-wishlist`

**Request Body:**
```json
{
  "wishlistUrl": "https://www.amazon.com/hz/wishlist/ls/YOUR_WISHLIST_ID"
}
```

**Response:**
```json
{
  "success": true,
  "items": [
    {
      "name": "Product Name",
      "price": 29.99,
      "retailer": "Amazon",
      "link": "https://www.amazon.com/dp/PRODUCT_ID",
      "image": "https://m.media-amazon.com/images/...",
      "category": "Safety"
    }
  ],
  "message": "Successfully scraped X items from wishlist"
}
```

### Data Mapping

The scraper extracts the following data:
- **Name**: Product title from various Amazon selectors
- **Price**: Extracts numerical price from price elements
- **Image**: Product image URL (handles both src and data-src attributes)
- **Link**: Direct product link to Amazon
- **Category**: Auto-categorized based on product name keywords

### Error Handling

Common issues and solutions:

1. **Private Wishlist**: Make sure the Amazon wishlist is set to public
2. **CORS Errors**: Ensure the API server is running on port 3001
3. **No Items Found**: Amazon may have changed their HTML structure; check console logs
4. **Rate Limiting**: Amazon may block requests if too many are made quickly

## Limitations

- Only works with **public** Amazon wishlists
- Requires the wishlist to be accessible without authentication
- Amazon's HTML structure may change, requiring updates to selectors
- Subject to Amazon's Terms of Service regarding automated access

## Security Considerations

- The scraper respects robots.txt guidelines
- Implements user-agent headers to identify as a browser
- Includes rate limiting to avoid overwhelming Amazon's servers
- Only accesses publicly available data

## Future Enhancements

Potential improvements:
- Support for other retailer wishlists (Target, Walmart, etc.)
- Batch processing for multiple wishlists
- Product image optimization and storage
- Enhanced categorization using AI/ML
- Price monitoring and updates
