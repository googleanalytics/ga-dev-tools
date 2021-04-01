"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = exports.Environment = exports.DotEnvProductionPath = exports.DotEnvDevelopmentPath = exports.RuntimeJsonPath = exports.Encoding = exports.PWD = void 0;
const path = require("path");
exports.PWD = process.cwd();
exports.Encoding = "utf8";
exports.RuntimeJsonPath = path.join(exports.PWD, "runtime.json");
exports.DotEnvDevelopmentPath = path.join(exports.PWD, ".env.development");
exports.DotEnvProductionPath = path.join(exports.PWD, ".env.production");
var Environment;
(function (Environment) {
    Environment["Production"] = "production";
    Environment["Development"] = "development";
})(Environment = exports.Environment || (exports.Environment = {}));
var Command;
(function (Command) {
    Command["CheckConfig"] = "check-config";
    Command["Build"] = "build";
    Command["Develop"] = "develop";
    Command["Serve"] = "serve";
    Command["Deploy"] = "deploy";
})(Command = exports.Command || (exports.Command = {}));
