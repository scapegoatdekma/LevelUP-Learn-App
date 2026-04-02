const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  dateStyle: "medium",
});

const dateTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  dateStyle: "medium",
  timeStyle: "short",
});

export const formatDeadline = (value) => {
  if (!value) {
    return "Без дедлайна";
  }

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return dateFormatter.format(date);
};

export const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return dateTimeFormatter.format(date);
};

