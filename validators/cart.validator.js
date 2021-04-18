const Joi = require('@hapi/joi');

exports.addToCart = () => {
    return Joi.object().keys({
        products: Joi.array().required(),
        totalAmnt: Joi.number().required()
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
        totalAmnt: Joi.number().required()
    });
};

exports.updateQuantity = () => {
    return Joi.object().keys({
        productId: Joi.string().required(),
        quantity: Joi.number().optional(),
        totalAmnt: Joi.number().required()
    });
};

exports.updateNewProductToCart = () => {
    return Joi.object().keys({
        product: Joi.array().required(),
        totalAmnt: Joi.number().required()
    });
};