const Question = require("../database/Question");

const getAllQuestions = async (filterParams) => {
    try {
        const filteredQuestions = await Question.getAllQuestions(filterParams);
        return filteredQuestions;
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

const getQuestionAnswers = async (questionId, numAnswers, apiCall = true) => {
    try {
        const allAnswers = await Question.getAllQuestionAnswers(questionId);
        
        if (!numAnswers || numAnswers < 2) {
            return allAnswers;
        }

        const { trueAnswers, falseAnswers } = 
            allAnswers.reduce((r, answer) => {
                r[answer.isCorrect ? 'trueAnswers' : 'falseAnswers'].push(answer);
                return r;
            }, { trueAnswers: [], falseAnswers: [] });

        if (!trueAnswers) {
            if (apiCall) {
                throw {
                    status: 400,
                    message: `Question with id: '${questionId}' doesn't have any valid answer'`,
                };             
            }
            return false;
        }            

        if (falseAnswers.length < (numAnswers - 1)) {
            if (apiCall) {
                throw {
                    status: 400,
                    message: `Question with id: '${questionId}' doesn't have enough false answers'`,
                };            
            }
            return false;
        }

        let answers = new Array(trueAnswers[[trueAnswers.length * Math.random() | 0]]);

        let falseAnswersLeft = numAnswers - 1;
        while (falseAnswersLeft-- && falseAnswers.length > 0) {
            answers.push(falseAnswers.splice([[falseAnswers.length * Math.random() | 0]], 1).pop());
        }       

        const suffleIndex = answers.length * Math.random() | 0;
        if (suffleIndex > 0) {
            const tempElem = answers[suffleIndex];
            answers[suffleIndex] = answers[0];
            answers[0] = tempElem;
        }

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

const deleteOneAnswer = async (questionId, answerId) => {
    try {
        const questionAfterDelete = await Question.deleteOneAnswer(questionId, answerId);
        return questionAfterDelete;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllQuestions,
    createNewQuestion,
    updateOneQuestion,
    deleteOneQuestion,
    getQuestionAnswers,
    addNewAnswer,
    updateOneAnswer,
    deleteOneAnswer
};