module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/backend/**/*.test.js', // Match backend tests
    '<rootDir>/**/*.test.js'         // Match frontend tests
  ],
  coverageDirectory: './coverage',   // Save coverage reports
  moduleDirectories: [
    'node_modules',
    '<rootDir>/backend',
    '<rootDir>'
  ]
};
