import * as fs from "fs"
import * as inquirer from "inquirer"
import {
  RuntimeJson,
  RuntimeJsonPath,
  Encoding,
  DotEnvDevelopmentPath,
  DotEnvProductionPath,
} from "./types"
import * as execa from "execa"

type ConfigQuestionFilter = {
  askAll?: true | undefined
} & Partial<RuntimeJson>

const ensureNecessaryFiles = async (
  runtimeJson: RuntimeJson
): Promise<RuntimeJson> => {
  // Create `runtime.json` if it doesn't exist.
  const exists = fs.existsSync(RuntimeJsonPath)
  if (!exists) {
    fs.writeFileSync(RuntimeJsonPath, "")
  }

  // Create `.env.development` if it doesn't exist.
  if (!fs.existsSync(DotEnvDevelopmentPath)) {
    fs.writeFileSync(DotEnvDevelopmentPath, "")
  }

  // Create `.env.production` if it doesn't exist.
  if (!fs.existsSync(DotEnvProductionPath)) {
    fs.writeFileSync(DotEnvProductionPath, "")
  }

  // Overwrite `runtime.json` with provided configuration.
  fs.writeFileSync(RuntimeJsonPath, JSON.stringify(runtimeJson, null, "  "), {
    encoding: Encoding,
  })

  // TODO - this should be pulled out into a function.
  // Overwrite `.env.development` with provided configuration.
  fs.writeFileSync(
    DotEnvDevelopmentPath,
    [
      `GAPI_CLIENT_ID=${runtimeJson.gapiClientId}`,
      `GATSBY_GA_MEASUREMENT_ID=${runtimeJson.gaMeasurementIdDev}`,
    ].join("\n"),
    { encoding: Encoding }
  )
  // Overwrite `.env.production` with provided configuration.
  fs.writeFileSync(
    DotEnvProductionPath,
    [
      `GAPI_CLIENT_ID=${runtimeJson.gapiClientId}`,
      `GATSBY_GA_MEASUREMENT_ID=${runtimeJson.gaMeasurementId}`,
    ].join("\n"),
    { encoding: Encoding }
  )

  console.log("Writing `runtime.json`.")

  return runtimeJson
}

// Given a filter, returns an array of questions to be asked to make sure all
// required configuration data is present. The filter allows some questions to
// be skipped if already provided.
const configQuestions = (
  filter: ConfigQuestionFilter
): inquirer.QuestionCollection<RuntimeJson> => {
  return [
    {
      name: "gaMeasurementId",
      // TODO - Nice to have, list the user's available properties. Would
      // require the user to authenticate first to make the request.
      type: "input",
      message: "Google Analytics measurement ID for production: ",
      default: filter.gaMeasurementId || "none-provided",
      when: () => {
        return filter.askAll || filter.gaMeasurementId === undefined
      },
    },
    {
      name: "gaMeasurementIdDev",
      // TODO - Nice to have, list the user's available properties. Would
      // require the user to authenticate first to make the request.
      type: "input",
      message: "Google Analytics measurement ID for development: ",
      default: filter.gaMeasurementIdDev || "none-provided",
      when: () => {
        return filter.askAll || filter.gaMeasurementIdDev === undefined
      },
    },
    {
      name: "firebaseStagingProjectId",
      type: "input",
      message: "Firebase project ID to use for staging environment:",
      // TODO - See if listing is useful. Probably should only do it if there's not a ton.
      default: filter.firebaseStagingProjectId,
      when: () => {
        return filter.askAll || filter.firebaseStagingProjectId === undefined
      },
    },
    {
      name: "gapiClientId",
      type: "input",
      // TODO - Check to see if there a way to make getting this value easier.
      // (or at least provide a link to where the user can find this value)
      message: "Client ID to use for user authentication to this site.",
      default: filter.gapiClientId,
      when: () => {
        return filter.askAll || filter.gapiClientId === undefined
      },
    },
  ]
}

const ensureFirebaseLoginStatus = async () => {
  console.log(`Ensuring that you're logged into to Firebase.`)

  // TODO - --no-localhost might should be a flag to checkConfig.
  return execa("yarn", ["run", "firebase", "login", "--no-localhost"], {
    stderr: "inherit",
    stdout: "inherit",
    stdin: "inherit",
  })
}

// TODO - Check config should take a flag to force a reauth for firebase since
// the token is short-lived.

// Ensures that required config files exist. If they don't, prompt the user for
// required values & creates necessary files.
export const checkConfig = async (): Promise<RuntimeJson> => {
  console.log("Checking required configuration...")

  const exists = fs.existsSync(RuntimeJsonPath)

  let filter: ConfigQuestionFilter = {}
  let currentConfig: Partial<RuntimeJson> = {}

  // If the file doesn't exist at all, prompt for all configuration entries.
  if (!exists) {
    filter = { askAll: true }
  } else {
    // Otherwise, read in the current configFile so that can be passed as the
    // filter to the questions to ask.
    currentConfig = JSON.parse(
      fs.readFileSync(RuntimeJsonPath, { encoding: Encoding })
    )
  }

  // TODO - This check is probably only needed for deploying or if we want to
  // list the available projects for the firebase Project ID questions.

  // Make sure user is logged into Firebase.
  await ensureFirebaseLoginStatus()

  const answers = await inquirer.prompt(
    configQuestions(Object.assign({}, currentConfig, filter))
  )

  const merged = Object.assign({}, currentConfig, answers)

  const config = await ensureNecessaryFiles(merged)
  return config
}
