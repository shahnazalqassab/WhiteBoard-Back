const express = require('express')
const router = express.Router()

const {
  Register,
  Login,
  UpdatePassword,
  CheckSession
} = require('../controllers/users')

router.post('/user/register', Register)
router.post('/user/login', Login)
router.put('/user/:id', UpdatePassword)
router.get('/user/session', CheckSession)

module.exports = router