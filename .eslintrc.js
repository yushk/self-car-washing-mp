module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint",
    requireConfigFile: false,
    sourceType: "module",
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  globals: {
    uni: "writable",
    wx: "writable",
    plus: "writable",
    jsAgent: "writable",
    getCurrentPages: "writable",
  },
  extends: ['plugin:vue/recommended', 'eslint:recommended'],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-unused-vars": "off",
    "vue/multi-word-component-names": "off",
  },
};
