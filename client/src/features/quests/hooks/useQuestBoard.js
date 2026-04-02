import { useCallback, useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { ApiError } from "../../../api/apiClient";
import { questApi } from "../../../api/questApi";
import { DEFAULT_FILTERS } from "../../../shared/constants/questOptions";
import { validateQuestForm } from "../validation/questFormSchema";

export const useQuestBoard = () => {
  const [quests, setQuests] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const normalizedFilters = useMemo(
    () => ({
      status: filters.status === "all" ? undefined : filters.status,
      difficulty: filters.difficulty === "all" ? undefined : filters.difficulty,
      search: filters.search.trim() || undefined,
    }),
    [filters],
  );

  const loadQuests = useCallback(async () => {
    setLoading(true);

    try {
      const data = await questApi.getQuests(normalizedFilters);
      setQuests(data || []);
    } catch (error) {
      const text =
        error instanceof ApiError ? error.message : "РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ РєРІРµСЃС‚С‹";
      message.error(text);
    } finally {
      setLoading(false);
    }
  }, [normalizedFilters]);

  useEffect(() => {
    void loadQuests();
  }, [loadQuests]);

  const updateFilters = (nextFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...nextFilters,
    }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const openCreateModal = () => {
    setEditingQuest(null);
    setModalOpen(true);
  };

  const openEditModal = (quest) => {
    setEditingQuest(quest);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingQuest(null);
  };

  const submitQuest = async (formValues) => {
    // Валидацию держим отдельно от JSX, чтобы форма не превращалась в простыню.
    // Этот кусок потом легко тестировать без UI.
    const validation = validateQuestForm(formValues);

    if (!validation.success) {
      return {
        ok: false,
        fieldErrors: validation.fieldErrors,
      };
    }

    setSubmitLoading(true);

    try {
      if (editingQuest) {
        await questApi.updateQuest(editingQuest.id, validation.data);
        message.success("РљРІРµСЃС‚ РѕР±РЅРѕРІР»РµРЅ");
      } else {
        await questApi.createQuest(validation.data);
        message.success("РљРІРµСЃС‚ СЃРѕР·РґР°РЅ");
      }

      closeModal();
      await loadQuests();

      return {
        ok: true,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          ok: false,
          message: error.message,
          serverErrors: Array.isArray(error.details) ? error.details : [],
        };
      }

      return {
        ok: false,
        message: "РќРµ СѓРґР°Р»РѕСЃСЊ РІС‹РїРѕР»РЅРёС‚СЊ Р·Р°РїСЂРѕСЃ",
      };
    } finally {
      setSubmitLoading(false);
    }
  };

  const deleteQuest = async (quest) => {
    try {
      await questApi.deleteQuest(quest.id);
      message.success(`РљРІРµСЃС‚ "${quest.title}" СѓРґР°Р»РµРЅ`);
      await loadQuests();
    } catch (error) {
      const text =
        error instanceof ApiError ? error.message : "РќРµ СѓРґР°Р»РѕСЃСЊ СѓРґР°Р»РёС‚СЊ РєРІРµСЃС‚";
      message.error(text);
    }
  };

  return {
    state: {
      quests,
      filters,
      loading,
      modalOpen,
      editingQuest,
      submitLoading,
    },
    actions: {
      updateFilters,
      resetFilters,
      refresh: loadQuests,
      openCreateModal,
      openEditModal,
      closeModal,
      submitQuest,
      deleteQuest,
    },
  };
};

