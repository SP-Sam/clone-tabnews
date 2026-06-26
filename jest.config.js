import dotenv from "dotenv";

dotenv.config({ path: ".env.development" });

export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  moduleDirectories: ["node_modules", "<rootDir>"],
  extensionsToTreatAsEsm: [".ts"],
  testTimeout: 60000,
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
};
