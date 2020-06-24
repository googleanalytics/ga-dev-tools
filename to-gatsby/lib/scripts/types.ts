import * as path from "path"

export const PWD = process.cwd()
export const Encoding = "utf8"
export const RuntimeJsonPath = path.join(PWD, "runtime.json")

export interface RuntimeJson {
  gaMeasurementId: string
  gaMeasurementIdDev: string
  firebaseStagingProjectId: string
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

export enum Command {
  CheckRequiredConfiguration = "check-config",
  Build = "build",
  Develop = "develop",
  Serve = "serve",
}

export type Args = CheckRuntimeFilesArgs | ServeArgs | BuildArgs | DevelopArgs
