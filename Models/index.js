const mongoose = require('mongoose')
const userSchema = require('./users')
const postSchema = require('./course')

const User = mongoose.model('User', userSchema)
const Course = mongoose.model('Post', postSchema)

module.exports = {
    User,
    Course
}