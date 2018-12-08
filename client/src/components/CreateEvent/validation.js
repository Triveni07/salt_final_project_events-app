import Joi from 'joi';

const dateSchema = Joi.object().keys({
  start: Joi.date().required(),
  end: Joi.date(),
});

const locationSchema = Joi.object().keys({
  address: Joi.string().min(3).max(20).required(),
  zip: Joi.string().regex(/[\d]{3}\s[\d]{2}/),
  coordinates: Joi.object().keys({ x: Joi.number(), y: Joi.number() }),
});

const schema = Joi.object().keys({
  category: Joi.string().min(2).max(20).required(),
  date: dateSchema,
  description: Joi.string().min(10).max(400).required(),
  location: locationSchema,
  title: Joi.string().min(5).max(30).required(),
  public: Joi.boolean().required(),
});

const validate = details => Joi.validate(details, schema);

export default validate;
