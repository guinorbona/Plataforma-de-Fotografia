const bcrypt = require('bcryptjs');
const { loginSchema, registerSchema, changePasswordSchema } = require('../config/joiSchemas');
const User = require('../models/User');

exports.getLogin = (req, res) => {
  if (req.session.user) {
    return res.redirect('/eventos');
  }
  res.render('auth/login', { title: 'Login', errors: {}, old: {}, globalError: null });
};

exports.postLogin = async (req, res) => {
  // 1 Validação de formato com Joi
  const { error, value } = loginSchema.validate(req.body, { abortEarly: false });

  let errors = {};
  if (error) {
    errors = error.details.reduce((acc, cur) => {
      acc[cur.path[0]] = cur.message;
      return acc;
    }, {});
  }

  // Se já falhou na validação básica, volta
  if (error) {
    return res.status(400).render('auth/login', {
      title: 'Login',
      errors,
      old: req.body,
      globalError: null
    });
  }

  const { email, password } = value;

  try {
    // 2 Busca usuário no banco
    const user = await User.findByEmail(email);

    // 3 Se não achou usuário, erro genérico
    if (!user) {
      return res.status(401).render('auth/login', {
        title: 'Login',
        errors: {},
        old: { email },
        globalError: 'E-mail ou senha inválidos.'
      });
    }

    // 4 Compara senha digitada com hash do banco
    const senhaConfere = await bcrypt.compare(password, user.password_hash);

    if (!senhaConfere) {
      return res.status(401).render('auth/login', {
        title: 'Login',
        errors: {},
        old: { email },
        globalError: 'E-mail ou senha inválidos.'
      });
    }

    // 5 Se deu tudo certo, cria sessão do usuário
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // Guarda flag na sessão também
    req.session.mustChangePassword = user.mustChangePassword === 1;

    // Se precisa trocar senha → manda pra tela de alterar senha
    if (req.session.mustChangePassword) {
      return res.redirect('/auth/alterar-senha');
    }

    // Senão segue o fluxo normal
    return res.redirect('/eventos');

  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).render('auth/login', {
      title: 'Login',
      errors: {},
      old: { email },
      globalError: 'Ocorreu um erro ao realizar o login. Tente novamente.'
    });
  }
};

exports.getRegister = (req, res) => {
  if (req.session.user) {
    return res.redirect('/eventos');
  }
  res.render('auth/register', { title: 'Cadastro', errors: {}, old: {}, globalError: null });
};

exports.postRegister = async (req, res) => {
  const { error, value } = registerSchema.validate(req.body, { abortEarly: false });

  let errors = {};
  if (error) {
    errors = error.details.reduce((acc, cur) => {
      acc[cur.path[0]] = cur.message;
      return acc;
    }, {});
    return res.status(400).render('auth/register', {
      title: 'Cadastro',
      errors,
      old: req.body,
      globalError: null
    });
  }

  const { name, email, password } = value;

  try {
    // 1 Verifica se já existe usuário com esse e-mail
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).render('auth/register', {
        title: 'Cadastro',
        errors: { email: 'Já existe um usuário com esse e-mail.' },
        old: req.body,
        globalError: null
      });
    }

    // 2 Gera hash da senha
    const passwordHash = await bcrypt.hash(password, 10);

    // 3 Cria usuário como "cliente"
    await User.create({
      name,
      email,
      role: 'cliente',
      passwordHash
    });

    // 4 Redireciona para login
    return res.redirect('/auth/login');
  } catch (err) {
    console.error('Erro no cadastro:', err);
    return res.status(500).render('auth/register', {
      title: 'Cadastro',
      errors: {},
      old: req.body,
      globalError: 'Ocorreu um erro ao realizar o cadastro. Tente novamente.'
    });
  }
};

// GET /auth/alterar-senha
exports.getChangePassword = (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  res.render('auth/change-password', {
    title: 'Alterar senha',
    errors: {},
    old: {},
    globalError: null
  });
};

// POST /auth/alterar-senha
exports.postChangePassword = async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  const { error, value } = changePasswordSchema.validate(req.body, {
    abortEarly: false
  });

  let errors = {};
  if (error) {
    errors = error.details.reduce((acc, cur) => {
      acc[cur.path[0]] = cur.message;
      return acc;
    }, {});
    return res.status(400).render('auth/change-password', {
      title: 'Alterar senha',
      errors,
      old: req.body,
      globalError: null
    });
  }

  const { currentPassword, newPassword } = value;

  try {
    const user = await User.findById(req.session.user.id);

    if (!user) {
      return res.redirect('/auth/login');
    }

    // Confere se a senha atual está correta
    const ok = await bcrypt.compare(currentPassword, user.password_hash);
    if (!ok) {
      return res.status(400).render('auth/change-password', {
        title: 'Alterar senha',
        errors: {},
        old: { ...req.body, currentPassword: '' },
        globalError: 'Senha atual incorreta.'
      });
    }

    // Gera novo hash e zera flag mustChangePassword
    const newHash = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(user.id, newHash, 0);

    // Atualiza sessão
    req.session.mustChangePassword = false;

    // Redireciona pra área logada
    return res.redirect('/eventos');
  } catch (err) {
    console.error('Erro ao alterar senha:', err);
    return res.status(500).render('auth/change-password', {
      title: 'Alterar senha',
      errors: {},
      old: { ...req.body, currentPassword: '' },
      globalError: 'Erro ao alterar senha. Tente novamente.'
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
