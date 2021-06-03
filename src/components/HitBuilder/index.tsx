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

import Typography from "@material-ui/core/Typography"

import { Url } from "@/constants"
import ExternalLink from "@/components/ExternalLink"
import Parameters from "./Parameters"
import HitCard from "./HitCard"
import * as hitUtils from "./hit"
import * as hooks from "./hooks"

const HitBuilder: React.FC = () => {
  const { properties } = hooks.useProperties()
  const [hitPayload, setHitPayload] = React.useState("")

  const {
    updateParameterName,
    updateParameterValue,
    addParameter,
    removeParameter,
    parameters,
    hasParameter,
    setParametersFromString,
    shouldFocus,
  } = hooks.useParameters()

  const {
    hitStatus,
    validationMessages,
    validateHit,
    sendHit,
  } = hooks.useValidationServer(parameters)

  // Update the hitPayload whenever the parameters change.
  React.useEffect(() => {
    setHitPayload(hitUtils.convertParamsToHit(parameters))
  }, [parameters])

  return (
    <>
      <Typography variant="body1">
        This tools allows you to construct and validate{" "}
        <ExternalLink href={Url.measurementProtocol}>
          Measurement Protocol
        </ExternalLink>{" "}
        hits using the{" "}
        <ExternalLink href={Url.validatingMeasurement}>
          Measurement Protocol Validation Server
        </ExternalLink>
        .
      </Typography>

      <Typography variant="body1">
        To get started, use the controls below to construct a new hit or paste
        an existing hit into the text box in the hit summary.
      </Typography>

      <Typography variant="body1">
        The box below displays the full hit and its validation status. You can
        update the hit in the text box and the parameter details below will be
        automatically updated.
      </Typography>

      <HitCard
        setParametersFromString={setParametersFromString}
        hasParameter={hasParameter}
        addParameter={addParameter}
        validateHit={validateHit}
        sendHit={sendHit}
        hitPayload={hitPayload}
        hitStatus={hitStatus}
        validationMessages={validationMessages}
      />

      <Typography variant="h3">Hit parameter details</Typography>
      <Typography variant="body1">
        The fields below are a breakdown of the individual parameters and values
        for the hit in the text box above. When you update these values, the hit
        above will be automatically updated.
      </Typography>

      <Parameters
        shouldFocus={shouldFocus}
        validationMessages={validationMessages}
        properties={properties}
        parameters={parameters}
        updateParameterName={updateParameterName}
        updateParameterValue={updateParameterValue}
        removeParameter={removeParameter}
        addParameter={addParameter}
      />

      <Typography variant="h3">References</Typography>

      <Typography variant="body1">
        Click the info link to the right of each parameter in the details
        section to go directly to its documentation. For general references,
        refer to the links below:
      </Typography>

      <Typography variant="body1" component="ul">
        <li>
          <ExternalLink href={Url.protocolParameters}>
            Parameter reference
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href={Url.commonHits}>
            Examples of common hits
          </ExternalLink>
        </li>
      </Typography>
    </>
  )
}

export default HitBuilder
