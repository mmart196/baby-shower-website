-- Baby Shower Wishlist Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create wishlist_items table
CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT CHECK (category IN ('Safety', 'Travel', 'Furniture', 'Clothing', 'Feeding', 'Bedding')) NOT NULL,
  retailer TEXT NOT NULL,
  link TEXT NOT NULL,
  image TEXT,
  claimed BOOLEAN DEFAULT FALSE,
  claimed_by TEXT,
  claimed_at TIMESTAMP WITH TIME ZONE,
  claim_message TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_wishlist_items_claimed ON wishlist_items(claimed);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_category ON wishlist_items(category);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_created_at ON wishlist_items(created_at);

-- Enable Row Level Security
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a baby registry that friends/family should access)
CREATE POLICY "Enable read access for all users" ON wishlist_items
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON wishlist_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON wishlist_items
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON wishlist_items
  FOR DELETE USING (true);

-- Create RSVPs table
CREATE TABLE IF NOT EXISTS rsvps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  attending BOOLEAN NOT NULL DEFAULT true,
  guest_count INTEGER NOT NULL DEFAULT 1,
  dietary_restrictions TEXT,
  message TEXT
);

-- Create indexes for RSVP table
CREATE INDEX IF NOT EXISTS idx_rsvps_attending ON rsvps(attending);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON rsvps(created_at);
CREATE INDEX IF NOT EXISTS idx_rsvps_name ON rsvps(name);

-- Enable Row Level Security for RSVPs
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Create policies for RSVP access
CREATE POLICY "Enable read access for all users" ON rsvps
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON rsvps
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON rsvps
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON rsvps
  FOR DELETE USING (true);

-- Insert initial data (matching your current items)
INSERT INTO wishlist_items (name, price, category, retailer, link, image, claimed) VALUES
('Convertible Car Seat', 199.99, 'Safety', 'Amazon', 'https://www.amazon.com/dp/B07WNQBXZP', 'https://m.media-amazon.com/images/I/71Z5Y9Z6iBL._AC_SX466_.jpg', false),
('All-Terrain Stroller', 279.99, 'Travel', 'Target', 'https://www.target.com/p/evenflo-pivot-xplore-all-terrain-stroller-wagon/-/A-76646261', 'https://target.scene7.com/is/image/Target/GUEST_f4d4b8c8-2a8e-4a1c-bd5f-8b3e5e1c2d5e?wid=488&hei=488&fmt=pjpeg', false),
('Convertible Crib', 329.99, 'Furniture', 'Pottery Barn Kids', 'https://www.potterybarnkids.com/products/kendall-4-in-1-convertible-crib/', 'https://assets.pbimgs.com/pbimgs/rk/images/dp/wcm/202438/0018/kendall-4-in-1-convertible-crib-c.jpg', false),
('Smart Baby Monitor', 159.99, 'Safety', 'Amazon', 'https://www.amazon.com/dp/B086DVWZ5P', 'https://m.media-amazon.com/images/I/71+9x8lVJmL._AC_SX466_.jpg', false),
('Organic Onesie Set', 49.99, 'Clothing', 'Amazon', 'https://www.amazon.com/dp/B07TXQPZRG', 'https://m.media-amazon.com/images/I/81qL7+QkBDL._AC_SX466_.jpg', false),
('Glass Baby Bottle Set', 69.99, 'Feeding', 'Target', 'https://www.target.com/p/lifefactory-4oz-glass-baby-bottles-4pk/-/A-14482816', 'https://target.scene7.com/is/image/Target/GUEST_a1c5d3e7-9b4f-4c2e-a6d8-7e3f2a1b9c4d?wid=488&hei=488&fmt=pjpeg', false),
('Muslin Swaddle Set', 39.99, 'Bedding', 'Aden & Anais', 'https://www.adenandanais.com/products/classic-swaddle-4-pack-lovely', 'https://cdn.shopify.com/s/files/1/0044/7932/6103/products/9320-lovely-muslin-swaddles-4-pack-front.jpg?v=1669067044', false),
('Changing Station', 149.99, 'Furniture', 'Wayfair', 'https://www.wayfair.com/baby-kids/pdp/delta-children-changing-table-with-storage-bins-W004388234.html', 'https://secure.img1-cg.wfcdn.com/im/39375045/resize-h755-w755%5Ecompr-r85/1355/135572945/default_name.jpg', false),
('Knit Baby Blanket', 89.99, 'Bedding', 'Etsy', 'https://www.etsy.com/listing/785432123/organic-cotton-knit-baby-blanket', 'https://i.etsystatic.com/24567890/r/il/c12345/1234567890/il_fullxfull.1234567890_abcd.jpg', false),
('High Chair', 199.99, 'Feeding', 'BuyBuyBaby', 'https://www.buybuybaby.com/store/product/abiie-beyond-wooden-high-chair-with-tray/5331634', 'https://b3h2.scene7.com/is/image/BedBathandBeyond/12345_6789_MAIN?wid=488&hei=488&fmt=pjpeg', false);
