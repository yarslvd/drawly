const express = require('express');
const multer = require('multer');
const controller = require('../controllers/users-controller');
const {jwtMiddleware} = require("../utils/jwt")

const router = express.Router();

const upload = multer({
  dest: "./public/avatars/"
});

//  api/users/
router.get('/me', jwtMiddleware, controller.getMe);
router.get('/:id', controller.getOne);
router.patch('/', jwtMiddleware, controller.update);
router.post('/avatar', jwtMiddleware, upload.single("avatar"), controller.updateAvatar);

module.exports = router;