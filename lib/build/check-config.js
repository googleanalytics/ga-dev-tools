"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkConfig = exports.SKIP_QUESTION = exports.writeEnvFile = void 0;
const fs = require("fs");
const inquirer = require("inquirer");
const types_1 = require("./types");
exports.writeEnvFile = async (config, endpointName = "bitly_auth") => {
    // If any questions are skipped, don't include them in the outgoing .env
    // files so they are `undefined` for `process.env[ENV_NAME]`.
    const gapiLine = config.gapiClientId === exports.SKIP_QUESTION
        ? undefined
        : `GAPI_CLIENT_ID=${config.gapiClientId}`;
    const bitlyLine = config.bitlyClientId === exports.SKIP_QUESTION
        ? undefined
        : `BITLY_CLIENT_ID=${config.bitlyClientId}`;
    const authEndpointLine = `AUTH_ENDPOINT=https://us-central1-${config.firebaseProjectId}.cloudfunctions.net/${endpointName}`;
    const measurementIdLine = `GA_MEASUREMENT_ID=${config.measurementId}`;
    [types_1.DotEnvProductionPath, types_1.DotEnvDevelopmentPath].map(path => fs.writeFileSync(path, [gapiLine, bitlyLine, authEndpointLine, measurementIdLine].join("\n"), {
        encoding: types_1.Encoding,
    }));
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
exports.SKIP_QUESTION = "Leave blank to skip";
// Given a filter, returns an array of questions to be asked to make sure all
// required configuration data is present. The filter allows some questions to
// be skipped if already provided.
const configQuestions = (filter) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    // TODO the `?.`s can be removed once this has stabilized. They're here now to
    // be friendly as the runtimeJson type evolves.
    return [
        {
            name: types_1.AnswerNames.BaseUriProd,
            type: "input",
            message: "Domain of production service including https:// (production):",
            default: ((_a = filter === null || filter === void 0 ? void 0 : filter.production) === null || _a === void 0 ? void 0 : _a.baseUri) || exports.SKIP_QUESTION,
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
            name: types_1.AnswerNames.FirebaseProjectIdProd,
            type: "input",
            message: "Firebase project ID (production):",
            // TODO - See if listing is useful. Probably should only do it if there's not a ton.
            default: ((_b = filter === null || filter === void 0 ? void 0 : filter.production) === null || _b === void 0 ? void 0 : _b.firebaseProjectId) || exports.SKIP_QUESTION,
            when: () => {
                var _a;
                return (filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.production) === null || _a === void 0 ? void 0 : _a.firebaseProjectId) === undefined);
            },
        },
        {
            name: types_1.AnswerNames.GapiClientIdProd,
            type: "input",
            // TODO - Check to see if there a way to make getting this value easier.
            // (or at least provide a link to where the user can find this value)
            message: "Google client ID (production):",
            default: ((_c = filter === null || filter === void 0 ? void 0 : filter.production) === null || _c === void 0 ? void 0 : _c.gapiClientId) || exports.SKIP_QUESTION,
            when: () => {
                var _a;
                return filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.production) === null || _a === void 0 ? void 0 : _a.gapiClientId) === undefined;
            },
        },
        {
            name: types_1.AnswerNames.BitlyClientIdProd,
            type: "input",
            message: "Bit.ly client ID (production):",
            default: ((_d = filter === null || filter === void 0 ? void 0 : filter.production) === null || _d === void 0 ? void 0 : _d.bitlyClientId) || exports.SKIP_QUESTION,
            when: () => {
                var _a;
                return filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.production) === null || _a === void 0 ? void 0 : _a.bitlyClientId) === undefined;
            },
        },
        {
            name: types_1.AnswerNames.BitlyClientSecretProd,
            type: "input",
            message: "Bit.ly client secret (production):",
            default: ((_e = filter === null || filter === void 0 ? void 0 : filter.production) === null || _e === void 0 ? void 0 : _e.bitlyClientSecret) || exports.SKIP_QUESTION,
            when: () => {
                var _a;
                return (filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.production) === null || _a === void 0 ? void 0 : _a.bitlyClientSecret) === undefined);
            },
        },
        {
            name: types_1.AnswerNames.MeasurementIdProd,
            type: "input",
            message: "GA Measurement ID (production):",
            default: ((_f = filter === null || filter === void 0 ? void 0 : filter.production) === null || _f === void 0 ? void 0 : _f.measurementId) || exports.SKIP_QUESTION,
            when: () => {
                var _a;
                return filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.production) === null || _a === void 0 ? void 0 : _a.measurementId) === undefined;
            },
        },
        // Staging questions
        {
            name: types_1.AnswerNames.BaseUriStaging,
            type: "input",
            message: "Domain of service including https:// (staging):",
            default: ((_g = filter === null || filter === void 0 ? void 0 : filter.staging) === null || _g === void 0 ? void 0 : _g.baseUri) || exports.SKIP_QUESTION,
            when: () => {
                var _a;
                return filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.staging) === null || _a === void 0 ? void 0 : _a.baseUri) === undefined;
            },
        },
        {
            name: types_1.AnswerNames.FirebaseProjectIdStaging,
            type: "input",
            message: "Firebase project ID (staging):",
            // TODO - See if listing is useful. Probably should only do it if there's not a ton.
            default: ((_h = filter === null || filter === void 0 ? void 0 : filter.staging) === null || _h === void 0 ? void 0 : _h.firebaseProjectId) || exports.SKIP_QUESTION,
            when: () => {
                var _a;
                return filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.staging) === null || _a === void 0 ? void 0 : _a.firebaseProjectId) === undefined;
            },
        },
        {
            name: types_1.AnswerNames.GapiClientIdStaging,
            type: "input",
            // TODO - Check to see if there a way to make getting this value easier.
            // (or at least provide a link to where the user can find this value)
            message: "Google client ID (staging):",
            default: ((_j = filter === null || filter === void 0 ? void 0 : filter.staging) === null || _j === void 0 ? void 0 : _j.gapiClientId) || exports.SKIP_QUESTION,
            when: () => {
                var _a;
                return filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.staging) === null || _a === void 0 ? void 0 : _a.gapiClientId) === undefined;
            },
        },
        {
            name: types_1.AnswerNames.BitlyClientIdStaging,
            type: "input",
            message: "Bit.ly client ID (staging):",
            default: ((_k = filter === null || filter === void 0 ? void 0 : filter.staging) === null || _k === void 0 ? void 0 : _k.bitlyClientId) || exports.SKIP_QUESTION,
            when: () => {
                var _a;
                return filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.staging) === null || _a === void 0 ? void 0 : _a.bitlyClientId) === undefined;
            },
        },
        {
            name: types_1.AnswerNames.BitlyClientSecretStaging,
            type: "input",
            message: "Bit.ly client secret (staging):",
            default: ((_l = filter === null || filter === void 0 ? void 0 : filter.staging) === null || _l === void 0 ? void 0 : _l.bitlyClientSecret) || exports.SKIP_QUESTION,
            when: () => {
                var _a;
                return filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.staging) === null || _a === void 0 ? void 0 : _a.bitlyClientSecret) === undefined;
            },
        },
        {
            name: types_1.AnswerNames.MeasurementIdStaging,
            type: "input",
            message: "GA Measurement ID (staging):",
            default: ((_m = filter === null || filter === void 0 ? void 0 : filter.staging) === null || _m === void 0 ? void 0 : _m.measurementId) || exports.SKIP_QUESTION,
            when: () => {
                var _a;
                return filter.askAll || ((_a = filter === null || filter === void 0 ? void 0 : filter.staging) === null || _a === void 0 ? void 0 : _a.measurementId) === undefined;
            },
        },
    ];
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const production = {
        measurementId: throwIfUndefined(answers.measurementIdProd || (currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.production.measurementId)),
        baseUri: answers.baseUriProd || ((_a = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.production) === null || _a === void 0 ? void 0 : _a.baseUri) ||
            "http://localhost:5000",
        firebaseProjectId: throwIfUndefined(answers.firebaseProjectIdProd || ((_b = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.production) === null || _b === void 0 ? void 0 : _b.firebaseProjectId)),
        gapiClientId: throwIfUndefined(answers.gapiClientIdProd || ((_c = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.production) === null || _c === void 0 ? void 0 : _c.gapiClientId)),
        bitlyClientId: throwIfUndefined(answers.bitlyClientIdProd || ((_d = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.production) === null || _d === void 0 ? void 0 : _d.bitlyClientId)),
        bitlyClientSecret: throwIfUndefined(answers.bitlyClientSecretProd || ((_e = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.production) === null || _e === void 0 ? void 0 : _e.bitlyClientSecret)),
    };
    const staging = {
        measurementId: throwIfUndefined(answers.measurementIdStaging || (currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.staging.measurementId)),
        // TODO - This could be a bit smarter. Especially if we support changing the port.
        baseUri: answers.baseUriStaging || ((_f = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.staging) === null || _f === void 0 ? void 0 : _f.baseUri) ||
            "http://localhost:5000",
        firebaseProjectId: throwIfUndefined(answers.firebaseProjectIdStaging || ((_g = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.staging) === null || _g === void 0 ? void 0 : _g.firebaseProjectId)),
        gapiClientId: throwIfUndefined(answers.gapiClientIdStaging || ((_h = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.staging) === null || _h === void 0 ? void 0 : _h.gapiClientId)),
        bitlyClientId: throwIfUndefined(answers.bitlyClientIdStaging || ((_j = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.staging) === null || _j === void 0 ? void 0 : _j.bitlyClientId)),
        bitlyClientSecret: throwIfUndefined(answers.bitlyClientSecretStaging || ((_k = currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.staging) === null || _k === void 0 ? void 0 : _k.bitlyClientSecret)),
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
    if (runtimeJson.staging.bitlyClientSecret === undefined) {
        throw new Error("Missing the staging bitly client secret");
    }
    if (runtimeJson.staging.bitlyClientId === undefined) {
        throw new Error("Missing the staging bitly client id");
    }
    if (runtimeJson.staging.baseUri === undefined) {
        throw new Error("Missing the staging base url");
    }
    if (runtimeJson.staging.measurementId === undefined) {
        throw new Error("Missing the staging measurement ID");
    }
    if (runtimeJson.production.gapiClientId === undefined) {
        throw new Error("Missing the production gapiClientId");
    }
    if (runtimeJson.production.firebaseProjectId === undefined) {
        throw new Error("Missing the production firebaseProjectId");
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
    if (runtimeJson.production.measurementId === undefined) {
        throw new Error("Missing the production measurement ID");
    }
    return runtimeJson;
};
