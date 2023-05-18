module.exports = {
  root: true,

  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],

  parserOptions: {
    project: "app/frontend/tsconfig.json",
    extraFileExtensions: [".svelte"],
  },
  overrides: [
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      // Parse the `<script>` in `.svelte` as TypeScript by adding the following configuration.
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },
  ],

  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:svelte/recommended", "prettier",],

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
