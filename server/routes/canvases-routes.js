const express = require("express");
const controller = require("../controllers/canvases-controller");
const { jwtMiddleware } = require("../utils/jwt");

const router = express.Router();

//  api/canvases
router.post("/", jwtMiddleware, controller.create);
router.get("/:id", jwtMiddleware, controller.get);
router.patch("/", jwtMiddleware, controller.update);
router.delete("/", jwtMiddleware, controller.delete);

module.exports = router;