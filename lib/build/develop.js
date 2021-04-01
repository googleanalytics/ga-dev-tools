"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.develop = void 0;
// yarn check-types && gatsby develop --host=0.0.0.0"
const check_config_1 = require("./check-config");
const execa = require("execa");
exports.develop = async () => {
    // TODO - update check config to take an argument for which command it is
    // running. All commands don't require all config to be set and this would
    // make it easier to get started.
    await check_config_1.checkConfig({ all: false });
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
