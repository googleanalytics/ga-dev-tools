"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.develop = void 0;
// yarn check-types && gatsby develop --host=0.0.0.0"
const check_config_1 = require("./check-config");
const execa = require("execa");
const _1 = require(".");
exports.develop = async (args) => {
    const config = await check_config_1.checkConfig({ all: false });
    await check_config_1.writeEnvFile(_1.configForEnvironment(args.environment, config));
    // We use port 5000 because the generated oauth client for a firebase allows
    // port 5000 by default on localhost. The developer can change this value, but
    // they'll need to make sure that the host+post they use is set in the
    // Authorized JavaScript origins.
    await execa("yarn", ["gatsby", "develop", "--host=0.0.0.0", "--port=5000"], {
        stderr: "inherit",
        stdout: "inherit",
        stdin: "inherit",
    });
    return;
};
