const DB = require("./tipotestdb.json");
const { saveToDatabase } = require("./utils");

const getAllQuestions = (filterParams) => {
    try {
        let questions = [...DB.questions];
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

const getQuestionsForTest = (topicId, numQuestions, numAnswers) => {
    try {
        let questions = structuredClone(DB.questions);

        if (topicId) {
            questions = questions.filter((question) => question.topic === topicId);
        }

        while (questions.length > numQuestions) {
            questions.splice([[questions.length * Math.random() | 0]],1);
        }

        questions.forEach( question => {
            question.answers = getQuestionAnswers(question.id, numAnswers, false);
            if (!question.answers) {
                const badQuestionIndex = questions.findIndex( (element) => element.id == question.id);
                questions.splice(badQuestionIndex, 1);
            }
        });

        return questions;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

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

const updateOneQuestion = (questionId, changes) => {
    try {
        const topic = changes.topic;
        const text = changes.text;

        if (!text && !topic) {
            throw {
                status: 400,
                message: `No valid changes requested`
            };
        } 

        if (topic) {
            const topicExists = DB.topics.findIndex((topicIndex) => topicIndex.id === topic) > -1;

            if (!topicExists) {
                throw {
                    status: 400,
                    message: `Does not exists any topic with id: ${topic}`
                };
            }            
        } 

        const indexQuestionForUpdate = DB.questions.findIndex(
            (question) => question.id === questionId
        );
        if (indexQuestionForUpdate === -1) {
            throw {
                status: 400,
                message: `Can't find Question with the id '${questionId}'`,
            };        
        }

        const currentTopic = DB.questions[indexQuestionForUpdate].topic;

        const isAlreadyAdded = 
        DB.questions.findIndex((question) => 
            (question.text === text) && (question.topic === (topic ? topic : currentTopic))) > -1;

        if (isAlreadyAdded) {
            throw {
                status: 400,
                message: `Question with text: '${text}' already exists for topic: '${topic ? topic : currentTopic}'`,
            };
        }

        const filteredChanges = Object.assign({},
            text === undefined ? null : {text},    
            topic === undefined ? null : {topic},
        );

        const updatedQuestion = {
            ...DB.questions[indexQuestionForUpdate],
            ...filteredChanges,
            updatedAt: new Date().toLocaleString("en-US", {timeZone: "UTC"}),
        };
    
        DB.questions[indexQuestionForUpdate] = updatedQuestion;
        saveToDatabase(DB);
        return updatedQuestion;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        };
    }
};

const deleteOneQuestion = (questionId) => {
    try {
        const indexForDeletion = DB.questions.findIndex(
            (question) => question.id === questionId
        );
        if (indexForDeletion === -1) {
            throw {
                status: 400,
                message: `Can't find Question with the id '${questionId}'`,
            }; 
        }
        DB.questions.splice(indexForDeletion, 1);
        saveToDatabase(DB);
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        };
    }
};

const getQuestionAnswers = (questionId, numAnswers, apiCall = true) => {
    try {
        const allAnswers = (DB.questions.find((question) => question.id === questionId )).answers;

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

const updateOneAnswer = (questionId, answerId, changes) => {
    try {
        
        const text = changes.text;
        const isCorrect = changes.isCorrect === undefined ? undefined : Boolean(changes.isCorrect);

        if (!text && isCorrect === undefined) {
            throw {
                status: 400,
                message: `No valid changes requested`
            };
        } 
        
        const indexQuestionForUpdate = DB.questions.findIndex(
            (question) => question.id === questionId
        );
        if (indexQuestionForUpdate === -1) {
            throw {
                status: 400,
                message: `Can't find Question with the id '${questionId}'`,
            };        
        }

        const indexForUpdate = DB.questions[indexQuestionForUpdate].answers.findIndex(
            (answer) => answer.id === answerId
        );
        if (indexForUpdate === -1) {
            throw {
                status: 400,
                message: `Can't find Answer with the id '${answerId}'`,
            };        
        }       
        let updatedQuestion = DB.questions[indexQuestionForUpdate];
        const isAlreadyAdded = updatedQuestion.answers.findIndex((answer) => (answer.text === text)) > -1;

        if (isAlreadyAdded) {
            throw {
                status: 400,
                message: `Answer with text: '${text}' already exists for question with id: '${questionId}'`,
            };
        } 

        const filteredChanges = Object.assign({},
            text === undefined ? null : {text},    
            isCorrect === undefined ? null : {isCorrect},
        );

        const updatedAnswer = {
            ...updatedQuestion.answers[indexForUpdate],
            ...filteredChanges,
            updatedAt: new Date().toLocaleString("en-US", {timeZone: "UTC"}),
        };

        updatedQuestion.answers[indexForUpdate] = updatedAnswer;
        updatedQuestion = {
            ...updatedQuestion,
            updatedAt: new Date().toLocaleString("en-US", {timeZone: "UTC"}),
        }
    
        DB.questions[indexQuestionForUpdate] = updatedQuestion;
        saveToDatabase(DB);
        return updatedAnswer;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        };
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