import dotenv from "dotenv";

dotenv.config({ path: ".env.development" });

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  moduleDirectories: ["node_modules", "<rootDir>"],
};
