const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ConvocationSchema = new Schema(
  {
    name: { type: String, required: true },
    year: { type: String, required: true },
    institution: { type: String, required: true },
    category: { type: String, required: true },
    topicList: [{ type: Schema.Types.ObjectId, ref: 'topic' }],
    createdAt: { type: Date, required: true, default: new Date().toLocaleString('en-US', { timeZone: 'UTC' }) },
    updatedAt: { type: Date, required: true, default: new Date().toLocaleString('en-US', { timeZone: 'UTC' }) }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
)

ConvocationSchema.virtual('fullName').get(function () {
  return this.name + ' ' + this.year + ' - ' + this.institution + ' - ' + this.category
})

ConvocationSchema.index({ name: 1, year: 1, institution: 1, category: 1 }, { unique: true })

const Convocation = mongoose.model('convocation', ConvocationSchema)

module.exports = {
  Convocation
}
