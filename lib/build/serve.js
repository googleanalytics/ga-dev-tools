"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = void 0;
const execa = require("execa");
const build_1 = require("./build");
const types_1 = require("./types");
const check_config_1 = require("./check-config");
exports.serve = async (args) => {
    const config = await check_config_1.checkConfig({ all: false });
    let projectId;
    if (args.environment === types_1.Environment.Staging) {
        console.error(`Note: serving using the staging environment isn't fully supported. You should use "yarn start" instead to run locally.`);
        process.exit(1);
    }
    else if (args.environment === types_1.Environment.Production) {
        projectId = config.production.firebaseProjectId;
    }
    else {
        throw new Error("Unreachable");
    }
    if (!args.skipBuild) {
        await build_1.build(false);
    }
    await execa("yarn", ["run", "firebase", "--project", projectId, "serve", "--host", "0.0.0.0"], {
        stderr: "inherit",
        stdout: "inherit",
        stdin: "inherit",
    });
    return;
};
