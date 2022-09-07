const express = require('express');
const mongoose = require('mongoose');
const config = require("./config");

const v1ConvocationRoutes = require("./v1/routes/convocationRoutes");
const v1TopicRoutes = require("./v1/routes/topicRoutes");
const v1QuestionRoutes = require("./v1/routes/questionRoutes");
const v1TestRoutes = require("./v1/routes/testRoutes");

const mongoDB = `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();

app.use(express.json());
app.use("/api/v1/convocations", v1ConvocationRoutes);
app.use("/api/v1/topics", v1TopicRoutes);
app.use("/api/v1/questions", v1QuestionRoutes);
app.use("/api/v1/tests", v1TestRoutes);

app.listen(config.app.port, () => {
    console.log(`🌎 ${config.app.name} running on port ${config.app.port}`)
});