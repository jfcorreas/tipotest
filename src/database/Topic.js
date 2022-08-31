
const Topic = require("../database/schemas/TopicSchema");

const getAllTopics = async () => {
    try {
        const allTopics = await Topic.find();
        return allTopics;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};


const getExistingTopics = async (topicIds) => {
    try {
        const existingTopics = await Topic.find({ _id: { $in: topicIds } });
        return existingTopics;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

const getOneTopic = async (topicId) => {
    try {
        const topic = await Topic.findOne({ _id: topicId });
        return topic;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

// TODO: getTopicTests

const createNewTopic = async (newTopic) => {
    try {
        const createdTopic = new Topic(newTopic);
        await Topic.create(createdTopic);
        return createdTopic;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

const updateOneTopic = async (topicId, changes) => {
    try {
        const topicChanges = await Topic.findById(topicId).exec();

        if (!topicChanges) {
            throw {
                status: 400,
                message: `Can't find Topic with the id '${topicId}`
            };            
        }

        topicChanges.title = changes.title;
        topicChanges.shorthand = changes.shorthand;
        topicChanges.fullTitle = changes.fullTitle;
        topicChanges.updatedAt = new Date().toLocaleString("en-US", {timeZone: "UTC"});
            
        const updatedTocic = await topicChanges.save();
        return updatedTocic;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        };
    }
};

const deleteOneTopic = async (topicId) => {
    try {
        // FIXME: Check that no questions have this Topic
        await Topic.deleteOne( { _id: topicId});
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        };
    }
};

module.exports = {
    getAllTopics,
    getExistingTopics,
    getOneTopic,
    createNewTopic,
    updateOneTopic,
    deleteOneTopic
};