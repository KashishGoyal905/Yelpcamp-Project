// file schema foe for reviews 

//requiring mongoose
const mongoose = require('mongoose');
//shortcut so we don't have to write mongoose.schema everywhere
const Schema = mongoose.Schema;


//making schema details for reviews
const reviewSchema = new Schema({
   body:String,
   rating:Number,
   author:{
      type:Schema.Types.ObjectId,
      ref:'user'
   }
});

//exporting reviews schema so that we can use this in index.js
module.exports = mongoose.model('Review', reviewSchema);
