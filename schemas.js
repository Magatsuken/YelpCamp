const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        location: Joi.string().required(),
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        description: Joi.string().required(),
        image: Joi.string().required(),
    }).required()
});