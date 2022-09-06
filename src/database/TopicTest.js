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

module.exports = {
    getTestTopics,
    createNewTopicsForTest
}