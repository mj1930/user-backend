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
                    $and: [
                        { email },
                        { isDeleted: true }
                    ]
                }).lean();
                if (!data) {
                    return res.json({
                        code: 200,
                        data: {},
                        message: "Contact your administrator",
                        accessToken
                    });
                }
                let userPassword = await crypto.staticDecrypter(data.password);
                if(password === userPassword) {
                    const accessToken = await jwtService.generateAccessToken({
                        _id: data._id,
                        name: data.fname + " " + data.lname,
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
                    message: "User not registered.", 
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
                lname, fname, email, password, phone
            } = await userValidator.signup().validateAsync(req.body);
            let count = await usersSchema.countDocuments({
                email
            });
            if (count) {
                return res.json({
                    code: 400,
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
                password,
                "address.mobile": phone
            });
            const userData = await data.save();
            if (userData) {
                return res.json({
                    code: 200,
                    message: 'Registration Completed!!',
                    data: userData,
                    error: null
                });
            } else {
                return res.json({ 
                    code: 400,
                    data: {},
                    message: "Something Error!! Not created successfully.", 
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
    },

    updateUserData : async(req,res,next) =>{
        const user = await usersSchema.findById(req.decoded._id)

        if (user) {
          user.fname = req.body.fname || user.fname
          user.lname = req.body.lname || user.lname
          user.email = req.body.email || user.email
          if (req.body.password) {
            user.password = req.body.password
          }
      
          const updatedUser = await user.save()
      
          res.json({
            _id: updatedUser._id,
            fname: updatedUser.fname,
            lname: updatedUser.lname,
            email: updatedUser.email,
            token:  await jwtService.generateAccessToken({
                _id: updatedUser._id,
                name: updatedUser.fname + updatedUser.lname
            }),
          })
        } else {
          res.status(404)
          throw new Error('User not found')
        }
    }
    ,
    saveAddress: async (req, res) => {
        console.log(req)
      const user= await usersSchema.findById(req.decoded._id)
        if(user){
          user.address = req.body.address || user.address;
        }
        const userAddress = await user.save()
      res.json({
        ok: true,
        data: userAddress,
      });
    }
}