import { Draft07, JSONError, CreateError, createError } from "json-schema-library"

const RESERVED_WORDS = [
    "ad_activeview", "ad_click", "ad_exposure", "ad_impression", "ad_query",
    "adunit_exposure", "app_clear_data", "app_install", "app_update",
    "app_remove", "error", "first_open", "first_visit", "in_app_purchase",
    "notification_dismiss", "notification_foreground", "notification_open",
    "notification_receive", "os_update", "screen_view", "session_start",
    "user_engagement"
]

const USER_PROPERTY_RESERVED_WORDS = [
    "first_open_time", "first_visit_time", "last_deep_link_referrer", "user_id",
    "first_open_after_install"
]

export const isValidAppInstanceId = (value: string): boolean => {
    const hexdigits = /^[0-9a-fA-F]+$/;
    // RFC 4122 version - 4 UUID without the dashes, 32 char.
    try {
        if (value.length !== 32 || !hexdigits.test(value)) {
            createError(
                "FormatError", {
                    pointer: `'${value}' is not a valid RFC 4122 v4 UUID without dashes of length 32`
                }
            )
        }

        return true
    } catch (err) {

    }
    return true
} 