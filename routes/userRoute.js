const router = require('express').Router();
const userController = require('../controllers/userController');

router.post('/create', userController.createUser);

router.post('/login', userController.login);

router.post('/searchUser', userController.searchUser);

router.post('/logout', userController.logout);


module.exports = router;
