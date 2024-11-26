module.exports = {
  testEnvironment: 'node',
  testMatch: ["./tests/db.test.js", "./tests/authMiddleware.test.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {'^.+\\.js$': 'babel-jest'}
};
