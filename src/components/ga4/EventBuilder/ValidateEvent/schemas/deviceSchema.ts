export const deviceSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        category: {
            type: "string",
        },
        language: {
            type: "string",
        },
        screen_resolution: {
            type: "string",
        },
        operating_system: {
            type: "string",
        },
        operating_system_version: {
            type: "string",
        },
        model: {
            type: "string",
        },
        brand: {
            type: "string",
        },
        browser: {
            type: "string",
        },
        browser_version: {
            type: "string",
        },
    },
};
