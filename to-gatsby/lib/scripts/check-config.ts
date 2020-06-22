import * as fs from "fs"
import * as inquirer from "inquirer"
import { RuntimeJson, RuntimeJsonPath, Encoding } from "./types"

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

  // Overwrite `runtime.json` with provided configuration.
  fs.writeFileSync(RuntimeJsonPath, JSON.stringify(runtimeJson, null, "  "), {
    encoding: Encoding,
  })

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
      message: "Measurement ID for production: ",
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
      message: "Measurement ID for development: ",
      default: filter.gaMeasurementIdDev || "none-provided",
      when: () => {
        return filter.askAll || filter.gaMeasurementIdDev === undefined
      },
    },
  ]
}

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

  const answers = await inquirer.prompt(
    configQuestions(Object.assign({}, currentConfig, filter))
  )

  const merged = Object.assign({}, currentConfig, answers)

  const config = await ensureNecessaryFiles(merged)
  return config
}
