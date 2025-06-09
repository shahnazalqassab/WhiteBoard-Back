const { Schema } = require('mongoose')

const assignmentSchema = new Schema(
  {
    title: { type: String, required: true },
    material: { type: String, required: true },
    document: { type: String, required: false },
  },
  { _id : false } 
)

const lessonSchema = new Schema(
  {
    title: { type: String, required: true },
    material: { type: String, required: true },
    assignment: {
      type: assignmentSchema,
      required: false,
    }
  },
  { _id : false } 
)

const courseSchema = new Schema(
  {
    name: { type: String, required: true },
    lessons: {
      type: [lessonSchema],
      required: false,
      default: []
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  },
  { timestamps: true }
)

module.exports = courseSchema ;