function isAuthenticated(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
}

function isAdmin(req, res, next) {
  if (!req.session || !req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).send('Acesso não autorizado');
  }
  next();
}

module.exports = {
  isAuthenticated,
  isAdmin
};
