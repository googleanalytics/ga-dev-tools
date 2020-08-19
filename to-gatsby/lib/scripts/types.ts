import * as path from "path"

export const PWD = process.cwd()
export const Encoding = "utf8"
export const RuntimeJsonPath = path.join(PWD, "runtime.json")
export const DotEnvDevelopmentPath = path.join(PWD, ".env.development")
export const DotEnvProductionPath = path.join(PWD, ".env.production")

interface CommonConfig {
  gaMeasurementId: string
  firebaseProjectId: string
  firebaseFunctionsBaseUrl: string
  gapiClientId: string
  bitlyClientId: string
  bitlyClientSecret: string
  baseUri: string
}

export interface ProductionConfig extends CommonConfig {}
export interface DevelopmentConfig extends CommonConfig {}

export interface ConfigAnswers {
  baseUriProd: string
  gaMeasurementIdProd: string
  gaMeasurementIdDev: string
  firebaseProjectIdProd: string
  firebaseProjectIdDev: string
  gapiClientIdProd: string
  gapiClientIdDev: string
  bitlyClientId: string
  bitlyClientSecret: string
}

export interface RuntimeJson {
  production: ProductionConfig
  development: DevelopmentConfig
}

export enum Environment {
  Production = "production",
  Development = "development",
}

export interface CheckConfigArgs {
  cmd: Command.CheckConfig
  all: boolean
}

interface BuildArgs {
  cmd: Command.Build
}

interface DevelopArgs {
  cmd: Command.Develop
}

export interface ServeArgs {
  cmd: Command.Serve
  skipBuild: boolean
  environment: Environment
}

export interface DeployArgs {
  cmd: Command.Deploy
  environment: Environment
}

export enum Command {
  CheckConfig = "check-config",
  Build = "build",
  Develop = "develop",
  Serve = "serve",
  Deploy = "deploy",
}

export type Args =
  | CheckConfigArgs
  | ServeArgs
  | BuildArgs
  | DevelopArgs
  | DeployArgs
