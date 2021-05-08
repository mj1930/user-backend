const orderSchema = require('../models/orders/orders');
const userSchema = require('../models/customers/users');
const productSchema = require('../models/products/products');
const ratingSchema = require('../models/products/rating');
const orderValidator = require('../validators/orders.validators');

module.exports = {

    addOrder: async (req, res, next) => {
        try {
            let userId = req.decoded._id;
            let { products, totalAmnt, address,
                  userGstin, businessName, paymentMode } = await orderValidator.addOrder().validateAsync(req.body);
            let orderData = await orderSchema.create({
                mode: "website",
                products,
                userId,
                totalAmnt,
                address,
                userGstin,
                businessName,
                paymentMode
            });
            for (let i = 0; i < products.length;i++) {
                let productData = products[i];
                await productSchema.updateOne({
                    _id: productData.productId
                }, {
                    $inc: {
                        availableUnits : -parseInt(productData.quantity)
                    }
                });
            }
            return res.json({
                code: 200,
                data: orderData,
                message: 'Order placed successfully',
                error: null
            });
        } catch (err) {
            next(err);
        }
    },

    listOrders: async (req, res, next) => {
        try {
            let userId = req.decoded._id;
            let { skip, limit } = await orderValidator.listOrders().validateAsync(req.body);
            let orders = await orderSchema.find({userId})
            .skip(skip)
            .limit(limit)
            .lean();
            let userName = await userSchema.findOne({
                _id: userId
            }).lean();
            return res.json({
                code: 200,
                data: {
                    orders,
                    name: userName.fname + " " + userName.lname
                },
                message: "Orders list fetched",
                error: null
            });
        } catch (err) {
            next(err);
        }
    },

    filterProducts: async (req, res, next) => {
        try {
            let userId = req.decoded._id;
            let { skip, limit, status } = await orderValidator.filterOrders().validateAsync(req.body);
            let orders = await orderSchema.find({
                $and: [
                    {
                        userId
                    },
                    {
                        orderStatus: status
                    }
                ]
            })
            .skip(skip)
            .limit(limit)
            .lean();
            return res.json({
                code: 200,
                data: orders,
                message: "Orders list fetched",
                error: null
            });
        } catch (err) {
            next(err);
        }
    },

    orderStatus: async (req, res, next) => {
        try {
            let userId = req.decoded._id;
            let orders = await orderSchema.findById(userId);
            return res.json({
                code: 200,
                data: orders,
                message: "Orders list fetched",
                error: null
            });
        } catch (err) {
            next(err);
        }
    },

    orderStatusFindOne: async (req, res, next) => {
        try {
            let userId = req.decoded._id;
            let id = req.params.id;
            let orders = await orderSchema.findOne({
                $and: [
                    {
                        userId
                    },
                    {
                        _id: id
                    }
                ]
            })
            return res.json({
                code: 200,
                data: orders,
                message: "Orders list fetched",
                error: null
            });
        } catch (err) {
            next(err);
        }
    },

    addRatingAndFeedback: async (req, res, next) => {
        try {
            let userId = req.decoded._id;
            let userName = req.decoded.name;
            let { rating, feedback, productId } = await orderValidator.rateOrder().validateAsync(req.body);
            let ratingData = await ratingSchema.create({
                feedback,
                productId,
                customerId: userId,
                name: userName,
                rating
            });
            let totalRating = await ratingSchema.find({ productId }).lean();
            let prevRating = 0;
            prevRating += parseInt(rating)
            totalRating.forEach(item => {
                prevRating += item.rating;
            });
            prevRating = parseInt(rating / totalRating.length);
            await productSchema.updateOne({
                _id: productId,
            }, {
                $set: {
                    rating: prevRating
                }
            });
            return res.send({
                code: 200,
                data: ratingData,
                message: "Feedback added successfully",
                error: null
            });
        } catch (err) {
            next(err);
        }
    }
}