import * as path from "path"
export const PWD = process.cwd()
export const Encoding = "utf8"
export const RuntimeJsonPath = path.join(PWD, "runtime.json")
export const DotEnvProductionPath = path.join(PWD, ".env.production")
export const DotEnvDevelopmentPath = path.join(PWD, ".env.development")
export var AnswerNames
;(function (AnswerNames) {
  AnswerNames["BaseUriProd"] = "baseUriProd"
  AnswerNames["BaseUriStaging"] = "baseUriStaging"
  AnswerNames["FirebaseProjectIdProd"] = "firebaseProjectIdProd"
  AnswerNames["FirebaseProjectIdStaging"] = "firebaseProjectIdStaging"
  AnswerNames["GapiClientIdProd"] = "gapiClientIdProd"
  AnswerNames["GapiClientIdStaging"] = "gapiClientIdStaging"
  AnswerNames["BitlyClientIdProd"] = "bitlyClientIdProd"
  AnswerNames["BitlyClientIdStaging"] = "bitlyClientIdStaging"
  AnswerNames["BitlyClientSecretProd"] = "bitlyClientSecretProd"
  AnswerNames["BitlyClientSecretStaging"] = "bitlyClientSecretStaging"
  AnswerNames["MeasurementIdProd"] = "measurementIdProd"
  AnswerNames["MeasurementIdStaging"] = "measurementIdStaging"
})(AnswerNames || (AnswerNames = {}))
export var Environment
;(function (Environment) {
  Environment["Production"] = "production"
  Environment["Staging"] = "staging"
})(Environment || (Environment = {}))
export var Command
;(function (Command) {
  Command["CheckConfig"] = "check-config"
  Command["Build"] = "build"
  Command["Develop"] = "develop"
  Command["Serve"] = "serve"
  Command["Deploy"] = "deploy"
  Command["DeployFunctions"] = "deploy-functions"
})(Command || (Command = {}))
