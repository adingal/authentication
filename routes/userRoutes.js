const express = require('express')

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userControllers')

const { login, protect, restrictTo } = require('../controllers/authControllers')

const router = express.Router()

// router.post('/login', login)

/**
 * Need to login to access below routes
 * Only admins are allowed to create, update, and delete user data
 */
// router.use(protect)

// router.route('/').get(getAllUsers).post(restrictTo('admin'), createUser)
router.route('/').get(getAllUsers).post(createUser)

router
  .route('/:id')
  .get(getUser)
  .patch(restrictTo('admin'), updateUser)
  .delete(restrictTo('admin'), deleteUser)

module.exports = router
