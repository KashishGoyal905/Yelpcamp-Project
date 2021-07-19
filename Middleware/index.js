// requiring express
const express = require('express');
const app = express();
// requiring morgan
const morgan = require('morgan');

// app.use can do any request pull patch post and give responsee
app.use(
    // using morgan function
    morgan('tiny')
);

app.use((req, res, next) => { 
    //date
    req.requestTime = Date.now();
    console.log(req.method, req.path);
    next();
});

app.use('/dogs',(req, res, next) => {
    console.log("dogs");
    next();
})

//simple auth trick 
app.use('/secrets',(req, res, next) => {
    const {pass} = req.query;
    if(pass === "chickens"){
        next();
    }
    res.send("you need a pass");
})

// how next works if we did not call it will stop after doing app.use no further code read
// app.use((req, res, next) => {
//     console.log("this is my first middleware");
//     next();
// });
// app.use((req, res, next) => {
//     console.log("this is my second middleware");
//     next();
// });

//home page
app.get('/', (req, res) => {
    console.log(`requesr time is ${req.requestTime}`);
    res.send('Welcome to home');
});

// /dogs page
app.get('/dogs', (req, res) => {
    console.log(`requesr time is ${req.requestTime}`);
    res.send('bow bow');
});

//secret auth
app.get('/secrets', (req, res) => {
    res.send('important thing is you r dumb');
})

//if nothing matched this will run coz nothing upper route match 
//and this route gonna match everything that's why this is in the end;
//and we don't need to call next coz it's in the end;
app.use((req, res) => {
    //instead of this
    // res.send('Not Found');
    //do this it will send status too (postman)
    res.status(404).send('Not Found');
});

//setting up port
app.listen(3000, () => {
    console.log('listening miidleware 3000')
})
