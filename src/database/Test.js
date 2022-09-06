const { Test } = require("./schemas/TestSchema");

const getAllTests = async () => {
    try {
        const allTests = await Test.find({});
        return allTests;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

const createNewTest = async (newTest) => {
    try {
        const createdTest = new Test(newTest);
        await Test.create(createdTest);
        return createdTest;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

module.exports = {
    getAllTests,
    createNewTest
}