//making our first mongoose model

//requiring mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//making schema details for products
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,

    // embedding or connecting review model with camoground model
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review' 
    }]
});

//deleting review alongwith campground                 //campground we deleted passed here
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        // inside campground there is review named array
        await Review.deleteMany({
            // which has id
            _id: {
                $in: doc.reviews
            }
        })
    }
});

//exporting mongoose schema so that we can use this in index.js
module.exports = mongoose.model('Campground', CampgroundSchema);

