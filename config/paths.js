"use strict";

const path = require("path");
const fs = require("fs");

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp(".env"),
  appPath: resolveApp("."),
  appBuild: resolveApp("lib"),
  appIndexJs: resolveApp("src/index.ts"),
  appPackageJson: resolveApp("package.json"),
  appSrc: resolveApp("src"),
  testsSetup: resolveApp("src/setupTests.ts"),
  appNodeModules: resolveApp("node_modules"),
  appTsConfig: resolveApp("tsconfig.json"),
  appTsProdConfig: resolveApp("tsconfig.prod.json"),
  appTsLint: resolveApp("tslint.json"),
};
