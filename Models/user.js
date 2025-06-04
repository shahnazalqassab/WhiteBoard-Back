const { Schema } = require('mongoose')

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    category: { type: String, enum: ['student', 'teacher']},
  },
  { timestamps: true }
)

module.exports = userSchema 