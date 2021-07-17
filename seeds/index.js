//requiring mongoose for connection to database
const mongoose = require('mongoose');
//requiring campground.js file here for schema
const Campground = require('../models/campground');
//requiring cities file for location
const cities = require('./cities');
//requiring seedHelpers file for title
const { places, descriptors } = require('./seedHelpers');


//connecting mongo man~!
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
//don't know why this is here kinda like connecting with mongo
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// a sample function to search for place and their native place randomly in seedhelpers file
const sample = array => array[Math.floor(Math.random() * array.length)];

//a simple function
const seedDb = async () => {
    //deleting existing campground (which we make earlier for test)
    await Campground.deleteMany({});
    //making 50 new campground from cities file using random
    for (let i = 0; i < 50; i++) {
        const Random1000 = Math.floor(Math.random() * 1000);
        //making new camps
        const camp = new Campground({
            location: `${cities[Random1000].city} , ${cities[Random1000].state}`,
            title: `${sample(descriptors)}, ${sample(places)}`
        });
        //saving each camp one by one
        await camp.save();
    }

}
// running function
seedDb().then((req,res) => {
    //disconnecting from seedDb after a sec connection;
    mongoose.connection.close();
})