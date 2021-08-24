import * as fs from "fs"
import * as inquirer from "inquirer"
import {
  RuntimeJson,
  RuntimeJsonPath,
  Encoding,
  DotEnvProductionPath,
  ConfigAnswers,
  ProductionConfig,
  CheckConfigArgs,
  StagingConfig,
  CommonConfig,
  AnswerNames,
  DotEnvDevelopmentPath,
} from "./types"

type ConfigQuestionFilter = {
  askAll?: true | undefined
} & Partial<RuntimeJson>

export const writeEnvFile = async (
  config: CommonConfig,
  endpointName: string = "bitly_auth"
) => {
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

  const authEndpointLine = `AUTH_ENDPOINT=https://us-central1-${config.firebaseProjectId}.cloudfunctions.net/${endpointName}`

  const measurementIdLine = `GA_MEASUREMENT_ID=${config.measurementId}`

  ;[DotEnvProductionPath, DotEnvDevelopmentPath].map(path =>
    fs.writeFileSync(
      path,
      [gapiLine, bitlyLine, authEndpointLine, measurementIdLine].join("\n"),
      {
        encoding: Encoding,
      }
    )
  )
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

  // Overwrite `runtime.json` with provided configuration.
  fs.writeFileSync(RuntimeJsonPath, JSON.stringify(runtimeJson, null, "  "), {
    encoding: Encoding,
  })

  return runtimeJson
}

// TODO - Make sure to account for these values in the code and log an
// appropriate error for pages where they are required.
export const SKIP_QUESTION = "Leave blank to skip"

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
      name: AnswerNames.BaseUriProd,
      type: "input",
      message: "Domain of production service including https:// (production):",
      default: filter?.production?.baseUri || SKIP_QUESTION,
      when: () => {
        return filter.askAll || filter?.production?.baseUri === undefined
      },
    },
    {
      // TODO - Nice to have. Accept a value that lets the user create a new
      // firebase project if they don't already have one. The firebase cli
      // supports this so it shouldn't bee too tricky. This should probably use
      // the --json flag for the cli so the data comes back in a useful format.
      name: AnswerNames.FirebaseProjectIdProd,
      type: "input",
      message: "Firebase project ID (production):",
      // TODO - See if listing is useful. Probably should only do it if there's not a ton.
      default: filter?.production?.firebaseProjectId || SKIP_QUESTION,
      when: () => {
        return (
          filter.askAll || filter?.production?.firebaseProjectId === undefined
        )
      },
    },
    {
      name: AnswerNames.GapiClientIdProd,
      type: "input",
      // TODO - Check to see if there a way to make getting this value easier.
      // (or at least provide a link to where the user can find this value)
      message: "Google client ID (production):",
      default: filter?.production?.gapiClientId || SKIP_QUESTION,
      when: () => {
        return filter.askAll || filter?.production?.gapiClientId === undefined
      },
    },
    {
      name: AnswerNames.BitlyClientIdProd,
      type: "input",
      message: "Bit.ly client ID (production):",
      default: filter?.production?.bitlyClientId || SKIP_QUESTION,
      when: () => {
        return filter.askAll || filter?.production?.bitlyClientId === undefined
      },
    },
    {
      name: AnswerNames.BitlyClientSecretProd,
      type: "input",
      message: "Bit.ly client secret (production):",
      default: filter?.production?.bitlyClientSecret || SKIP_QUESTION,
      when: () => {
        return (
          filter.askAll || filter?.production?.bitlyClientSecret === undefined
        )
      },
    },
    {
      name: AnswerNames.MeasurementIdProd,
      type: "input",
      message: "GA Measurement ID (production):",
      default: filter?.production?.measurementId || SKIP_QUESTION,
      when: () => {
        return filter.askAll || filter?.production?.measurementId === undefined
      },
    },
    // Staging questions
    {
      name: AnswerNames.BaseUriStaging,
      type: "input",
      message: "Domain of service including https:// (staging):",
      default: filter?.staging?.baseUri || SKIP_QUESTION,
      when: () => {
        return filter.askAll || filter?.staging?.baseUri === undefined
      },
    },
    {
      name: AnswerNames.FirebaseProjectIdStaging,
      type: "input",
      message: "Firebase project ID (staging):",
      // TODO - See if listing is useful. Probably should only do it if there's not a ton.
      default: filter?.staging?.firebaseProjectId || SKIP_QUESTION,
      when: () => {
        return filter.askAll || filter?.staging?.firebaseProjectId === undefined
      },
    },
    {
      name: AnswerNames.GapiClientIdStaging,
      type: "input",
      // TODO - Check to see if there a way to make getting this value easier.
      // (or at least provide a link to where the user can find this value)
      message: "Google client ID (staging):",
      default: filter?.staging?.gapiClientId || SKIP_QUESTION,
      when: () => {
        return filter.askAll || filter?.staging?.gapiClientId === undefined
      },
    },
    {
      name: AnswerNames.BitlyClientIdStaging,
      type: "input",
      message: "Bit.ly client ID (staging):",
      default: filter?.staging?.bitlyClientId || SKIP_QUESTION,
      when: () => {
        return filter.askAll || filter?.staging?.bitlyClientId === undefined
      },
    },
    {
      name: AnswerNames.BitlyClientSecretStaging,
      type: "input",
      message: "Bit.ly client secret (staging):",
      default: filter?.staging?.bitlyClientSecret || SKIP_QUESTION,
      when: () => {
        return filter.askAll || filter?.staging?.bitlyClientSecret === undefined
      },
    },
    {
      name: AnswerNames.MeasurementIdStaging,
      type: "input",
      message: "GA Measurement ID (staging):",
      default: filter?.staging?.measurementId || SKIP_QUESTION,
      when: () => {
        return filter.askAll || filter?.staging?.measurementId === undefined
      },
    },
  ]
}

// TODO - Check config should take a flag to force a reauth for firebase since
// the token is short-lived.

// Ensures that required config files exist. If they don't, prompt the user for
// required values & creates necessary files.
export const checkConfig = async (
  args: Omit<CheckConfigArgs, "cmd">
): Promise<RuntimeJson> => {
  console.log("Checking required configuration...")

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

  return config
}

const throwIfUndefined = <T>(value: T | undefined): T => {
  if (value === undefined) {
    throw new Error("Value cannot be undefined")
  } else {
    return value
  }
}

const toRuntimeJson = (
  answers: Partial<ConfigAnswers>,
  currentConfig: RuntimeJson | undefined
): RuntimeJson => {
  const production: ProductionConfig = {
    measurementId: throwIfUndefined(
      answers.measurementIdProd || currentConfig?.production.measurementId
    ),
    baseUri:
      answers.baseUriProd ||
      currentConfig?.production?.baseUri ||
      "http://localhost:5000",
    firebaseProjectId: throwIfUndefined(
      answers.firebaseProjectIdProd ||
        currentConfig?.production?.firebaseProjectId
    ),
    gapiClientId: throwIfUndefined(
      answers.gapiClientIdProd || currentConfig?.production?.gapiClientId
    ),
    bitlyClientId: throwIfUndefined(
      answers.bitlyClientIdProd || currentConfig?.production?.bitlyClientId
    ),
    bitlyClientSecret: throwIfUndefined(
      answers.bitlyClientSecretProd ||
        currentConfig?.production?.bitlyClientSecret
    ),
  }

  const staging: StagingConfig = {
    measurementId: throwIfUndefined(
      answers.measurementIdStaging || currentConfig?.staging.measurementId
    ),
    // TODO - This could be a bit smarter. Especially if we support changing the port.
    baseUri:
      answers.baseUriStaging ||
      currentConfig?.staging?.baseUri ||
      "http://localhost:5000",
    firebaseProjectId: throwIfUndefined(
      answers.firebaseProjectIdStaging ||
        currentConfig?.staging?.firebaseProjectId
    ),
    gapiClientId: throwIfUndefined(
      answers.gapiClientIdStaging || currentConfig?.staging?.gapiClientId
    ),
    bitlyClientId: throwIfUndefined(
      answers.bitlyClientIdStaging || currentConfig?.staging?.bitlyClientId
    ),
    bitlyClientSecret: throwIfUndefined(
      answers.bitlyClientSecretStaging ||
        currentConfig?.staging?.bitlyClientSecret
    ),
  }

  const fullConfig = { production, staging }

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
  if (runtimeJson.staging.gapiClientId === undefined) {
    throw new Error("Missing the staging gapiClientId")
  }

  if (runtimeJson.staging.firebaseProjectId === undefined) {
    throw new Error("Missing the staging firebaseProjectId")
  }

  if (runtimeJson.staging.bitlyClientSecret === undefined) {
    throw new Error("Missing the staging bitly client secret")
  }

  if (runtimeJson.staging.bitlyClientId === undefined) {
    throw new Error("Missing the staging bitly client id")
  }

  if (runtimeJson.staging.baseUri === undefined) {
    throw new Error("Missing the staging base url")
  }

  if (runtimeJson.staging.measurementId === undefined) {
    throw new Error("Missing the staging measurement ID")
  }

  if (runtimeJson.production.gapiClientId === undefined) {
    throw new Error("Missing the production gapiClientId")
  }

  if (runtimeJson.production.firebaseProjectId === undefined) {
    throw new Error("Missing the production firebaseProjectId")
  }

  if (runtimeJson.production.bitlyClientId === undefined) {
    throw new Error("Missing the bitly clientId")
  }

  if (runtimeJson.production.bitlyClientSecret === undefined) {
    throw new Error("Missing the bitly clientSecret")
  }

  if (runtimeJson.production.baseUri === undefined) {
    throw new Error("Missing the production base url")
  }

  if (runtimeJson.production.measurementId === undefined) {
    throw new Error("Missing the production measurement ID")
  }

  return runtimeJson
}
