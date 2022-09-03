const { Convocation } = require("../database/schemas/ConvocationSchema");
//const Topic = require("../database/Topic");

const getAllConvocations = async (filterParams) => {
    try {
        const allQuestions = await Question.find(filterParams);
        return allQuestions;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

const createNewConvocation = async (newConvocation) => {
    try {
        const createdConvocation = new Convocation(newConvocation);
        await Convocation.create(createdConvocation);
        return createdConvocation;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

module.exports = {
    createNewConvocation
};