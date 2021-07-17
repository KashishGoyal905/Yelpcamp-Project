//making our first mongoose model

//requiring mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//making schema details for products
const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

//exporting mongoose schema so that we can use this in index.js
module.exports = mongoose.model('Campground', CampgroundSchema);

