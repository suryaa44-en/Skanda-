const express = require("express");
const router = express.Router();
const { create, getByTaskId, getAll } = require("../controllers/aar.controller");

router.post("/", create);
router.get("/", (req, res) => {
  if (req.query.taskId) return getByTaskId(req, res);
  return getAll(req, res);
});

module.exports = router;
