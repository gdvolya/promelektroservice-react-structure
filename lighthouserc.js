module.exports = {
  ci: {
    collect: {
      url: ['https://promelektroservice.vercel.app'],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
      },
    },
    upload: {
      target: 'temporary-public-storage',
      output: ['html'],
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
      },
    },
  },
};
