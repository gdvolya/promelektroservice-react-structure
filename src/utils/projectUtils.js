// src/utils/projectUtils.js

export const getProjectData = (t, projectId) => {
  const allProjects = t('portfolio.projects', { returnObjects: true });
  // projectId, полученный из URL, всегда строка, поэтому преобразуем его в число
  const numericId = parseInt(projectId, 10);

  // Проверяем, существует ли проект с таким ID
  if (allProjects && allProjects[numericId]) {
    return allProjects[numericId];
  }

  return null;
};