"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkConfig = exports.ensureFirebaseFunctionsConfig = exports.writeEnvFile = void 0;
const fs = require("fs");
const inquirer = require("inquirer");
const types_1 = require("./types");
const execa = require("execa");
exports.writeEnvFile = async (config) => {
    // If any questions are skipped, don't include them in the outgoing .env
    // files so they are `undefined` for `process.env[ENV_NAME]`.
    const gapiLine = config.gapiClientId === SKIP_QUESTION
        ? undefined
        : `GAPI_CLIENT_ID=${config.gapiClientId}`;
    const bitlyLine = config.bitlyClientId === SKIP_QUESTION
        ? undefined
        : `BITLY_CLIENT_ID=${config.bitlyClientId}`;
    const firebaseFunctionsBaseUrlLine = `FUNCTIONS_BASE_URL=${config.firebaseFunctionsBaseUrl}`;
    fs.writeFileSync(types_1.DotEnvProductionPath, [gapiLine, bitlyLine, firebaseFunctionsBaseUrlLine].join("\n"), {
        encoding: types_1.Encoding,
    });
};
exports.ensureFirebaseFunctionsConfig = async (config) => {
    await ensureFirebaseLoginStatus({ noLocalhost: config.noLocalhost });
    const bitlyClientId = config.production.bitlyClientId === SKIP_QUESTION
        ? ""
        : `bitly.client_id=${config.production.bitlyClientId}`;
    const bitlyClientSecret = config.production.bitlyClientSecret === SKIP_QUESTION
        ? ""
        : `bitly.client_secret=${config.production.bitlyClientSecret}`;
    const bitlyBaseUriProd = `bitly.base_uri=${config.production.baseUri}`;
    const bitlyBaseUriDev = `bitly.base_uri=${config.staging.baseUri}`;
    // Don't call the command at all if all of these values were unset.
    if ([bitlyClientSecret, bitlyClientId].every(a => a === "")) {
        console.log("Skipping Firebase functions environment configuration because no values were provided.");
        return;
    }
    console.log("Updating Firebase functions environment configuration...");
    try {
        await execa("yarn", [
            "run",
            "firebase",
            "--project",
            config.staging.firebaseProjectIdFunctions,
            "functions:config:set",
            bitlyClientId,
            bitlyClientSecret,
            bitlyBaseUriDev,
        ], {});
        await execa("yarn", [
            "run",
            "firebase",
            "--project",
            config.production.firebaseProjectIdFunctions,
            "functions:config:set",
            bitlyClientId,
            bitlyClientSecret,
            bitlyBaseUriProd,
        ], {});
    }
    catch (e) {
        console.error("Couldn't update firebase functions config.");
        process.exit(1);
    }
    return;
};
const ensureNecessaryFiles = async (runtimeJson) => {
    // TODO - Ideally this only re-writes a file if there's actually a difference
    // between the current one and the new data.
    // Create `runtime.json` if it doesn't exist.
    const exists = fs.existsSync(types_1.RuntimeJsonPath);
    if (!exists) {
        fs.writeFileSync(types_1.RuntimeJsonPath, "");
    }
    // Overwrite `runtime.json` with provided configuration.
    fs.writeFileSync(types_1.RuntimeJsonPath, JSON.stringify(runtimeJson, null, "  "), {
        encoding: types_1.Encoding,
    });
    return runtimeJson;
};
// TODO - Make sure to account for these values in the code and log an
// appropriate error for pages where they are required.
const SKIP_QUESTION = "Leave blank to skip";
// Given a filter, returns an array of questions to be asked to make sure all
// required configuration data is present. The filter allows some questions to
// be skipped if already provided.
const configQuestions = (filter) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    // TODO the `?.`s can be removed once this has stabilized. They're here now to
    // be friendly as the runtimeJson type evolves.
    return [
        {
            name: "baseUriProd",
            type: "input",
            message: "Domain of production service including https:// (production):",
            default: ((_a = filter === null || filter === void 0 ? void 0 : filter.production) === null || _a === void 0 ? void 0 : _a.baseUri) || SKIP_QUESTION,
            when: () => {
                var _a;
                return filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.production) === null || _a === void 0 ? void 0 : _a.baseUri) === undefined;
            },
        },
        {
            // TODO - Nice to have. Accept a value that lets the user create a new
            // firebase project if they don't already have one. The firebase cli
            // supports this so it shouldn't bee too tricky. This should probably use
            // the --json flag for the cli so the data comes back in a useful format.
            name: "firebaseProjectIdProd",
            type: "input",
            message: "Firebase project ID (production):",
            // TODO - See if listing is useful. Probably should only do it if there's not a ton.
            default: ((_b = filter === null || filter === void 0 ? void 0 : filter.production) === null || _b === void 0 ? void 0 : _b.firebaseProjectId) || SKIP_QUESTION,
            when: () => {
                var _a;
                return (filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.production) === null || _a === void 0 ? void 0 : _a.firebaseProjectId) === undefined);
            },
        },
        {
            name: "firebaseProjectIdFunctionsProd",
            type: "input",
            message: "Firebase project ID to use for cloud functions (production):",
            // TODO - See if listing is useful. Probably should only do it if there's not a ton.
            default: ((_c = filter === null || filter === void 0 ? void 0 : filter.production) === null || _c === void 0 ? void 0 : _c.firebaseProjectIdFunctions) || SKIP_QUESTION,
            when: () => {
                var _a;
                return (filter.askAll ||
                    ((_a = filter === null || filter === void 0 ? void 0 : filter.production) === null || _a === void 0 ? void 0 : _a.firebaseProjectIdFunctions) === undefined);
            },
        },
        {
            name: "gapiClientIdProd",
            type: "input",
            // TODO - Check to see if there a way to make getting this value easier.
            // (or at least provide a link to where the user can find this value)
            message: "Google client ID (production):",
            default: ((_d = filter === null || filter === void 0 ? void 0 : filter.production) === null || _d === void 0 ? void 0 : _d.gapiClientId) || SKIP_QUESTION,
            when: () => {
                var _a;
                return filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.production) === null || _a === void 0 ? void 0 : _a.gapiClientId) === undefined;
            },
        },
        {
            name: "bitlyClientIdProd",
            type: "input",
            message: "Bit.ly client ID (production):",
            default: ((_e = filter === null || filter === void 0 ? void 0 : filter.production) === null || _e === void 0 ? void 0 : _e.bitlyClientId) || SKIP_QUESTION,
            when: () => {
                var _a;
                return filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.production) === null || _a === void 0 ? void 0 : _a.bitlyClientId) === undefined;
            },
        },
        {
            name: "bitlyClientSecretProd",
            type: "input",
            message: "Bit.ly client secret (production):",
            default: ((_f = filter === null || filter === void 0 ? void 0 : filter.production) === null || _f === void 0 ? void 0 : _f.bitlyClientSecret) || SKIP_QUESTION,
            when: () => {
                var _a;
                return (filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.production) === null || _a === void 0 ? void 0 : _a.bitlyClientSecret) === undefined);
            },
        },
        // Staging questions
        {
            name: "baseUriStaging",
            type: "input",
            message: "Domain of service including https:// (staging):",
            default: ((_g = filter === null || filter === void 0 ? void 0 : filter.staging) === null || _g === void 0 ? void 0 : _g.baseUri) || SKIP_QUESTION,
            when: () => {
                var _a;
                return filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.staging) === null || _a === void 0 ? void 0 : _a.baseUri) === undefined;
            },
        },
        {
            name: "firebaseProjectIdStaging",
            type: "input",
            message: "Firebase project ID (staging):",
            // TODO - See if listing is useful. Probably should only do it if there's not a ton.
            default: ((_h = filter === null || filter === void 0 ? void 0 : filter.staging) === null || _h === void 0 ? void 0 : _h.firebaseProjectId) || SKIP_QUESTION,
            when: () => {
                var _a;
                return filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.staging) === null || _a === void 0 ? void 0 : _a.firebaseProjectId) === undefined;
            },
        },
        {
            name: "firebaseProjectIdFunctionsStaging",
            type: "input",
            message: "Firebase project ID to use for cloud functions (staging):",
            // TODO - See if listing is useful. Probably should only do it if there's not a ton.
            default: ((_j = filter === null || filter === void 0 ? void 0 : filter.staging) === null || _j === void 0 ? void 0 : _j.firebaseProjectIdFunctions) || SKIP_QUESTION,
            when: () => {
                var _a;
                return (filter.askAll ||
                    ((_a = filter === null || filter === void 0 ? void 0 : filter.staging) === null || _a === void 0 ? void 0 : _a.firebaseProjectIdFunctions) === undefined);
            },
        },
        {
            name: "gapiClientIdStaging",
            type: "input",
            // TODO - Check to see if there a way to make getting this value easier.
            // (or at least provide a link to where the user can find this value)
            message: "Google client ID (staging):",
            default: ((_k = filter === null || filter === void 0 ? void 0 : filter.staging) === null || _k === void 0 ? void 0 : _k.gapiClientId) || SKIP_QUESTION,
            when: () => {
                var _a;
                return filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.staging) === null || _a === void 0 ? void 0 : _a.gapiClientId) === undefined;
            },
        },
        {
            name: "bitlyClientIdStaging",
            type: "input",
            message: "Bit.ly client ID (staging):",
            default: ((_l = filter === null || filter === void 0 ? void 0 : filter.staging) === null || _l === void 0 ? void 0 : _l.bitlyClientId) || SKIP_QUESTION,
            when: () => {
                var _a;
                return filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.staging) === null || _a === void 0 ? void 0 : _a.bitlyClientId) === undefined;
            },
        },
        {
            name: "bitlyClientSecretStaging",
            type: "input",
            message: "Bit.ly client secret (staging):",
            default: ((_m = filter === null || filter === void 0 ? void 0 : filter.staging) === null || _m === void 0 ? void 0 : _m.bitlyClientSecret) || SKIP_QUESTION,
            when: () => {
                var _a;
                return filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.staging) === null || _a === void 0 ? void 0 : _a.bitlyClientSecret) === undefined;
            },
        },
    ];
};
const ensureFirebaseLoginStatus = async ({ noLocalhost, }) => {
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
// TODO - Check config should take a flag to force a reauth for firebase since
// the token is short-lived.
// Ensures that required config files exist. If they don't, prompt the user for
// required values & creates necessary files.
exports.checkConfig = async (args) => {
    console.log("Checking required configuration...");
    const exists = fs.existsSync(types_1.RuntimeJsonPath);
    let filter = {};
    let currentConfig;
    if (!exists || args.all) {
        filter = { askAll: true };
    }
    if (exists) {
        // If there is already a config file, read it in to use as the default
        // values.
        currentConfig = JSON.parse(fs.readFileSync(types_1.RuntimeJsonPath, { encoding: types_1.Encoding }));
    }
    const questions = configQuestions(Object.assign({}, currentConfig, filter));
    const answers = await inquirer.prompt(questions);
    const asRuntime = toRuntimeJson(answers, currentConfig);
    const config = await ensureNecessaryFiles(asRuntime);
    return config;
};
const throwIfUndefined = (value) => {
    if (value === undefined) {
        throw new Error("Value cannot be undefined");
    }
    else {
        return value;
    }
};
const toRuntimeJson = (answers, currentConfig) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const production = {
        baseUri: answers.baseUriProd || ((_a = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.production) === null || _a === void 0 ? void 0 : _a.baseUri) ||
            "http://localhost:5000",
        firebaseProjectId: throwIfUndefined(answers.firebaseProjectIdProd || ((_b = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.production) === null || _b === void 0 ? void 0 : _b.firebaseProjectId)),
        firebaseProjectIdFunctions: throwIfUndefined(answers.firebaseProjectIdFunctionsProd || ((_c = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.production) === null || _c === void 0 ? void 0 : _c.firebaseProjectIdFunctions)),
        gapiClientId: throwIfUndefined(answers.gapiClientIdProd || ((_d = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.production) === null || _d === void 0 ? void 0 : _d.gapiClientId)),
        bitlyClientId: throwIfUndefined(answers.bitlyClientIdProd || ((_e = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.production) === null || _e === void 0 ? void 0 : _e.bitlyClientId)),
        bitlyClientSecret: throwIfUndefined(answers.bitlyClientSecretProd || ((_f = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.production) === null || _f === void 0 ? void 0 : _f.bitlyClientSecret)),
        // TODO - This is pretty messy. It should probably just ask you what the
        // bitly_auth url is.
        firebaseFunctionsBaseUrl: ((_g = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.production) === null || _g === void 0 ? void 0 : _g.firebaseFunctionsBaseUrl) ||
            `https://us-central1-${throwIfUndefined(answers.firebaseProjectIdFunctionsProd || (currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.production.firebaseProjectIdFunctions))}.cloudfunctions.net/bitly_auth`,
    };
    const staging = {
        // TODO - This could be a bit smarter. Especially if we support changing the port.
        baseUri: answers.baseUriStaging || ((_h = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.staging) === null || _h === void 0 ? void 0 : _h.baseUri) ||
            "http://localhost:5000",
        firebaseProjectId: throwIfUndefined(answers.firebaseProjectIdStaging || ((_j = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.staging) === null || _j === void 0 ? void 0 : _j.firebaseProjectId)),
        firebaseProjectIdFunctions: throwIfUndefined(answers.firebaseProjectIdFunctionsStaging || (currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.staging.firebaseProjectIdFunctions)),
        gapiClientId: throwIfUndefined(answers.gapiClientIdStaging || ((_k = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.staging) === null || _k === void 0 ? void 0 : _k.gapiClientId)),
        bitlyClientId: throwIfUndefined(answers.bitlyClientIdStaging || ((_l = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.staging) === null || _l === void 0 ? void 0 : _l.bitlyClientId)),
        bitlyClientSecret: throwIfUndefined(answers.bitlyClientSecretStaging || ((_m = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.staging) === null || _m === void 0 ? void 0 : _m.bitlyClientSecret)),
        firebaseFunctionsBaseUrl: ((_o = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.staging) === null || _o === void 0 ? void 0 : _o.firebaseFunctionsBaseUrl) ||
            `https://us-central1-${throwIfUndefined(answers.firebaseProjectIdFunctionsStaging || (currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.staging.firebaseProjectIdFunctions))}.cloudfunctions.net/bitly_auth`,
    };
    const fullConfig = { production, staging };
    let asserted;
    try {
        asserted = assertAllValues(fullConfig);
    }
    catch (e) {
        console.error(e.message);
        process.exit(1);
    }
    return asserted;
};
const assertAllValues = (runtimeJson) => {
    if (runtimeJson.staging.gapiClientId === undefined) {
        throw new Error("Missing the staging gapiClientId");
    }
    if (runtimeJson.staging.firebaseProjectId === undefined) {
        throw new Error("Missing the staging firebaseProjectId");
    }
    if (runtimeJson.staging.firebaseFunctionsBaseUrl === undefined) {
        throw new Error("Missing the staging firebase functions base url");
    }
    if (runtimeJson.staging.bitlyClientSecret === undefined) {
        throw new Error("Missing the staging bitly client secret");
    }
    if (runtimeJson.staging.bitlyClientId === undefined) {
        throw new Error("Missing the staging bitly client id");
    }
    if (runtimeJson.staging.baseUri === undefined) {
        throw new Error("Missing the staging base url");
    }
    if (runtimeJson.staging.firebaseProjectIdFunctions === undefined) {
        throw new Error("Missing the staging firebaseProjectId for functions");
    }
    if (runtimeJson.staging.firebaseFunctionsBaseUrl === undefined) {
        throw new Error("Missing the staging firebase functions base url");
    }
    if (runtimeJson.production.gapiClientId === undefined) {
        throw new Error("Missing the production gapiClientId");
    }
    if (runtimeJson.production.firebaseProjectId === undefined) {
        throw new Error("Missing the production firebaseProjectId");
    }
    if (runtimeJson.production.firebaseProjectIdFunctions === undefined) {
        throw new Error("Missing the firebaseProjectId for functions");
    }
    if (runtimeJson.production.firebaseFunctionsBaseUrl === undefined) {
        throw new Error("Missing the production firebase functions base url");
    }
    if (runtimeJson.production.bitlyClientId === undefined) {
        throw new Error("Missing the bitly clientId");
    }
    if (runtimeJson.production.bitlyClientSecret === undefined) {
        throw new Error("Missing the bitly clientSecret");
    }
    if (runtimeJson.production.baseUri === undefined) {
        throw new Error("Missing the production base url");
    }
    return runtimeJson;
};
