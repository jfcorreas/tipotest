const topicService = require("../services/topicServices");

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
        res.status(200).send({ status: "OK", data: newTopic });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error }});
    }
};

module.exports = {
    createNewTopic,
};