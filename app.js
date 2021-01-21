//External Packages
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require("body-parser");
const db = require('./api/config/database');

db.authenticate().then(() => console.log("Connected")).catch(() => console.log("error"));

//Parsing the body
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Allowing Cors 
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//Get the routes
const userRoutes = require('./api/routes/users');

//Routes which should handle the request
app.use('/users', userRoutes);

//If nothing is matched
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//Handling errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})
exports.app = app;