const { TopicTest } = require("./schemas/TopicTestSchema");

const getTestTopics = async (testId) => {
    try {
        const testTopics = await TopicTest.find( { testId: testId}, 'topicId' );
        return testTopics.map((element) => element.topicId);
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

const getTopicTests = async (topicId) => {
    try {
        const topicTest = await TopicTest.find( { topicId: topicId}, 'testId' );
        return topicTest.map((element) => element.testId);
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

const createNewTopicsForTest = async (newTopicsForTest) => {
    try {
        const createdTTs = await TopicTest.create(newTopicsForTest);
        return createdTTs;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

const deleteTopicTests = async (deletedTopicId) => {
    try {
        const numberOfDeletions = await TopicTest.deleteMany({topicId: deletedTopicId});
        return numberOfDeletions;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

const deleteTestTopics = async (deletedTestId) => {
    try {
        const numberOfDeletions = await TopicTest.deleteMany({testId: deletedTestId});
        return numberOfDeletions;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

module.exports = {
    getTestTopics,
    getTopicTests,
    createNewTopicsForTest,
    deleteTopicTests,
    deleteTestTopics
}