const Joi = require('joi');

// Auth
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'E-mail inválido',
    'any.required': 'E-mail é obrigatório'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Senha deve ter no mínimo 6 caracteres',
    'any.required': 'Senha é obrigatória'
  })
});

const passwordStrongRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;

const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(passwordStrongRegex)
    .required()
    .messages({
      'string.pattern.base':
        'A senha deve ter no mínimo 8 caracteres, com letra maiúscula, minúscula, número e símbolo.',
      'any.required': 'Senha é obrigatória'
    }),
  confirmPassword: Joi.valid(Joi.ref('password')).required().messages({
    'any.only': 'As senhas não conferem'
  })
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'any.required': 'Senha atual é obrigatória'
  }),
  newPassword: Joi.string()
    .pattern(passwordStrongRegex)
    .required()
    .messages({
      'string.pattern.base':
        'A nova senha deve ter no mínimo 8 caracteres, com letra maiúscula, minúscula, número e símbolo.',
      'any.required': 'A nova senha é obrigatória'
    }),
  confirmNewPassword: Joi.valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'As senhas novas não conferem'
  })
});

// Eventos
const eventSchema = Joi.object({
  eventName: Joi.string().min(3).required(),
  eventDate: Joi.date()
    .iso()
    .min('1900-01-01')
    .max('now')
    .required()
    .messages({
      'date.min': 'A data do evento não pode ser menor que 01/01/1900.',
      'date.max': 'A data do evento não pode ser maior que a data atual.'
    })
});


// Fotos
const photoSchema = Joi.object({
  title: Joi.string().allow(''),
  caption: Joi.string().allow(''),
  imageUrl: Joi.string().uri().required().messages({
    'string.uri': 'Informe uma URL válida para a imagem'
  })
});

// Usuários (admin)
const userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('admin', 'cliente').required()
});

module.exports = {
  loginSchema,
  registerSchema,
  eventSchema,
  photoSchema,
  userSchema,
  changePasswordSchema,
  passwordStrongRegex
};
