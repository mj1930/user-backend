const usersSchema = require('../models/customers/users');

const userValidator = require('../validators/users.validators');
const crypto = require('../utils/crypto/Crypto');
const jwtService = require('../utils/jwt/jwt');

module.exports = {

    login : async (req, res, next) => {
        try {
            let { email, password } = await userValidator.login().validateAsync(req.body);
            let count = await usersSchema.countDocuments({
                email
            });
            if (count) {
                let data = await usersSchema.findOne({
                    email
                }).lean();
                let userPassword = await crypto.staticDecrypter(data.password);
                if(password === userPassword) {
                    const accessToken = await jwtService.generateAccessToken({
                        _id: data._id,
                        name: data.fname + data.lname,
                        email: data.email
                    });
                    return res.json({
                        code: 200,
                        data,
                        message: "Fetched user details",
                        accessToken
                    });
                } else {
                    return res.json({
                        code: 400,
                        data: {},
                        message: "password did not match",
                        accessToken: {}
                    }); 
                }
            } else {
                return res.json({ 
                    code: 400,
                    data: {},
                    messgae: "User not registered.", 
                    error: null 
                });
            }
        } catch (err) {
            next(err);
        }
    },

    signup: async (req, res, next) => {
        try {
            let {
                lname, fname, email, password
            } = await userValidator.signup().validateAsync(req.body);
            let count = await usersSchema.countDocuments({
                email
            });
            if (count) {
                return res.json({
                    code: 200,
                    message: 'Email already exists !!',
                    data:{},
                    error: null
                }); 
            }
            password = await crypto.staticEncrypter(password);
            let data = new usersSchema({
                lname,
                fname,
                email,
                password
            });
            const userData = await data.save();
            const accessToken = await jwtService.generateAccessToken({
                _id: userData._id,
                name: userData.fname + userData.lname
            });
            if (userData) {
                return res.json({
                    code: 200,
                    message: 'Registration Completed!!',
                    data: userData,
                    accessToken,
                    error: null
                });
            } else {
                return res.json({ 
                    code: 400,
                    data: {},
                    messgae: "Something Error!! Not created successfully.", 
                    error: null 
                });
            }
        } catch (err) {
            next(err)
        }
    },

    getUserData: async (req, res, next) => {
        try {
            let userId = req.decoded._id;
            let userData = await usersSchema.findOne({
                _id: userId
            }).lean();
            const accessToken = await jwtService.generateAccessToken({
                _id: userData._id,
                name: userData.fname + userData.lname
            });
            if (userData) {
                return res.json({
                    code: 200,
                    message: 'User profile data found !!',
                    data: userData,
                    accessToken,
                    error: null
                });
            } else {
                return res.json({
                    code: 400,
                    message: 'No user found !!',
                    data: {},
                    accessToken,
                    error: null
                });
            }
        } catch (err) {
            next(err);
        }
    }
}