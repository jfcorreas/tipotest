
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

module.exports = {
    getAllTopics,
    createNewTopic,
    updateOneTopic
};