//External Packages
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require("body-parser");
const db = require('./api/config/database');

db.authenticate().then(() => console.log("Connected")).catch(() => console.log("error"));

//Parsing the body
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));

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
const cropRoutes = require('./api/routes/crops');
const userCropRoutes = require('./api/routes/user_crops');
const timelineEventRoutes = require('./api/routes/timeline_event');
const checkAuth = require('./api/middleware/check-auth');

//Routes which should handle the request
const postRoutes = require('./api/routes/post');
const commentRoutes = require('./api/routes/comment');
const replyRoutes = require('./api/routes/reply');
const likeRoutes = require('./api/routes/like');
const ChannelRoutes = require('./api/routes/channel');
const userChannelRoutes = require('./api/routes/user_channel');

//Routes which should handle the request
app.use('/users', userRoutes);
app.use('/crops', checkAuth, cropRoutes);
app.use('/userCrops', userCropRoutes);
app.use('/timeline', timelineEventRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/reply', replyRoutes);
app.use('/like', likeRoutes);
app.use('/channel', ChannelRoutes);
app.use('/userChannel', userChannelRoutes);

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