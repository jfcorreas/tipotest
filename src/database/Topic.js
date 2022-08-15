const DB = require("./tipotestdb.json");
const { saveToDatabase } = require("./utils");

const getAllTopics = () => {
    try {
        const allTopics = DB.topics;
        return allTopics;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
}

const createNewTopic = (newTopic) => {
    try {
        const isAlreadyAdded = 
            (DB.topics.findIndex((topic) => topic.title === newTopic.title ) > -1) ||
            (DB.topics.findIndex((topic) => topic.shorthand === newTopic.shorthand ) > -1);

        if (isAlreadyAdded) {
            throw {
                status: 400,
                message: `Topic with title: '${newTopic.title}' or shorthand: '${newTopic.shorthand}' already exists`,
            };
        }

        DB.topics.push(newTopic);
        saveToDatabase(DB);
        return newTopic;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

module.exports = {
    getAllTopics,
    createNewTopic
};