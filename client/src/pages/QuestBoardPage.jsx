import { RocketOutlined } from "@ant-design/icons";
import { Divider, Typography } from "antd";
import QuestFilters from "../features/quests/components/QuestFilters";
import QuestFormModal from "../features/quests/components/QuestFormModal";
import QuestStats from "../features/quests/components/QuestStats";
import QuestTable from "../features/quests/components/QuestTable";
import { useQuestBoard } from "../features/quests/hooks/useQuestBoard";

function QuestBoardPage() {
    const { state, actions } = useQuestBoard();

    return (
        <div className="page-shell">
            <header className="hero-block">
                <div className="hero-badge">
                    <RocketOutlined />
                    LevelUp
                </div>

                <Typography.Title level={1} className="hero-title">
                    Учебные квесты и XP
                </Typography.Title>
            </header>

            <section className="board-panel">
                <QuestFilters
                    filters={state.filters}
                    loading={state.loading}
                    onChange={actions.updateFilters}
                    onReset={actions.resetFilters}
                    onRefresh={actions.refresh}
                    onCreate={actions.openCreateModal}
                />

                <QuestStats quests={state.quests} />

                <Divider />

                <QuestTable
                    quests={state.quests}
                    loading={state.loading}
                    onEdit={actions.openEditModal}
                    onDelete={actions.deleteQuest}
                />
            </section>

            <QuestFormModal
                open={state.modalOpen}
                quest={state.editingQuest}
                loading={state.submitLoading}
                onCancel={actions.closeModal}
                onSubmit={actions.submitQuest}
            />
        </div>
    );
}

export default QuestBoardPage;
