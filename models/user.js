// requiring mongoose
const mongoose = require('mongoose');
// schema shortcut
const Schema = mongoose.Schema;
// requiring passport-local-mongoose
const passportLocalMongoose = require('passport-local-mongoose');


// making schema
const userSchema =new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
})

userSchema.plugin(passportLocalMongoose);

// exporting schema
module.exports = mongoose.model('user',userSchema);