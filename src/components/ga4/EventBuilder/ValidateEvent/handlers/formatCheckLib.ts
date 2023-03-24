import { ValidationMessage } from "../../types"

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

export const formatCheckLib = (payload) => {
    let errors: ValidationMessage[] = []

    const appInstanceIdErrors = isValidAppInstanceId(payload)
    const eventNameErrors = isValidEventName(payload)
    const userPropertyNameErrors = isValidUserPropertyName(payload)
    const currencyErrors = isValidCurrencyType(payload)

    return [
        ...errors, 
        ...appInstanceIdErrors, 
        ...eventNameErrors,
        ...userPropertyNameErrors,
        ...currencyErrors,
    ]
}

const isValidAppInstanceId = (payload) => {
    let errors: ValidationMessage[] = []
    const appInstanceId = payload.app_instance_id

    if (appInstanceId.length != 32) {
        errors.push({
            description: `Measurement app_instance_id is expected to be a 32 digit hexadecimal number but was [${appInstanceId.length}] digits.`,
            validationCode: "FormatCheckError",
            fieldPath: "app_instance_id"
        })
    }

    if (!appInstanceId.match(/[a-f0-9]/)) {
        let nonChars = appInstanceId.split('').filter(letter => {
            if (!/[0-9A-Fa-f]/.test(letter)) {
                return letter
            }
        })

        errors.push({
            description: `Measurement app_instance_id contains non hexadecimal character [${nonChars[0]}].`,
            validationCode: "FormatCheckError",
            fieldPath: "app_instance_id"
        })
    }

    return errors
}


const isValidEventName = (payload) => {
    let errors: ValidationMessage[] = []

    payload.events.forEach(ev => {
        if (RESERVED_EVENT_NAMES.includes(ev.name)) {
            errors.push({
                description: `${ev.name} is a reserved event name`,
                validationCode: "FormatCheckError",
                fieldPath: "name"
            })
        }
    })

    return errors
}

const isValidUserPropertyName = (payload) => {
    let errors: ValidationMessage[] = []
    const userProperties = payload.user_properties

    Object.keys(userProperties).forEach(prop => {
        if (RESERVED_USER_PROPERTY_NAMES.includes(prop)) {
            errors.push({
                description: `user_property: ${prop} is a reserved user property name`,
                validationCode: "FormatCheckError",
                fieldPath: "user_property"
            })
        }
    })

    return errors
}

const isValidCurrencyType = (payload) => {
    let errors: ValidationMessage[] = []

    payload.events.forEach(ev => {
        if (ev.params && ev.params.currency) {
            const currency = ev.params.currency

            if (currency.length !== 3 || !currency.match(/[A-Z]{3}/)) {
                errors.push({
                    description: `currency: ${currency} must be a valid 3-letter ISO 4217 format`,
                    validationCode: "FormatCheckError",
                    fieldPath: "currency"
                })
            }
        }
    })

    return errors
}