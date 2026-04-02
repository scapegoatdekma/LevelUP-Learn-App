export const difficultyOptions = [
  { value: "легко", label: "Легко" },
  { value: "средне", label: "Средне" },
  { value: "сложно", label: "Сложно" },
];

export const statusOptions = [
  { value: "к_выполнению", label: "К выполнению" },
  { value: "в_работе", label: "В работе" },
  { value: "выполнено", label: "Выполнено" },
];

export const subjectOptions = [
  { value: "Фронтенд", label: "Фронтенд" },
  { value: "Бэкенд", label: "Бэкенд" },
  { value: "JavaScript", label: "JavaScript" },
  { value: "React", label: "React" },
  { value: "Базы данных", label: "Базы данных" },
  { value: "Алгоритмы", label: "Алгоритмы" },
];

export const difficultyColors = {
  "легко": "green",
  "средне": "gold",
  "сложно": "volcano",
};

export const statusColors = {
  "к_выполнению": "default",
  "в_работе": "processing",
  "выполнено": "success",
};

export const statusLabels = {
  "к_выполнению": "К выполнению",
  "в_работе": "В работе",
  "выполнено": "Выполнено",
};

export const difficultyLabels = {
  "легко": "Легко",
  "средне": "Средне",
  "сложно": "Сложно",
};

export const DEFAULT_FILTERS = {
  status: "all",
  difficulty: "all",
  search: "",
};

