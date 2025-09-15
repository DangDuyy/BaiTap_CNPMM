import Joi from 'joi'

const list = async (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1),
    itemsPerPage: Joi.number().integer().min(1),
    q: Joi.string().allow('', null),
    category: Joi.string().allow('', null),
    inStock: Joi.boolean().truthy('true').falsy('false'),
    onSale: Joi.boolean().truthy('true').falsy('false'),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    minRating: Joi.number().min(0).max(5),
    sortBy: Joi.string().valid('name','price','rating','views'),
    sortOrder: Joi.string().valid('asc','desc')
  })
  try {
    await schema.validateAsync(req.query, { abortEarly: false })
    next()
  } catch (err) { next(err) }
}

export const productValidation = { list }
