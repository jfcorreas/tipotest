const { TopicTest } = require("./schemas/TopicTestSchema");

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
    createNewTopicsForTest
}