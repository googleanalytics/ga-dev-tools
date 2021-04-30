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

import React from "react"

import makeStyles from "@material-ui/core/styles/makeStyles"

import { Parameter, ParameterType } from "../types"
import EditOptionalStringParameter from "./EditOptionalStringParameter"
import EditOptionalNumberParameter from "./EditOptionalNumberParameter"
import EditItemsParameter from "./EditItemsParameter"

const useStyles = makeStyles(() => ({
  editParameter: {
    flexGrow: 5,
  },
}))

interface EditParameterValueProps {
  parameter: Parameter
  updateParameter: (nu: Parameter) => void
}

const EditParameterValue: React.FC<EditParameterValueProps> = ({
  parameter,
  updateParameter,
}) => {
  const classes = useStyles()
  switch (parameter.type) {
    case ParameterType.String:
      return (
        <EditOptionalStringParameter
          className={classes.editParameter}
          parameter={parameter}
          updateParameter={updateParameter}
        />
      )
    case ParameterType.Items:
      return (
        <EditItemsParameter
          items={parameter}
          updateParameter={updateParameter}
        />
      )
    case ParameterType.Number:
      return (
        <EditOptionalNumberParameter
          className={classes.editParameter}
          parameter={parameter}
          updateParameter={updateParameter}
        />
      )
  }
}

export default EditParameterValue
