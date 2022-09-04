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

module.exports = {
    getAllTests
}