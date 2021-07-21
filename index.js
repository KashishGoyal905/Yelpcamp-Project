// requiring and acessing express
const express = require('express');
const app = express();
//requiring path for views directory to acess it from anywhere
const path = require('path');
//requiring method-override for pull and patch request download via(npm i method-override)
const methodOverride = require('method-override');
//requiring mongoose
const mongoose = require('mongoose');
//requiring campground.js file here
const Campground = require('./models/campground');
//requiring ejs-mate for templates
const ejsMate = require('ejs-mate');

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
//parsing body to see output
app.use(express.urlencoded({extended: true}));
//using method-override
app.use(methodOverride('_method'));
//setting enfine for ejs-mate
app.engine('ejs',ejsMate);

//first home page
app.get('/', (req, res) => {
    //rendering home.ejs
    res.render('home');
});

//making page for campgrounds
app.get('/campgrounds', async (req, res) => {
    //finding all campgrounds
    const campgrounds = await Campground.find({});
    //rendering index under campgrounds under views && passing all found campgound;
    res.render('campgrounds/index', { campgrounds });
});

//new page for cretaing new campgrounds
app.get('/campgrounds/new', (req, res) => {
    //rendering to new.ejs file
    res.render('campgrounds/new');
});

//posting new added campground via post req
app.post('/campgrounds',async (req, res)=>{
    //by default it will show us the empty body so we have to parse it
    // res.send(req.body);

    //making new campground by user input
    const campground = new Campground(req.body.campground);
    //saving new campground to database
    await campground.save();
    //redirecting after save 
    res.redirect(`/campgrounds/${campground._id}`);
});


//whenever someone try to come to this url it will show show.ejs file under campgrounds
app.get('/campgrounds/:id', async (req, res) => {
    //now we will find campground which user asked in url 
    const campground = await Campground.findById(req.params.id);
    //rendering show file  under campgrounds under views && we will pass that one found campground in show file
    res.render('campgrounds/show', {campground});
});

//edit page for campgrounds 
app.get('/campgrounds/:id/edit', async (req, res) => {
    //now we will find campground which user asked in url 
    const campground = await Campground.findById(req.params.id);
    //rendering to edit page to edit a campground
    res.render('campgrounds/edit', {campground});

});

//put request for updating specific campground
app.put('/campgrounds/:id', async (req, res) =>{
    //to check it worked
    // res.send("it worked");

    // finding id via url
    const {id} = req.params;
    // finding by id and updating && spreading in object 
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    // redirecting to specific campground details page
    res.redirect(`/campgrounds/${campground._id}`);
});

//deleting specific campground as simple as that
app.delete('/campgrounds/:id', async (req, res) =>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});

//it will take to the campground page /makecampground
// app.get('/makecampground', async (req, res) => {
//     // have to make it async and await coz it's take time so we make it async so it will stop until then
//     const camp = new Campground({ title: 'My Backyard',description: 'free camping'});
//     await camp.save();
//     res.send(camp);
// });
//don't need this now


//setting port for all the pages
app.listen(3000, () => {
    console.log('serving on port 3000');
});