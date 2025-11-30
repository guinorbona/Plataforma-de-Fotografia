const { eventSchema } = require('../config/joiSchemas');
const Event = require('../models/Event');

// LISTAR MEUS EVENTOS
exports.listMyEvents = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const isAdmin = req.session.user.role === 'admin';

    const filters = {
      search: req.query.search || '',
      date: req.query.date || '',
      clientName: isAdmin ? (req.query.clientName || '') : ''
    };

    let eventos;
    if (isAdmin) {
      eventos = await Event.findAll(filters);
    } else {
      eventos = await Event.findByUser(userId, filters);
    }

    res.render('events/index', {
      title: isAdmin ? 'Todos os Eventos' : 'Meus Eventos',
      eventos,
      isAdmin,
      filters
    });
  } catch (err) {
    console.error('Erro ao listar eventos:', err);
    res.status(500).render('events/index', {
      title: 'Meus Eventos',
      eventos: [],
      isAdmin: req.session.user.role === 'admin',
      filters: {
        search: req.query.search || '',
        date: req.query.date || '',
        clientName: req.query.clientName || ''
      },
      errorMessage: 'Erro ao carregar eventos.'
    });
  }
};

// FORM NOVO EVENTO
exports.getCreateEvent = (req, res) => {
  res.render('events/form', {
    title: 'Novo Evento',
    action: '/eventos/novo',
    event: {},
    errors: {}
  });
};

// CRIAR EVENTO
exports.postCreateEvent = async (req, res) => {
  const { error } = eventSchema.validate(req.body, { abortEarly: false });

  let errors = {};
  if (error) {
    errors = error.details.reduce((acc, cur) => {
      acc[cur.path[0]] = cur.message;
      return acc;
    }, {});

    return res.render('events/form', {
      title: 'Novo Evento',
      action: '/eventos/novo',
      event: req.body,
      errors
    });
  }

  try {
    const userId = req.session.user.id; // pega o id do usuário logado
    await Event.create(userId, req.body);

    res.redirect('/eventos');
  } catch (err) {
    console.error('Erro ao criar evento:', err);
    res.status(500).render('events/form', {
      title: 'Novo Evento',
      action: '/eventos/novo',
      event: req.body,
      errors,
      errorMessage: 'Erro ao salvar evento.'
    });
  }
};

// EDITAR EVENTO 
exports.getEditEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.session.user.id;

  try {
    const event = await Event.findById(id);

    if (!event || event.userId !== userId) {
      return res.status(404).send('Evento não encontrado.');
    }

    res.render('events/form', {
      title: 'Editar Evento',
      action: `/eventos/${id}/editar`,
      event,
      errors: {}
    });
  } catch (err) {
    console.error('Erro ao carregar evento para edição:', err);
    res.status(500).send('Erro ao carregar evento.');
  }
};

exports.postEditEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.session.user.id;

  const { error } = eventSchema.validate(req.body, { abortEarly: false });

  let errors = {};
  if (error) {
    errors = error.details.reduce((acc, cur) => {
      acc[cur.path[0]] = cur.message;
      return acc;
    }, {});

    return res.render('events/form', {
      title: 'Editar Evento',
      action: `/eventos/${id}/editar`,
      event: { id, ...req.body },
      errors
    });
  }

  try {
    const event = await Event.findById(id);

    if (!event || event.userId !== userId) {
      return res.status(404).send('Evento não encontrado.');
    }

    await Event.update(id, req.body);
    res.redirect('/eventos');
  } catch (err) {
    console.error('Erro ao atualizar evento:', err);
    res.status(500).send('Erro ao atualizar evento.');
  }
};

exports.postDeleteEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.session.user.id;

  try {
    const event = await Event.findById(id);

    if (!event || event.userId !== userId) {
      return res.status(404).send('Evento não encontrado.');
    }

    await Event.softDelete(id);
    res.redirect('/eventos');
  } catch (err) {
    console.error('Erro ao excluir evento:', err);
    res.status(500).send('Erro ao excluir evento.');
  }
};
