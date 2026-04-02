const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ALLOWED_DIFFICULTIES = new Set(["легко", "средне", "сложно"]);
const ALLOWED_STATUSES = new Set(["к_выполнению", "в_работе", "выполнено"]);

const createIssue = (path, message) => ({ path, message });

const normalizeString = (value) => {
  return typeof value === "string" ? value.trim() : "";
};

export const validateQuestForm = (payload) => {
  const issues = [];

  const title = normalizeString(payload.title);
  if (title.length < 3) {
    issues.push(createIssue("title", "Название должно содержать минимум 3 символа"));
  }
  if (title.length > 100) {
    issues.push(createIssue("title", "Название должно содержать максимум 100 символов"));
  }

  const subject = normalizeString(payload.subject);
  if (subject.length < 2) {
    issues.push(createIssue("subject", "Предмет должен содержать минимум 2 символа"));
  }
  if (subject.length > 50) {
    issues.push(createIssue("subject", "Предмет должен содержать максимум 50 символов"));
  }

  const difficulty = normalizeString(payload.difficulty);
  if (!ALLOWED_DIFFICULTIES.has(difficulty)) {
    issues.push(
      createIssue("difficulty", "Сложность должна быть одной из: легко, средне, сложно"),
    );
  }

  const xp = Number(payload.xp);
  if (!Number.isInteger(xp)) {
    issues.push(createIssue("xp", "XP должен быть целым числом"));
  } else if (xp < 10 || xp > 500) {
    issues.push(createIssue("xp", "XP должен быть в диапазоне от 10 до 500"));
  }

  const status = normalizeString(payload.status);
  if (!ALLOWED_STATUSES.has(status)) {
    issues.push(
      createIssue(
        "status",
        "Статус должен быть одним из: к_выполнению, в_работе, выполнено",
      ),
    );
  }

  const deadlineValue = normalizeString(payload.deadline);
  const deadline = deadlineValue === "" ? null : deadlineValue;
  if (deadline !== null && !DATE_PATTERN.test(deadline)) {
    issues.push(createIssue("deadline", "Дедлайн должен быть в формате YYYY-MM-DD"));
  }

  const notes = normalizeString(payload.notes);
  if (notes.length > 500) {
    issues.push(createIssue("notes", "Заметки должны содержать максимум 500 символов"));
  }

  if (issues.length > 0) {
    return {
      success: false,
      data: null,
      fieldErrors: issues,
    };
  }

  return {
    success: true,
    data: {
      title,
      subject,
      difficulty,
      xp,
      status,
      deadline,
      notes,
    },
    fieldErrors: [],
  };
};
