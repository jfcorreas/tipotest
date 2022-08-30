const Question = require("../database/schemas/QuestionSchema");

const getAllQuestions = async (filterParams) => {
    try {
        const allQuestions = await Question.find();
        return allQuestions;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

module.exports = {
    getAllQuestions,
};