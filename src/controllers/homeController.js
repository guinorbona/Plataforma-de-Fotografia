exports.index = (req, res) => {
  if (req.session.user) {
    // Redireciona direto para os eventos
    return res.redirect('/eventos');
  }

  const eventosRecentes = [];

  res.render('index', {
    title: 'Home',
    eventosRecentes
  });
};

