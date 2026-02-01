module.exports = {
  root: true,
  extends: ["@worklog/config/eslint/nextjs.js"],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
};
