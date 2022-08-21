const DB = require("./tipotestdb.json");
const { saveToDatabase } = require("./utils");

const getAllQuestions = (filterParams) => {
    try {
        let questions = DB.questions;
        if (filterParams.topic) {
            questions = questions.filter((question) => question.topic === filterParams.topic);
        }
        return questions;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
}

const createNewQuestion = (newQuestion) => {
    try {
        const topicExists = DB.topics.findIndex((topic) => topic.id === newQuestion.topic) > -1;

        if (!topicExists) {
            throw {
                status: 400,
                message: `Does not exists any topic with id: ${newQuestion.topic}`
            };
        }

        const isAlreadyAdded = 
            DB.questions.findIndex((question) => 
                (question.text === newQuestion.text) && (question.topic === newQuestion.topic)) > -1;

        if (isAlreadyAdded) {
            throw {
                status: 400,
                message: `Question with text: '${newQuestion.text}' already exists for topic: '${newQuestion.topic}'`,
            };
        }

        DB.questions.push(newQuestion);
        saveToDatabase(DB);
        return newQuestion;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

const getQuestionAnswers = (questionId, numAnswers) => {
    try {
        const allAnswers = (DB.questions.find((question) => question.id === questionId )).answers;

        const { trueAnswers, falseAnswers } = 
            allAnswers.reduce((r, answer) => {
                r[answer.isCorrect ? 'trueAnswers' : 'falseAnswers'].push(answer);
                return r;
            }, { trueAnswers: [], falseAnswers: [] });

        if (!trueAnswers) {
            throw {
                status: 400,
                message: `Question with id: '${questionId}' doesn't have any valid answer'`,
            };             
        }            

        if (falseAnswers.length < (numAnswers - 1)) {
            throw {
                status: 400,
                message: `Question with id: '${questionId}' doesn't have enough false answers'`,
            };            
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
        throw {
            status: error?.status || 500,
            message: error?.message || error
        }
    }
};

const addNewAnswer = (questionId, newAnswer) => {
    try {
        const questionIndex = DB.questions.findIndex((question) => question.id === questionId);

        if (questionIndex === -1) {
            throw {
                status: 400,
                message: `Does not exists any question with id: ${questionId}`
            };
        }

        let updatedQuestion = DB.questions[questionIndex];
        const isAlreadyAdded = updatedQuestion.answers.findIndex((answer) => (answer.text === newAnswer.text)) > -1;

        if (isAlreadyAdded) {
            throw {
                status: 400,
                message: `Answer with text: '${newAnswer.text}' already exists for question with id: '${questionId}'`,
            };
        }
        updatedQuestion.answers.push(newAnswer);
        updatedQuestion = {
            ...updatedQuestion,
            updatedAt: new Date().toLocaleString("en-US", {timeZone: "UTC"}),
        }
        DB.questions[questionIndex] = updatedQuestion;
        saveToDatabase(DB);
        return newAnswer;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

module.exports = {
    getAllQuestions,
    createNewQuestion,
    getQuestionAnswers,
    addNewAnswer
};