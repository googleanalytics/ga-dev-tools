import argparse from "argparse"
import { checkConfig } from "./check-config.js"
import { build } from "./build.js"
import { develop } from "./develop.js"
import { serve } from "./serve.js"
import { stage } from "./stage.js"
import { Command, Environment } from "./types.js"
import { deployFunctions } from "./deploy-functions.js"
export const configForEnvironment = (environment, config) => {
  let environmentConfig
  switch (environment) {
    case Environment.Staging:
      environmentConfig = config.staging
      break
    case Environment.Production:
      environmentConfig = config.production
      break
    default:
      console.error(`Environment: ${environment} is not supported.`)
      process.exit(1)
  }
  return environmentConfig
}
// TODO - We should add some tests for pure functions in here for a bit more
// confidence.
const getParser = async () => {
  const parser = new argparse.ArgumentParser({
    add_help: true,
    description: "Scripts for managing ga-dev-tools development.",
  })
  const subparsers = parser.add_subparsers({
    title: "Sub command",
    dest: "cmd",
  })
  const checkConfigParser = subparsers.add_parser(Command.CheckConfig, {
    help: "Ensures that all necessary configuration files exist & have required values.",
  })
  checkConfigParser.add_argument("--all", {
    default: false,
    dest: "all",
    action: "storeTrue",
  })
  const buildParser = subparsers.add_parser(Command.Build, {
    help: "Builds the project. Runs any necessary validation before building.",
  })
  // TODO - It's probably worth implementing a workaround so this can be built
  // using the development environment variables. Right now, this works great
  // for local development, but it's less useful for the staging site.
  const deployParser = subparsers.add_parser(Command.Deploy, {
    help: "Builds the project and deploys it to `--environment`.",
  })
  const deployFunctionsParser = subparsers.add_parser(Command.DeployFunctions, {
    help: "Builds ./functions project and deploys it to `--environment`.",
  })
  ;[deployParser, deployFunctionsParser].map(parser =>
    parser.add_argument("--no-localhost", {
      default: false,
      dest: "noLocalhost",
      action: "storeTrue",
    })
  )
  const developParser = subparsers.add_parser(Command.Develop, {
    help: "Runs a local dev server. Runs any necessary validation before serving.",
  })
  const serveParser = subparsers.add_parser(Command.Serve, {
    help: "Serves the content in the build directory locally through the Firebase cli.",
  })
  serveParser.add_argument("--skip_build", {
    default: false,
    dest: "skipBuild",
    action: "storeTrue",
  })
  ;[
    buildParser,
    serveParser,
    deployParser,
    deployFunctionsParser,
    developParser,
  ].forEach(parser => {
    parser.add_argument("--environment", {
      required: true,
      dest: "environment",
      choices: Object.values(Environment),
    })
  })
  return parser
}
const scripts = async () => {
  const parser = await getParser()
  const args = parser.parse_args()
  switch (args.cmd) {
    case Command.CheckConfig: {
      await checkConfig(args)
      break
    }
    case Command.Build: {
      await build()
      break
    }
    case Command.Develop: {
      await develop(args)
      break
    }
    case Command.Serve: {
      await serve(args)
      break
    }
    case Command.Deploy: {
      await stage(args)
      break
    }
    case Command.DeployFunctions: {
      await deployFunctions(args)
      break
    }
  }
  process.exit(0)
}
scripts()
