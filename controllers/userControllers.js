const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  })
})

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(new AppError('No user found with this ID.', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  })
})

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  })

  if (!newUser) {
    return next(
      new AppError('Failed to create new user, please try again.', 401)
    )
  }

  // Remove password and version key on response
  newUser.password = undefined
  newUser.__v = undefined

  res.status(200).json({
    status: 'success',
    data: {
      newUser,
    },
  })
})

exports.updateUser = catchAsync(async (req, res, next) => {
  const { name, email, role, active } = req.body
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    // Get only the items that can be updated
    { name, email, role, active },
    {
      new: true,
      runValidators: true,
    }
  )

  if (!updatedUser) {
    return next(new AppError('User not found.', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      updatedUser,
    },
  })
})

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id)

  if (!user) {
    return next(new AppError('No user found.', 404))
  }

  res.status(204).json({
    status: 'success',
    data: null,
  })
})
