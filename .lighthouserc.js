module.exports = {
  ci: {
    collect: {
      url: ['https://promelektroservice-react-structure.vercel.app/'],
      numberOfRuns: 3,  // Количество запусков для получения стабильных данных
    },
    upload: {
      target: 'filesystem', // Сохраняем отчёты на файловой системе
      outputDir: '.lighthouseci/report', // Указываем каталог для хранения отчётов
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.3 }], // Минимальная оценка для производительности
        'categories:accessibility': ['warn', { minScore: 0.9 }], // Минимальная оценка для доступности
        'categories:seo': ['warn', { minScore: 0.9 }], // Минимальная оценка для SEO
      },
    },
  },
};
