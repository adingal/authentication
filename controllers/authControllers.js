const { promisify } = require('util')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true
  }

  // Send cookie to client
  res.cookie('jwt', token, cookieOptions)

  // Remove user password from the response
  user.password = undefined

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  })
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new Error('Please provide email and password.')
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.comparePassword(password, user.password))) {
      throw new Error('Incorrect email or password.')
    }

    // Update login date
    await User.findByIdAndUpdate(user._id, {
      lastLoggedIn: Date.now(),
    })

    createSendToken(user, 200, res)
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'Failed to login user.',
      errorStack: error,
    })
  }
}

exports.protect = async (req, res, next) => {
  try {
    let token
    // 1. Get token and check if it exist
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      throw new Error('You are not logged in. Please login to get access.')
    }

    // 2. Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    // 3. Check if user still exist
    const currentUser = await User.findById(decoded.id)

    if (!currentUser) {
      throw new Error('The user belonging to this token no longer exist.')
    }

    // Grant access to protected route
    req.user = currentUser

    next()
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'Failed to login user.',
      errorStack: error,
    })
  }
}

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    try {
      // roles ['admin', 'user']
      if (!roles.includes(req.user.role)) {
        throw new Error('You do not have permission to perform this action.')
      }

      next()
    } catch (error) {
      res.status(404).json({
        status: 'fail',
        message: 'You do not have permission to perform this action.',
        errorStack: error,
      })
    }
  }
}
