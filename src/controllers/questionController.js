const questionService = require("../services/questionServices");

const getAllQuestions = async (req, res) => {
    const { topicId } = req.query;
    const filterParams = topicId? { topic: topicId} : {};
    try {
        const allQuestions = await questionService.getAllQuestions(filterParams);
        res.send({ status: "OK", data: allQuestions});
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({status: "FAILED", data: { error: error?.message || error }});
    };
};

const createNewQuestion = async (req, res) => {
    const { body } = req;

    if (
        !body.text ||
        !body.topic
    ) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: {
                    error:
                        "One of the following keys is missing or is empty in request body: 'text' or 'topic'",
                },
            });
        return;
    };

    const newQuestion = {
        text: body.text,
        topic: body.topic,
        answers: [],
    };

    try {
        const createdQuestion = await questionService.createNewQuestion(newQuestion);
        res.status(201).send({ status: "OK", data: createdQuestion });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error }});
    }
};

const updateOneQuestion = async (req, res) => {
    const {
        body,
        params: { questionId },
    } = req;

    if (!questionId) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: {
                    error: "Parameter ':questionId' can not be empty",
                },
            }); 
        return;
    }

    const changes = {
        text: body.text,
        topic: body.topic,
    };

    try {
        const updatedQuestion = await questionService.updateOneQuestion(questionId, changes);
        res.send({ status: "OK", data: updatedQuestion });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({
                status: "FAILED", data: { error: error?.message || error }});        
    }
};

const deleteOneQuestion = async (req, res) => {
    const {
        params: { questionId },
    } = req;

    if (!questionId) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: {
                    error: "Parameter ':questionId' can not be empty",
                },
            }); 
        return;
    }

    try {
        await questionService.deleteOneQuestion(questionId);
        res.status(204).send({ status: "OK" });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({
                status: "FAILED", data: { error: error?.message || error }});            
    }
};

const getQuestionAnswers = async (req, res) => {
    const { questionId } = req.params;
    const { numAnswers } = req.query;
    
    try {
        const answers = await questionService.getQuestionAnswers(questionId, numAnswers);
        res.send({ status: "OK", data: answers});
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({status: "FAILED", data: { error: error?.message || error }});
    };
};

const addNewAnswer = async (req, res) => {
    const {
        params: { questionId },
        body
    } = req;

    if (!questionId) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: {
                    error: "Parameter ':questionId' can not be empty",
                },
            });    
        return;
    }

    if (
        !body.text ||
        body.isCorrect === undefined
    ) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: {
                    error:
                        "One of the following keys is missing or is empty in request body: 'text' or 'isCorrect'",
                },
            });
        return;
    };

    const newAnswer = {
        text: body.text,
        isCorrect: Boolean(body.isCorrect),
    };

    try {
        const addedAnswer = await questionService.addNewAnswer(questionId, newAnswer);
        res.status(201).send({ status: "OK", data: addedAnswer });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error }});
    }
};

const updateOneAnswer = async (req, res) => {
    const {
        body,
        params: { questionId, answerId },
    } = req;

    if (!questionId || !answerId) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: {
                    error: "Parameters ':questionId' and ':answerId' can not be empty",
                },
            }); 
        return;
    }

    const changes = {
        text: body.text,
        isCorrect: body.isCorrect,
    };    

    try {
        const updatedAnswer = await questionService.updateOneAnswer(questionId, answerId, changes);
        res.send({ status: "OK", data: updatedAnswer });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({
                status: "FAILED", data: { error: error?.message || error }});        
    }
};

const deleteOneAnswer = async (req, res) => {
    const {
        params: { questionId, answerId },
    } = req;

    if (!questionId || !answerId) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: {
                    error: "Parameters ':questionId' and ':answerId' can not be empty",
                },
            }); 
        return;
    }

    try {
        const questionAfterDelete = await questionService.deleteOneAnswer(questionId, answerId);
        res.send({ status: "OK", data: questionAfterDelete });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({
                status: "FAILED", data: { error: error?.message || error }});            
    }
};

module.exports = {
    getAllQuestions,
    createNewQuestion,
    updateOneQuestion,
    deleteOneQuestion,
    getQuestionAnswers,
    addNewAnswer,
    updateOneAnswer,
    deleteOneAnswer
};