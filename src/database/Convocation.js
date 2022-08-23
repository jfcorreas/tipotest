const DB = require("./tipotestdb.json");
const { saveToDatabase } = require("./utils");

const getAllConvocations = () => {
    try {
        const allConvocations = DB.convocations;
        return allConvocations;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

const createNewConvocation = (newConvocation) => {
    try {
        DB.convocations.push(newConvocation);
        saveToDatabase(DB);
        return newConvocation;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};
/*
const updateOneTopic = (topicId, changes) => {
    try {
        const title = changes.title;
        const shorthand = changes.shorthand;
        const fullTitle = changes.fullTitle;

        if (!shorthand && !title && !fullTitle) {
            throw {
                status: 400,
                message: `No valid changes requested`
            };
        }

        const indexTopicForUpdate = DB.topics.findIndex(
            (topic) => topic.id === topicId
        );
        if (indexTopicForUpdate === -1) {
            throw {
                status: 400,
                message: `Can't find Topic with the id '${topicId}'`,
            };        
        }        

        const isAlreadyAdded = 
            (DB.topics.findIndex((topic) => topic.title === title ) > -1) ||
            (DB.topics.findIndex((topic) => topic.shorthand === shorthand ) > -1);

        if (isAlreadyAdded) {
            throw {
                status: 400,
                message: `Topic with title: '${title}' or shorthand: '${shorthand}' already exists`,
            };
        }

        const filteredChanges = Object.assign({},
            shorthand === undefined ? null : {shorthand},    
            title === undefined ? null : {title},
            fullTitle === undefined ? null : {fullTitle}
        );

        const updatedTopic = {
            ...DB.topics[indexTopicForUpdate],
            ...filteredChanges,
            updatedAt: new Date().toLocaleString("en-US", {timeZone: "UTC"}),
        };
    
        DB.topics[indexTopicForUpdate] = updatedTopic;
        saveToDatabase(DB);
        return updatedTopic;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        };
    }
}; */

/* const deleteOneTopic = (topicId) => {
    try {
        const indexForDeletion = DB.topics.findIndex(
            (topic) => topic.id === topicId
        );
        if (indexForDeletion === -1) {
            throw {
                status: 400,
                message: `Can't find Topic with the id '${topicId}'`,
            }; 
        }
        DB.topics.splice(indexForDeletion, 1);
        saveToDatabase(DB);
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        };
    }
}; */

module.exports = {
    getAllConvocations,
    createNewConvocation,
    /*updateOneTopic,
    deleteOneTopic */
};