/**
 * Created by mayomi on 7/6/17.
 */
const
    express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    mongoose = require('mongoose'),
    ejs = require('ejs'),
    config = require('./config/main'),
    router = require('./router');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/test', (req,res, next)=>{
    return res.json('working');
});

// Start the server
const server = app.listen(config.port);
console.log('Your server is running on port ' + config.port + '.');

// Database Connection
mongoose.connect(config.database,  {
    useMongoClient: true,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Setting up basic middleware for all Express requests
app.use(logger('dev')); // Log requests to API using morgan

// Enable CORS from client-side
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST,PATCH, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

router(app);
