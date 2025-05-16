module.exports = {
  ci: {
    collect: {
      url: ['https://promelektroservice.vercel.app'],
      numberOfRuns: 3,
      startServerCommand: null
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
}
