import * as fs from "fs"
import * as inquirer from "inquirer"
import {
  RuntimeJson,
  RuntimeJsonPath,
  Encoding,
  DotEnvDevelopmentPath,
  DotEnvProductionPath,
  ConfigAnswers,
  ProductionConfig,
  DevelopmentConfig,
} from "./types"
import * as execa from "execa"

type ConfigQuestionFilter = {
  askAll?: true | undefined
} & Partial<RuntimeJson>

const ensureNecessaryFiles = async (
  runtimeJson: RuntimeJson
): Promise<RuntimeJson> => {
  // TODO - Ideally this only re-writes a file if there's actually a difference
  // between the current one and the new data.

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
      `GAPI_CLIENT_ID=${runtimeJson.development.gapiClientId}`,
      `GA_MEASUREMENT_ID=${runtimeJson.development.gaMeasurementId}`,
    ].join("\n"),
    { encoding: Encoding }
  )
  // Overwrite `.env.production` with provided configuration.
  fs.writeFileSync(
    DotEnvProductionPath,
    [
      `GAPI_CLIENT_ID=${runtimeJson.production.gapiClientId}`,
      `GA_MEASUREMENT_ID=${runtimeJson.production.gaMeasurementId}`,
    ].join("\n"),
    { encoding: Encoding }
  )

  return runtimeJson
}

// Given a filter, returns an array of questions to be asked to make sure all
// required configuration data is present. The filter allows some questions to
// be skipped if already provided.
const configQuestions = (
  filter: ConfigQuestionFilter
): inquirer.QuestionCollection<ConfigAnswers> => {
  // TODO the `?.`s can be removed once this has stabilized. They're here now to
  // be friendly as the runtimeJson type evolves.
  return [
    {
      name: "gaMeasurementIdProd",
      // TODO - Nice to have, list the user's available properties. Would
      // require the user to authenticate first to make the request.
      type: "input",
      message: "Google Analytics measurement ID for production: ",
      default: filter?.production?.gaMeasurementId || "none-provided",
      when: () => {
        return (
          filter.askAll || filter?.production?.gaMeasurementId === undefined
        )
      },
    },
    {
      name: "gaMeasurementIdDev",
      // TODO - Nice to have, list the user's available properties. Would
      // require the user to authenticate first to make the request.
      type: "input",
      message: "Google Analytics measurement ID for development: ",
      default: filter?.development?.gaMeasurementId || "none-provided",
      when: () => {
        return (
          filter.askAll || filter?.development?.gaMeasurementId === undefined
        )
      },
    },
    {
      name: "firebaseProjectIdProd",
      type: "input",
      message: "Firebase project ID to use for production:",
      // TODO - See if listing is useful. Probably should only do it if there's not a ton.
      default: filter?.production?.firebaseProjectId,
      when: () => {
        return (
          filter.askAll || filter?.production?.firebaseProjectId === undefined
        )
      },
    },
    {
      name: "firebaseProjectIdDev",
      type: "input",
      message: "Firebase project ID to use for development environment:",
      // TODO - See if listing is useful. Probably should only do it if there's not a ton.
      default: filter?.development?.firebaseProjectId,
      when: () => {
        return (
          filter.askAll || filter?.development?.firebaseProjectId === undefined
        )
      },
    },
    {
      name: "gapiClientIdProd",
      type: "input",
      // TODO - Check to see if there a way to make getting this value easier.
      // (or at least provide a link to where the user can find this value)
      message: "Google client ID to use for production:",
      default: filter?.production?.gapiClientId,
      when: () => {
        return filter.askAll || filter?.production?.gapiClientId === undefined
      },
    },
    {
      name: "gapiClientIdDev",
      type: "input",
      // TODO - Check to see if there a way to make getting this value easier.
      // (or at least provide a link to where the user can find this value)
      message: "Google client ID to use for development environment:",
      default: filter?.development?.gapiClientId,
      when: () => {
        return filter.askAll || filter?.development?.gapiClientId === undefined
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
  let currentConfig: RuntimeJson | undefined

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

  const questions = configQuestions(Object.assign({}, currentConfig, filter))

  const answers: Partial<ConfigAnswers> = await inquirer.prompt(questions)

  const asRuntime = toRuntimeJson(answers, currentConfig)

  const config = await ensureNecessaryFiles(asRuntime)
  return config
}

const toRuntimeJson = (
  answers: Partial<ConfigAnswers>,
  currentConfig: RuntimeJson
): RuntimeJson => {
  const production: ProductionConfig = {
    gaMeasurementId:
      answers.gaMeasurementIdProd || currentConfig.production.gaMeasurementId,
    firebaseProjectId:
      answers.firebaseProjectIdProd ||
      currentConfig.production.firebaseProjectId,
    gapiClientId:
      answers.gapiClientIdProd || currentConfig.production.gapiClientId,
  }

  const development: DevelopmentConfig = {
    gaMeasurementId:
      answers.gaMeasurementIdDev || currentConfig.development.gaMeasurementId,
    firebaseProjectId:
      answers.firebaseProjectIdDev ||
      currentConfig.development.firebaseProjectId,
    gapiClientId:
      answers.gapiClientIdDev || currentConfig.development.gapiClientId,
  }

  const fullConfig = { production, development }

  return assertAllValues(fullConfig)
}

const assertAllValues = (runtimeJson: RuntimeJson): RuntimeJson => {
  if (runtimeJson.development.gapiClientId === undefined) {
    throw new Error("Missing the development gapiClientId")
  }

  if (runtimeJson.development.gaMeasurementId === undefined) {
    throw new Error("Missing the development gaMeasurementId")
  }

  if (runtimeJson.development.firebaseProjectId === undefined) {
    throw new Error("Missing the development firebaseProjectId")
  }

  if (runtimeJson.production.gapiClientId === undefined) {
    throw new Error("Missing the production gapiClientId")
  }

  if (runtimeJson.production.gaMeasurementId === undefined) {
    throw new Error("Missing the production gaMeasurementId")
  }

  if (runtimeJson.production.firebaseProjectId === undefined) {
    throw new Error("Missing the production firebaseProjectId")
  }

  return runtimeJson
}
