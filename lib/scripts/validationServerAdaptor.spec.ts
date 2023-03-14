import { validationServerAdaptor } from "./validationServerAdaptor"
import "jest"
import axios from 'axios'

jest.mock('./validationServerAdaptor')

describe(".validationServerAdaptor", () => {
  describe("#smartValidate", () => {
    test("Calls the validation server", () => {
        const spy = jest.spyOn(axios, 'get')
        const validationServerURL = "https://www.google-analytics.com/debug/mp/collect?firebase_app_id=1:XXXXXXXXXXXX:xxx:xxxxxxxxxxxxxxxxxxxxxx&api_secret=mock_api_secret"
        const response = {
            'validationMessages': [
                {
                    'fieldPath': 'timestamp_micros', 
                    'description': 'Measurement timestamp_micros has timestamp too far in the past. Measurement protocol only supports timestamps [72h] into the past. The current time in UNIX microseconds is [1678758461178324].', 
                    'validationCode': 'VALUE_INVALID'
                }
            ]
        }
        
        spy.mockResolvedValueOnce(response)
    
        expect(spy).toHaveBeenCalledWith(validationServerURL)
        expect(spy).toHaveBeenCalledTimes(1)
        expect(response).toEqual(response)

    })

    describe("when there are errors", () => {
        test("calls smartFixError", () => {
        })
    })

    test("calls the getErrorMessage for each error", () => {
    })
  })
})
