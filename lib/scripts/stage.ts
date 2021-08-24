import * as execa from "execa"
import { build } from "./build"
import { checkConfig, writeEnvFile } from "./check-config"
import { DeployArgs, Environment } from "./types"
import { ensureFirebaseLoginStatus } from "./deploy-functions"

export const stage = async (args: DeployArgs) => {
  const config = await checkConfig({
    all: false,
  })

  // Always create the .env.production file, but re-write it based on
  // environment.
  await writeEnvFile(
    args.environment === Environment.Production
      ? config.production
      : {
          ...config.staging,
          firebaseProjectId: config.production.firebaseProjectId,
        },
    args.environment === Environment.Staging
      ? "bitly_auth_integration"
      : undefined
  )

  await ensureFirebaseLoginStatus({ noLocalhost: args.noLocalhost })

  // TODO - should stage also do functions, or should they be managed
  // separately?
  //
  // await ensureFirebaseFunctionsConfig({
  //   ...config,
  //   noLocalhost: args.noLocalhost,
  // })

  let projectId: string
  if (args.environment === Environment.Staging) {
    projectId = config.staging.firebaseProjectId
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
