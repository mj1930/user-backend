const users = require('./users');
const product = require('./products');
const orders = require('./orders');
const cart = require('./carts');
const verification = require('./verification');

const errorMiddleware = require('../middleware/error');

module.exports = app => {
    app.get('/', (req, res, next) => {
        res.json({
            code: 200,
            title: 'Everything looks fine.'
        });
    });


    app.use((req, res, next) => {
        if (
            req.originalUrl.indexOf('/users') > -1 ||
            req.originalUrl.indexOf('/products') > -1 ||
            req.originalUrl.indexOf('/orders') > -1 ||
            req.originalUrl.indexOf('/carts') > -1 ||
            req.originalUrl.indexOf('/verify') > -1
        ) {
            next()
        } else {
            return res.json({ code: 400, data: null, error: 'Beta Feature', message: 'This feature is currently unavailable.' });
        }
    });
    app.use('/users', users);
    app.use('/products', product);
    app.use('/orders', orders);
    app.use('/carts', cart);
    app.use('/verify', verification);
    app.use(errorMiddleware);
}