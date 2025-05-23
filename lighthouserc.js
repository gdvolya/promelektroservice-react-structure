module.exports = {
  ci: {
    collect: {
      url: ['https://promelektroservice-react-structure-8ki480yn5-gdvolyas-projects.vercel.app/'],
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', {minScore: 0.85}],
        'categories:accessibility': ['warn', {minScore: 0.9}],
        'categories:seo': ['warn', {minScore: 0.9}]
      }
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
      },
    }
  }
};
