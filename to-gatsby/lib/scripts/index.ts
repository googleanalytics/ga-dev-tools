import * as argparse from "argparse"
import { checkConfig } from "./check-config"
import { build } from "./build"
import { develop } from "./develop"
import { serve } from "./serve"
import { stage } from "./stage"
import { Command, Args } from "./types"

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

  subparsers.addParser(Command.StageToIntegration, {
    help: "Builds the project, then stages it to `firebaseStagingProjectId`.",
  })

  subparsers.addParser(Command.Develop, {
    help:
      "Runs a local dev server. Runs any necessary validation before serving.",
  })

  const serveParser = subparsers.addParser(Command.Serve, {
    help:
      "Serves the content in the build directory locally through the Firebase cli.",
  })
  serveParser.addArgument("--skip_build", {
    defaultValue: false,
    dest: "skipBuild",
    action: "storeTrue",
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
    case Command.Develop: {
      await develop()
      break
    }
    case Command.Serve: {
      await serve(args)
      break
    }
    case Command.StageToIntegration: {
      await stage("integration")
      break
    }
  }

  process.exit(0)
}

scripts()
