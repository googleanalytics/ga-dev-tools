import * as execa from "execa"
import { build } from "./build"
import { ServeArgs, Environment } from "./types"
import { checkConfig } from "./check-config"

export const serve = async (args: ServeArgs) => {
  const config = await checkConfig({ all: false })

  let projectId: string
  if (args.environment === Environment.Development) {
    projectId = config.development.firebaseProjectId
    console.warn(
      `Note: serving using the development environment isn't fully supported. You should use "yarn start" instead to run locally.`
    )
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
