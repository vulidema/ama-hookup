export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/lib/testing/setup.ts"],
  testPathIgnorePatterns: ["/node_modules/"],
};
