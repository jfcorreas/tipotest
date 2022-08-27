const express = require('express');
const config = require("./config");
const v1ConvocationRoutes = require("./v1/routes/convocationRoutes");
const v1TopicRoutes = require("./v1/routes/topicRoutes");
const v1QuestionRoutes = require("./v1/routes/questionRoutes");
const v1TestRoutes = require("./v1/routes/testRoutes");

const { app: { appName, APIport }} = config;

const app = express()

app.use(express.json())
app.use("/api/v1/convocations", v1ConvocationRoutes);
app.use("/api/v1/topics", v1TopicRoutes);
app.use("/api/v1/questions", v1QuestionRoutes);
app.use("/api/v1/tests", v1TestRoutes);

app.listen(APIport, () => {
    console.log(`🌎 ${appName} running on port ${APIport}`)
});