const ratingSchema = require('../models/products/rating');

module.exports = {

    getProductRatings: async (req, res, next) => {
        try {
          let productId = req.params.id;
          let ratingData = await ratingSchema.find({
            productId
          })
          .lean();
          return res.send({
              code: 200,
              data: ratingData,
              message: "Ratings fetched",
              error: null
          });
        } catch (err) {
            next(err);
        }
    }
}