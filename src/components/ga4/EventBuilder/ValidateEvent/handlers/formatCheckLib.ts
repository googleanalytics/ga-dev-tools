import { ValidationMessage } from "../../types"
import 'object-sizeof'
import sizeof from "object-sizeof"
import { eventDefinitions } from "../schemas/eventTypes/eventDefinitions"

const RESERVED_EVENT_NAMES = [
    "ad_activeview", "ad_click", "ad_exposure", "ad_impression", "ad_query",
    "adunit_exposure", "app_clear_data", "app_install", "app_update",
    "app_remove", "error", "first_open", "first_visit", "in_app_purchase",
    "notification_dismiss", "notification_foreground", "notification_open",
    "notification_receive", "os_update", "screen_view", "session_start",
    "user_engagement"
]
const RESERVED_USER_PROPERTY_NAMES = [
    "first_open_time", "first_visit_time", "last_deep_link_referrer", "user_id",
    "first_open_after_install"
]

// formatCheckLib provides additional validations for payload not included in 
// the schema validations. All checks are consistent with Firebase documentation.
export const formatCheckLib = (payload, firebaseAppId, api_secret) => {
    let errors: ValidationMessage[] = []

    const appInstanceIdErrors = isValidAppInstanceId(payload)
    const eventNameErrors = isValidEventName(payload)
    const userPropertyNameErrors = isValidUserPropertyName(payload)
    const currencyErrors = isValidCurrencyType(payload)
    const emptyItemsErrors = isItemsEmpty(payload)
    const itemsRequiredKeyErrors = itemsHaveRequiredKey(payload)
    const firebaseAppIdErrors = isfirebaseAppIdValid(firebaseAppId)
    const apiSecretErrors = isApiSecretNotNull(api_secret)
    const sizeErrors = isTooBig(payload)

    return [
        ...errors, 
        ...appInstanceIdErrors, 
        ...eventNameErrors,
        ...userPropertyNameErrors,
        ...currencyErrors,
        ...emptyItemsErrors,
        ...itemsRequiredKeyErrors,
        ...firebaseAppIdErrors,
        ...apiSecretErrors,
        ...sizeErrors,
    ]
}

const isValidAppInstanceId = (payload) => {
    let errors: ValidationMessage[] = []
    const appInstanceId = payload.app_instance_id

    if (appInstanceId) {
        if (appInstanceId?.length !== 32) {
            errors.push({
                description: `Measurement app_instance_id is expected to be a 32 digit hexadecimal number but was [${appInstanceId.length}] digits.`,
                validationCode: "value_invalid",
                fieldPath: "app_instance_id"
            })
        }

        if (!appInstanceId.match(/^[A-Fa-f0-9]+$/)) {
            let nonChars = appInstanceId.split('').filter((letter: string)=> {
                return (!/[0-9A-Fa-f]/.test(letter))
            })

            errors.push({
                description: `Measurement app_instance_id contains non hexadecimal character [${nonChars[0]}].`,
                validationCode: "value_invalid",
                fieldPath: "app_instance_id"
            })
        }
    }

    return errors
}


const isValidEventName = (payload) => {
    let errors: ValidationMessage[] = []

    payload.events?.forEach(ev => {
        if (RESERVED_EVENT_NAMES.includes(ev.name)) {
            errors.push({
                description: `${ev.name} is a reserved event name`,
                validationCode: "value_invalid",
                fieldPath: "#/events/name"
            })
        }
    })

    return errors
}

const isValidUserPropertyName = (payload) => {
    let errors: ValidationMessage[] = []
    const userProperties = payload.user_properties

    if (userProperties) {
        Object.keys(userProperties).forEach(prop => {
            if (RESERVED_USER_PROPERTY_NAMES.includes(prop)) {
                errors.push({
                    description: `user_property: '${prop}' is a reserved user property name`,
                    validationCode: "value_invalid",
                    fieldPath: "user_property"
                })
            }
        })
    }

    return errors
}

const isValidCurrencyType = (payload) => {
    let errors: ValidationMessage[] = []

    payload.events?.forEach(ev => {
        if (ev.params && ev.params.currency) {
            const currency = ev.params.currency

            if (currency.length !== 3 || !currency.match(/[A-Z]{3}/)) {
                errors.push({
                    description: `currency: ${currency} must be a valid uppercase 3-letter ISO 4217 format`,
                    validationCode: "value_invalid",
                    fieldPath: "#/events/0/params/currency"
                })
            }
        }
    })

    return errors
}

const isItemsEmpty = (payload) => {
    let errors: ValidationMessage[] = []

    payload?.events?.forEach(ev => {
        if (ev?.params?.items && ev?.params?.items?.length < 1 && eventRequiresItems(ev?.params?.name)){
            errors.push({
                description: "'items' should not be empty; One of 'item_id' or 'item_name' is a required key",
                validationCode: "minItems",
                fieldPath: "#/events/0/params/item_id"
            })
        }
    })

    return errors
}

const eventRequiresItems = (eventName) => {
    if (eventDefinitions[eventName]) {
        return eventDefinitions[eventName].includes('items')
    }

    return false
}

const itemsHaveRequiredKey = (payload) => {
    let errors: ValidationMessage[] = []

    payload?.events?.forEach(ev => {
        if (ev?.params?.items?.length > 0) {
            const itemsObj = ev.params.items[0]

            if (requiredKeysDontExist(itemsObj) || requiredKeysEmpty(itemsObj)) {
                errors.push({
                    description: "'items' object must contain one of the following keys: 'item_id' or 'item_name'",
                    validationCode: "limitation",
                    fieldPath: "#/events/0/params/item_id"
                })
            }
        }
    })

    return errors
}

const requiredKeysDontExist = (itemsObj) => {
    return !(itemsObj.hasOwnProperty('item_id') || itemsObj.hasOwnProperty('item_name'))
}

const requiredKeysEmpty = (itemsObj) => {
    return !(itemsObj.item_id || itemsObj.item_name)
}

const isfirebaseAppIdValid = (firebaseAppId) => {
    let errors: ValidationMessage[] = []

    if (firebaseAppId && !firebaseAppId.match(/[0-9]:[0-9]+:[a-zA-Z]+:[a-zA-Z0-9]+$/)) {
        errors.push({
            description: `${firebaseAppId} does not follow firebase_app_id pattern of X:XX:XX:XX at path`,
            validationCode: "value_invalid",
            fieldPath: "firebase_app_id"
        })
    }

    return errors
}

const isApiSecretNotNull = (api_secret) => {
    let errors: ValidationMessage[] = []

    if (!api_secret) {
        errors.push({
            description: "Unable to find non-empty parameter [api_secret] value in request.",
            validationCode: "VALUE_REQUIRED",
            fieldPath: "api_secret"
        })
    }

    return errors
}

const isTooBig = (payload) => {
    let errors: ValidationMessage[] = []

    if (sizeof(payload) > 130000) {
        errors.push({
            description: 'Post body must be smaller than 130kBs',
            validationCode: "max-body-size",
            fieldPath: "#"
        })
    }

    return errors
}
