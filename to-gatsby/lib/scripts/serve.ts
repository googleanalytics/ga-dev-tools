import * as execa from "execa"
import { build } from "./build"
import { ServeArgs, Environment } from "./types"
import { checkConfig } from "./check-config"

export const serve = async (args: ServeArgs) => {
  const config = await checkConfig()

  let projectId: string
  if (args.environment === Environment.Development) {
    projectId = config.development.firebaseProjectId
  } else if (args.environment === Environment.Production) {
    projectId = config.production.firebaseProjectId
  }

  if (!args.skipBuild) {
    await build(false)
  }

  await execa(
    "yarn",
    ["run", "firebase", "--project", projectId, "serve", "--host", "0.0.0.0"],
    {
      stderr: "inherit",
      stdout: "inherit",
      stdin: "inherit",
    }
  )

  return
}
