import { ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";
import QuestBoardPage from "../pages/QuestBoardPage";

const theme = {
  token: {
    colorPrimary: "#0f766e",
    colorInfo: "#0f766e",
    colorSuccess: "#2f855a",
    colorWarning: "#d97706",
    colorError: "#c53030",
    borderRadius: 14,
    fontFamily: '"Manrope", "Segoe UI", sans-serif',
  },
};

function App() {
  return (
    <ConfigProvider locale={ruRU} theme={theme}>
      <QuestBoardPage />
    </ConfigProvider>
  );
}

export default App;

