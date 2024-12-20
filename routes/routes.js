const express = require('express');

const router = express.Router();

var usercontroller = require("../controllers/usercontrollers");

var authValidator = require("../validation/authValidator")

router.post('/register',authValidator.signup(), usercontroller.register);

router.post('/login',authValidator.signIn(), usercontroller.login);

router.get('/getUser', usercontroller.getUser);

router.delete('/deletingUser/:id', usercontroller.deletingUser);

router.put('/updateUser/:id', usercontroller.updateUser);

module.exports = router;