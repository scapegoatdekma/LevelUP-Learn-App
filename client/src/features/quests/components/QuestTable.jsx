import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table, Tag, Typography } from "antd";
import {
  difficultyColors,
  difficultyLabels,
  statusColors,
  statusLabels,
} from "../../../shared/constants/questOptions";
import { formatDateTime, formatDeadline } from "../../../shared/lib/dateFormat";

function QuestTable({ quests, loading, onEdit, onDelete }) {
  const columns = [
    {
      title: "Квест",
      dataIndex: "title",
      key: "title",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Typography.Text strong>{record.title}</Typography.Text>
          <Typography.Text type="secondary">{record.subject}</Typography.Text>
        </Space>
      ),
    },
    {
      title: "Сложность",
      dataIndex: "difficulty",
      key: "difficulty",
      width: 130,
      render: (difficulty) => (
        <Tag color={difficultyColors[difficulty]}>{difficultyLabels[difficulty]}</Tag>
      ),
    },
    {
      title: "XP",
      dataIndex: "xp",
      key: "xp",
      width: 90,
      align: "right",
      render: (xp) => <Typography.Text strong>{xp}</Typography.Text>,
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: "Дедлайн",
      dataIndex: "deadline",
      key: "deadline",
      width: 150,
      render: (deadline) => formatDeadline(deadline),
    },
    {
      title: "Обновлено",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 170,
      render: (updatedAt) => formatDateTime(updatedAt),
    },
    {
      title: "Действия",
      key: "actions",
      width: 160,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Изменить
          </Button>

          <Popconfirm
            title="Удалить квест?"
            description="Это действие нельзя отменить"
            okText="Удалить"
            cancelText="Отмена"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(record)}
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Удалить
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      className="quest-table"
      loading={loading}
      columns={columns}
      dataSource={quests}
      pagination={{
        pageSize: 6,
        showSizeChanger: false,
      }}
      scroll={{ x: 980 }}
    />
  );
}

export default QuestTable;

