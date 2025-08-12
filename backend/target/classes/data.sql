-- Reset tables for idempotent local development seeding
TRUNCATE TABLE user_roles RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;
TRUNCATE TABLE perfumes RESTART IDENTITY CASCADE;
TRUNCATE TABLE brands RESTART IDENTITY CASCADE;
TRUNCATE TABLE categories RESTART IDENTITY CASCADE;

-- Sample Categories
INSERT INTO categories (name, description, color) VALUES 
('Men', 'Perfumes designed for men', '#1e40af'),
('Women', 'Perfumes designed for women', '#be185d'),
('Unisex', 'Perfumes suitable for everyone', '#059669');

-- Sample Brands for Men
INSERT INTO brands (name, description, image_url, category_id) VALUES 
('Dior', 'Luxury French fashion house', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', 1),
('Chanel', 'Iconic French luxury brand', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400', 1),
('Tom Ford', 'American luxury fashion brand', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400', 1);

-- Sample Brands for Women
INSERT INTO brands (name, description, image_url, category_id) VALUES 
('Yves Saint Laurent', 'French luxury fashion house', 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d32?w=400', 2),
('Gucci', 'Italian luxury fashion brand', 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400', 2),
('Versace', 'Italian luxury fashion brand', 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400', 2);

-- Sample Brands for Unisex
INSERT INTO brands (name, description, image_url, category_id) VALUES 
('Jo Malone', 'British fragrance house', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400', 3),
('Byredo', 'Swedish luxury fragrance house', 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=400', 3),
('Le Labo', 'Artisanal fragrance house', 'https://images.unsplash.com/photo-1594736797933-d0710ba87cc9?w=400', 3);

-- Sample Perfumes for Dior (Men)
INSERT INTO perfumes (name, number, brand_id) VALUES 
('Sauvage', 'D-001', 1),
('Eau Sauvage', 'D-002', 1),
('Fahrenheit', 'D-003', 1);

-- Sample Perfumes for Chanel (Men)
INSERT INTO perfumes (name, number, brand_id) VALUES 
('Bleu de Chanel', 'C-001', 2),
('Allure Homme', 'C-002', 2),
('Antaeus', 'C-003', 2);

-- Sample Perfumes for Tom Ford (Men)
INSERT INTO perfumes (name, number, brand_id) VALUES 
('Tobacco Vanille', 'TF-001', 3),
('Oud Wood', 'TF-002', 3),
('Black Orchid', 'TF-003', 3);

-- Sample Perfumes for YSL (Women)
INSERT INTO perfumes (name, number, brand_id) VALUES 
('Black Opium', 'YSL-001', 4),
('Libre', 'YSL-002', 4),
('Mon Paris', 'YSL-003', 4);

-- Sample Perfumes for Gucci (Women)
INSERT INTO perfumes (name, number, brand_id) VALUES 
('Bloom', 'G-001', 5),
('Guilty', 'G-002', 5),
('Bamboo', 'G-003', 5);

-- Sample Perfumes for Versace (Women)
INSERT INTO perfumes (name, number, brand_id) VALUES 
('Bright Crystal', 'V-001', 6),
('Eros', 'V-002', 6),
('Dylan Blue', 'V-003', 6);

-- Sample Perfumes for Jo Malone (Unisex)
INSERT INTO perfumes (name, number, brand_id) VALUES 
('Wood Sage & Sea Salt', 'JM-001', 7),
('Lime Basil & Mandarin', 'JM-002', 7),
('Pomegranate Noir', 'JM-003', 7);

-- Sample Perfumes for Byredo (Unisex)
INSERT INTO perfumes (name, number, brand_id) VALUES 
('Gypsy Water', 'BY-001', 8),
('Bal d''Afrique', 'BY-002', 8),
('Mojave Ghost', 'BY-003', 8);

-- Sample Perfumes for Le Labo (Unisex)
INSERT INTO perfumes (name, number, brand_id) VALUES 
('Santal 33', 'LL-001', 9),
('Rose 31', 'LL-002', 9),
('Bergamote 22', 'LL-003', 9);

-- Create default admin user (password: admin123)
INSERT INTO users (username, password, email, enabled) VALUES 
('admin', '$2a$10$Lvj9.DpmVGKIabbe2Fwt1unAUVueVD0UO0WNmgNz0SYrcsDtPYL.y', 'admin@cataloghakim.com', true);

-- Create additional admin user (password: admin123)
INSERT INTO users (username, password, email, enabled) VALUES 
('admin2', '$2a$10$Lvj9.DpmVGKIabbe2Fwt1unAUVueVD0UO0WNmgNz0SYrcsDtPYL.y', 'admin2@cataloghakim.com', true);

-- Assign roles to admin
INSERT INTO user_roles (user_id, role) VALUES 
((SELECT id FROM users WHERE username = 'admin'), 'ROLE_ADMIN');
INSERT INTO user_roles (user_id, role) VALUES 
((SELECT id FROM users WHERE username = 'admin'), 'ROLE_USER');

-- Assign roles to admin2
INSERT INTO user_roles (user_id, role) VALUES 
((SELECT id FROM users WHERE username = 'admin2'), 'ROLE_ADMIN');
INSERT INTO user_roles (user_id, role) VALUES 
((SELECT id FROM users WHERE username = 'admin2'), 'ROLE_USER');

-- Create default regular user (password: user123)
INSERT INTO users (username, password, email, enabled) VALUES 
('user', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'user@cataloghakim.com', true);

-- Assign role to regular user
INSERT INTO user_roles (user_id, role) VALUES 
((SELECT id FROM users WHERE username = 'user'), 'ROLE_USER');
