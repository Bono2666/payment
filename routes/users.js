let express = require('express');
let router = express.Router();
let User = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.findAndCountAll().then(users => {
    res.json({
      status: true,
      message: "Users retrieved successfully",
      data: users,
      count: users.count,
    });
  }).catch(err => {
    res.json({
      status: false,
      message: "Users not retrieved successfully" + err,
      data: {},
    });
  });
});

// Add a new user
router.post('/', function(req, res, next) {
  User.create(req.body).then(user => {
    res.json({
      status: true,
      message: "User added successfully",
      data: user,
    });
  }).catch(err => {
    res.json({
      status: false,
      message: "User not added successfully. " + err,
      data: req.body,
    });
  });
});

// Edit a user
router.put('/', function(req, res, next) {
  User.update(req.body, {
    where: {id:req.body.id},
  }).then(user => {
    res.json({
      status: true,
      message: "User updated successfully",
      data: user,
    });
  }).catch(err => {
    res.json({
      status: false,
      message: "User not updated successfully. " + err,
      data: req.body,
    });
  });
});

// Delete a user
router.delete('/', function(req, res, next) {
  User.destroy({
    where: {id:req.body.id},
  }).then(user => {
    res.json({
      status: true,
      message: "User deleted successfully",
      data: user,
    });
  }).catch(err => {
    res.json({
      status: false,
      message: "User not deleted successfully. " + err,
      data: req.body,
    });
  });
});

module.exports = router;
