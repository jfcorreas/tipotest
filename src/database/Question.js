const { Question, Answer } = require("../database/schemas/QuestionSchema");
const Topic = require("../database/Topic");

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

const createNewQuestion = async (newQuestion) => {
    try {
        const createdQuestion = new Question(newQuestion);
        await Question.create(createdQuestion);
        return createdQuestion;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

const updateOneQuestion = async (questionId, changes) => {
    try {
        const questionChanges = await Question.findById(questionId).exec();
        if (!questionChanges) {
            throw {
                status: 400,
                message: `Can't find Question with the id '${questionId}`
            };            
        }

        const topic = await Topic.getOneTopic(changes.topic);

        questionChanges.text = changes.text? changes.text : questionChanges.text;
        questionChanges.topic = topic? topic._id : questionChanges.topic;
        questionChanges.updatedAt = new Date().toLocaleString("en-US", {timeZone: "UTC"});

        const updatedQuestion = await questionChanges.save();
        return updatedQuestion;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        };
    }
};

const deleteOneQuestion = async (questionId) => {
    try {
        await Question.findByIdAndDelete(questionId);
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        };
    }
};

const addNewAnswer = async (questionId, newAnswer) => {
    try {
        const question = await Question.findById(questionId).exec();
        if (!question) {
            throw {
                status: 400,
                message: `Can't find Question with the id '${questionId}`
            };            
        }

        const existingAnswer = await Question.findOne( { _id: question._id, "answers.text": newAnswer.text} ).exec();

        if (existingAnswer) {
            throw {
                status: 400,
                message: `Answer with text: '${newAnswer.text}' already exists for question with id: '${questionId}'`,
            };
        }

        const createdAnswer = new Answer(newAnswer);

        question.answers.push(createdAnswer);
        question.updatedAt = new Date().toLocaleString("en-US", {timeZone: "UTC"});
        await question.save();

        return createdAnswer;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

const updateOneAnswer = async (questionId, answerId, changes) => {
    try {
        const question = await Question.findById(questionId).exec();
        if (!question) {
            throw {
                status: 400,
                message: `Can't find Question with the id '${questionId}`
            };            
        }

        const questionToUpdate = await Question.findOne( { _id: question._id, "answers._id": answerId} ).exec();
        if (!questionToUpdate) {
            throw {
                status: 400,
                message: `Can't find Answer with the id '${answerId}`
            };            
        }

        const isAlreadyAdded = questionToUpdate.answers.findIndex((answer) => (answer.text === changes.text)) > -1;
        // FIXME: don't check the text in the answer to be updated

        if (isAlreadyAdded) {
            throw {
                status: 400,
                message: `Answer with text: '${changes.text}' already exists for question with id: '${questionId}'`,
            };
        } 

        changes.text = changes.text? changes.text : questionToUpdate.answers.id(answerId).text;
        changes.isCorrect = changes.isCorrect != undefined? changes.isCorrect : questionToUpdate.answers.id(answerId).isCorrect;

        await Question.updateOne({ _id: questionId, "answers._id": answerId}, {
            "$set": {
                "answers.$.text": changes.text,
                "answers.$.isCorrect": changes.isCorrect,
                "answers.$.updatedAt": new Date().toLocaleString("en-US", {timeZone: "UTC"}),
                "updatedAt": new Date().toLocaleString("en-US", {timeZone: "UTC"})
            }
        });

        const updatedQuestion = await Question.findById(questionId).exec();
        return updatedQuestion;
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
    updateOneQuestion,
    deleteOneQuestion,
    addNewAnswer,
    updateOneAnswer
};