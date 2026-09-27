import { PREP_DATA } from "../data/prepData";

export const calculateReadinessScore = (completedTasksCount, userXP, userLevel) => {
  const totalChecklists = PREP_DATA.reduce((sum, cat) => sum + (cat.checklists?.length || 0), 0);
  const checklistScore = totalChecklists > 0 ? (completedTasksCount / totalChecklists) * 60 : 0;
  const xpScore = Math.min(userXP / 500, 1) * 25;
  const levelScore = Math.min(userLevel / 5, 1) * 15;
  return Math.min(Math.round(checklistScore + xpScore + levelScore), 100);
};
