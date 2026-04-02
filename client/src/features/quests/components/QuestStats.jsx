import { Card, Col, Progress, Row, Statistic, Typography } from "antd";

function QuestStats({ quests }) {
  const total = quests.length;
  const done = quests.filter((quest) => quest.status === "выполнено").length;
  const inProgress = quests.filter((quest) => quest.status === "в_работе").length;
  const totalXp = quests
    .filter((quest) => quest.status === "выполнено")
    .reduce((sum, quest) => sum + quest.xp, 0);

  const completionPercent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <Row gutter={[16, 16]} className="stats-grid">
      <Col xs={24} sm={12} lg={6}>
        <Card className="stats-card">
          <Statistic title="Всего квестов" value={total} />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card className="stats-card">
          <Statistic title="Выполнено" value={done} />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card className="stats-card">
          <Statistic title="В работе" value={inProgress} />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card className="stats-card">
          <Statistic title="Заработано XP" value={totalXp} suffix="XP" />
        </Card>
      </Col>

      <Col span={24}>
        <Card className="stats-card progress-card">
          <Typography.Text className="progress-label">Процент выполнения</Typography.Text>
          <Progress
            percent={completionPercent}
            status="active"
            strokeColor="#0f766e"
          />
        </Card>
      </Col>
    </Row>
  );
}

export default QuestStats;

