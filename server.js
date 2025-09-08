import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Amazon wishlist scraper endpoint
app.post('/api/scrape-wishlist', async (req, res) => {
  try {
    const { wishlistUrl } = req.body;
    
    if (!wishlistUrl) {
      return res.status(400).json({ error: 'Wishlist URL is required' });
    }

    // Extract wishlist ID from URL
    const wishlistId = extractWishlistId(wishlistUrl);
    if (!wishlistId) {
      return res.status(400).json({ error: 'Invalid Amazon wishlist URL' });
    }

    // Try multiple URL formats to maximize success
    const urlVariations = [
      `https://www.amazon.com/hz/wishlist/ls/${wishlistId}?viewType=list`,
      `https://www.amazon.com/hz/wishlist/ls/${wishlistId}`,
      `https://www.amazon.com/gp/registry/wishlist/${wishlistId}`,
      `https://www.amazon.com/hz/wishlist/ls/${wishlistId}?type=wishlist`
    ];

    console.log('Trying multiple URL formats for wishlist:', wishlistId);
    
    let response;
    let formattedUrl;
    
    // Try each URL variation until one works
    for (const url of urlVariations) {
      try {
        console.log('Trying URL:', url);
        response = await axios.get(url, { headers });
        formattedUrl = url;
        console.log('Successfully fetched wishlist from:', url);
        break;
      } catch (urlError) {
        console.log('Failed to fetch from:', url, '-', urlError.message);
        continue;
      }
    }
    
    if (!response) {
      throw new Error('Could not fetch wishlist from any URL format. Make sure the wishlist is public.');
    }

    const $ = cheerio.load(response.data);

    const items = [];

    // Try multiple selector strategies to find all items
    const selectors = [
      '[data-itemid]',
      '[id^="item_"]',
      '.g-item-sortable',
      '[data-id]',
      '.a-fixed-left-grid-col.a-col-right'
    ];

    let foundItems = false;

    // Try each selector until we find items
    for (const selector of selectors) {
      const elements = $(selector);
      console.log(`Trying selector "${selector}": found ${elements.length} elements`);
      
      if (elements.length > 0) {
        foundItems = true;
        
        elements.each((index, element) => {
          try {
            const $item = $(element);
            
            // Multiple strategies to extract item details
            const nameSelectors = [
              '[data-cy="item-title"]',
              'h3 a',
              '.a-size-base-plus',
              '.a-size-base',
              '.s-size-mini .a-color-base',
              'a[title]'
            ];
            
            const priceSelectors = [
              '[data-cy="item-price"]',
              '.a-price-whole',
              '.a-price .a-offscreen',
              '.a-price-range .a-offscreen',
              '.a-price-fractional'
            ];
            
            const linkSelectors = [
              '[data-cy="item-title"]',
              'h3 a',
              'a[href*="/dp/"]',
              'a[href*="/gp/product/"]'
            ];
            
            // Extract name
            let name = '';
            for (const sel of nameSelectors) {
              const found = $item.find(sel);
              if (found.length > 0) {
                name = found.first().text().trim() || found.first().attr('title') || '';
                if (name) break;
              }
            }
            
            // Extract price
            let priceText = '';
            for (const sel of priceSelectors) {
              const found = $item.find(sel);
              if (found.length > 0) {
                priceText = found.first().text().trim();
                if (priceText) break;
              }
            }
            
            // Extract product link
            let productLink = '';
            for (const sel of linkSelectors) {
              const found = $item.find(sel);
              if (found.length > 0) {
                productLink = found.first().attr('href') || '';
                if (productLink) break;
              }
            }
            
            // Extract image with multiple fallbacks
            const imageUrl = $item.find('img').attr('src') || 
                           $item.find('img').attr('data-src') ||
                           $item.find('img').attr('data-lazy') ||
                           $item.find('.s-image').attr('src');

            // Parse price
            let price = 0;
            if (priceText) {
              // Remove currency symbols and extract numbers
              const cleaned = priceText.replace(/[$,\s]/g, '');
              const priceMatch = cleaned.match(/(\d+\.?\d*)/);
              if (priceMatch) {
                price = parseFloat(priceMatch[1]);
              }
            }

            // Format product link
            let fullProductLink = '';
            if (productLink) {
              fullProductLink = productLink.startsWith('http') 
                ? productLink 
                : `https://www.amazon.com${productLink}`;
            }

            // Format image URL
            let fullImageUrl = '';
            if (imageUrl) {
              fullImageUrl = imageUrl.startsWith('http') 
                ? imageUrl 
                : `https:${imageUrl}`;
            }

            // Only add if we have a name
            if (name && name.length > 0) {
              const item = {
                name: name,
                price: price || 0,
                retailer: 'Amazon',
                link: fullProductLink,
                image: fullImageUrl,
                category: categorizeName(name)
              };
              
              // Avoid duplicates
              const isDuplicate = items.some(existingItem => 
                existingItem.name === item.name || 
                (item.link && existingItem.link === item.link)
              );
              
              if (!isDuplicate) {
                items.push(item);
                console.log(`Found item ${items.length}: ${name} - $${price}`);
              }
            }
          } catch (itemError) {
            console.error('Error parsing item:', itemError);
          }
        });
        
        // If we found items with this selector, break out of the loop
        if (items.length > 0) {
          console.log(`Successfully found ${items.length} items using selector: ${selector}`);
          break;
        }
      }
    }

    console.log(`Found ${items.length} items`);

    // If we didn't find many items, try to find pagination or "show more" indicators
    if (items.length < 20) {
      const pageIndicators = [
        '.a-pagination',
        '[data-cy="pagination"]',
        'a[aria-label*="Next"]',
        'button[aria-label*="more"]',
        '.a-button[data-action="a-show-more"]'
      ];
      
      let hasMorePages = false;
      for (const indicator of pageIndicators) {
        if ($(indicator).length > 0) {
          hasMorePages = true;
          console.log(`Found pagination indicator: ${indicator}`);
          break;
        }
      }
      
      if (hasMorePages) {
        console.log('Warning: This wishlist may have more items on additional pages. Current scraper only gets the first page.');
      }
    }

    // Debug: Save the HTML to see the structure (optional, for development)
    if (process.env.NODE_ENV === 'development' && items.length === 0) {
      console.log('No items found. HTML structure preview:');
      console.log($('body').html().substring(0, 1000) + '...');
    }

    if (items.length === 0 && !foundItems) {
      // Try alternative selectors
      const alternativeItems = [];
      $('.g-item-sortable').each((index, element) => {
        try {
          const $item = $(element);
          const name = $item.find('h3').text().trim() || $item.find('.a-size-base').text().trim();
          const priceText = $item.find('.a-price').text().trim();
          const imageUrl = $item.find('img').attr('src');
          const productLink = $item.find('h3 a').attr('href');

          if (name) {
            let price = 0;
            if (priceText) {
              const priceMatch = priceText.match(/[\d,]+\.?\d*/);
              if (priceMatch) {
                price = parseFloat(priceMatch[0].replace(',', ''));
              }
            }

            alternativeItems.push({
              name: name,
              price: price || 0,
              retailer: 'Amazon',
              link: productLink ? `https://www.amazon.com${productLink}` : '',
              image: imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `https:${imageUrl}`) : '',
              category: categorizeName(name)
            });
          }
        } catch (itemError) {
          console.error('Error parsing alternative item:', itemError);
        }
      });

      if (alternativeItems.length > 0) {
        items.push(...alternativeItems);
      }
    }

    res.json({ 
      success: true, 
      items: items,
      message: `Successfully scraped ${items.length} items from wishlist`
    });

  } catch (error) {
    console.error('Error scraping wishlist:', error);
    res.status(500).json({ 
      error: 'Failed to scrape wishlist',
      details: error.message 
    });
  }
});

// Helper function to extract wishlist ID from URL
function extractWishlistId(url) {
  const patterns = [
    /\/hz\/wishlist\/ls\/([A-Z0-9]+)/i,
    /\/gp\/registry\/wishlist\/([A-Z0-9]+)/i,
    /wishlist\/([A-Z0-9]+)/i
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

// Helper function to categorize items based on name
function categorizeName(name) {
  const nameUpper = name.toUpperCase();
  
  if (nameUpper.includes('CAR SEAT') || nameUpper.includes('SAFETY') || nameUpper.includes('MONITOR')) {
    return 'Safety';
  } else if (nameUpper.includes('STROLLER') || nameUpper.includes('CARRIER') || nameUpper.includes('TRAVEL')) {
    return 'Travel';
  } else if (nameUpper.includes('CRIB') || nameUpper.includes('CHAIR') || nameUpper.includes('TABLE')) {
    return 'Furniture';
  } else if (nameUpper.includes('ONESIE') || nameUpper.includes('CLOTHES') || nameUpper.includes('OUTFIT')) {
    return 'Clothing';
  } else if (nameUpper.includes('BOTTLE') || nameUpper.includes('FEEDING') || nameUpper.includes('FOOD')) {
    return 'Feeding';
  } else if (nameUpper.includes('BLANKET') || nameUpper.includes('SWADDLE') || nameUpper.includes('BEDDING')) {
    return 'Bedding';
  }
  
  return 'Safety'; // Default category
}

// Debug endpoint to help troubleshoot wishlist scraping
app.post('/api/debug-wishlist', async (req, res) => {
  try {
    const { wishlistUrl } = req.body;
    
    if (!wishlistUrl) {
      return res.status(400).json({ error: 'Wishlist URL is required' });
    }

    const wishlistId = extractWishlistId(wishlistUrl);
    if (!wishlistId) {
      return res.status(400).json({ error: 'Invalid Amazon wishlist URL' });
    }

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };

    const testUrl = `https://www.amazon.com/hz/wishlist/ls/${wishlistId}?viewType=list`;
    const response = await axios.get(testUrl, { headers });
    const $ = cheerio.load(response.data);

    // Count different types of elements
    const debug = {
      url: testUrl,
      totalHTML: response.data.length,
      elementCounts: {
        'data-itemid': $('[data-itemid]').length,
        'id^="item_"': $('[id^="item_"]').length,
        'g-item-sortable': $('.g-item-sortable').length,
        'data-id': $('[data-id]').length,
        'a-fixed-left-grid-col': $('.a-fixed-left-grid-col.a-col-right').length,
        'all_divs': $('div').length,
        'all_links': $('a').length,
        'all_images': $('img').length
      },
      titleCheck: $('title').text(),
      hasItems: response.data.includes('item') || response.data.includes('wishlist'),
      sampleSelectors: {
        h3_texts: $('h3').map((i, el) => $(el).text().trim()).get().slice(0, 5),
        link_hrefs: $('a[href*="/dp/"]').map((i, el) => $(el).attr('href')).get().slice(0, 5),
        prices: $('.a-price').map((i, el) => $(el).text().trim()).get().slice(0, 5)
      }
    };

    res.json(debug);
  } catch (error) {
    res.status(500).json({ 
      error: 'Debug failed',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
