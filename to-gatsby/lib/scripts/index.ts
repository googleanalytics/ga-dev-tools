import * as path from "path"
import * as fs from "fs"
import * as argparse from "argparse"

const PWD = process.cwd()

const RuntimeJsonPath = path.join(PWD, "runtime.json")

interface RuntimeJson {
  gaMeasurementId: string
  gaMeasurementIdDev: string
}

// Ensures that `runtime.json` exists. If it doesn't exist, prompts the user for
// required values & creates it.
const ensureRuntimeJson = async () => {
  console.log(`The path is: ${PWD}`)
  const exists = fs.existsSync(RuntimeJsonPath)
  if (!exists) {
    console.log(
      "You do not have a `runtime.json` file. \nPlease answer the following prompts to populate one:"
    )
  }
  return true
}

const getParser = async (): Promise<argparse.ArgumentParser> => {
  const parser = new argparse.ArgumentParser({
    version: "1.0",
    addHelp: true,
    description: "Scripts for managing ga-dev-tools development.",
  })
  return parser
}

const scripts = async () => {
  const parser = await getParser()
  const args = parser.parseArgs()
  console.log(args)

  console.log(
    "Placeholder for generalized scripts that check for requirements & allow fixing of them before actually running."
  )
  await ensureRuntimeJson()
}

scripts()
