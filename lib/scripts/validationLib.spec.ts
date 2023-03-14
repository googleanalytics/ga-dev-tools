import { validationLib } from "./validationLib"
import { validationServerAdaptor } from "./validationServerAdaptor"
import "jest"
jest.mock('./validationServerAdaptor')

describe(".validationLib", () => {
  describe("#validate", () => {
    test("calls the validationServerAdaptor", () => {
      let payload = {
        'user_id': '7db02b47fc8f4bce4ee2bd5717eb4ab1d770aece37ac278c729b6a11c66b9f93.7db02b47fc8f4bce4ee2bd5717eb4ab1d770aece37ac278c729b6a11c66b9f93', 
        'events': [
          {
            'name': 'purchase', 
            'params': {
              'visitor_id': '7db02b47fc8f4bce4ee2bd5717eb4ab1d770aece37ac278c729b6a11c66b9f93', 
              'country': 'US', 
              'region': 'NA', 
              'transaction_id': '1501894659', 
              'ogp_nor_loc': 3.7999, 
              'ogp_nob_loc': 18.99, 
              'ogp_loc': 3.4201, 
              'value': 3.4201, 
              'currency': 'USD'
            }
          }
        ], 
        'timestamp_micros': '1638319297000000', 
        'app_instance_id': '9a9e70fefa0ae5f9b3fa68e3ffa0d050', 
        'non_personalized_ads': false
      }
      let additional_params = {
        'param_type': 'firebase_app_id', 
        'value': '1:169314272487:android:dffe7f557ea03322'
      }
      let schema_type = 'base'
      let content_length  = 726
      const validation = new validationLib(
        payload,
        additional_params,
        schema_type,
        content_length,
      )  
      validation.validate()

      expect(validationServerAdaptor).toHaveBeenCalledWith(
        payload,
        schema_type
      )
    })
  })
})
