const { userSchema } = require('../config/joiSchemas');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Cria helper para gerar senha temporária forte ao criar usuário 
function generateStrongPassword(length = 12) {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()-_=+[]{};:,.<>?';

  const all = lower + upper + numbers + symbols;

  let password = '';
  // Garantir pelo menos 1 de cada
  password += lower[Math.floor(Math.random() * lower.length)];
  password += upper[Math.floor(Math.random() * upper.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Completar até o tamanho desejado
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  // Embaralhar
  password = password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');

  return password;
}

// LISTAR TODOS OS USUÁRIOS (APENAS ADMIN)
exports.listUsers = async (req, res) => {
  try {
    const filters = {
      name: req.query.name || '',
      role: req.query.role || ''
    };

    const users = await User.findAll(filters);

    res.render('users/index', {
      title: 'Gerenciamento de Usuários',
      users,
      filters
    });
  } catch (err) {
    console.error('Erro ao listar usuários:', err);
    res.status(500).render('users/index', {
      title: 'Gerenciamento de Usuários',
      users: [],
      filters: {
        name: req.query.name || '',
        role: req.query.role || ''
      },
      errorMessage: 'Erro ao carregar usuários.'
    });
  }
};

// FORM NOVO USUÁRIO
exports.getCreateUser = (req, res) => {
  res.render('users/form', {
    title: 'Novo Usuário',
    action: '/admin/usuarios/novo',
    user: {},
    errors: {}
  });
};

// CRIAR USUÁRIO (ADMIN CRIA OUTRO USUÁRIO)
exports.postCreateUser = async (req, res) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });

  let errors = {};
  if (error) {
    errors = error.details.reduce((acc, cur) => {
      acc[cur.path[0]] = cur.message;
      return acc;
    }, {});

    return res.render('users/form', {
      title: 'Novo Usuário',
      action: '/admin/usuarios/novo',
      user: req.body,
      errors
    });
  }

  const { name, email, role } = req.body;

  try {
    // Verificar se já existe usuário com esse e-mail
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.render('users/form', {
        title: 'Novo Usuário',
        action: '/admin/usuarios/novo',
        user: req.body,
        errors: { email: 'Já existe um usuário com esse e-mail.' }
      });
    }

    // Gerar uma senha forte temporária
    const tempPassword = generateStrongPassword(12);
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    // mustChangePassword = 1 forçar troca da senha no primeiro login
    const newUserId = await User.create({
      name,
      email,
      role,
      passwordHash,
      mustChangePassword: 1
    });

    // Mostra uma tela com a senha temporária
    return res.render('users/created', {
      title: 'Usuário criado com sucesso',
      user: {
        id: newUserId,
        name,
        email,
        role
      },
      tempPassword
    });

  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    res.status(500).render('users/form', {
      title: 'Novo Usuário',
      action: '/admin/usuarios/novo',
      user: req.body,
      errors,
      errorMessage: 'Erro ao salvar usuário.'
    });
  }
};

// FORM EDITAR USUÁRIO
exports.getEditUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send('Usuário não encontrado.');
    }

    res.render('users/form', {
      title: 'Editar Usuário',
      action: `/admin/usuarios/${id}/editar`,
      user,
      errors: {}
    });
  } catch (err) {
    console.error('Erro ao carregar usuário para edição:', err);
    res.status(500).send('Erro ao carregar usuário.');
  }
};

// SALVAR EDIÇÃO DO USUÁRIO 
exports.postEditUser = async (req, res) => {
  const { id } = req.params;

  const { error } = userSchema.validate(req.body, { abortEarly: false });

  let errors = {};
  if (error) {
    errors = error.details.reduce((acc, cur) => {
      acc[cur.path[0]] = cur.message;
      return acc;
    }, {});

    return res.render('users/form', {
      title: 'Editar Usuário',
      action: `/admin/usuarios/${id}/editar`,
      user: { id, ...req.body },
      errors
    });
  }

  const { name, email, role } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send('Usuário não encontrado.');
    }

    await User.update(id, { name, email, role });

    res.redirect('/admin/usuarios');
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
    res.status(500).send('Erro ao atualizar usuário.');
  }
};

// "EXCLUIR" USUÁRIO (SOFT DELETE)
exports.postDeleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send('Usuário não encontrado.');
    }

    await User.softDelete(id);

    res.redirect('/admin/usuarios');
  } catch (err) {
    console.error('Erro ao excluir usuário:', err);
    res.status(500).send('Erro ao excluir usuário.');
  }
};
