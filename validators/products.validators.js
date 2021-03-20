const Joi = require("@hapi/joi");

exports.findProductByCategory = () => {
    return Joi.object().keys({
        categoryId: Joi.string().required().trim(),
        skip: Joi.number().required(),
        limit: Joi.number().required()
    });
};

exports.findProductByLocation = () => {
    return Joi.object().keys({
        city: Joi.string().required().trim(),
        skip: Joi.number().required(),
        limit: Joi.number().required()
    });
};

exports.listAllProduct = () => {
    return Joi.object().keys({
        skip: Joi.number().required(),
        limit: Joi.number().required(),
        status: Joi.boolean().required()
    });
};

exports.findProductById = () => {
    return Joi.object().keys({
        productId: Joi.string().required().trim()
    })
}