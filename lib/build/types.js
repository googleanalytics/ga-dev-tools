"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = exports.Environment = exports.AnswerNames = exports.DotEnvDevelopmentPath = exports.DotEnvProductionPath = exports.RuntimeJsonPath = exports.Encoding = exports.PWD = void 0;
const path = require("path");
exports.PWD = process.cwd();
exports.Encoding = "utf8";
exports.RuntimeJsonPath = path.join(exports.PWD, "runtime.json");
exports.DotEnvProductionPath = path.join(exports.PWD, ".env.production");
exports.DotEnvDevelopmentPath = path.join(exports.PWD, ".env.development");
var AnswerNames;
(function (AnswerNames) {
    AnswerNames["BaseUriProd"] = "baseUriProd";
    AnswerNames["BaseUriStaging"] = "baseUriStaging";
    AnswerNames["FirebaseProjectIdProd"] = "firebaseProjectIdProd";
    AnswerNames["FirebaseProjectIdStaging"] = "firebaseProjectIdStaging";
    AnswerNames["GapiClientIdProd"] = "gapiClientIdProd";
    AnswerNames["GapiClientIdStaging"] = "gapiClientIdStaging";
    AnswerNames["BitlyClientIdProd"] = "bitlyClientIdProd";
    AnswerNames["BitlyClientIdStaging"] = "bitlyClientIdStaging";
    AnswerNames["BitlyClientSecretProd"] = "bitlyClientSecretProd";
    AnswerNames["BitlyClientSecretStaging"] = "bitlyClientSecretStaging";
    AnswerNames["MeasurementIdProd"] = "measurementIdProd";
    AnswerNames["MeasurementIdStaging"] = "measurementIdStaging";
})(AnswerNames = exports.AnswerNames || (exports.AnswerNames = {}));
var Environment;
(function (Environment) {
    Environment["Production"] = "production";
    Environment["Staging"] = "staging";
})(Environment = exports.Environment || (exports.Environment = {}));
var Command;
(function (Command) {
    Command["CheckConfig"] = "check-config";
    Command["Build"] = "build";
    Command["Develop"] = "develop";
    Command["Serve"] = "serve";
    Command["Deploy"] = "deploy";
    Command["DeployFunctions"] = "deploy-functions";
})(Command = exports.Command || (exports.Command = {}));
