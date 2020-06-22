import * as fs from "fs"
import * as inquirer from "inquirer"
import { RuntimeJson, RuntimeJsonPath, Encoding } from "./types"

type ConfigQuestionFilter = {
  askAll?: true | undefined
}

const ensureNecessaryFiles = (runtimeJson: RuntimeJson): Promise<void> => {
  // Create `runtime.json` if it doesn't exist.
  const exists = fs.existsSync(RuntimeJsonPath)
  if (!exists) {
    fs.writeFileSync(RuntimeJsonPath, "")
  }

  // Overwrite `runtime.json` with provided configuration.
  fs.writeFileSync(RuntimeJsonPath, JSON.stringify(runtimeJson, null, "  "), {
    encoding: Encoding,
  })

  return
}

const configQuestions = (
  filter: ConfigQuestionFilter
): inquirer.QuestionCollection<RuntimeJson> => {
  return [
    {
      name: "gaMeasurementId",
      // TODO - Nice to have, list the user's available properties. Would
      // require the user to authenticate first to make the request & could be
      // optional.
      type: "input",
      message: "Measurement ID for production: ",
      default: "none-provided",
      when: () => {
        return filter.askAll
      },
    },
    {
      name: "gaMeasurementIdDev",
      // TODO - Nice to have, list the user's available properties. Would
      // require the user to authenticate first to make the request & could be
      // optional.
      type: "input",
      message: "Measurement ID for development: ",
      default: "none-provided",
      when: () => {
        return filter.askAll
      },
    },
  ]
}

// Ensures that required config files exist. If they don't, prompt the user for
// required values & creates necessary files.
export const checkConfig = async () => {
  console.log("Checking required configuration...")
  const exists = fs.existsSync(RuntimeJsonPath)

  let filter: ConfigQuestionFilter = {}

  // If file doesn't exist at all, prompt for all configuration entries.
  if (!exists) {
    filter = { askAll: true }
  }

  // TODO if some of the values were already there, make sure to merge answers
  // with the current values.
  const answers = await inquirer.prompt(configQuestions(filter))

  await ensureNecessaryFiles(answers)
  console.log(answers)
  return true
}
