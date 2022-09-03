const convocationService = require("../services/convocationServices");

const getAllConvocations = async (req, res) => {
    let {
        query: { name, year, institution, category }
    } = req;

    let filterParams = {};
    if (year || name || institution || category) {

        name = name? new RegExp( name, "i") : undefined;
        institution = institution? new RegExp( institution, "i") : undefined;
        year = year? new RegExp( year, "i") : undefined;
        category = category? new RegExp( category, "i") : undefined;

        filterParams = Object.assign({},
            name === undefined ? null : {name},    
            year === undefined ? null : {year},
            institution === undefined ? null : {institution},
            category === undefined ? null : {category}
        );
    }     
    try {
        const allConvocations = await convocationService.getAllConvocations(filterParams);
        res.send({ status: "OK", data: allConvocations});
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({status: "FAILED", data: { error: error?.message || error }});
    };
};

const getConvocationById = async (req, res) => {
    const {
        params: { convocationId },
    } = req;

    if (!convocationId) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: {
                    error: "Parameter ':convocationId' can not be empty",
                },
            });
        return; 
    }    
    try {
        const convocationReq = await convocationService.getConvocationById(convocationId);
        res.send({ status: "OK", data: convocationReq});
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({status: "FAILED", data: { error: error?.message || error }});
    };
};

const createNewConvocation = async (req, res) => {
    const { body } = req;

    if (
        !body.name ||
        !body.year ||
        !body.institution ||
        !body.category
    ) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: {
                    error:
                        "One of the following keys is missing or is empty in request body: 'name', 'year', 'institution', 'category'",
                },
            });
        return;
    };

    const newConvocation = {
        name: body.name,
        year: body.year,
        institution: body.institution,
        category: body.category,
        topicList: []
    };

    try {
        const createdConvocation = await convocationService.createNewConvocation(newConvocation);
        res.status(201).send({ status: "OK", data: createdConvocation });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error }});
    }
};

const updateOneConvocation = (req, res) => {
    const {
        body,
        params: { convocationId },
    } = req;

    if (!convocationId) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: {
                    error: "Parameter ':convocationId' can not be empty",
                },
            });
        return; 
    }
    try {
        const updatedConvocation = convocationService.updateOneConvocation(convocationId, body);
        res.send({ status: "OK", data: updatedConvocation });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({
                status: "FAILED", data: { error: error?.message || error }});        
    }
};

const updateConvocationTopics = (req, res) => {
    const {
        body: { topicList },
        params: { convocationId },
    } = req;

    if (!convocationId || !topicList) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: {
                    error: "Parameter ':convocationId' and property 'topicList' can not be empty",
                },
            }); 
        return;
    }

    if (topicList.constructor.name != "Array") {
        res
        .status(400)
        .send({
            status: "FAILED",
            data: {
                error: "Invalid list of topics",
            },
        });     
        return;            
    };

    try {
        const updatedConvocation = convocationService.updateConvocationTopics(convocationId, topicList);
        res.send({ status: "OK", data: updatedConvocation });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({
                status: "FAILED", data: { error: error?.message || error }});        
    }
};

const deleteOneConvocation = async (req, res) => {
    const {
        params: { convocationId },
    } = req;

    if (!convocationId) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: {
                    error: "Parameter ':convocationId' can not be empty",
                },
            }); 
        return;
    }

    try {
        await convocationService.deleteOneConvocation(convocationId);
        res.status(204).send({ status: "OK" });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({
                status: "FAILED", data: { error: error?.message || error }});            
    }
};

module.exports = {
    getAllConvocations,
    getConvocationById,
    createNewConvocation,
    updateOneConvocation,
    updateConvocationTopics,
    deleteOneConvocation
};