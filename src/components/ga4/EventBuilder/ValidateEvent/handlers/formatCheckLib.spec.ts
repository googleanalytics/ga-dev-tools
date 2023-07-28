import "jest"
import { formatCheckLib } from "./formatCheckLib" 

describe("formatCheckLib", () => {
    describe("returns appOrClientErrors", () => {
        describe("when useFirebase is true", () => {
            test("does not return an error when app_instance_id is 32 alpha-numeric chars", () => {
                const payload = {app_instance_id: "12345678901234567890123456789012"}
                const firebaseAppId = '1:1233455666:android:abcdefgh'
                const instanceId = {firebase_app_id: firebaseAppId}
                const api_secret = '123'

                let errors = formatCheckLib(payload, instanceId, api_secret, true)

                expect(errors).toEqual([])
            })

            test("returns an error when appInstanceId is not 32 chars", () => {
                const appInstanceId = "123456789012345678901234567890123"
                const payload = {app_instance_id: appInstanceId}
                const firebaseAppId = '1:1233455666:android:abcdefgh'
                const instanceId = {firebase_app_id: firebaseAppId}
                const api_secret = '123'

                let errors = formatCheckLib(payload, instanceId, api_secret, true)

                expect(errors[0].description).toEqual(
                    `Measurement app_instance_id is expected to be a 32 digit hexadecimal number but was [${ appInstanceId.length }] digits.`
                )
            })

            test("returns an error when appInstanceId contains non-alphanumeric char", () => {
                const appInstanceId = "1234567890123456789012345678901g"
                const payload = {app_instance_id: appInstanceId}
                const firebaseAppId = '1:1233455666:android:abcdefgh'
                const instanceId = {firebase_app_id: firebaseAppId}
                const api_secret = '123'

                let errors = formatCheckLib(payload, instanceId, api_secret, true)

                expect(errors[0].description).toEqual(
                    `Measurement app_instance_id contains non hexadecimal character [g].`,
                )
            })

            test("returns an error when appInstanceId is null", () => {
                const appInstanceId = ""
                const payload = {app_instance_id: appInstanceId}
                const firebaseAppId = '1:1233455666:android:abcdefgh'
                const instanceId = {firebase_app_id: firebaseAppId}
                const api_secret = '123'

                let errors = formatCheckLib(payload, instanceId, api_secret, true)

                expect(errors[0].description).toEqual(
                    "Measurement requires an app_instance_id.",
                )
            })

            test("returns an error when appInstanceId not present in the payload", () => {
                const payload = {}
                const firebaseAppId = '1:1233455666:android:abcdefgh'
                const instanceId = {firebase_app_id: firebaseAppId}
                const api_secret = '123'

                let errors = formatCheckLib(payload, instanceId, api_secret, true)

                expect(errors[0].description).toEqual(
                    "Measurement requires an app_instance_id.",
                )
            })
        })

        describe("when useFirebase is false", () => {
            test("does not return an error when client_id is present", () => {
                const payload = {client_id: "12345678901234567890123456789012"}
                const measurementId = 'test'
                const instanceId = {measurement_id: measurementId}
                const api_secret = '123'

                let errors = formatCheckLib(payload, instanceId, api_secret, false)

                expect(errors).toEqual([])
            })

            test("returns an error when client_id is not present", () => {
                const payload = {}
                const measurementId = 'test'
                const instanceId = {measurement_id: measurementId}
                const api_secret = '123'

                let errors = formatCheckLib(payload, instanceId, api_secret, false)

                expect(errors[0].description).toEqual(
                    "Measurement requires a client_id.",
                )
            })

            test("returns an error when appInstanceId contains non-alphanumeric char", () => {
                const appInstanceId = "1234567890123456789012345678901g"
                const payload = {app_instance_id: appInstanceId}
                const firebaseAppId = '1:1233455666:android:abcdefgh'
                const instanceId = {firebase_app_id: firebaseAppId}
                const api_secret = '123'

                let errors = formatCheckLib(payload, instanceId, api_secret, true)

                expect(errors[0].description).toEqual(
                    `Measurement app_instance_id contains non hexadecimal character [g].`,
                )
            })

            test("returns an error when appInstanceId is null", () => {
                const appInstanceId = ""
                const payload = {app_instance_id: appInstanceId}
                const firebaseAppId = '1:1233455666:android:abcdefgh'
                const instanceId = {firebase_app_id: firebaseAppId}
                const api_secret = '123'

                let errors = formatCheckLib(payload, instanceId, api_secret, true)

                expect(errors[0].description).toEqual(
                    "Measurement requires an app_instance_id.",
                )
            })
        })
    })

    describe("returns invalidEventName errors", () => {
        test("does not return an error for a valid event name", () => {
            const payload = {app_instance_id: "12345678901234567890123456789012", events: [{name: 'add_payment_info'}]}
            const firebaseAppId = '1:1233455666:android:abcdefgh'
            const instanceId = {firebase_app_id: firebaseAppId}
            const api_secret = '123'

            let errors = formatCheckLib(payload, instanceId, api_secret, true)

            expect(errors).toEqual([])
        })

        test("returns an error when event's name is a reserved name", () => {
            const payload = {app_instance_id: "12345678901234567890123456789012", events: [{name: 'ad_click'}]}
            const firebaseAppId = '1:1233455666:android:abcdefgh'
            const instanceId = {firebase_app_id: firebaseAppId}
            const api_secret = '123'

            let errors = formatCheckLib(payload, instanceId, api_secret, true)

            expect(errors[0].description).toEqual(
                "ad_click is a reserved event name"
            )
        })
    })

    describe("returns invalidUserPropertyName errors", () => {
        test("does not return an error for a valid user property name", () => {
            const payload = {app_instance_id: "12345678901234567890123456789012", user_properties: {'test': 'test'}}
            const firebaseAppId = '1:1233455666:android:abcdefgh'
            const instanceId = {firebase_app_id: firebaseAppId}
            const api_secret = '123'

            let errors = formatCheckLib(payload, instanceId, api_secret, true)

            expect(errors).toEqual([])
        })

        test("returns an error when event's name is a reserved name", () => {
            const payload = {app_instance_id: "12345678901234567890123456789012", user_properties: {'first_open_time': 'test'}}
            const firebaseAppId = '1:1233455666:android:abcdefgh'
            const instanceId = {firebase_app_id: firebaseAppId}
            const api_secret = '123'

            let errors = formatCheckLib(payload, instanceId, api_secret, true)

            expect(errors[0].description).toEqual(
                "user_property: 'first_open_time' is a reserved user property name"
            )
        })
    })

    describe("returns invalidCurrencyType errors", () => {
        test("does not return an error for a valid currency type", () => {
            const payload = {app_instance_id: "12345678901234567890123456789012", events: [{params: {currency: 'USD'}}]}
            const firebaseAppId = '1:1233455666:android:abcdefgh'
            const instanceId = {firebase_app_id: firebaseAppId}
            const api_secret = '123'

            let errors = formatCheckLib(payload, instanceId, api_secret, true)

            expect(errors).toEqual([])
        })

        test("returns an error for an invalid currency type", () => {
            const payload = {app_instance_id: "12345678901234567890123456789012", events: [{params: {currency: 'USDD'}}]}
            const firebaseAppId = '1:1233455666:android:abcdefgh'
            const instanceId = {firebase_app_id: firebaseAppId}
            const api_secret = '123'

            let errors = formatCheckLib(payload, instanceId, api_secret, true)

            expect(errors[0].description).toEqual(
                "currency: USDD must be a valid uppercase 3-letter ISO 4217 format"
            )
        })
    })

    describe("validates items array", () => {
        test("does not return an error if items array is valid", () => {
            const payload = {app_instance_id: "12345678901234567890123456789012", events: [{params: {items: [{'item_id': 1234}]}}]}
            const firebaseAppId = '1:1233455666:android:abcdefgh'
            const instanceId = {firebase_app_id: firebaseAppId}
            const api_secret = '123'

            let errors = formatCheckLib(payload, instanceId, api_secret, true)

            expect(errors).toEqual([])
        })

        test("returns an error when items does not have either item_id or item_name", () => {
            const payload = {app_instance_id: "12345678901234567890123456789012", events: [{params: {items: [{'item_namee': 'test'}]}}]}
            const firebaseAppId = '1:1233455666:android:abcdefgh'
            const instanceId = {firebase_app_id: firebaseAppId}
            const api_secret = '123'

            let errors = formatCheckLib(payload, instanceId, api_secret, true)

            expect(errors[0].description).toEqual(
                "'items' object must contain one of the following keys: 'item_id' or 'item_name'"
            )
        })

        test("validates empty items array when event requires items", () => {
            const payload = {app_instance_id: "12345678901234567890123456789012", events: [{params: {name: 'purchase', items: []}}]}
            const firebaseAppId = '1:1233455666:android:abcdefgh'
            const instanceId = {firebase_app_id: firebaseAppId}
            const api_secret = '123'

            let errors = formatCheckLib(payload, instanceId, api_secret, true)

            expect(errors[0].description).toEqual(
                "'items' should not be empty; One of 'item_id' or 'item_name' is a required key"
            )
        })

        test("does not validate empty items array when event doesn't require items", () => {
            const payload = {app_instance_id: "12345678901234567890123456789012", events: [{params: {name: 'random', items: []}}]}
            const firebaseAppId = '1:1233455666:android:abcdefgh'
            const instanceId = {firebase_app_id: firebaseAppId}
            const api_secret = '123'

            let errors = formatCheckLib(payload, instanceId, api_secret, true)

            expect(errors).toEqual([])
        })

        test("does not validate empty items array when event does not have a name", () => {
            const payload = {app_instance_id: "12345678901234567890123456789012", events: [{params: {items: []}}]}
            const firebaseAppId = '1:1233455666:android:abcdefgh'
            const instanceId = {firebase_app_id: firebaseAppId}
            const api_secret = '123'

            let errors = formatCheckLib(payload, instanceId, api_secret, true)

            expect(errors).toEqual([])
        })

        test("returns an error when item_id and item_name keys have empty values", () => {
            const payload = {
                app_instance_id: "12345678901234567890123456789012", 
                events: [
                    {
                        params: {
                            items: [
                                {
                                    'item_name': '',
                                    'item_id': ''
                                }
                            ]
                        }
                    }
                ] 
            }
            const firebaseAppId = '1:1233455666:android:abcdefgh'
            const instanceId = {firebase_app_id: firebaseAppId}
            const api_secret = '123'

            let errors = formatCheckLib(payload, instanceId, api_secret, true)

            expect(errors[0].description).toEqual(
                "'items' object must contain one of the following keys: 'item_id' or 'item_name'"
            )
        })
    })

    describe("validates instance_id", () => {
        describe("when useFirebase is true", () => {
            test("does not return an error if firebase_app_id is valid", () => {
                const payload = {app_instance_id: "12345678901234567890123456789012"}
                const firebaseAppId = '1:1233455666:android:abcdefgh'
                const instanceId = {firebase_app_id: firebaseAppId}
                const api_secret = '123'

                let errors = formatCheckLib(payload, instanceId, api_secret, true)

                expect(errors).toEqual([])
            })

            test("returns an error when firebase_app_id is invalid", () => {
                const payload = {app_instance_id: "12345678901234567890123456789012"}
                const firebaseAppId = '1233455666:android:abcdefgh'
                const instanceId = {firebase_app_id: firebaseAppId}
                const api_secret = '123'

                let errors = formatCheckLib(payload, instanceId, api_secret, true)

                expect(errors[0].description).toEqual(
                    `${firebaseAppId} does not follow firebase_app_id pattern of X:XX:XX:XX at path`
                )
            })

            test("does not validate measurement_id", () => {
                const payload = {app_instance_id: "12345678901234567890123456789012"}
                const firebaseAppId = '1:1233455666:android:abcdefgh'
                const measurementId = ''
                const instanceId = {firebase_app_id: firebaseAppId, measurement_id: measurementId}
                const api_secret = '123'

                let errors = formatCheckLib(payload, instanceId, api_secret, true)

                expect(errors).toEqual([])
            })
        })

        describe("when useFirebase is false", () => {
            test("does not return an error if measurement_id is not null", () => {
                const payload = {client_id: "12345678901234567890123456789012"}
                const measurementId = 'test'
                const instanceId = {measurement_id: measurementId}
                const api_secret = '123'

                let errors = formatCheckLib(payload, instanceId, api_secret, false)

                expect(errors).toEqual([])
            })

            test("returns an error when meausrement_id is null", () => {
                const payload = {client_id: "12345678901234567890123456789012"}
                const measurementId = ''
                const instanceId = {measurement_id: measurementId}
                const api_secret = '123'

                let errors = formatCheckLib(payload, instanceId, api_secret, false)

                expect(errors[0].description).toEqual(
                    "Unable to find non-empty parameter [measurement_id] value in request."
                )
            })

            test("does not validate firebase_app_id", () => {
                const payload = {client_id: "12345678901234567890123456789012"}
                const firebaseAppId = '1233455666:android:abcdefgh'
                const measurementId = 'test'
                const instanceId = {firebase_app_id: firebaseAppId, measurement_id: measurementId}
                const api_secret = '123'

                let errors = formatCheckLib(payload, instanceId, api_secret, false)

                expect(errors).toEqual([])
            })
        })
    })

    describe("validates api_secret", () => {
        test("does not return an error api_secret is not null", () => {
            const payload = { app_instance_id: "12345678901234567890123456789012" }
            const firebaseAppId = '1:1233455666:android:abcdefgh'
            const instanceId = {firebase_app_id: firebaseAppId}
            const api_secret = '123'

            let errors = formatCheckLib(payload, instanceId, api_secret, true)

            expect(errors).toEqual([])
        })

        test("returns an error when api_secret is null", () => {
            const payload = { app_instance_id: "12345678901234567890123456789012" }
            const firebaseAppId = '1:1233455666:android:abcdefgh'
            const instanceId = {firebase_app_id: firebaseAppId}
            const api_secret = ''

            let errors = formatCheckLib(payload, instanceId, api_secret, true)

            expect(errors[0].description).toEqual(
                "Unable to find non-empty parameter [api_secret] value in request."
            )
        })
    })
})