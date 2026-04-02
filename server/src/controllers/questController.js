const questService = require("../services/questService");
const { sendSuccess } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const {
  validateQuestPayload,
  validateQuestIdParam,
  validateQuestFilters,
} = require("../validators/questValidators");

const getQuests = asyncHandler(async (req, res) => {
  // Здесь только HTTP-обвязка: забрали входные данные и отдали их в сервис.
  // Бизнес-логика остается ниже по слоям, поэтому читать и поддерживать проще.
  const filters = validateQuestFilters(req.query);
  const quests = await questService.listQuests(filters);

  return sendSuccess(res, {
    message: "РЎРїРёСЃРѕРє РєРІРµСЃС‚РѕРІ РїРѕР»СѓС‡РµРЅ",
    data: quests,
  });
});

const getQuestById = asyncHandler(async (req, res) => {
  const id = validateQuestIdParam(req.params);
  const quest = await questService.getQuestById(id);

  return sendSuccess(res, {
    message: "РљРІРµСЃС‚ РїРѕР»СѓС‡РµРЅ",
    data: quest,
  });
});

const createQuest = asyncHandler(async (req, res) => {
  const payload = validateQuestPayload(req.body);
  const createdQuest = await questService.createQuest(payload);

  return sendSuccess(res, {
    statusCode: 201,
    message: "РљРІРµСЃС‚ СЃРѕР·РґР°РЅ",
    data: createdQuest,
  });
});

const updateQuest = asyncHandler(async (req, res) => {
  const id = validateQuestIdParam(req.params);
  const payload = validateQuestPayload(req.body);
  const updatedQuest = await questService.updateQuest(id, payload);

  return sendSuccess(res, {
    message: "РљРІРµСЃС‚ РѕР±РЅРѕРІР»РµРЅ",
    data: updatedQuest,
  });
});

const deleteQuest = asyncHandler(async (req, res) => {
  const id = validateQuestIdParam(req.params);
  const deletedQuest = await questService.deleteQuest(id);

  return sendSuccess(res, {
    message: "РљРІРµСЃС‚ СѓРґР°Р»РµРЅ",
    data: deletedQuest,
  });
});

module.exports = {
  getQuests,
  getQuestById,
  createQuest,
  updateQuest,
  deleteQuest,
};

