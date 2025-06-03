const express = require('express')
const logger = require('morgan')
const cors = require('cors')

const userRouter = require('./Routes/userRouter')
const courseRouter = require('./Routes/courseRoutes')

const PORT = process.env.PORT || 3001

const DB = require('./Database')

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/user', userRouter)
app.use('/courses', courseRouter)

app.use('/', (req, res) => {
  res.send(`Connected!`)
})

app.listen(PORT, () => {
  console.log(`Running Express server on Port ${PORT} . . .`)
})
