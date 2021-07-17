// requiring and acessing express
const express = require('express');
const app = express();
//requiring path for views directory to acess it from anywhere
const path = require('path');

//requiring mongoose
const mongoose = require('mongoose');
//requiring campground.js file here
const Campground = require('./models/campground');

//connecting mongo man
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


// setting up path for our home ejs file and view engine
app.set('view engine', 'ejs');
// by this it will search(home.ejs) via whole path not relative
app.set('views', path.join(__dirname, 'views'));

//first home page
app.get('/', (req, res) => {
    //rendering home.ejs
    res.render('home');
});

//it will take to the campground page /makecampground
app.get('/makecampground', async (req, res) => {
    // have to make it async and await coz it's take time so we make it async so it will stop until then
    const camp = new Campground({ title: 'My Backyard',description: 'free camping'});
    await camp.save();
    res.send(camp);
});

//setting port for all the pages
app.listen(3000, () => {
    console.log('serving on port 3000')
});