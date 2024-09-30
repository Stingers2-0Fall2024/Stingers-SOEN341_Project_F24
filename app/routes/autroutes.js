// Done by Ali

const express = require('express');
const authController = require('../controllers/authentication');
const router=express.Router();

// defines the route at the path, so that the registration process is called
router.post('/register', authController.register);

// this calls the login process 
router.post('/login', authController.login);

module.exports=router;
