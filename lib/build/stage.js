import { execa } from "execa"
import { build } from "./build.js"
import { checkConfig, writeEnvFile } from "./check-config.js"
import { Environment } from "./types.js"
import { ensureFirebaseLoginStatus } from "./deploy-functions.js"
export const stage = async args => {
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
  let projectId
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
