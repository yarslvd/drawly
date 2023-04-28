const express = require('express');
const auth = require('../controllers/auth-controller');
const {jwtMiddleware} = require("../utils/jwt");

const router = express.Router();

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/logout', auth.logout);
router.post('/refresh', auth.refresh);
router.get( '/getMe', jwtMiddleware, auth.getMe);
router.post('/checkToken/:confirm_token', auth.checkToken);

router.post('/password-reset', auth.passwordReset);

router.post('/password-reset/:confirm_token', auth.passwordResetConfirm);
router.get('/email-confirm/:confirm_token', auth.emailConfirm)

module.exports = router;