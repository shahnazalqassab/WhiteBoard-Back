const mongoose = require('mongoose')
const userSchema = require('./user')
const courseSchema = require('./course')

const User = mongoose.model('User', userSchema)
const Course = mongoose.model('Post', courseSchema)

module.exports = {
    User,
    Course
}