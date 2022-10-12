const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const config = require("./config");
require('dotenv').config();

const v1ConvocationRoutes = require("./v1/routes/convocationRoutes");
const v1TopicRoutes = require("./v1/routes/topicRoutes");
const v1QuestionRoutes = require("./v1/routes/questionRoutes");
const v1TestRoutes = require("./v1/routes/testRoutes");

const mongoDB = process.env.DB_CONNECTION_STRING;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const corsOptions = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
};

const app = express();

app.use(cors(corsOptions));    // Configure CORS - https://expressjs.com/en/resources/middleware/cors.html
app.use(express.json());
app.use("/api/v1/convocations", v1ConvocationRoutes);
app.use("/api/v1/topics", v1TopicRoutes);
app.use("/api/v1/questions", v1QuestionRoutes);
app.use("/api/v1/tests", v1TestRoutes);

app.use(function(req, res, next){
    res.status(404);
    
    // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
    }

    // respond with html page
    if (req.accepts('html')) {
      res.render('404', { url: req.url });
      return;
    }
    
    // default to plain-text. send()
    res.type('txt').send('Not found');
});

app.listen(config.app.port, () => {
    console.log(`🌎 ${config.app.name} running on port ${config.app.port} - ${process.env.NODE_ENV} MODE`)
});