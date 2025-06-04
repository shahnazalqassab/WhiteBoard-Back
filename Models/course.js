const { Schema } = require('mongoose')

const courseSchema = new Schema(
  {
    name: { type: String, required: true },
    lessons: {
      title: { type: String,  required: true },
      material: { type: String, required: true },
      assignment: {
        title: { type: String, required: true },
        material: { type: String, required: true },
        document: { type: String, required: false },
      }},
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  },
  { timestamps: true }
)

module.exports = courseSchema ;