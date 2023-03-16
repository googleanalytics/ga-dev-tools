// Copyright 2020 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as React from "react"
import { useState } from "react"

import TextField from "@material-ui/core/TextField"
import Layout from "@/components/Layout"
import { IS_SSR } from "@/hooks"
import { PlainButton } from "@/components/Buttons"
import { validationLib } from "../../../../validators/validationLib"
export default ({ location: { pathname } }) => {
  const [firebaseAppId, setFireBaseAppId] = useState("")
  const [payload, setPayload] = useState("")

  return (
    <Layout
      title="Firebase Measurement Protocol Validator"
      pathname={pathname}
      description="This tool allows you to easily add campaign parameters to URLs so you can measure Custom Campaigns in Google Analytics."
    >
      {IS_SSR ? null : (
        <section>
          <h1>Hi there</h1>
            <TextField
              id="firebase_app_id"
              required
              value={firebaseAppId}
              onChange={(e) => setFireBaseAppId(e.target.value)}
              label="firebase_app_id"
              size="medium"
              variant="outlined"
              helperText={
                <span>
                  (e.g. {"X:XX:XX:XX"})
                </span>
              }
            />

            <TextField
              id="website-url"
              required
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              label="Payload"
              size="medium"
              multiline
              margin={"dense"}
              fullWidth
              variant="outlined"
              helperText={
                <span>
                  Enter JSON to validate
                </span>
              }
            />

          <PlainButton
            style={{ marginRight: "8px" }}
            medium
            onClick = {() => {
              let validation = new validationLib(
                {
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
                },
                {
                  'param_type': 'firebase_app_id', 
                  'value': '1:169314272487:android:dffe7f557ea03322'
                },
                'base',
                726,
              )
              const validationResult = validation.validate()
            }}
          >
            submit
          </PlainButton>
        </section>
      )}
    </Layout>
  )
}
