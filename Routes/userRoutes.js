const router = require('express').Router()
const ctrl = require('../controllers/users')
const middleware = require('../middleware')


router.post('/register', ctrl.Register)
router.post('/login', ctrl.Login)
router.put('/profile', middleware.stripToken, middleware.verifyToken, ctrl.UpdateProfile)
router.get('/session', middleware.stripToken, middleware.verifyToken, ctrl.CheckSession)

module.exports = router