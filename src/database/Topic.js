
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

module.exports = {
    getAllTopics
};