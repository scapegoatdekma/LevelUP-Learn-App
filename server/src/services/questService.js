const questModel = require("../models/questModel");
const AppError = require("../utils/AppError");

const listQuests = async (filters) => {
  return questModel.findAll(filters);
};

const getQuestById = async (id) => {
  const quest = await questModel.findById(id);

  if (!quest) {
    throw new AppError("Квест не найден", 404);
  }

  return quest;
};

const createQuest = async (payload) => {
  return questModel.create(payload);
};

const updateQuest = async (id, payload) => {
  await getQuestById(id);
  return questModel.update(id, payload);
};

const deleteQuest = async (id) => {
  const quest = await getQuestById(id);
  await questModel.remove(id);
  return quest;
};

module.exports = {
  listQuests,
  getQuestById,
  createQuest,
  updateQuest,
  deleteQuest,
};

