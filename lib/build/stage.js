"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stage = void 0;
const execa = require("execa");
const build_1 = require("./build");
const check_config_1 = require("./check-config");
const types_1 = require("./types");
exports.stage = async (args) => {
    const config = await check_config_1.checkConfig({ all: false });
    let projectId;
    if (args.environment === types_1.Environment.Development) {
        // TODO - support development deployments.
        projectId = config.development.firebaseProjectId;
        console.error(`Note: deploying using the development environment supported.`);
        process.exit(1);
    }
    else if (args.environment === types_1.Environment.Production) {
        projectId = config.production.firebaseProjectId;
    }
    else {
        throw new Error("unreachable");
    }
    await build_1.build(false);
    await execa("yarn", ["run", "firebase", "--project", projectId, "deploy", "--only", "hosting"], {
        stderr: "inherit",
        stdout: "inherit",
        stdin: "inherit",
    });
    return;
};
