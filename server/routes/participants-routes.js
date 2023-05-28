const express = require("express");
const controller = require("../controllers/participants-controller");
const { jwtMiddleware } = require("../utils/jwt");

const router = express.Router();

//  api/participants

// query `user_id` - get for specific user
// query `canvas_id` - get for specific canvas
router.get("/", jwtMiddleware, controller.get);
router.post("/", jwtMiddleware, controller.create);
router.delete("/", jwtMiddleware, controller.delete);

module.exports = router;
