module.exports = {
  root: true,

  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],

  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],

  rules: {
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "_",
        varsIgnorePattern: "_",
      },
    ],
    "prettier/prettier": [
      "error",
      {
        printWidth: 120,
      },
    ],
  },

  env: {
    browser: true,
    node: true,
  },

  ignorePatterns: ["node_modules/**/*", "_compile/**/*.js", "app/**/*.guard.ts"],
};
