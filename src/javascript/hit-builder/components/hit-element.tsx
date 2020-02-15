// Copyright 2016 Google Inc. All rights reserved.
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

/* global $ */

import React from "react";
import Textarea from "react-textarea-autosize";
import { gaAll } from "../../analytics";
import Icon from "../../components/icon";
import IconButton from "../../components/icon-button";
import CopyButton from "./copy-button";
import supports from "../../supports";
import { sleep } from "../../utils";
import actions from "../actions";
import { HitStatus, ValidationMessage, State } from "../types";
import { useSelector, useDispatch } from "react-redux";

const ACTION_TIMEOUT = 1500;

const HitElement: React.FC = () => {
  const hitStatus = useSelector<State, HitStatus>(a => a.hitStatus);
  let className = "HitElement";
  if (hitStatus === HitStatus.Valid) {
    className += " HitElement--valid";
  }
  if (hitStatus === HitStatus.Invalid) {
    className += " HitElement--invalid";
  }

  return (
    <section className={className}>
      <ValidationStatus />
      <div className="HitElement-body">
        <div className="HitElement-requestInfo">
          POST /collect HTTP/1.1
          <br />
          Host: www.google-analytics.com
        </div>
        <div className="HitElement-requestBody">
          <div className="FormControl FormControl--full">
            <label className="FormControl-label">Hit payload</label>
            <div className="FormControl-body">
              <HitPayloadInput />
            </div>
          </div>
        </div>
        <HitActions />
      </div>
    </section>
  );
};

export default HitElement;

const ValidationStatus: React.FC = () => {
  const validationMessages = useSelector<State, ValidationMessage[]>(
    a => a.validationMessages
  );
  const hitStatus = useSelector<State>(a => a.hitStatus);
  switch (hitStatus) {
    case "VALID":
      return (
        <header className="HitElement-status">
          <span className="HitElement-statusIcon">
            <Icon type="check" />
          </span>
          <div className="HitElement-statusBody">
            <h1 className="HitElement-statusHeading">Hit is valid!</h1>
            <p className="HitElement-statusMessage">
              Use the controls below to copy the hit or share it with coworkers.
              <br />
              You can also send the hit to Google Analytics and watch it in
              action in the Real Time view.
            </p>
          </div>
        </header>
      );
    case "INVALID":
      return (
        <header className="HitElement-status">
          <span className="HitElement-statusIcon">
            <Icon type="error-outline" />
          </span>
          <div className="HitElement-statusBody">
            <h1 className="HitElement-statusHeading">Hit is invalid!</h1>
            <ul className="HitElement-statusMessage">
              {validationMessages.map(message => (
                <li key={message.param}>{message.description}</li>
              ))}
            </ul>
          </div>
        </header>
      );
    default:
      return (
        <header className="HitElement-status">
          <span className="HitElement-statusIcon">
            <Icon type="warning" />
          </span>
          <div className="HitElement-statusBody">
            <h1 className="HitElement-statusHeading">
              This hit has not yet been validated
            </h1>
            <p className="HitElement-statusMessage">
              You can update the hit using any of the controls below.
              <br />
              When you're done, click the "Validate hit" button to make sure
              everything's OK.
            </p>
          </div>
        </header>
      );
  }
};

const HitActions: React.FC = () => {
  const hitStatus = useSelector<State, HitStatus>(a => a.hitStatus);
  const hitPayload = useSelector<State, string>(a => a.hitPayload);
  const [hitSent, setHitSent] = React.useState<boolean>(false);
  React.useEffect(() => {
    setHitSent(false);
  }, [hitPayload]);

  /**
   * Sends the hit payload to Google Analytics and updates the button state
   * to indicate the hit was successfully sent. After 1 second the button
   * gets restored to its original state.
   */
  const sendHit = React.useCallback(async () => {
    await $.ajax({
      method: "POST",
      url: "https://www.google-analytics.com/collect",
      data: hitPayload
    });
    setHitSent(true);
    gaAll("send", "event", {
      eventCategory: "Hit Builder",
      eventAction: "send",
      eventLabel: "payload"
    });
    await sleep(ACTION_TIMEOUT);
    setHitSent(false);
  }, [hitPayload]);

  const dispatch = useDispatch();
  const validateHit = React.useCallback(() => {
    dispatch(actions.validateHit);
  }, [dispatch]);

  if (hitStatus != "VALID") {
    const buttonText = (hitStatus == "INVALID" ? "Rev" : "V") + "alidate hit";

    return (
      <div className="HitElement-action">
        <button
          className="Button Button--action"
          disabled={hitStatus === "VALIDATING"}
          onClick={validateHit}
        >
          {hitStatus === "VALIDATING" ? "Validating..." : buttonText}
        </button>
      </div>
    );
  }

  const sendHitButton = (
    <IconButton
      className="Button Button--success Button--withIcon"
      type={hitSent ? "check" : "send"}
      onClick={sendHit}
    >
      Send hit to Google Analytics
    </IconButton>
  );

  if (supports.copyToClipboard()) {
    const sharableLinkToHit =
      location.protocol +
      "//" +
      location.host +
      location.pathname +
      "?" +
      hitPayload;
    return (
      <div className="HitElement-action">
        <div className="ButtonSet">
          {sendHitButton}
          <CopyButton textToCopy={hitPayload} type="content-paste">
            Copy hit payload
          </CopyButton>
          <CopyButton type="link" textToCopy={sharableLinkToHit}>
            Copy sharable link to hit
          </CopyButton>
        </div>
      </div>
    );
  } else {
    return <div className="HitElement-action">{sendHitButton}</div>;
  }
};

const HitPayloadInput: React.FC = () => {
  const hitPayload = useSelector<State, string>(a => a.hitPayload);
  const [value, setValue] = React.useState(hitPayload);
  const [editing, setIsEditing] = React.useState(false);
  const dispatch = useDispatch();
  const updateHit = React.useCallback(
    (newHit: string) => {
      dispatch(actions.updateHit(newHit));
    },
    [dispatch]
  );

  // Update the localState of then input when the hitPayload changes.
  React.useEffect(() => {
    setValue(hitPayload);
  }, [hitPayload]);

  React.useEffect(() => {
    if (editing) {
      $("body").addClass("is-editing");
    } else {
      $("body").removeClass("is-editing");
    }
  }, [editing]);

  const onFocus = React.useCallback(() => {
    setIsEditing(true);
  }, []);

  const onBlur = React.useCallback(() => {
    setIsEditing(false);
    updateHit(value);
  }, [value]);

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    },
    []
  );

  return (
    <Textarea
      className="FormField"
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};
