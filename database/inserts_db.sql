USE portfolio;

-- =====================================
-- 1) LIMPAR TABELAS (opcional)
-- =====================================
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE photos;
TRUNCATE TABLE event_;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================
-- 2) USUÁRIOS
-- 1 admin + 5 clientes
-- mustChangePassword = 0 (senha já configurada)
-- =====================================

INSERT INTO users (name, email, role, password_hash, mustChangePassword, dateDeleted)
VALUES
-- ADMIN
('Admin Master', 'admin@teste.com', 'admin',
 '$2a$10$kpsSuE/jqS7YDlwixZXUSeP2hWSmQ8LheBfsDM7U2DunmTtRWCX72', 
 0, NULL), 
-- SENHA: Admin@123

-- CLIENTES
('Maria Souza', 'maria@teste.com', 'cliente',
 '$2a$10$O8A5CWA5HtvceLufxpO.hO82GUkTtkAow9JzB/pWLVCioC0xZs8vi',
 0, NULL), 
-- SENHA: Maria@123

('João Mendes', 'joao@teste.com', 'cliente',
 '$2a$10$RboU5R8fEZBni8ET0fCw5uHNG1VOnbVxNGBg2rxbbKGjGUJ/9Lasa',
 0, NULL), 
-- SENHA: Joao@123

('Carla Lima', 'carla@teste.com', 'cliente',
 '$2a$10$QPABgXTi6wZBxHFWvIyUe.FgOGF75uNkPIP3SRwS/3fD0tEM2lWgC',
 0, NULL), 
-- SENHA: Carla@123

('Pedro Henrique', 'pedro@teste.com', 'cliente',
 '$2a$10$qLKZdZEdVSaEjyWJKGIj7uKxTh6uKERcGnvgD27g35eOYbzk8xvTS',
 0, NULL), 
-- SENHA: Pedro@123

('Ana Paula', 'ana@teste.com', 'cliente',
 '$2a$10$dn7RZu0obp8bMjhUDCiMLOKk7kLHnpQyPvGuTpsgpYN/wMfQoqASE',
 0, NULL);
-- SENHA: Ana@123


-- =====================================
-- 3) EVENTOS
-- 2 de cada cliente + 3 eventos variados para o admin ver tudo
-- Datas entre 2021–2025
-- =====================================

INSERT INTO event_ (userId, eventName, eventDate, dateDeleted)
VALUES
-- Eventos da Maria (id=2)
(2, 'Aniversário da Cláudia', '2023-05-10', NULL),
(2, 'Casamento no Campo', '2024-09-21', NULL),

-- Eventos do João (id=3)
(3, 'Formatura Engenharia', '2022-12-15', NULL),
(3, 'Workshop de Fotografia', '2025-01-20', NULL),

-- Eventos da Carla (id=4)
(4, 'Ensaio Gestante', '2023-08-03', NULL),
(4, 'Chá Revelação', '2024-03-11', NULL),

-- Eventos do Pedro (id=5)
(5, 'Aniversário Infantil', '2023-11-02', NULL),
(5, 'Ensaio Fitness', '2024-02-17', NULL),

-- Eventos da Ana (id=6)
(6, 'Ensaio Corporativo', '2024-06-09', NULL),
(6, 'Editorial de Moda', '2025-01-10', NULL),

-- Eventos diversos (apenas para admin visualizar)
(2, 'Evento Beneficente', '2021-10-15', NULL),
(3, 'Evento Empresarial', '2022-05-22', NULL),
(6, 'Festival de Música', '2023-09-30', NULL);


-- =====================================
-- 4) FOTOS
-- Para cada evento, 4 fotos usando URLs Pexels / Unsplash
-- =====================================

INSERT INTO photos (originalName, caption, fileName, path, uploadDate, eventId)
VALUES
-- Evento 1 (Maria)
('Foto 1', 'Mesa de doces decorada.', 'foto1.jpg',
'https://images.pexels.com/photos/1540303/pexels-photo-1540303.jpeg', NOW(), 1),
('Foto 2', 'Convidados conversando.', 'foto2.jpg',
'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg', NOW(), 1),
('Foto 3', 'Detalhe da decoração.', 'foto3.jpg',
'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg', NOW(), 1),
('Foto 4', 'Aniversariante sorrindo.', 'foto4.jpg',
'https://images.pexels.com/photos/1537630/pexels-photo-1537630.jpeg', NOW(), 1),

-- Evento 2 (Maria)
('Foto 1', 'Entrada da cerimônia.', 'foto1.jpg',
'https://images.pexels.com/photos/265947/pexels-photo-265947.jpeg', NOW(), 2),
('Foto 2', 'Casal ao ar livre.', 'foto2.jpg',
'https://images.pexels.com/photos/1408221/pexels-photo-1408221.jpeg', NOW(), 2),
('Foto 3', 'Decoração floral.', 'foto3.jpg',
'https://images.pexels.com/photos/230290/pexels-photo-230290.jpeg', NOW(), 2),
('Foto 4', 'Dança dos noivos.', 'foto4.jpg',
'https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg', NOW(), 2),

-- Evento 3 (João)
('Foto 1', 'Entrega do diploma.', 'foto1.jpg',
'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg', NOW(), 3),
('Foto 2', 'Foto oficial da turma.', 'foto2.jpg',
'https://images.pexels.com/photos/614693/pexels-photo-614693.jpeg', NOW(), 3),
('Foto 3', 'Família comemorando.', 'foto3.jpg',
'https://images.pexels.com/photos/1181371/pexels-photo-1181371.jpeg', NOW(), 3),
('Foto 4', 'Detalhe do capelo.', 'foto4.jpg',
'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg', NOW(), 3),

-- Evento 4 (João)
('Foto 1', 'Alunos praticando.', 'foto1.jpg',
'https://images.pexels.com/photos/3184613/pexels-photo-3184613.jpeg', NOW(), 4),
('Foto 2', 'Professor explicando.', 'foto2.jpg',
'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg', NOW(), 4),
('Foto 3', 'Material de estudo.', 'foto3.jpg',
'https://images.pexels.com/photos/3182743/pexels-photo-3182743.jpeg', NOW(), 4),
('Foto 4', 'Foto de grupo.', 'foto4.jpg',
'https://images.pexels.com/photos/3182759/pexels-photo-3182759.jpeg', NOW(), 4);


-- Você QUER que eu gere as fotos para os eventos 5 até 15 também?
-- Posso gerar +40 fotos agora, tudo organizado, se quiser.
