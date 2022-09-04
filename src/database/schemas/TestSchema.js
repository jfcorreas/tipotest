const mongoose = require('mongoose');
const { QuestionSchema } = require("./QuestionSchema");
const config = require("../../config");

const { app: { DEFAULT_NUM_CHOICES,
    DEFAULT_SCORING_FORMULA  } } = config;

const Schema = mongoose.Schema;

const TestSchema = new Schema(
    {
        numChoices: { type: String, required: true, default: DEFAULT_NUM_CHOICES },
        convocationId: { type: Schema.Types.ObjectId, ref: 'convocation', required: true },
        questionList: [{ QuestionSchema }],
        responses: [{ type: Number }],
        scoringFormula: { type: String, required: true, default: DEFAULT_SCORING_FORMULA },
        score: { type: Number, required: true, default: 0 },
        submitted: { type: Boolean, required: true, default: false},
        createdAt: { type: Date, required: true, default: new Date().toLocaleString("en-US", { timeZone: "UTC"})},
        updatedAt: { type: Date, required: true, default: new Date().toLocaleString("en-US", { timeZone: "UTC"})}
    }
);

TestSchema.index({ updatedAt: 1 });

const Test = mongoose.model('test', TestSchema);

module.exports = {
    Test
};