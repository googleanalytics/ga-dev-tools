"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const check_config_1 = require("./check-config");
const execa = require("execa");
const checkTypes = async () => {
    console.log("Checking typescript types...");
    await execa("yarn", ["run", "check-types"], {
        stderr: "inherit",
        stdout: "inherit",
        stdin: "inherit",
    });
};
// Building makes sure all necessary config items are provided, then runs gatsby build with all necessary environment variables.
exports.build = async (shouldCheckConfig = true) => {
    if (shouldCheckConfig) {
        await check_config_1.checkConfig({ all: false });
    }
    await checkTypes();
    // Delete cache & public contents before a build to keep things neat.
    await execa("yarn", ["run", "gatsby", "clean"], {
        stderr: "inherit",
        stdout: "inherit",
        stdin: "inherit",
    });
    await execa("yarn", ["run", "gatsby", "build"], {
        stderr: "inherit",
        stdout: "inherit",
        stdin: "inherit",
    });
    return;
};
