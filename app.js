const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const indexRoutes = require('./routes/indexRoutes');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Configurações básicas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Autenticação básica
app.use(session({
  secret: process.env.SESSION_SECRET || 'segredo-super-seguro',
  resave: false,
  saveUninitialized: false
}));

// Middleware para deixar user e role acessíveis nas views
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.isAdmin = req.session.user && req.session.user.role === 'admin';
  next();
});

// Rotas
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/eventos', eventRoutes);
app.use('/galeria', galleryRoutes);
app.use('/admin/usuarios', userRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Página não encontrada' });
});

module.exports = app;
