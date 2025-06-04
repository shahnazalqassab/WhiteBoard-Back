const express = require('express')
const router = express.Router()

const {
  Register,
  Login,
  UpdatePassword,
  CheckSession
} = require('../controllers/users')

router.post('/register', Register)
router.get('/login', Login)
router.put('/:id', UpdatePassword)
router.get('/session', CheckSession)

module.exports = router