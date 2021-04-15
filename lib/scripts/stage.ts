import * as execa from "execa"
import { build } from "./build"
import { checkConfig, ensureFirebaseFunctionsConfig } from "./check-config"
import { DeployArgs, Environment } from "./types"

export const stage = async (args: DeployArgs) => {
  const config = await checkConfig({
    all: false,
  })

  await ensureFirebaseFunctionsConfig({
    ...config,
    noLocalhost: args.noLocalhost,
  })

  let projectId: string
  if (args.environment === Environment.Development) {
    // TODO - support development deployments.
    projectId = config.development.firebaseProjectId
    console.error(
      `Note: deploying using the development environment is not supported.`
    )
    process.exit(1)
  } else if (args.environment === Environment.Production) {
    projectId = config.production.firebaseProjectId
  } else {
    throw new Error("unreachable")
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
