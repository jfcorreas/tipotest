
const Topic = require("../database/schemas/TopicSchema");
const Question = require("../database/schemas/QuestionSchema");

const getAllTopics = async (filterParams) => {
    try {
        const allTopics = await Topic.find(filterParams);
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
        const existingTopics = await Topic.find({ _id: { $in: topicIds } }, '_id');
        return existingTopics;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

const getTopicById = async (topicId) => {
    try {
        const topic = await Topic.findById(topicId);
        return topic;
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
        const topicToUpdate = await Topic.findById(topicId).exec();

        if (!topicToUpdate) {
            throw {
                status: 400,
                message: `Can't find Topic with the id '${topicId}`
            };            
        }

        if (changes.title) topicToUpdate.title = changes.title;
        if (changes.shorthand) topicToUpdate.shorthand = changes.shorthand;
        if (changes.fullTitle) topicToUpdate.fullTitle = changes.fullTitle;
        topicToUpdate.updatedAt = new Date().toLocaleString("en-US", {timeZone: "UTC"});
            
        const updatedTocic = await topicToUpdate.save();
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
        const questions = await Question.find({ topic: topicId });
        if (questions.length > 0) {
            throw {
                status: 400,
                message: `Can't delete Topic with the id '${topicId}: there are questions associated with it `
            };            
        }
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
    getTopicById,
    createNewTopic,
    updateOneTopic,
    deleteOneTopic
};