const { Convocation } = require("../database/schemas/ConvocationSchema");
const Topic = require("../database/schemas/TopicSchema");

const getAllConvocations = async (filterParams) => {
    try {
        const allConvocations = await Convocation.find(filterParams);
        return allConvocations;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

const getConvocationById = async (convocationId) => {
    try {
        const convocation = await Convocation.findById(convocationId);
        return convocation;
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

const updateOneConvocation = async (convocationId, changes) => {
    try {
        const convocationToUpdate = await Convocation.findById(convocationId).exec();

        if (!convocationToUpdate) {
            throw {
                status: 400,
                message: `Can't find Convocation with the id '${convocationId}`
            };            
        }

        if (changes.name) convocationToUpdate.name = changes.name;
        if (changes.year) convocationToUpdate.year = changes.year;
        if (changes.institution) convocationToUpdate.institution = changes.institution;
        if (changes.category) convocationToUpdate.category = changes.category;
        convocationToUpdate.updatedAt = new Date().toLocaleString("en-US", {timeZone: "UTC"});
            
        const updatedConvocation = await convocationToUpdate.save();
        return updatedConvocation;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        };
    }
};

const updateOneConvocationTopics = async (convocationId, topics) => {
    try {

        if (topics.constructor.name != "Array") {
            throw {
                status: 400,
                message: `Invalid list of topics`
            };
        }

        const convocationToUpdate = await Convocation.findById(convocationId).exec();

        if (!convocationToUpdate) {
            throw {
                status: 400,
                message: `Can't find Convocation with the id '${convocationId}`
            };            
        }

        const uniqueTopics = new Set(topics);

        if (topics.length > uniqueTopics.size) {
            throw {
                status: 400,
                message: `Found duplicated topics`
            };
        }        
        
        const existentTopics = await Topic.find({ _id: { $in: topics } }, "_id" );
        const filteredTopics = existentTopics.map( (topic) => {
            return topic._id;
        });

        convocationToUpdate.topicList = filteredTopics; 
        convocationToUpdate.updatedAt = new Date().toLocaleString("en-US", {timeZone: "UTC"});
            
        const updatedConvocation = await convocationToUpdate.save();
        return updatedConvocation;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        };
    }
};

const deleteOneConvocation = async (convocationId) => {
    try {
        await Convocation.deleteOne({ _id: convocationId });
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

module.exports = {
    getAllConvocations,
    getConvocationById,
    createNewConvocation,
    updateOneConvocation,
    updateOneConvocationTopics,
    deleteOneConvocation
};