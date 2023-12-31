const express = require('express');
const router = express.Router();
const usersCtrl = require('../../controllers/api/users');

//All methods are ok for anonymous use
// POST /api/users
router.post('/', usersCtrl.create);
// POST /api/users/login
router.post('/login', usersCtrl.login);
// POST /api/users/request-password-reset
router.post('/request-password-reset', usersCtrl.sendPasswordResetEmail);
// PUT /api/users/perform-password-reset
router.put('/perform-password-reset', usersCtrl.performPasswordReset);
// POST /api/users/verify-email
router.post('/verify-email', usersCtrl.verifyEmail);

module.exports = router;