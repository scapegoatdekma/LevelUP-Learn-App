import { useEffect, useMemo } from "react";
import {
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
} from "antd";
import {
  difficultyOptions,
  statusOptions,
  subjectOptions,
} from "../../../shared/constants/questOptions";

const questFields = [
  "title",
  "subject",
  "difficulty",
  "xp",
  "status",
  "deadline",
  "notes",
];

function QuestFormModal({ open, quest, loading, onCancel, onSubmit }) {
  const [form] = Form.useForm();
  const isEditMode = Boolean(quest);

  const initialValues = useMemo(
    () => ({
      title: quest?.title || "",
      subject: quest?.subject || "JavaScript",
      difficulty: quest?.difficulty || "легко",
      xp: quest?.xp || 80,
      status: quest?.status || "к_выполнению",
      deadline: quest?.deadline || "",
      notes: quest?.notes || "",
    }),
    [quest],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    form.setFieldsValue(initialValues);
  }, [form, initialValues, open]);

  const mapIssuesToFormErrors = (issues = []) => {
    const formErrors = issues
      .filter((issue) => questFields.includes(issue.path))
      .map((issue) => ({
        name: issue.path,
        errors: [issue.message],
      }));

    const globalIssue = issues.find((issue) => !questFields.includes(issue.path));

    return {
      formErrors,
      globalIssue,
    };
  };

  const handleFinish = async (values) => {
    const result = await onSubmit(values);

    if (result.ok) {
      form.resetFields();
      return;
    }

    const mergedIssues = [
      ...(result.fieldErrors || []),
      ...(result.serverErrors || []),
    ];

    if (mergedIssues.length > 0) {
      const { formErrors, globalIssue } = mapIssuesToFormErrors(mergedIssues);

      if (formErrors.length > 0) {
        form.setFields(formErrors);
      }

      if (globalIssue) {
        message.error(globalIssue.message);
      }
    }

    if (result.message && mergedIssues.length === 0) {
      message.error(result.message);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={isEditMode ? "Редактировать квест" : "Создать квест"}
      open={open}
      destroyOnClose
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText={isEditMode ? "Сохранить" : "Создать"}
      cancelText="Отмена"
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleFinish}
      >
        <Form.Item label="Название" name="title" rules={[{ required: true }]}>
          <Input maxLength={100} placeholder="Пример: Реализовать авторизацию" />
        </Form.Item>

        <Form.Item label="Предмет" name="subject" rules={[{ required: true }]}>
          <Select showSearch options={subjectOptions} />
        </Form.Item>

        <Form.Item
          label="Сложность"
          name="difficulty"
          rules={[{ required: true }]}
        >
          <Select options={difficultyOptions} />
        </Form.Item>

        <Form.Item label="XP" name="xp" rules={[{ required: true }]}>
          <InputNumber min={10} max={500} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Статус" name="status" rules={[{ required: true }]}>
          <Select options={statusOptions} />
        </Form.Item>

        <Form.Item label="Дедлайн" name="deadline">
          <Input placeholder="ГГГГ-ММ-ДД" />
        </Form.Item>

        <Form.Item label="Заметки" name="notes">
          <Input.TextArea
            maxLength={500}
            rows={4}
            placeholder="Комментарий для команды"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default QuestFormModal;

