const mongoose = require('mongoose')
const config = require('../../config')

const {
  app: {
    DEFAULT_NUM_CHOICES,
    DEFAULT_SCORING_FORMULA
  }
} = config

const Schema = mongoose.Schema

const TestSchema = new Schema(
  {
    numChoices: { type: String, required: true, default: DEFAULT_NUM_CHOICES },
    convocationId: { type: Schema.Types.ObjectId, ref: 'convocation' },
    questionList: [{
      text: { type: String, required: true },
      topic: { type: Schema.Types.ObjectId, ref: 'topic', required: true },
      answers: [{
        text: { type: String, required: true },
        isCorrect: { type: Boolean, required: true, default: false }
      }]
    }],
    responses: [{ type: Number }],
    scoringFormula: { type: String, required: true, default: DEFAULT_SCORING_FORMULA },
    score: { type: Number, required: true, default: -1 },
    submitted: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, required: true, default: new Date() },
    updatedAt: { type: Date, required: true, default: new Date() }
  }
)

TestSchema.index({ updatedAt: 1 })

const Test = mongoose.model('test', TestSchema)

module.exports = {
  Test
}
