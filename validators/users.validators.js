const Joi = require("@hapi/joi");

exports.login = () => {
    return Joi.object().keys({
        email: Joi.string().required().trim(),
        password: Joi.string().required().trim()
    });
};

exports.signup = () => {
    return Joi.object().keys({
        fname: Joi.string().required().trim(),
        lname: Joi.string().required().trim(),
        password: Joi.string().required().trim(),
        email: Joi.string().email().required().trim(),
        mobile: Joi.string().email().required().trim()
    });
};

