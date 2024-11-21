module.exports = {
  setupFilesAfterEnv: ['./jest.setup.js'], // Include setup for Testing Library
  testEnvironment: 'jsdom',              // DOM-based testing
  transformIgnorePatterns: [
    '/node_modules/(?!your-module-name-or-other-modules-to-transform)',
  ],
};
