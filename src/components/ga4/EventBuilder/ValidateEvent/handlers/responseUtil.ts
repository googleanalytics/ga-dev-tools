import { ValidationMessage } from "../../types"

const ALPHA_NUMERIC_NAME = "does not match '^(?!ga_|google_|firebase_)[A-Za-z][A-Za-z0-9_]*$'"
const ALPHA_NUMERIC_OVERRIDE = " may only contain alpha-numeric characters and underscores,start with an alphabetic character, and cannot contain google_, ga_, firebase_"
const CUSTOM_PARAMS_NAME = "can have at most [10] custom params."
const ITEM_INVALID_KEY_OVERRIDE = "Item array has invalid key"

const API_DOC_LIMITATIONS_URL = 'https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events?hl=en&client_type=firebase#limitations'
const API_DOC_BASE_PAYLOAD_URL = 'https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference#'
const API_DOC_EVENT_URL = 'https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#'
const API_DOC_USER_PROPERTIES = 'https://developers.google.com/analytics/devguides/collection/protocol/ga4/user-properties?hl=en&client_type=firebase'
const API_DOC_SENDING_EVENTS_URL = 'https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events?hl=en&client_type=firebase'
const API_DOC_JSON_POST_BODY = 'https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?hl=en&client_type=firebase#payload_post_body'
const API_DOC_GTAG = 'https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events?client_type=gtag#required_parameters'

const BASE_PAYLOAD_ATTRIBUTES = ['app_instance_id', 'api_secret', 'firebase_app_id', 'user_id', 'timestamp_micros', 'user_properties', 'non_personalized_ads']

// formats error messages for clarity; add documentation to each error
export const formatErrorMessages = (errors: ValidationMessage[], payload: any, useFirebase: boolean) => {
    const formattedErrors = errors.map(error => {
        const { description, fieldPath } = error

        if (description.endsWith(CUSTOM_PARAMS_NAME)) {
            error['description'] = ITEM_INVALID_KEY_OVERRIDE
            error['validationCode'] = 'value_invalid'
            error['fieldPath'] = '#/events/0/params/item_id'
            
            return error
        } else if (description.endsWith(ALPHA_NUMERIC_NAME)) {
            let end_index = description.indexOf(ALPHA_NUMERIC_NAME);
            error['description'] = description.slice(0, end_index) + ALPHA_NUMERIC_OVERRIDE

            return error
        } else if (BASE_PAYLOAD_ATTRIBUTES.includes(fieldPath?.slice(2))) {
            error['fieldPath'] = fieldPath.slice(2)
            return error
        }
        return error
    })

    const documentedErrors = formattedErrors.map(error => {
        error['documentation'] = addDocumentation(error, payload, useFirebase)
        return error
    })

    return documentedErrors
}

const addDocumentation = (error: ValidationMessage, payload: any, useFirebase: boolean) => {
    const { fieldPath, validationCode } = error

    if (validationCode === 'max-length-error' || validationCode === 'max-properties-error' || validationCode === 'max-body-size') {
        return API_DOC_LIMITATIONS_URL
    } else if (fieldPath?.startsWith('#/events/')) {
        return API_DOC_EVENT_URL + payload?.events[0]?.name
    } else if (!useFirebase && (fieldPath === 'client_id' || fieldPath === 'measurement_id')) {
        return API_DOC_GTAG
    } else if (BASE_PAYLOAD_ATTRIBUTES.includes(fieldPath)) {
        return API_DOC_BASE_PAYLOAD_URL + fieldPath
    } else if (fieldPath === '#/user_properties') {
        return API_DOC_USER_PROPERTIES
    }

    return API_DOC_SENDING_EVENTS_URL
}

export const formatValidationMessage = () => {
    return [{
        'description': 'Fix formatting issue and re-validate payload by clicking `Validate Event` below',
        'validationCode': 'format_invalid',
        'fieldPath': '#',
        'documentation': API_DOC_JSON_POST_BODY
    }]
}