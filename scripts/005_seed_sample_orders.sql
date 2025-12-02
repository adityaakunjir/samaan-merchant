-- This script creates sample orders for testing
-- Run this after a merchant is created to see orders in the dashboard

-- Note: Replace 'YOUR_MERCHANT_ID' with the actual merchant UUID after creating one
-- You can find your merchant ID by checking the merchants table after signing up

-- Example orders (commented out - uncomment and update merchant_id to use)
/*
INSERT INTO orders (merchant_id, customer_name, customer_phone, customer_address, status, total_amount, items, notes)
VALUES 
  (
    'YOUR_MERCHANT_ID',
    'Rahul Sharma',
    '+91 98765 43210',
    '402, Green Valley Apartments, Sector 15',
    'new',
    450.00,
    '[{"product_id": "1", "name": "Basmati Rice 5kg", "price": 350, "quantity": 1}, {"product_id": "2", "name": "Toor Dal 1kg", "price": 100, "quantity": 1}]'::jsonb,
    'Please deliver before 7 PM'
  ),
  (
    'YOUR_MERCHANT_ID',
    'Priya Patel',
    '+91 87654 32109',
    '103, Sunrise Tower, MG Road',
    'confirmed',
    285.00,
    '[{"product_id": "3", "name": "Amul Butter 500g", "price": 285, "quantity": 1}]'::jsonb,
    NULL
  ),
  (
    'YOUR_MERCHANT_ID',
    'Amit Kumar',
    '+91 76543 21098',
    '205, Palm Residency, JP Nagar',
    'packed',
    720.00,
    '[{"product_id": "4", "name": "Fortune Oil 5L", "price": 720, "quantity": 1}]'::jsonb,
    'Ring the bell twice'
  );
*/
