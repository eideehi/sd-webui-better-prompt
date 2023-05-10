module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
    extraFileExtensions: [".svelte"],
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  plugins: ["svelte3", "@typescript-eslint"],
  overrides: [
    {
      files: ["**/*.svelte"],
      processor: "svelte3/svelte3",
    },
    {
      files: ["**/*.ts", "**/*.svelte"],
      rules: {
        "no-undef": "off",
      },
    },
  ],
  settings: {
    "svelte3/typescript": () => require("typescript"),
    "svelte3/ignore-styles": () => true,
  },
};
