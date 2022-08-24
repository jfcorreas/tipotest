const DB = require("./tipotestdb.json");
const { saveToDatabase } = require("./utils");

const getAllTests = () => {
    try {
        const allTests = DB.tests;
        return allTests;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};
/*
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

const updateOneConvocation = (convocationId, changes) => {
    try {
        const name = changes.name;
        const year = changes.year;
        const institution = changes.institution;
        const category = changes.category;

        if (!year && !name && !institution && !category) {
            throw {
                status: 400,
                message: `No valid changes requested`
            };
        }

        const indexConvocationForUpdate = DB.convocations.findIndex(
            (convocation) => convocation.id === convocationId
        );
        if (indexConvocationForUpdate === -1) {
            throw {
                status: 400,
                message: `Can't find Convocation with the id '${convocationId}'`,
            };        
        }        

        const filteredChanges = Object.assign({},
            year === undefined ? null : {year},    
            name === undefined ? null : {name},
            institution === undefined ? null : {institution},
            category === undefined ? null : {category}
        );

        const updatedConvocation = {
            ...DB.convocations[indexConvocationForUpdate],
            ...filteredChanges,
            updatedAt: new Date().toLocaleString("en-US", {timeZone: "UTC"}),
        };
    
        DB.convocations[indexConvocationForUpdate] = updatedConvocation;
        saveToDatabase(DB);
        return updatedConvocation;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        };
    }
};

const updateConvocationTopics = (convocationId, topics) => {
    try {

        if (topics.constructor.name != "Array") {
            throw {
                status: 400,
                message: `Invalid list of topics`
            };
        }

        const indexConvocationForUpdate = DB.convocations.findIndex(
            (convocation) => convocation.id === convocationId
        );
        if (indexConvocationForUpdate === -1) {
            throw {
                status: 400,
                message: `Can't find Convocation with the id '${convocationId}'`,
            };        
        }        

        filteredTopics = topics.filter(Topic.topicExists);

        const updatedConvocation = {
            ...DB.convocations[indexConvocationForUpdate],
            topicList: filteredTopics,
            updatedAt: new Date().toLocaleString("en-US", {timeZone: "UTC"}),
        };
    
        DB.convocations[indexConvocationForUpdate] = updatedConvocation;
        saveToDatabase(DB);
        return updatedConvocation;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        };
    }
};

const deleteOneConvocation = (convocationId) => {
    try {
        const indexForDeletion = DB.convocations.findIndex(
            (convocation) => convocation.id === convocationId
        );
        if (indexForDeletion === -1) {
            throw {
                status: 400,
                message: `Can't find Convocation with the id '${convocationId}'`,
            }; 
        }
        DB.convocations.splice(indexForDeletion, 1);
        saveToDatabase(DB);
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        };
    }
}; */

module.exports = {
    getAllTests,
/*     createNewConvocation,
    updateOneConvocation,
    updateConvocationTopics,
    deleteOneConvocation */
};