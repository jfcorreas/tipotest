const testService = require("../services/testServices");
const config = require("../config");

const { app: { DEFAULT_NUM_CHOICES,
            DEFAULT_NUM_QUESTIONS,
            DEFAULT_SCORING_FORMULA  } } = config;

const getAllTests = (req, res) => {
    try {
        const allTests = testService.getAllTests();
        res.send({ status: "OK", data: allTests});
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({status: "FAILED", data: { error: error?.message || error }});
    };
};

const getTestTopics = (req, res) => {
    const {
        params: { testId },
    } = req;

    if (!testId) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: {
                    error: "Parameter ':testId' can not be empty",
                },
            }); 
        return;
    }

    try {
        const testTopics = testService.getTestTopics(testId);
        res.status(200).send({ status: "OK", data: testTopics });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({
                status: "FAILED", data: { error: error?.message || error }});            
    }
};

const createNewTest = (req, res) => {
    const { body } = req;
    const validTopicList = ( body.topicList &&
                            body.topicList.constructor.name == "Array" &&
                            body.topicList.length > 0);

    if ( !body.convocationId && !validTopicList ) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: {
                    error:
                        "The following keys are missing, are empty or are not valid in request body: 'convocationId' and 'topicList'",
                },
            });
        return;
    };

    const topicList = validTopicList? body.topicList : false;
    const validNumQuestions = ( Number.isInteger(body.numQuestions) && body.numQuestions > 0 );
    const numQuestions = validNumQuestions? body.numQuestions : DEFAULT_NUM_QUESTIONS;

    const newTest = {
        numChoices: body.numChoices || DEFAULT_NUM_CHOICES,
        convocationId: body.convocationId,
        questionList: [],
        responses: [],
        scoringFormula: body.scoringFormula || DEFAULT_SCORING_FORMULA,
        score: 0,
        submitted: false
    };

    try {
        const createdTest = testService.createNewTest(newTest, topicList, numQuestions);
        res.status(200).send({ status: "OK", data: createdTest });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error }});
    }
};

const completeOneTest = (req, res) => {
    const {
        params: { testId },
        body: { testResponses }
    } = req;

    if (!testId || !testResponses) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: {
                    error: "Parameter ':testId' and array of responses can not be empty",
                },
            }); 
        return;
    }

    try {
        const completedTest = testService.completeOneTest(testId, testResponses);
        res.status(200).send({ status: "OK", data: completedTest });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({
                status: "FAILED", data: { error: error?.message || error }});            
    }
};

const deleteOneTest = (req, res) => {
    const {
        params: { testId },
    } = req;

    if (!testId) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: {
                    error: "Parameter ':testId' can not be empty",
                },
            }); 
        return;
    }

    try {
        testService.deleteOneTest(testId);
        res.status(204).send({ status: "OK" });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({
                status: "FAILED", data: { error: error?.message || error }});            
    }
};

module.exports = {
    getAllTests,
    getTestTopics,
    createNewTest,
    completeOneTest,
    deleteOneTest
};