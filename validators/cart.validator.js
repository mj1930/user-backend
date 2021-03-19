const Joi = require('@hapi/joi');

exports.addToCart = () => {
    return Joi.object().keys({
        products: Joi.array().required(),
        totalAmnt: Joi.string().required().trim()
    });
};

exports.listCart = () => {
    return Joi.object().keys({
        skip: Joi.number().required(),
        limit: Joi.number().required()
    });
};

exports.removeFromCart = () => {
    return Joi.object().keys({
        productId: Joi.string().required(),
        quantity: Joi.number().optional(),
        totalAmnt: Joi.string().required().trim()
    });
};

exports.updateQuantity = () => {
    return Joi.object().keys({
        productId: Joi.string().required(),
        quantity: Joi.number().optional(),
        totalAmnt: Joi.string().required().trim()
    });
};

exports.updateNewProductToCart = () => {
    return Joi.object().keys({
        product: Joi.object().required(),
        totalAmnt: Joi.string().required().trim()
    });
};