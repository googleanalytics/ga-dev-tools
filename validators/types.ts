// import * as path from "path"

// export const PWD = process.cwd()
// export const Encoding = "utf8"
// export const RuntimeJsonPath = path.join(PWD, "runtime.json")
// export const DotEnvProductionPath = path.join(PWD, ".env.production")
// export const DotEnvDevelopmentPath = path.join(PWD, ".env.development")

export type Payload = {
    user_id: string;
    events: Array<Event>;
    timestamp_micros?: string;
    app_instance_id: string;
    non_personalized_ads: boolean;
    validationBehavior?: string;
};

export type Event = {
    name: string;
    params: {
        visitor_id: string;
        country: string;
        region: string;
        transaction_id: string;
        ogp_nor_loc: number;
        ogp_nob_loc: number;
        ogp_loc: number;
        value: number;
        currency: string;
    };
};

export type AdditionalParams = {
    param_type: string;
    value: string;
};

export type SchemaType = string;

export type ContentLength = number;

export type ValidationServerResponse = {
    validationMessages?: Array<ValidationMessage>
}

export type ValidationMessage = {
    fieldPath: string,
    description: string,
    validationCode: string
}

export type SchemaValidationError = {
    message: string
    instance: Payload
    validator: string
    path: Array<string>
}