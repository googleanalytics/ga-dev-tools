import * as execa from "execa"
import { DeployFunctionsArgs, RuntimeJson, Environment } from "./types"
import { checkConfig, SKIP_QUESTION } from "./check-config"
import { configForEnvironment } from "."

export const ensureFirebaseLoginStatus = async ({
  noLocalhost,
}: {
  noLocalhost: boolean
}) => {
  console.log("Logging out of firebase since tokens are shortlived...")
  await execa("yarn", ["run", "firebase", "logout"])

  if (noLocalhost) {
    return execa("yarn", ["run", "firebase", "login", "--no-localhost"], {
      stderr: "inherit",
      stdout: "inherit",
      stdin: "inherit",
    })
  } else {
    return execa("yarn", ["run", "firebase", "login"], {
      stderr: "inherit",
      stdout: "inherit",
      stdin: "inherit",
    })
  }
}

export const ensureFirebaseFunctionsConfig = async (
  environment: Environment,
  config: RuntimeJson & { noLocalhost: boolean }
): Promise<void> => {
  await ensureFirebaseLoginStatus({ noLocalhost: config.noLocalhost })

  const environmentConfig = configForEnvironment(environment, config)

  const bitlyClientId =
    config.production.bitlyClientId === SKIP_QUESTION
      ? ""
      : `bitly.client_id=${environmentConfig.bitlyClientId}`
  const bitlyClientSecret =
    config.production.bitlyClientSecret === SKIP_QUESTION
      ? ""
      : `bitly.client_secret=${environmentConfig.bitlyClientSecret}`

  const bitlyBaseUri = `bitly.base_uri=${environmentConfig.baseUri}`

  // Don't call the command at all if all of these values were unset.
  if ([bitlyClientSecret, bitlyClientId].every(a => a === "")) {
    console.error(
      "bitlyClientSecret and bitlyClientId are both required for functions deployment."
    )
    process.exit(1)
  }

  console.log("Updating Firebase functions environment configuration...")

  try {
    await execa(
      "yarn",
      [
        "run",
        "firebase",
        "--project",
        environmentConfig.firebaseProjectId,
        "functions:config:set",
        bitlyClientId,
        bitlyClientSecret,
        bitlyBaseUri,
      ],
      {}
    )
  } catch (e) {
    console.error("Couldn't update firebase functions config.")
    process.exit(1)
  }
  return
}

export const deployFunctions = async (args: DeployFunctionsArgs) => {
  const config = await checkConfig({
    all: false,
  })

  await ensureFirebaseFunctionsConfig(args.environment, {
    ...config,
    noLocalhost: args.noLocalhost,
  })

  const environmentConfig = configForEnvironment(args.environment, config)

  await execa(
    "npm",
    [
      "run",
      "firebase",
      "--",
      "--project",
      environmentConfig.firebaseProjectId,
      "deploy",
      "--only",
      "functions",
    ],
    {
      stderr: "inherit",
      stdout: "inherit",
      stdin: "inherit",
    }
  )
}
