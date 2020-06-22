import * as argparse from "argparse"
import { checkConfig } from "./check-config"
import { build } from "./build"

interface CheckRuntimeFilesArgs {}

enum Command {
  CheckRequiredConfiguration = "check-config",
  Build = "build",
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

  subparsers.addParser(Command.CheckRequiredConfiguration, {
    help:
      "Ensures that all necessary configuration files exist & have required values.",
  })

  subparsers.addParser(Command.Build, {
    help: "Builds the project. Runs any necessary validation before building.",
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
    case Command.Build: {
      await build()
      break
    }
  }

  process.exit(0)
}

scripts()
