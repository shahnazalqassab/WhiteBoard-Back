const mongoose = require('mongoose')
const userSchema = require('./User')
const courseSchema = require('./Course')

const User = mongoose.model('User', userSchema)
const Course = mongoose.model('Course', courseSchema)

module.exports = {
    User,
    Course
}