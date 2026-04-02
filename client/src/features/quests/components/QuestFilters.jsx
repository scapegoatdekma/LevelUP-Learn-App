import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Select } from "antd";
import {
  difficultyOptions,
  statusOptions,
} from "../../../shared/constants/questOptions";

const statusFilterOptions = [
  { value: "all", label: "Все статусы" },
  ...statusOptions,
];

const difficultyFilterOptions = [
  { value: "all", label: "Любая сложность" },
  ...difficultyOptions,
];

function QuestFilters({
  filters,
  loading,
  onChange,
  onReset,
  onRefresh,
  onCreate,
}) {
  return (
    <div className="filters-bar">
      <Flex gap={12} wrap className="filters-group">
        <Input
          placeholder="Поиск по названию, предмету и заметкам"
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          style={{ minWidth: 240 }}
        />

        <Select
          value={filters.status}
          options={statusFilterOptions}
          style={{ minWidth: 170 }}
          onChange={(value) => onChange({ status: value })}
        />

        <Select
          value={filters.difficulty}
          options={difficultyFilterOptions}
          style={{ minWidth: 170 }}
          onChange={(value) => onChange({ difficulty: value })}
        />

        <Button onClick={onReset}>Сбросить</Button>
      </Flex>

      <Flex gap={8} className="filters-actions">
        <Button icon={<ReloadOutlined />} loading={loading} onClick={onRefresh}>
          Обновить
        </Button>

        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
          Новый квест
        </Button>
      </Flex>
    </div>
  );
}

export default QuestFilters;

