"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configForEnvironment = void 0;
const argparse = require("argparse");
const check_config_1 = require("./check-config");
const build_1 = require("./build");
const develop_1 = require("./develop");
const serve_1 = require("./serve");
const stage_1 = require("./stage");
const types_1 = require("./types");
const deploy_functions_1 = require("./deploy-functions");
exports.configForEnvironment = (environment, config) => {
    let environmentConfig;
    switch (environment) {
        case types_1.Environment.Staging:
            environmentConfig = config.staging;
            break;
        case types_1.Environment.Production:
            environmentConfig = config.production;
            break;
        default:
            console.error(`Environment: ${environment} is not supported.`);
            process.exit(1);
    }
    return environmentConfig;
};
// TODO - We should add some tests for pure functions in here for a bit more
// confidence.
const getParser = async () => {
    const parser = new argparse.ArgumentParser({
        version: "1.0",
        addHelp: true,
        description: "Scripts for managing ga-dev-tools development.",
    });
    const subparsers = parser.addSubparsers({
        title: "Sub command",
        dest: "cmd",
    });
    const checkConfigParser = subparsers.addParser(types_1.Command.CheckConfig, {
        help: "Ensures that all necessary configuration files exist & have required values.",
    });
    checkConfigParser.addArgument("--all", {
        defaultValue: false,
        dest: "all",
        action: "storeTrue",
    });
    const buildParser = subparsers.addParser(types_1.Command.Build, {
        help: "Builds the project. Runs any necessary validation before building.",
    });
    // TODO - It's probably worth implementing a workaround so this can be built
    // using the development environment variables. Right now, this works great
    // for local development, but it's less useful for the staging site.
    const deployParser = subparsers.addParser(types_1.Command.Deploy, {
        help: "Builds the project and deploys it to `--environment`.",
    });
    const deployFunctionsParser = subparsers.addParser(types_1.Command.DeployFunctions, {
        help: "Builds ./functions project and deploys it to `--environment`.",
    });
    [deployParser, deployFunctionsParser].map(parser => parser.addArgument("--no-localhost", {
        defaultValue: false,
        dest: "noLocalhost",
        action: "storeTrue",
    }));
    const developParser = subparsers.addParser(types_1.Command.Develop, {
        help: "Runs a local dev server. Runs any necessary validation before serving.",
    });
    const serveParser = subparsers.addParser(types_1.Command.Serve, {
        help: "Serves the content in the build directory locally through the Firebase cli.",
    });
    serveParser.addArgument("--skip_build", {
        defaultValue: false,
        dest: "skipBuild",
        action: "storeTrue",
    });
    [
        buildParser,
        serveParser,
        deployParser,
        deployFunctionsParser,
        developParser,
    ].forEach(parser => {
        parser.addArgument("--environment", {
            required: true,
            dest: "environment",
            choices: Object.values(types_1.Environment),
        });
    });
    return parser;
};
const scripts = async () => {
    const parser = await getParser();
    const args = parser.parseArgs();
    switch (args.cmd) {
        case types_1.Command.CheckConfig: {
            await check_config_1.checkConfig(args);
            break;
        }
        case types_1.Command.Build: {
            await build_1.build();
            break;
        }
        case types_1.Command.Develop: {
            await develop_1.develop(args);
            break;
        }
        case types_1.Command.Serve: {
            await serve_1.serve(args);
            break;
        }
        case types_1.Command.Deploy: {
            await stage_1.stage(args);
            break;
        }
        case types_1.Command.DeployFunctions: {
            await deploy_functions_1.deployFunctions(args);
            break;
        }
    }
    process.exit(0);
};
scripts();
