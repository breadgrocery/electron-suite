module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    "eqeqeq": "warn",
    "spaced-comment": ["error", "always", { markers: ["/"] }],
    "capitalized-comments": ["error", "always"]
  },
  ignorePatterns: [".eslintrc*", "dist"]
};
