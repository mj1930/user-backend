const Joi = require('@hapi/joi');

exports.addOrder = () => {
    return Joi.object().keys({
        products: Joi.array().required(),
        totalAmnt: Joi.string().required().trim(),
        address: Joi.object().required(),
        userGstin: Joi.string().optional(),
        businessName: Joi.string().optional(),
        paymentMode:  Joi.string().required().trim(),
    });
};

exports.listOrders = () => {
    return Joi.object().keys({
        skip:  Joi.number().required(),
        limit: Joi.number().required()
    });
};

exports.filterOrders = () => {
    return Joi.object().keys({
        skip:  Joi.string().required().trim(),
        limit: Joi.string().required().trim(),
        status: Joi.string().required().trim()
    });
};

exports.rateOrder = () => {
    return Joi.object().keys({
        rating:  Joi.string().required().trim(),
        feedback: Joi.string().required().trim(),
        productId: Joi.string().required().trim()
    });
};