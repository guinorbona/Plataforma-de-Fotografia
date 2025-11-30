const { photoSchema } = require('../config/joiSchemas');
const Event = require('../models/Event');
const Photo = require('../models/Photo');

// LISTAR GALERIA DE UM EVENTO
exports.listEventGallery = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.session.user.id;

  try {
    // 1 Buscar evento no banco
    const event = await Event.findById(eventId);

    // 2 Garantir que o evento existe e é do usuário logado
    if (!event || event.userId !== userId) {
      return res.status(404).send('Evento não encontrado.');
    }

    // 3 Buscar fotos desse evento
    const photosDb = await Photo.findByEvent(eventId);

    // 4 Mapear campos do banco para o que a view espera
    const photos = photosDb.map(p => ({
      id: p.id,
      title: p.originalName,   
      caption: '',             
      imageUrl: p.path        
    }));

    res.render('gallery/index', {
      title: `Galeria - ${event.eventName}`,
      event,
      photos
    });
  } catch (err) {
    console.error('Erro ao carregar galeria:', err);
    res.status(500).send('Erro ao carregar galeria.');
  }
};

// FORM PARA ADICIONAR NOVA FOTO
exports.getAddPhoto = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.session.user.id;

  try {
    const event = await Event.findById(eventId);

    if (!event || event.userId !== userId) {
      return res.status(404).send('Evento não encontrado.');
    }

    res.render('gallery/form', {
      title: 'Adicionar Imagem',
      action: `/galeria/${eventId}/nova`,
      eventId,
      photo: {},
      errors: {}
    });
  } catch (err) {
    console.error('Erro ao carregar form de foto:', err);
    res.status(500).send('Erro ao carregar formulário.');
  }
};

// SALVAR NOVA FOTO
exports.postAddPhoto = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.session.user.id;

  // Validação com Joi (title, caption, imageUrl)
  const { error } = photoSchema.validate(req.body, { abortEarly: false });

  let errors = {};
  if (error) {
    errors = error.details.reduce((acc, cur) => {
      acc[cur.path[0]] = cur.message;
      return acc;
    }, {});
  }

  try {
    const event = await Event.findById(eventId);

    if (!event || event.userId !== userId) {
      return res.status(404).send('Evento não encontrado.');
    }

    if (error) {
      return res.render('gallery/form', {
        title: 'Adicionar Imagem',
        action: `/galeria/${eventId}/nova`,
        eventId,
        photo: req.body,
        errors
      });
    }

    // Montar dados para o banco
    const originalName = req.body.title || 'Sem título';
    const fileName = originalName
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // tira acento
      .replace(/\s+/g, '-'); // espaços → -

    const path = req.body.imageUrl; // URL da imagem

    await Photo.create(eventId, { originalName, fileName, path });

    res.redirect(`/galeria/${eventId}`);
  } catch (err) {
    console.error('Erro ao adicionar foto:', err);
    res.status(500).send('Erro ao salvar imagem.');
  }
};

// FORM PARA EDITAR FOTO
exports.getEditPhoto = async (req, res) => {
  const { eventId, photoId } = req.params;
  const userId = req.session.user.id;

  try {
    const event = await Event.findById(eventId);

    if (!event || event.userId !== userId) {
      return res.status(404).send('Evento não encontrado.');
    }

    const photoDb = await Photo.findById(photoId);

    if (!photoDb || photoDb.eventId !== Number(eventId)) {
      return res.status(404).send('Foto não encontrada.');
    }

    // Adaptar para a view
    const photo = {
      id: photoDb.id,
      title: photoDb.originalName,
      caption: '',
      imageUrl: photoDb.path
    };

    res.render('gallery/form', {
      title: 'Editar Imagem',
      action: `/galeria/${eventId}/${photoId}/editar`,
      eventId,
      photo,
      errors: {}
    });
  } catch (err) {
    console.error('Erro ao carregar foto para edição:', err);
    res.status(500).send('Erro ao carregar imagem.');
  }
};

// SALVAR EDIÇÃO DA FOTO
exports.postEditPhoto = async (req, res) => {
  const { eventId, photoId } = req.params;
  const userId = req.session.user.id;

  const { error } = photoSchema.validate(req.body, { abortEarly: false });

  let errors = {};
  if (error) {
    errors = error.details.reduce((acc, cur) => {
      acc[cur.path[0]] = cur.message;
      return acc;
    }, {});
  }

  try {
    const event = await Event.findById(eventId);

    if (!event || event.userId !== userId) {
      return res.status(404).send('Evento não encontrado.');
    }

    const photoDb = await Photo.findById(photoId);

    if (!photoDb || photoDb.eventId !== Number(eventId)) {
      return res.status(404).send('Foto não encontrada.');
    }

    if (error) {
      return res.render('gallery/form', {
        title: 'Editar Imagem',
        action: `/galeria/${eventId}/${photoId}/editar`,
        eventId,
        photo: { id: photoId, ...req.body },
        errors
      });
    }

    const originalName = req.body.title || 'Sem título';
    const fileName = originalName
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');

    const path = req.body.imageUrl;

    await Photo.update(photoId, { originalName, fileName, path });

    res.redirect(`/galeria/${eventId}`);
  } catch (err) {
    console.error('Erro ao atualizar foto:', err);
    res.status(500).send('Erro ao atualizar imagem.');
  }
};

// EXCLUIR FOTO
exports.postDeletePhoto = async (req, res) => {
  const { eventId, photoId } = req.params;
  const userId = req.session.user.id;

  try {
    const event = await Event.findById(eventId);

    if (!event || event.userId !== userId) {
      return res.status(404).send('Evento não encontrado.');
    }

    const photoDb = await Photo.findById(photoId);

    if (!photoDb || photoDb.eventId !== Number(eventId)) {
      return res.status(404).send('Foto não encontrada.');
    }

    await Photo.delete(photoId);

    res.redirect(`/galeria/${eventId}`);
  } catch (err) {
    console.error('Erro ao excluir foto:', err);
    res.status(500).send('Erro ao excluir imagem.');
  }
};
