const User = require('../models/userModel')

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()

    res.status(200).json({
      status: 'success',
      data: {
        users,
      },
    })
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'No users found.',
      errorStack: error,
    })
  }
}

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      throw new Error('No user found with this ID.')
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    })
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'No users found.',
      errorStack: error,
    })
  }
}

exports.createUser = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role,
    })

    if (!newUser) {
      throw new Error('Failed to create new user, please try again.')
    }

    res.status(200).json({
      status: 'success',
      data: {
        newUser,
      },
    })
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'Failed to create user.',
      errorStack: error,
    })
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!updatedUser) {
      throw new Error('User not found.')
    }

    res.status(200).json({
      status: 'success',
      data: {
        updatedUser,
      },
    })
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'Failed to update user.',
      errorStack: error,
    })
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      throw new Error('No user found.')
    }

    res.status(204).json({
      status: 'success',
      data: null,
    })
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'Failed to delete user.',
      errorStack: error,
    })
  }
}
