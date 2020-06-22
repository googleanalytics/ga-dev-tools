import * as path from "path"
import * as fs from "fs"
import * as argparse from "argparse"
import * as inquirer from "inquirer"

const PWD = process.cwd()
const Encoding = "utf8"

const RuntimeJsonPath = path.join(PWD, "runtime.json")

interface RuntimeJson {
  gaMeasurementId: string
  gaMeasurementIdDev: string
}

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
const checkConfig = async () => {
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

interface CheckRuntimeFilesArgs {}

enum Command {
  CheckRequiredConfiguration = "check-config",
}

type Args = CheckRuntimeFilesArgs & { cmd: Command }

const getParser = async (): Promise<argparse.ArgumentParser> => {
  const parser = new argparse.ArgumentParser({
    version: "1.0",
    addHelp: true,
    description: "Scripts for managing ga-dev-tools development.",
  })

  const subparsers = parser.addSubparsers({
    title: "Sub command",
    dest: "cmd",
  })

  subparsers.addParser("check-config", {
    help:
      "Ensures that all necessary configuration files exist & have required values.",
  })

  return parser
}

const scripts = async () => {
  const parser = await getParser()
  const args = parser.parseArgs() as Args

  switch (args.cmd) {
    case Command.CheckRequiredConfiguration: {
      await checkConfig()
      break
    }
  }

  process.exit(0)
}

scripts()
