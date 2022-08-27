const testService = require("../services/testServices");

const DEFAULT_NUM_CHOICES = 4;
const DEFAULT_NUM_QUESTIONS = 100;
const DEFAULT_SCORING_FORMULA = "H-(F/4)"

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
        reponses: [],
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
/*
const updateOneConvocation = (req, res) => {
    const {
        body,
        params: { convocationId },
    } = req;

    if (!convocationId) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: {
                    error: "Parameter ':convocationId' can not be empty",
                },
            });
        return; 
    }
    try {
        const updatedConvocation = testService.updateOneConvocation(convocationId, body);
        res.send({ status: "OK", data: updatedConvocation });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({
                status: "FAILED", data: { error: error?.message || error }});        
    }
};

const updateConvocationTopics = (req, res) => {
    const {
        body: { topicList },
        params: { convocationId },
    } = req;

    if (!convocationId || !topicList) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: {
                    error: "Parameter ':convocationId' and property 'topicList' can not be empty",
                },
            }); 
        return;
    }

    if (topicList.constructor.name != "Array") {
        res
        .status(400)
        .send({
            status: "FAILED",
            data: {
                error: "Invalid list of topics",
            },
        });     
        return;            
    };

    try {
        const updatedConvocation = testService.updateConvocationTopics(convocationId, topicList);
        res.send({ status: "OK", data: updatedConvocation });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({
                status: "FAILED", data: { error: error?.message || error }});        
    }
};

const deleteOneConvocation = (req, res) => {
    const {
        params: { convocationId },
    } = req;

    if (!convocationId) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: {
                    error: "Parameter ':convocationId' can not be empty",
                },
            }); 
        return;
    }

    try {
        testService.deleteOneConvocation(convocationId);
        res.status(204).send({ status: "OK" });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({
                status: "FAILED", data: { error: error?.message || error }});            
    }
}; */

module.exports = {
    getAllTests,
    getTestTopics,
    createNewTest,
/*    updateOneConvocation,
    updateConvocationTopics,
    deleteOneConvocation */
};