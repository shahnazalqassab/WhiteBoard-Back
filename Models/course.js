const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lessons: {
      title: { type: String,  required: true },
      material: { type: String, required: true },
      assignment: {
        title: {
          type: String,
          required: true
        },
        material: {
          type: String,
          required: true
        },
        document: {
          type: String,
          required: true
        }
      }
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  },
  { timestamps: true }
)

const Course = mongoose.model('Course', courseSchema)

module.exports = Course