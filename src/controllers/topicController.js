const topicService = require("../services/topicServices");

const getAllTopics = (req, res) => {
    try {
        const allTopics = topicService.getAllTopics();
        res.send({ status: "OK", data: allTopics});
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({status: "FAILED", data: { error: error?.message || error }});
    };
};

const createNewTopic = (req, res) => {
    const { body } = req;

    if (
        !body.title ||
        !body.shorthand
    ) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: {
                    error:
                        `One of the following keys is missing or is empty
                        in request body: 'title', 'shorthand'`,
                },
            });
        return;
    };

    const newTopic = {
        title: body.title,
        shorthand: body.shorthand,
        fullTitle: body.fullTitle
    };

    try {
        const createdTopic = topicService.createNewTopic(newTopic);
        res.status(200).send({ status: "OK", data: createdTopic });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error }});
    }
};

module.exports = {
    getAllTopics,
    createNewTopic,
};