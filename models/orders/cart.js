const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    products: {
        type: Array,
        default: [
            {
                productImg: {
                    type: Array,
                    default: []
                },
                productName: {
                    type: String,
                    default: ""
                },
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: {
                    type: Number,
                    default: 0
                },
                orderPrice: {
                    type: String,
                    default: ""
                },
                sellerId: {
                    type: Schema.Types.ObjectId,
                    ref: 'sellers',
                    default: null
                }
            }
        ]
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'customers',
        default: null
    },
    totalAmnt: {
        type: String,
        default: ""
    }
}, {timestamps: true});

const carts = mongoose.model('cart', cartSchema);

module.exports = carts;

