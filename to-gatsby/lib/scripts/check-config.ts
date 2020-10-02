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
  CheckConfigArgs,
} from "./types"
import * as execa from "execa"

type ConfigQuestionFilter = {
  askAll?: true | undefined
} & Partial<RuntimeJson>

type WriteEnvArgs =
  | { file: "prod"; config: ProductionConfig }
  | { file: "dev"; config: DevelopmentConfig }
const writeEnvFile = async ({ file, config }: WriteEnvArgs) => {
  const path =
    file === "prod"
      ? DotEnvProductionPath
      : file === "dev"
      ? DotEnvDevelopmentPath
      : undefined

  if (path === undefined) {
    console.error(`Path type: ${file} not supported.`)
    process.exit(1)
  }

  // If any questions are skipped, don't include them in the outgoing .env
  // files so they are `undefined` for `process.env[ENV_NAME]`.
  const gapiLine =
    config.gapiClientId === SKIP_QUESTION
      ? undefined
      : `GAPI_CLIENT_ID=${config.gapiClientId}`
  const bitlyLine =
    config.bitlyClientId === SKIP_QUESTION
      ? undefined
      : `BITLY_CLIENT_ID=${config.bitlyClientId}`
  const measurementIdLine =
    config.gaMeasurementId === SKIP_QUESTION
      ? undefined
      : `GA_MEASUREMENT_ID=${config.gaMeasurementId}`
  const firebaseFunctionsBaseUrlLine = `FUNCTIONS_BASE_URL=${config.firebaseFunctionsBaseUrl}`

  fs.writeFileSync(
    path,
    [gapiLine, bitlyLine, measurementIdLine, firebaseFunctionsBaseUrlLine].join(
      "\n"
    ),
    {
      encoding: Encoding,
    }
  )
}

const ensureFirebaseFunctionsConfig = async (
  config: RuntimeJson
): Promise<void> => {
  const bitlyClientId =
    config.production.bitlyClientId === SKIP_QUESTION
      ? ""
      : `bitly.client_id=${config.production.bitlyClientId}`
  const bitlyClientSecret =
    config.production.bitlyClientSecret === SKIP_QUESTION
      ? ""
      : `bitly.client_secret=${config.production.bitlyClientSecret}`

  const bitlyBaseUriProd = `bitly.base_uri=${config.production.baseUri}`
  const bitlyBaseUriDev = `bitly.base_uri=${config.development.baseUri}`

  // Don't call the command at all if all of these values were unset.
  if ([bitlyClientSecret, bitlyClientId].every(a => a === "")) {
    console.log(
      "Skipping Firebase functions environment configuration because no values were provided."
    )
    return
  }

  console.log("Updating Firebase functions environment configuration...")

  try {
    await execa(
      "yarn",
      [
        "run",
        "firebase",
        "--project",
        config.development.firebaseProjectId,
        "functions:config:set",
        bitlyClientId,
        bitlyClientSecret,
        bitlyBaseUriDev,
      ],
      {}
    )
    await execa(
      "yarn",
      [
        "run",
        "firebase",
        "--project",
        config.production.firebaseProjectId,
        "functions:config:set",
        bitlyClientId,
        bitlyClientSecret,
        bitlyBaseUriProd,
      ],
      {}
    )
  } catch (e) {
    console.error("Couldn't update firebase functions config.")
    process.exit(1)
  }
  return
}

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

  await writeEnvFile({ file: "prod", config: runtimeJson.production })
  await writeEnvFile({ file: "dev", config: runtimeJson.development })

  return runtimeJson
}

// TODO - Make sure to account for these values in the code and log an
// appropriate error for pages where they are required.
const SKIP_QUESTION = "Leave blank to skip"

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
      name: "baseUriProd",
      type: "input",
      message: "Domain of production service (including https://):",
      default: filter?.production?.baseUri || SKIP_QUESTION,
      when: () => {
        return filter.askAll || filter?.production?.baseUri === undefined
      },
    },
    {
      name: "gaMeasurementIdProd",
      // TODO - Nice to have, list the user's available properties. Would
      // require the user to authenticate first to make the request.
      type: "input",
      message: "Google Analytics measurement ID for production: ",
      default: filter?.production?.gaMeasurementId || SKIP_QUESTION,
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
      default: filter?.development?.gaMeasurementId || SKIP_QUESTION,
      when: () => {
        return (
          filter.askAll || filter?.development?.gaMeasurementId === undefined
        )
      },
    },
    {
      // TODO - Nice to have. Accept a value that lets the user create a new
      // firebase project if they don't already have one. The firebase cli
      // supports this so it shouldn't bee too tricky. This should probably use
      // the --json flag for the cli so the data comes back in a useful format.
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
      default: filter?.production?.gapiClientId || SKIP_QUESTION,
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
      default: filter?.development?.gapiClientId || SKIP_QUESTION,
      when: () => {
        return filter.askAll || filter?.development?.gapiClientId === undefined
      },
    },
    {
      name: "bitlyClientId",
      type: "input",
      message: "Bit.ly client ID:",
      default: filter?.production?.bitlyClientId || SKIP_QUESTION,
      when: () => {
        return filter.askAll || filter?.production?.bitlyClientId === undefined
      },
    },
    {
      name: "bitlyClientSecret",
      type: "input",
      message: "Bit.ly client secret:",
      default: filter?.production?.bitlyClientSecret || SKIP_QUESTION,
      when: () => {
        return (
          filter.askAll || filter?.production?.bitlyClientSecret === undefined
        )
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
export const checkConfig = async (
  args: Omit<CheckConfigArgs, "cmd">
): Promise<RuntimeJson> => {
  console.log("Checking required configuration...")

  // Make sure user is logged into Firebase.
  await ensureFirebaseLoginStatus()

  const exists = fs.existsSync(RuntimeJsonPath)

  let filter: ConfigQuestionFilter = {}
  let currentConfig: RuntimeJson | undefined

  if (!exists || args.all) {
    filter = { askAll: true }
  }
  if (exists) {
    // If there is already a config file, read it in to use as the default
    // values.
    currentConfig = JSON.parse(
      fs.readFileSync(RuntimeJsonPath, { encoding: Encoding })
    )
  }

  const questions = configQuestions(Object.assign({}, currentConfig, filter))

  const answers: Partial<ConfigAnswers> = await inquirer.prompt(questions)

  const asRuntime = toRuntimeJson(answers, currentConfig)

  const config = await ensureNecessaryFiles(asRuntime)

  await ensureFirebaseFunctionsConfig(config)

  return config
}

const toRuntimeJson = (
  answers: Partial<ConfigAnswers>,
  currentConfig: RuntimeJson
): RuntimeJson => {
  const production: ProductionConfig = {
    baseUri: answers.baseUriProd || currentConfig.production.baseUri,
    gaMeasurementId:
      answers.gaMeasurementIdProd || currentConfig.production.gaMeasurementId,
    firebaseProjectId:
      answers.firebaseProjectIdProd ||
      currentConfig.production.firebaseProjectId,
    gapiClientId:
      answers.gapiClientIdProd || currentConfig.production.gapiClientId,
    bitlyClientId:
      answers.bitlyClientId || currentConfig.production.bitlyClientId,
    bitlyClientSecret:
      answers.bitlyClientSecret || currentConfig.production.bitlyClientSecret,
    firebaseFunctionsBaseUrl:
      currentConfig.production.firebaseFunctionsBaseUrl ||
      `https://us-central1-${
        answers.firebaseProjectIdProd ||
        currentConfig.production.firebaseProjectId
      }.cloudfunctions.net/bitly_auth`,
  }

  const development: DevelopmentConfig = {
    // TODO - This could be a bit smarter. Especially if we support changing the port.
    baseUri: currentConfig.development.baseUri || "http://localhost:5000",
    gaMeasurementId:
      answers.gaMeasurementIdDev || currentConfig.development.gaMeasurementId,
    firebaseProjectId:
      answers.firebaseProjectIdDev ||
      currentConfig.development.firebaseProjectId,
    gapiClientId:
      answers.gapiClientIdDev || currentConfig.development.gapiClientId,
    // We intentially don't support a different clientID & clientSecret for
    // bitly for dev.
    bitlyClientId:
      answers.bitlyClientId || currentConfig.production.bitlyClientId,
    bitlyClientSecret:
      answers.bitlyClientSecret || currentConfig.production.bitlyClientSecret,
    firebaseFunctionsBaseUrl:
      currentConfig.development.firebaseFunctionsBaseUrl ||
      `https://us-central1-${
        answers.firebaseProjectIdDev ||
        currentConfig.development.firebaseProjectId
      }.cloudfunctions.net/bitly_auth`,
  }

  const fullConfig = { production, development }

  let asserted: RuntimeJson
  try {
    asserted = assertAllValues(fullConfig)
  } catch (e) {
    console.error(e.message)
    process.exit(1)
  }
  return asserted
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

  if (runtimeJson.development.firebaseFunctionsBaseUrl === undefined) {
    throw new Error("Missing the development firebase functions base url")
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

  if (runtimeJson.production.firebaseFunctionsBaseUrl === undefined) {
    throw new Error("Missing the production firebase functions base url")
  }

  if (runtimeJson.production.bitlyClientId === undefined) {
    throw new Error("Missing the bitly clientId")
  }

  if (runtimeJson.production.bitlyClientSecret === undefined) {
    throw new Error("Missing the bitly clientSecret")
  }

  return runtimeJson
}
