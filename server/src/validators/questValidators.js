const AppError = require("../utils/AppError");
const {
  QUEST_DIFFICULTIES,
  QUEST_STATUSES,
} = require("../constants/questDictionary");

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const FILTER_KEYS = new Set(["status", "difficulty", "search"]);

const createIssue = (path, message) => ({ path, message });

const throwValidationError = (issues) => {
  throw new AppError("РћС€РёР±РєР° РІР°Р»РёРґР°С†РёРё", 400, issues);
};

const isPlainObject = (value) => {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
};

const normalizeRequiredString = (
  value,
  { path, minLength, maxLength, requiredMessage },
  issues,
) => {
  if (typeof value !== "string") {
    issues.push(createIssue(path, requiredMessage));
    return "";
  }

  const normalized = value.trim();

  if (normalized.length < minLength) {
    issues.push(
      createIssue(path, `РџРѕР»Рµ "${path}" РґРѕР»Р¶РЅРѕ СЃРѕРґРµСЂР¶Р°С‚СЊ РјРёРЅРёРјСѓРј ${minLength} СЃРёРјРІРѕР»Р°(РѕРІ)`),
    );
  }

  if (normalized.length > maxLength) {
    issues.push(
      createIssue(path, `РџРѕР»Рµ "${path}" РґРѕР»Р¶РЅРѕ СЃРѕРґРµСЂР¶Р°С‚СЊ РјР°РєСЃРёРјСѓРј ${maxLength} СЃРёРјРІРѕР»РѕРІ`),
    );
  }

  return normalized;
};

const normalizeOptionalString = (
  value,
  { path, maxLength, defaultValue = "" },
  issues,
) => {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  if (typeof value !== "string") {
    issues.push(createIssue(path, `РџРѕР»Рµ "${path}" РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ СЃС‚СЂРѕРєРѕР№`));
    return defaultValue;
  }

  const normalized = value.trim();

  if (normalized.length > maxLength) {
    issues.push(
      createIssue(path, `РџРѕР»Рµ "${path}" РґРѕР»Р¶РЅРѕ СЃРѕРґРµСЂР¶Р°С‚СЊ РјР°РєСЃРёРјСѓРј ${maxLength} СЃРёРјРІРѕР»РѕРІ`),
    );
  }

  return normalized;
};

const normalizeEnum = (value, { path, allowedValues, title }, issues) => {
  if (typeof value !== "string" || value.trim() === "") {
    issues.push(createIssue(path, `РџРѕР»Рµ "${path}" РѕР±СЏР·Р°С‚РµР»СЊРЅРѕ`));
    return "";
  }

  const normalized = value.trim();

  if (!allowedValues.includes(normalized)) {
    issues.push(
      createIssue(
        path,
        `${title}: РґРѕРїСѓСЃС‚РёРјС‹Рµ Р·РЅР°С‡РµРЅРёСЏ вЂ” ${allowedValues.join(", ")}`,
      ),
    );
  }

  return normalized;
};

const normalizePositiveInt = (
  value,
  { path, min, max, requiredMessage },
  issues,
) => {
  if (value === undefined || value === null || value === "") {
    issues.push(createIssue(path, requiredMessage));
    return 0;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    issues.push(createIssue(path, `РџРѕР»Рµ "${path}" РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ С†РµР»С‹Рј С‡РёСЃР»РѕРј`));
    return 0;
  }

  if (parsed < min || parsed > max) {
    issues.push(
      createIssue(path, `РџРѕР»Рµ "${path}" РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ РІ РґРёР°РїР°Р·РѕРЅРµ РѕС‚ ${min} РґРѕ ${max}`),
    );
  }

  return parsed;
};

const normalizeDeadline = (value, issues) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    issues.push(createIssue("deadline", "РџРѕР»Рµ \"deadline\" РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ СЃС‚СЂРѕРєРѕР№"));
    return null;
  }

  const normalized = value.trim();

  if (!DATE_PATTERN.test(normalized)) {
    issues.push(
      createIssue("deadline", "РџРѕР»Рµ \"deadline\" РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ РІ С„РѕСЂРјР°С‚Рµ YYYY-MM-DD"),
    );
    return null;
  }

  return normalized;
};

const validateQuestIdParam = (params) => {
  const rawId = params?.id;
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    throwValidationError([
      createIssue("id", "РџР°СЂР°РјРµС‚СЂ id РґРѕР»Р¶РµРЅ Р±С‹С‚СЊ РїРѕР»РѕР¶РёС‚РµР»СЊРЅС‹Рј С†РµР»С‹Рј С‡РёСЃР»РѕРј"),
    ]);
  }

  return id;
};

const validateQuestFilters = (query) => {
  const issues = [];
  const safeQuery = isPlainObject(query) ? query : {};

  for (const key of Object.keys(safeQuery)) {
    if (!FILTER_KEYS.has(key)) {
      issues.push(createIssue("query", `РќРµРґРѕРїСѓСЃС‚РёРјС‹Р№ С„РёР»СЊС‚СЂ: ${key}`));
    }
  }

  const status = safeQuery.status
    ? normalizeEnum(
        safeQuery.status,
        {
          path: "status",
          allowedValues: QUEST_STATUSES,
          title: "РќРµРІРµСЂРЅС‹Р№ СЃС‚Р°С‚СѓСЃ",
        },
        issues,
      )
    : undefined;

  const difficulty = safeQuery.difficulty
    ? normalizeEnum(
        safeQuery.difficulty,
        {
          path: "difficulty",
          allowedValues: QUEST_DIFFICULTIES,
          title: "РќРµРІРµСЂРЅР°СЏ СЃР»РѕР¶РЅРѕСЃС‚СЊ",
        },
        issues,
      )
    : undefined;

  let search;
  if (safeQuery.search !== undefined) {
    if (typeof safeQuery.search !== "string") {
      issues.push(createIssue("search", "Р¤РёР»СЊС‚СЂ search РґРѕР»Р¶РµРЅ Р±С‹С‚СЊ СЃС‚СЂРѕРєРѕР№"));
    } else {
      const normalizedSearch = safeQuery.search.trim();
      if (normalizedSearch.length > 100) {
        issues.push(
          createIssue("search", "Р¤РёР»СЊС‚СЂ search РґРѕР»Р¶РµРЅ СЃРѕРґРµСЂР¶Р°С‚СЊ РјР°РєСЃРёРјСѓРј 100 СЃРёРјРІРѕР»РѕРІ"),
        );
      } else if (normalizedSearch.length > 0) {
        search = normalizedSearch;
      }
    }
  }

  if (issues.length > 0) {
    throwValidationError(issues);
  }

  return {
    status,
    difficulty,
    search,
  };
};

const validateQuestPayload = (payload) => {
  if (!isPlainObject(payload)) {
    throwValidationError([
      createIssue("body", "РўРµР»Рѕ Р·Р°РїСЂРѕСЃР° РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ РѕР±СЉРµРєС‚РѕРј"),
    ]);
  }

  const issues = [];

  // Делаем ручную валидацию по шагам.
  // На разборе сразу видно: где проверка и какой текст ошибки прилетит клиенту.
  const title = normalizeRequiredString(
    payload.title,
    {
      path: "title",
      minLength: 3,
      maxLength: 100,
      requiredMessage: "РџРѕР»Рµ \"title\" РѕР±СЏР·Р°С‚РµР»СЊРЅРѕ Рё РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ СЃС‚СЂРѕРєРѕР№",
    },
    issues,
  );

  const subject = normalizeRequiredString(
    payload.subject,
    {
      path: "subject",
      minLength: 2,
      maxLength: 50,
      requiredMessage: "РџРѕР»Рµ \"subject\" РѕР±СЏР·Р°С‚РµР»СЊРЅРѕ Рё РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ СЃС‚СЂРѕРєРѕР№",
    },
    issues,
  );

  const difficulty = normalizeEnum(
    payload.difficulty,
    {
      path: "difficulty",
      allowedValues: QUEST_DIFFICULTIES,
      title: "РќРµРІРµСЂРЅР°СЏ СЃР»РѕР¶РЅРѕСЃС‚СЊ",
    },
    issues,
  );

  const xp = normalizePositiveInt(
    payload.xp,
    {
      path: "xp",
      min: 10,
      max: 500,
      requiredMessage: "РџРѕР»Рµ \"xp\" РѕР±СЏР·Р°С‚РµР»СЊРЅРѕ",
    },
    issues,
  );

  const status = normalizeEnum(
    payload.status,
    {
      path: "status",
      allowedValues: QUEST_STATUSES,
      title: "РќРµРІРµСЂРЅС‹Р№ СЃС‚Р°С‚СѓСЃ",
    },
    issues,
  );

  const deadline = normalizeDeadline(payload.deadline, issues);

  const notes = normalizeOptionalString(
    payload.notes,
    {
      path: "notes",
      maxLength: 500,
      defaultValue: "",
    },
    issues,
  );

  if (issues.length > 0) {
    throwValidationError(issues);
  }

  return {
    title,
    subject,
    difficulty,
    xp,
    status,
    deadline,
    notes,
  };
};

module.exports = {
  validateQuestPayload,
  validateQuestIdParam,
  validateQuestFilters,
};
