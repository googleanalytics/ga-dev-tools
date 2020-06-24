import * as path from "path"

export const PWD = process.cwd()
export const Encoding = "utf8"
export const RuntimeJsonPath = path.join(PWD, "runtime.json")
export const DotEnvDevelopmentPath = path.join(PWD, ".env.development")

export interface RuntimeJson {
  gaMeasurementId: string
  gaMeasurementIdDev: string
  firebaseStagingProjectId: string
  gapiClientId: string
}

interface CheckRuntimeFilesArgs {
  cmd: Command.CheckRequiredConfiguration
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
}

interface StageToIntegrationArgs {
  cmd: Command.StageToIntegration
}

export enum Command {
  CheckRequiredConfiguration = "check-config",
  Build = "build",
  Develop = "develop",
  Serve = "serve",
  StageToIntegration = "stage:integration",
}

export type Args =
  | CheckRuntimeFilesArgs
  | ServeArgs
  | BuildArgs
  | DevelopArgs
  | StageToIntegrationArgs
