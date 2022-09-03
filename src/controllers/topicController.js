const topicService = require("../services/topicServices");

const getAllTopics = async (req, res) => {
    try {
        // TODO: implement filters
        /*     let filters;
    if (body.shorthand || body.title || body.fullTitle) {
        filters = Object.assign({},
            title === undefined ? null : {title},    
            shorthand === undefined ? null : {shorthand},
            fullTitle === undefined ? null : {fullTitle}
        );
    }     */
        const allTopics = await topicService.getAllTopics();
        res.send({ status: "OK", data: allTopics});
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({status: "FAILED", data: { error: error?.message || error }});
    };
};

const getOneTopic = async (req, res) => {
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
        return;
    }

    try {
        const topic = await topicService.getOneTopic(topicId);
        res.send({ status: "OK", data: topic});
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({status: "FAILED", data: { error: error?.message || error }});
    };
};

const createNewTopic = async (req, res) => {
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
                        "One of the following keys is missing or is empty in request body: 'title', 'shorthand'",
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
        const createdTopic = await topicService.createNewTopic(newTopic);
        res.status(201).send({ status: "OK", data: createdTopic });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error }});
    }
};

const updateOneTopic = async (req, res) => {
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
        return;
    }

    const changes = {
        title: body.title,
        shorthand: body.shorthand,
        fullTitle: body.fullTitle
    };

    if (!changes.shorthand && !changes.title && !changes.fullTitle) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: {
                    error: "No valid changes requested",
                },
            }); 
        return;        
    }

    try {
        const updatedTopic = await topicService.updateOneTopic(topicId, changes);
        res.send({ status: "OK", data: updatedTopic });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({
                status: "FAILED", data: { error: error?.message || error }});        
    }
};

const deleteOneTopic = async (req, res) => {
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
        return;
    }

    try {
        await topicService.deleteOneTopic(topicId);
        res.status(204).send({ status: "OK" });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({
                status: "FAILED", data: { error: error?.message || error }});            
    }
};

const getTopicTests = (req, res) => {
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
        return;
    }

    try {
        const topicTests = topicService.getTopicTests(topicId);
        res.status(200).send({ status: "OK", data: topicTests });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({
                status: "FAILED", data: { error: error?.message || error }});            
    }
};

module.exports = {
    getAllTopics,
    getOneTopic,
    createNewTopic,
    updateOneTopic,
    deleteOneTopic,
    getTopicTests
};