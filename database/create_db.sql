-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS portfolio;
USE portfolio;

-- ===========================
-- TABELA DE USUÁRIOS
-- ===========================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    role ENUM('admin', 'cliente') NOT NULL DEFAULT 'cliente',
    password_hash VARCHAR(255) NOT NULL,
    mustChangePassword TINYINT(1) NOT NULL DEFAULT 0,
    dateDeleted DATETIME DEFAULT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_users_email UNIQUE (email)
);

-- Índices úteis para filtros
CREATE INDEX idx_users_role ON users(role);


-- ===========================
-- TABELA DE EVENTOS
-- ===========================
CREATE TABLE IF NOT EXISTS event_ (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    eventName VARCHAR(100) NOT NULL,
    eventDate DATE NOT NULL,
    dateDeleted DATETIME DEFAULT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_event_user
      FOREIGN KEY (userId) REFERENCES users(id)
      ON DELETE CASCADE
);

-- Índices para filtros (nome, data, cliente)
CREATE INDEX idx_event_userId ON event_(userId);
CREATE INDEX idx_event_name ON event_(eventName);
CREATE INDEX idx_event_date ON event_(eventDate);


-- ===========================
-- TABELA DE FOTOS
-- ===========================
CREATE TABLE IF NOT EXISTS photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    originalName VARCHAR(255) NOT NULL,   -- título da foto
    caption TEXT DEFAULT NULL,            -- legenda opcional (nova funcionalidade)
    fileName VARCHAR(255) NOT NULL,       -- nome "interno" / slug
    path VARCHAR(255) NOT NULL,           -- URL da imagem (banco de imagens)
    uploadDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    eventId INT NOT NULL,

    CONSTRAINT fk_photos_event
      FOREIGN KEY (eventId) REFERENCES event_(id)
      ON DELETE CASCADE
);

CREATE INDEX idx_photos_eventId ON photos(eventId);
