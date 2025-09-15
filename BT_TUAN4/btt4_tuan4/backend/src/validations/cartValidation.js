import Joi from 'joi'

const addItem = async (req, res, next) => {
  const schema = Joi.object({ productId: Joi.string().required(), quantity: Joi.number().integer().min(1).default(1) })
  try { await schema.validateAsync(req.body, { abortEarly: false }); next() } catch (err) { next(err) }
}

const updateItem = async (req, res, next) => {
  const schema = Joi.object({ quantity: Joi.number().integer().min(0).required() })
  try { await schema.validateAsync(req.body, { abortEarly: false }); next() } catch (err) { next(err) }
}

export const cartValidation = { addItem, updateItem }
