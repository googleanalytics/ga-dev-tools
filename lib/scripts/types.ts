import * as path from "path"

export const PWD = process.cwd()
export const Encoding = "utf8"
export const RuntimeJsonPath = path.join(PWD, "runtime.json")
export const DotEnvProductionPath = path.join(PWD, ".env.production")
export const DotEnvDevelopmentPath = path.join(PWD, ".env.development")

export interface CommonConfig {
  firebaseProjectId: string
  gapiClientId: string
  bitlyClientId: string
  bitlyClientSecret: string
  baseUri: string
  measurementId: string
}

export interface ProductionConfig extends CommonConfig {}
export interface StagingConfig extends CommonConfig {}

export enum AnswerNames {
  BaseUriProd = "baseUriProd",
  BaseUriStaging = "baseUriStaging",

  FirebaseProjectIdProd = "firebaseProjectIdProd",
  FirebaseProjectIdStaging = "firebaseProjectIdStaging",

  GapiClientIdProd = "gapiClientIdProd",
  GapiClientIdStaging = "gapiClientIdStaging",

  BitlyClientIdProd = "bitlyClientIdProd",
  BitlyClientIdStaging = "bitlyClientIdStaging",

  BitlyClientSecretProd = "bitlyClientSecretProd",
  BitlyClientSecretStaging = "bitlyClientSecretStaging",

  MeasurementIdProd = "measurementIdProd",
  MeasurementIdStaging = "measurementIdStaging",
}

export type ConfigAnswers = {
  [key in AnswerNames]: string
}

export interface RuntimeJson {
  production: ProductionConfig
  staging: StagingConfig
}

export enum Environment {
  Production = "production",
  Staging = "staging",
}

export interface CheckConfigArgs {
  cmd: Command.CheckConfig
  all: boolean
}

interface BuildArgs {
  cmd: Command.Build
}

export interface DevelopArgs {
  cmd: Command.Develop
  environment: Environment
}

export interface ServeArgs {
  cmd: Command.Serve
  skipBuild: boolean
  environment: Environment
}

export interface DeployArgs {
  cmd: Command.Deploy
  environment: Environment
  noLocalhost: boolean
}

export interface DeployFunctionsArgs {
  cmd: Command.DeployFunctions
  environment: Environment
  noLocalhost: boolean
}

export enum Command {
  CheckConfig = "check-config",
  Build = "build",
  Develop = "develop",
  Serve = "serve",
  Deploy = "deploy",
  DeployFunctions = "deploy-functions",
}

export type Args =
  | CheckConfigArgs
  | ServeArgs
  | BuildArgs
  | DevelopArgs
  | DeployArgs
  | DeployFunctionsArgs
