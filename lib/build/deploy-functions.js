"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployFunctions = exports.ensureFirebaseFunctionsConfig = exports.ensureFirebaseLoginStatus = void 0;
const execa = require("execa");
const check_config_1 = require("./check-config");
const _1 = require(".");
exports.ensureFirebaseLoginStatus = async ({ noLocalhost, }) => {
    console.log("Logging out of firebase since tokens are shortlived...");
    await execa("yarn", ["run", "firebase", "logout"]);
    if (noLocalhost) {
        return execa("yarn", ["run", "firebase", "login", "--no-localhost"], {
            stderr: "inherit",
            stdout: "inherit",
            stdin: "inherit",
        });
    }
    else {
        return execa("yarn", ["run", "firebase", "login"], {
            stderr: "inherit",
            stdout: "inherit",
            stdin: "inherit",
        });
    }
};
exports.ensureFirebaseFunctionsConfig = async (environment, config) => {
    await exports.ensureFirebaseLoginStatus({ noLocalhost: config.noLocalhost });
    const environmentConfig = _1.configForEnvironment(environment, config);
    const bitlyClientId = config.production.bitlyClientId === check_config_1.SKIP_QUESTION
        ? ""
        : `bitly.client_id=${environmentConfig.bitlyClientId}`;
    const bitlyClientSecret = config.production.bitlyClientSecret === check_config_1.SKIP_QUESTION
        ? ""
        : `bitly.client_secret=${environmentConfig.bitlyClientSecret}`;
    const bitlyBaseUri = `bitly.base_uri=${environmentConfig.baseUri}`;
    // Don't call the command at all if all of these values were unset.
    if ([bitlyClientSecret, bitlyClientId].every(a => a === "")) {
        console.error("bitlyClientSecret and bitlyClientId are both required for functions deployment.");
        process.exit(1);
    }
    console.log("Updating Firebase functions environment configuration...");
    try {
        await execa("yarn", [
            "run",
            "firebase",
            "--project",
            environmentConfig.firebaseProjectId,
            "functions:config:set",
            bitlyClientId,
            bitlyClientSecret,
            bitlyBaseUri,
        ], {});
    }
    catch (e) {
        console.error("Couldn't update firebase functions config.");
        process.exit(1);
    }
    return;
};
exports.deployFunctions = async (args) => {
    const config = await check_config_1.checkConfig({
        all: false,
    });
    await exports.ensureFirebaseFunctionsConfig(args.environment, {
        ...config,
        noLocalhost: args.noLocalhost,
    });
    const environmentConfig = _1.configForEnvironment(args.environment, config);
    await execa("npm", [
        "run",
        "firebase",
        "--",
        "--project",
        environmentConfig.firebaseProjectId,
        "deploy",
        "--only",
        "functions",
    ], {
        stderr: "inherit",
        stdout: "inherit",
        stdin: "inherit",
    });
};
