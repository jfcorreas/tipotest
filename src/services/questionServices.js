const { v4: uuid } = require('uuid');
const QuestionFile = require("../database/QuestionFile");
const Question = require("../database/Question");

const getAllQuestions = async (filterParams) => {
    try {
        const filteredQuestions = await Question.getAllQuestions(filterParams);
        return filteredQuestions;
    } catch (error) {
        throw error;
    }
};

const getQuestionsForTest = (topicId, numQuestions, numAnswers) => {
    try {
        const questionsForTest = QuestionFile.getQuestionsForTest(topicId, numQuestions, numAnswers);
        return questionsForTest;
    } catch (error) {
        throw error;
    }
};

const createNewQuestion = async (newQuestion) => {
    try {
        const createdQuestion = await Question.createNewQuestion(newQuestion);
        return createdQuestion;
    } catch (error) {
        throw error;
    }
};

const updateOneQuestion = async (questionId, changes) => {
    try {
        const updatedQuestion = await Question.updateOneQuestion(questionId, changes);
        return updatedQuestion;
    } catch (error) {
        throw error;
    }
};

const deleteOneQuestion = async (questionId) => {
    try {
        await Question.deleteOneQuestion(questionId);
    } catch (error) {
        throw error;
    }
};

const getQuestionAnswers = (questionId, numAnswers) => {
    try {
        const answers = QuestionFile.getQuestionAnswers(questionId, numAnswers);
        return answers;
    } catch (error) {
        throw error;
    }
};

const addNewAnswer = async (questionId, newAnswer) => {
    try {
        const createdAnswer = await Question.addNewAnswer(questionId, newAnswer);
        return createdAnswer;
    } catch (error) {
        throw error;
    }
};

const updateOneAnswer = async (questionId, answerId, changes) => {
    try {
        const updatedAnswer = await Question.updateOneAnswer(questionId, answerId, changes);
        return updatedAnswer;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllQuestions,
    getQuestionsForTest,
    createNewQuestion,
    updateOneQuestion,
    deleteOneQuestion,
    getQuestionAnswers,
    addNewAnswer,
    updateOneAnswer
};