/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // You can set it to 'jsdom' if working with browser-based code
  setupFiles: ['./jest.setup.ts', './src/infrastructure/env/index.ts'], // Add the setup file
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest', // Use ts-jest to transform TypeScript files
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/build/',
    '<rootDir>/api-docs/',
    '<rootDir>/docker/',
    '<rootDir>/scripts/',
    '<rootDir>/src/infrastructure/configs/',
    '<rootDir>/src/infrastructure/orm/sequelize/',
    '\\.interface\\.ts$',
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
}
