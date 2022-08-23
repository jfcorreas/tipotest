const convocationService = require("../services/convocationServices");

const getAllConvocations = (req, res) => {
    try {
        const allConvocations = convocationService.getAllConvocations();
        res.send({ status: "OK", data: allConvocations});
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({status: "FAILED", data: { error: error?.message || error }});
    };
};

const createNewConvocation = (req, res) => {
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
        const createdConvocation = convocationService.createNewConvocation(newConvocation);
        res.status(200).send({ status: "OK", data: createdConvocation });
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

/*const deleteOneTopic = (req, res) => {
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
    }

    try {
        convocationService.deleteOneTopic(convocationId);
        res.status(204).send({ status: "OK" });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({
                status: "FAILED", data: { error: error?.message || error }});            
    }
}; */

module.exports = {
    getAllConvocations,
    createNewConvocation,
    updateOneConvocation,
/*    deleteOneTopic */
};