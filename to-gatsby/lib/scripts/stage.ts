import * as execa from "execa"
import { build } from "./build"
import { checkConfig } from "./check-config"
import { DeployArgs, Environment } from "./types"

export const stage = async (args: DeployArgs) => {
  const config = await checkConfig()

  let projectId: string
  if (args.environment === Environment.Development) {
    projectId = config.development.firebaseProjectId
  } else if (args.environment === Environment.Production) {
    projectId = config.production.firebaseProjectId
  }

  await build(false)

  await execa(
    "yarn",
    ["run", "firebase", "--project", projectId, "deploy", "--only", "hosting"],
    {
      stderr: "inherit",
      stdout: "inherit",
      stdin: "inherit",
    }
  )

  return
}
