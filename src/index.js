const express = require('express');
const v1TopicRoutes = require("./v1/routes/topicRoutes");
const v1QuestionRoutes = require("./v1/routes/questionRoutes");

const app = express()
const PORT = process.env.PORT || 3080;

app.use(express.json())
app.use("/api/v1/topics", v1TopicRoutes);
app.use("/api/v1/questions", v1QuestionRoutes);

app.listen(PORT, () => {
    console.log(`🌎 TIPOTEST running on port ${PORT}`)
});

// TODO: 
//  Convocation CRUD
//  Convocation Topics CRUD
//  Test CRUD
//  Test update responses
//  Test update score