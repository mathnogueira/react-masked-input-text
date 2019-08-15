module.exports = {
  "verbose": true,
  "testMatch": [
    "**/?(*)+(Test).ts"
  ],
  "moduleFileExtensions": [
    "js",
    "jsx",
    "ts",
    "tsx"
  ],
  "transform": {
    "^.+\\.ts$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
  }
};