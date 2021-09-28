// requiring and acessing express
const express = require('express');
const app = express();
//requiring path for views directory to acess it from anywhere
const path = require('path');
//requiring method-override for pull and patch request download via(npm i method-override)
const methodOverride = require('method-override');
//requiring mongoose
const mongoose = require('mongoose');
//requiring ejs-mate for templates
const ejsMate = require('ejs-mate');
//requiring class/function Expresserror to throw our custom error 
const ExpressError = require('./Utils/ExpressError');
// requiring register routes 
const userRoutes = require('./routes/users');
// requiring all campgrounds routes 
const campgroundRouteS = require('./Routes/campgrounds');
// requiring all reviews routes 
const reviewRoutes = require('./Routes/reviews');
// requiring express-session
const session = require('express-session');
// requiring flash
const flash = require('connect-flash');
// rerquiring passport
const passport = require('passport');
// requiring passport-local
const localStrategy = require('passport-local');
// requiring user model schemas
const User = require('./models/user');

//connecting mongo man
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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
app.use(express.urlencoded({ extended: true }));
//using method-override
app.use(methodOverride('_method'));
//setting enfine for ejs-mate
app.engine('ejs', ejsMate);

// settion up secret and features
const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
};
// using session 
app.use(session(sessionConfig));
// using flash session
app.use(flash());
// telling to use passport
app.use(passport.initialize());
// passport session
app.use(passport.session());
// using passport
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// need to do it to send message via this middleware or via passing msg sucess to show route
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});



// route which use all campgrounds routes 
// prefix for all campground routes  //it'll use campgrounds file which we require at 25
app.use('/campgrounds', campgroundRoutes);
// route which use all reviews routes 
// prefix for all reviews routes  //it'll use reviews file which we require at 27
app.use('/campgrounds/:id/reviews', reviewRoutes);
// using userroutes file
app.use('/', userRoutes);
// serving static files
app.use(express.static(path.join(__dirname, 'public')));

//first home page
app.get('/', (req, res) => {
    //rendering home.ejs
    res.render('home');
});


//for our custom error it will come here take input message and code than go to next route
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

//a route for error handling whenever next(some parameter) is called it will come to this route;
app.use((err, req, res, next) => {
    //default message         //default status
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!';
    // renderinf error.ejs for error and passing message and code
    res.status(statusCode).render('error', { err });
});

//setting port for all the pages
app.listen(3000, () => {
    console.log('serving on port 3000');
});
