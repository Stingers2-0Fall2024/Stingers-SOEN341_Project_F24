module.exports = {
  setupFiles: ['./jest.setup.js'], // Path to your Jest setup file
  testEnvironment: 'jsdom',       // Required for DOM-based testing
    transformIgnorePatterns: [
    "/node_modules/(?!your-module-name-or-other-modules-to-transform)"
  ]
};
