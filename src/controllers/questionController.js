const questionService = require("../services/questionServices");

const getAllQuestions = (req, res) => {
    const { topic } = req.query;
    try {
        const allQuestions = questionService.getAllQuestions({ topic });
        res.send({ status: "OK", data: allQuestions});
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({status: "FAILED", data: { error: error?.message || error }});
    };
};

const createNewQuestion = (req, res) => {
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
                        `One of the following keys is missing or is empty
                        in request body: 'text' or 'topic'`,
                },
            });
        return;
    };

    const newQuestion = {
        text: body.text,
        topic: body.topic,
    };

    try {
        const createdQuestion = questionService.createNewQuestion(newQuestion);
        res.status(200).send({ status: "OK", data: createdQuestion });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error }});
    }
};

module.exports = {
    getAllQuestions,
    createNewQuestion,
};