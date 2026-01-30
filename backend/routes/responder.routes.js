const express = require("express");
const router = express.Router();

const {
  createResponder,
  getAllResponders
} = require("../controllers/responder.controller");

router.post("/", createResponder);
router.get("/", getAllResponders);

module.exports = router;
