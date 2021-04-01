"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkConfig = void 0;
const fs = require("fs");
const inquirer = require("inquirer");
const types_1 = require("./types");
const execa = require("execa");
const writeEnvFile = async ({ file, config }) => {
    const path = file === "prod"
        ? types_1.DotEnvProductionPath
        : file === "dev"
            ? types_1.DotEnvDevelopmentPath
            : undefined;
    if (path === undefined) {
        console.error(`Path type: ${file} not supported.`);
        process.exit(1);
    }
    // If any questions are skipped, don't include them in the outgoing .env
    // files so they are `undefined` for `process.env[ENV_NAME]`.
    const gapiLine = config.gapiClientId === SKIP_QUESTION
        ? undefined
        : `GAPI_CLIENT_ID=${config.gapiClientId}`;
    const bitlyLine = config.bitlyClientId === SKIP_QUESTION
        ? undefined
        : `BITLY_CLIENT_ID=${config.bitlyClientId}`;
    const firebaseFunctionsBaseUrlLine = `FUNCTIONS_BASE_URL=${config.firebaseFunctionsBaseUrl}`;
    fs.writeFileSync(path, [gapiLine, bitlyLine, firebaseFunctionsBaseUrlLine].join("\n"), {
        encoding: types_1.Encoding,
    });
};
// TODO - This probably shouldn't run unless we say --all. It maybe should only
// run during deploy.
const ensureFirebaseFunctionsConfig = async (config) => {
    const bitlyClientId = config.production.bitlyClientId === SKIP_QUESTION
        ? ""
        : `bitly.client_id=${config.production.bitlyClientId}`;
    const bitlyClientSecret = config.production.bitlyClientSecret === SKIP_QUESTION
        ? ""
        : `bitly.client_secret=${config.production.bitlyClientSecret}`;
    const bitlyBaseUriProd = `bitly.base_uri=${config.production.baseUri}`;
    const bitlyBaseUriDev = `bitly.base_uri=${config.development.baseUri}`;
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
            config.development.firebaseProjectIdFunctions,
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
    // Create `.env.development` if it doesn't exist.
    if (!fs.existsSync(types_1.DotEnvDevelopmentPath)) {
        fs.writeFileSync(types_1.DotEnvDevelopmentPath, "");
    }
    // Create `.env.production` if it doesn't exist.
    if (!fs.existsSync(types_1.DotEnvProductionPath)) {
        fs.writeFileSync(types_1.DotEnvProductionPath, "");
    }
    // Overwrite `runtime.json` with provided configuration.
    fs.writeFileSync(types_1.RuntimeJsonPath, JSON.stringify(runtimeJson, null, "  "), {
        encoding: types_1.Encoding,
    });
    await writeEnvFile({ file: "prod", config: runtimeJson.production });
    await writeEnvFile({ file: "dev", config: runtimeJson.development });
    return runtimeJson;
};
// TODO - Make sure to account for these values in the code and log an
// appropriate error for pages where they are required.
const SKIP_QUESTION = "Leave blank to skip";
// Given a filter, returns an array of questions to be asked to make sure all
// required configuration data is present. The filter allows some questions to
// be skipped if already provided.
const configQuestions = (filter) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    // TODO the `?.`s can be removed once this has stabilized. They're here now to
    // be friendly as the runtimeJson type evolves.
    return [
        {
            name: "baseUriProd",
            type: "input",
            message: "Domain of production service (including https://):",
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
            message: "Firebase project ID to use for production:",
            // TODO - See if listing is useful. Probably should only do it if there's not a ton.
            default: ((_b = filter === null || filter === void 0 ? void 0 : filter.production) === null || _b === void 0 ? void 0 : _b.firebaseProjectId) || SKIP_QUESTION,
            when: () => {
                var _a;
                return (filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.production) === null || _a === void 0 ? void 0 : _a.firebaseProjectId) === undefined);
            },
        },
        {
            name: "firebaseProjectIdDev",
            type: "input",
            message: "Firebase project ID to use for development environment:",
            // TODO - See if listing is useful. Probably should only do it if there's not a ton.
            default: ((_c = filter === null || filter === void 0 ? void 0 : filter.development) === null || _c === void 0 ? void 0 : _c.firebaseProjectId) || SKIP_QUESTION,
            when: () => {
                var _a;
                return (filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.development) === null || _a === void 0 ? void 0 : _a.firebaseProjectId) === undefined);
            },
        },
        {
            name: "firebaseProjectIdFunctions",
            type: "input",
            message: "Firebase project ID to use for cloud functions:",
            // TODO - See if listing is useful. Probably should only do it if there's not a ton.
            default: ((_d = filter === null || filter === void 0 ? void 0 : filter.production) === null || _d === void 0 ? void 0 : _d.firebaseProjectIdFunctions) || SKIP_QUESTION,
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
            message: "Google client ID to use for production:",
            default: ((_e = filter === null || filter === void 0 ? void 0 : filter.production) === null || _e === void 0 ? void 0 : _e.gapiClientId) || SKIP_QUESTION,
            when: () => {
                var _a;
                return filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.production) === null || _a === void 0 ? void 0 : _a.gapiClientId) === undefined;
            },
        },
        {
            name: "gapiClientIdDev",
            type: "input",
            // TODO - Check to see if there a way to make getting this value easier.
            // (or at least provide a link to where the user can find this value)
            message: "Google client ID to use for development environment:",
            default: ((_f = filter === null || filter === void 0 ? void 0 : filter.development) === null || _f === void 0 ? void 0 : _f.gapiClientId) || SKIP_QUESTION,
            when: () => {
                var _a;
                return filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.development) === null || _a === void 0 ? void 0 : _a.gapiClientId) === undefined;
            },
        },
        {
            name: "bitlyClientId",
            type: "input",
            message: "Bit.ly client ID:",
            default: ((_g = filter === null || filter === void 0 ? void 0 : filter.production) === null || _g === void 0 ? void 0 : _g.bitlyClientId) || SKIP_QUESTION,
            when: () => {
                var _a;
                return filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.production) === null || _a === void 0 ? void 0 : _a.bitlyClientId) === undefined;
            },
        },
        {
            name: "bitlyClientSecret",
            type: "input",
            message: "Bit.ly client secret:",
            default: ((_h = filter === null || filter === void 0 ? void 0 : filter.production) === null || _h === void 0 ? void 0 : _h.bitlyClientSecret) || SKIP_QUESTION,
            when: () => {
                var _a;
                return (filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.production) === null || _a === void 0 ? void 0 : _a.bitlyClientSecret) === undefined);
            },
        },
    ];
};
const ensureFirebaseLoginStatus = async () => {
    console.log(`Ensuring that you're logged into to Firebase.`);
    // TODO - --no-localhost might should be a flag to checkConfig.
    return execa("yarn", ["run", "firebase", "login", "--no-localhost"], {
        stderr: "inherit",
        stdout: "inherit",
        stdin: "inherit",
    });
};
// TODO - Check config should take a flag to force a reauth for firebase since
// the token is short-lived.
// Ensures that required config files exist. If they don't, prompt the user for
// required values & creates necessary files.
exports.checkConfig = async (args) => {
    console.log("Checking required configuration...");
    // Make sure user is logged into Firebase.
    await ensureFirebaseLoginStatus();
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
    await ensureFirebaseFunctionsConfig(config);
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    const production = {
        baseUri: answers.baseUriProd || ((_a = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.production) === null || _a === void 0 ? void 0 : _a.baseUri) ||
            "http://localhost:5000",
        firebaseProjectId: throwIfUndefined(answers.firebaseProjectIdProd || ((_b = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.production) === null || _b === void 0 ? void 0 : _b.firebaseProjectId)),
        firebaseProjectIdFunctions: throwIfUndefined(answers.firebaseProjectIdFunctions || ((_c = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.production) === null || _c === void 0 ? void 0 : _c.firebaseProjectIdFunctions)),
        gapiClientId: throwIfUndefined(answers.gapiClientIdProd || ((_d = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.production) === null || _d === void 0 ? void 0 : _d.gapiClientId)),
        bitlyClientId: throwIfUndefined(answers.bitlyClientId || ((_e = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.production) === null || _e === void 0 ? void 0 : _e.bitlyClientId)),
        bitlyClientSecret: throwIfUndefined(answers.bitlyClientSecret || ((_f = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.production) === null || _f === void 0 ? void 0 : _f.bitlyClientSecret)),
        // TODO - This is pretty messy. It should probably just ask you what the
        // bitly_auth url is.
        firebaseFunctionsBaseUrl: ((_g = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.production) === null || _g === void 0 ? void 0 : _g.firebaseFunctionsBaseUrl) ||
            `https://us-central1-${throwIfUndefined(answers.firebaseProjectIdProd || ((_h = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.production) === null || _h === void 0 ? void 0 : _h.firebaseProjectId))}.cloudfunctions.net/bitly_auth`,
    };
    const development = {
        // TODO - This could be a bit smarter. Especially if we support changing the port.
        baseUri: ((_j = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.development) === null || _j === void 0 ? void 0 : _j.baseUri) || "http://localhost:5000",
        firebaseProjectId: throwIfUndefined(answers.firebaseProjectIdDev || ((_k = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.development) === null || _k === void 0 ? void 0 : _k.firebaseProjectId)),
        firebaseProjectIdFunctions: throwIfUndefined(answers.firebaseProjectIdFunctions || (currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.development.firebaseProjectIdFunctions)),
        gapiClientId: throwIfUndefined(answers.gapiClientIdDev || ((_l = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.development) === null || _l === void 0 ? void 0 : _l.gapiClientId)),
        // We intentially don't support a different clientID & clientSecret for
        // bitly for dev.
        bitlyClientId: throwIfUndefined(answers.bitlyClientId || ((_m = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.production) === null || _m === void 0 ? void 0 : _m.bitlyClientId)),
        bitlyClientSecret: throwIfUndefined(answers.bitlyClientSecret || ((_o = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.production) === null || _o === void 0 ? void 0 : _o.bitlyClientSecret)),
        firebaseFunctionsBaseUrl: ((_p = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.development) === null || _p === void 0 ? void 0 : _p.firebaseFunctionsBaseUrl) ||
            `https://us-central1-${throwIfUndefined(answers.firebaseProjectIdDev || ((_q = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.development) === null || _q === void 0 ? void 0 : _q.firebaseProjectId))}.cloudfunctions.net/bitly_auth`,
    };
    const fullConfig = { production, development };
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
    if (runtimeJson.development.gapiClientId === undefined) {
        throw new Error("Missing the development gapiClientId");
    }
    if (runtimeJson.development.firebaseProjectId === undefined) {
        throw new Error("Missing the development firebaseProjectId");
    }
    if (runtimeJson.development.firebaseProjectIdFunctions === undefined) {
        throw new Error("Missing the firebaseProjectId for functions");
    }
    if (runtimeJson.development.firebaseFunctionsBaseUrl === undefined) {
        throw new Error("Missing the development firebase functions base url");
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
    return runtimeJson;
};
