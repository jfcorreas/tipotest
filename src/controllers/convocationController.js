const convocationService = require("../services/convocationServices");

const getAllConvocations = (req, res) => {
    try {
        const allConvocations = convocationService.getAllConvocations();
        res.send({ status: "OK", data: allConvocations});
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({status: "FAILED", data: { error: error?.message || error }});
    };
};

/* const createNewTopic = (req, res) => {
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
        const createdTopic = convocationService.createNewTopic(newTopic);
        res.status(200).send({ status: "OK", data: createdTopic });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error }});
    }
};

const updateOneTopic = (req, res) => {
    const {
        body,
        params: { topicId },
    } = req;

    if (!topicId) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: {
                    error: "Parameter ':topicId' can not be empty",
                },
            }); 
    }
    try {
        const updatedTopic = convocationService.updateOneTopic(topicId, body);
        res.send({ status: "OK", data: updatedTopic });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({
                status: "FAILED", data: { error: error?.message || error }});        
    }
};

const deleteOneTopic = (req, res) => {
    const {
        params: { topicId },
    } = req;

    if (!topicId) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: {
                    error: "Parameter ':topicId' can not be empty",
                },
            }); 
    }

    try {
        convocationService.deleteOneTopic(topicId);
        res.status(204).send({ status: "OK" });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({
                status: "FAILED", data: { error: error?.message || error }});            
    }
}; */

module.exports = {
    getAllConvocations,
/*     createNewTopic,
    updateOneTopic,
    deleteOneTopic */
};