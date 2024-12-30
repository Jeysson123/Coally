module.exports = {
  preset: 'ts-jest', // Use ts-jest for handling TypeScript files
  testEnvironment: 'node', // Set the test environment to Node.js
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // For TypeScript files
    '^.+\\.(js|jsx)$': 'babel-jest', // For JavaScript files (optional if using ES6 imports)
  },
  transformIgnorePatterns: [
    "/node_modules/(?!your-es6-package-to-transform)/", // Add this if you need to transpile some node_modules
  ],
};
