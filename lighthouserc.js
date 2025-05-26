module.exports = {
  ci: {
    collect: {
      url: ['https://promelektroservice-react-structure.vercel.app/'],
      numberOfRuns: 3
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci'
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.3 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }]
      }
    }
  }
};
