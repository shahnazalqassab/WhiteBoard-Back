const { User } = require('../Models')
const middleware = require('../middleware')

const Register = async (req, res) => {
  try {
    const { username, name, email, password, category } = req.body
    console.log(req.body)

    let existingUser = await User.findOne({ username })
    console.log(existingUser)

    if (existingUser) {
      return res.status(400).send('This username already exists!')
    } else {
      let passwordDigest = await middleware.hashPassword(password)
      const user = await User.create({
        username,
        name,
        email,
        passwordDigest,
        category
      })
      res.status(200).send(user)
    }
  } catch (error) {
    console.log(error)
    res
      .status(401)
      .send({ status: 'Error', msg: 'An error has occurred signing up!' })
  }
}

const Login = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })

    if (!user) {
      return res.status(401).send({ status: 'Error', msg: 'User not found' })
    }
    let matched = await middleware.comparePassword(
      password,
      user.passwordDigest
    )
    if (matched) {
      let payload = {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        category: user.category
      }
      let token = middleware.createToken(payload)
      return res.status(200).send({ user: payload, token })
    }
    res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
  } catch (error) {
    console.log(error)
    res
      .status(401)
      .send({ status: 'Error', msg: 'An error has occurred logging in!' })
  }
}

const UpdateProfile = async (req, res) => {
  const { name, email, password } = req.body
  try {
    if (!req.user) {
      return res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).send({ status: 'Error', msg: 'User not found' })
    }

    if (name) user.name = name
    if (email) user.email = email
    if (password) user.passwordDigest = await middleware.hashPassword(password)

    await user.save()
    res.status(200).send({ status: 'Profile updated successfully!', user })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      status: 'Error',
      msg: 'An error has occurred updating profile!'
    })
  }
}

const CheckSession = async (req, res) => {
  const { payload } = res.locals
  res.status(200).send(payload)
}

module.exports = {
  Register,
  Login,
  UpdateProfile,
  CheckSession
}
