import * as execa from "execa"
import { build } from "./build"
import { ServeArgs, Environment } from "./types"
import { checkConfig } from "./check-config"

export const serve = async (args: ServeArgs) => {
  const config = await checkConfig({ all: false })

  let projectId: string
  if (args.environment === Environment.Staging) {
    console.error(
      `Note: serving using the staging environment isn't fully supported. You should use "yarn start" instead to run locally.`
    )
    process.exit(1)
  } else if (args.environment === Environment.Production) {
    projectId = config.production.firebaseProjectId
  } else {
    throw new Error("Unreachable")
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
