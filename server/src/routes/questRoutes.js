const { Router } = require("express");
const {
  getQuests,
  getQuestById,
  createQuest,
  updateQuest,
  deleteQuest,
} = require("../controllers/questController");

const router = Router();

router.get("/", getQuests);
router.get("/:id", getQuestById);
router.post("/", createQuest);
router.put("/:id", updateQuest);
router.delete("/:id", deleteQuest);

module.exports = router;

