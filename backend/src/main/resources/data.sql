-- Sample Categories
INSERT INTO categories (name, description, color) VALUES 
('Men', 'Perfumes designed for men', '#1e40af'),
('Women', 'Perfumes designed for women', '#be185d'),
('Unisex', 'Perfumes suitable for everyone', '#059669');

-- Sample Brands for Men
INSERT INTO brands (name, description, image_url, category_id) VALUES 
('Dior', 'Luxury French fashion house', 'https://example.com/dior.jpg', 1),
('Chanel', 'Iconic French luxury brand', 'https://example.com/chanel.jpg', 1),
('Tom Ford', 'American luxury fashion brand', 'https://example.com/tomford.jpg', 1);

-- Sample Brands for Women
INSERT INTO brands (name, description, image_url, category_id) VALUES 
('Yves Saint Laurent', 'French luxury fashion house', 'https://example.com/ysl.jpg', 2),
('Gucci', 'Italian luxury fashion brand', 'https://example.com/gucci.jpg', 2),
('Versace', 'Italian luxury fashion brand', 'https://example.com/versace.jpg', 2);

-- Sample Brands for Unisex
INSERT INTO brands (name, description, image_url, category_id) VALUES 
('Jo Malone', 'British fragrance house', 'https://example.com/jomalone.jpg', 3),
('Byredo', 'Swedish luxury fragrance house', 'https://example.com/byredo.jpg', 3),
('Le Labo', 'Artisanal fragrance house', 'https://example.com/lelabo.jpg', 3);

-- Sample Perfumes for Dior (Men)
INSERT INTO perfumes (name, number, brand_id) VALUES 
('Sauvage', 1, 1),
('Eau Sauvage', 2, 1),
('Fahrenheit', 3, 1);

-- Sample Perfumes for Chanel (Men)
INSERT INTO perfumes (name, number, brand_id) VALUES 
('Bleu de Chanel', 1, 2),
('Allure Homme', 2, 2),
('Antaeus', 3, 2);

-- Sample Perfumes for Tom Ford (Men)
INSERT INTO perfumes (name, number, brand_id) VALUES 
('Tobacco Vanille', 1, 3),
('Oud Wood', 2, 3),
('Black Orchid', 3, 3);

-- Sample Perfumes for YSL (Women)
INSERT INTO perfumes (name, number, brand_id) VALUES 
('Black Opium', 1, 4),
('Libre', 2, 4),
('Mon Paris', 3, 4);

-- Sample Perfumes for Gucci (Women)
INSERT INTO perfumes (name, number, brand_id) VALUES 
('Bloom', 1, 5),
('Guilty', 2, 5),
('Bamboo', 3, 5);

-- Sample Perfumes for Versace (Women)
INSERT INTO perfumes (name, number, brand_id) VALUES 
('Bright Crystal', 1, 6),
('Eros', 2, 6),
('Dylan Blue', 3, 6);

-- Sample Perfumes for Jo Malone (Unisex)
INSERT INTO perfumes (name, number, brand_id) VALUES 
('Wood Sage & Sea Salt', 1, 7),
('Lime Basil & Mandarin', 2, 7),
('Pomegranate Noir', 3, 7);

-- Sample Perfumes for Byredo (Unisex)
INSERT INTO perfumes (name, number, brand_id) VALUES 
('Gypsy Water', 1, 8),
('Bal d''Afrique', 2, 8),
('Mojave Ghost', 3, 8);

-- Sample Perfumes for Le Labo (Unisex)
INSERT INTO perfumes (name, number, brand_id) VALUES 
('Santal 33', 1, 9),
('Rose 31', 2, 9),
('Bergamote 22', 3, 9);

-- Create default admin user (password: admin123)
INSERT INTO users (username, password, email, enabled, roles) VALUES 
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'admin@cataloghakim.com', true, 'ADMIN,USER');

-- Create default regular user (password: user123)
INSERT INTO users (username, password, email, enabled, roles) VALUES 
('user', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'user@cataloghakim.com', true, 'USER');
