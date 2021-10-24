//requiring campground.js file here
const Campground = require('../models/campground');

// exporting main function to routes/campground.js
// exporting index function
module.exports.index = async (req, res, next) => {
    //finding all campgrounds
    const campgrounds = await Campground.find({});
    //rendering index under campgrounds under views && passing all found campgound;
    res.render('campgrounds/index', { campgrounds });
};

// exporting new function
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

// exporting post function for creatng new campground
module.exports.createCampgrounds = async (req, res, next) => {
    //by default it will show us the empty body so we have to parse it
    // res.send(req.body);

    //making new campground by user input
    const campground = new Campground(req.body.campground);
    // making author by username
    campground.author=req.user._id;
    //saving new campground to database
    await campground.save();
    // flashing a message 
    req.flash('success', 'Suceesfully Created A Campground');
    //redirecting after save 
    res.redirect(`/campgrounds/${campground._id}`);
}

// exporting show camgrounds funcgion to view all campgrounds
module.exports.showCampground = async (req, res, next) => {
    //now we will find campground which user asked in url       //parsing objectid 
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    console.log(campground);
    // error flash message
    if (!campground) {
        req.flash('error', 'Campground Not Found');
        return res.redirect('/campgrounds');
    }
    //rendering show file  under campgrounds under views && we will pass that one found campground in show file
    res.render('campgrounds/show', { campground });
}

// exporting edit for for campground
module.exports.renderEditForm = async (req, res, next) => {
    //now we will find campground which user asked in url 
    const campground = await Campground.findById(req.params.id);
    // error flash message
    if (!campground) {
        req.flash('error', 'Campground Not Found');
        return res.redirect('/campgrounds');
    }
    //rendering to edit page to edit a campground
    res.render('campgrounds/edit', { campground });

};

//exportinf filr for put trquest of edit forms
module.exports.updateCampground = async (req, res, next) => {
    //to check it worked
    // res.send("it worked");

    // finding id via url
    const { id } = req.params;
    // finding by id and updating && spreading in object 
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    // updated flash message
    req.flash('success', "Campground Updated Sucessfully");
    // redirecting to specific campground details page
    res.redirect(`/campgrounds/${campground._id}`);
};

// exportinf file for deleting campground
module.exports.delete = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    // deleting review message
    req.flash('success', 'Deleted Review successfully');
    res.redirect('/campgrounds');
};