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
import Icon, { IconType } from "../../components/icon";
import IconButton from "../../components/icon-button";
import supports from "../../supports";
import { sleep } from "../../utils";
import { actions } from "../store";
import { HitStatus, ValidationMessage } from "../types";
import copy from "copy-to-clipboard";

const ACTION_TIMEOUT = 1500;

interface HitElementProps {
  hitPayload: string;
  actions: typeof actions;
  hitStatus: HitStatus;
  validationMessages: ValidationMessage[];
}

interface HitElementState {
  hitSent: boolean;
}

/**
 * A component that renders the generated hit element.
 */
export default class HitElement extends React.Component<
  HitElementProps,
  HitElementState
> {
  hitPayloadCopiedTimeout_?: number;
  hitUriCopiedTimeout_?: number;
  state = {
    hitSent: false
  };

  /**
   * Sends the hit payload to Google Analytics and updates the button state
   * to indicate the hit was successfully sent. After 1 second the button
   * gets restored to its original state.
   */
  sendHit = async () => {
    await $.ajax({
      method: "POST",
      url: "https://www.google-analytics.com/collect",
      data: this.props.hitPayload
    });
    this.setState({ hitSent: true });
    gaAll("send", "event", {
      eventCategory: "Hit Builder",
      eventAction: "send",
      eventLabel: "payload"
    });
    await sleep(ACTION_TIMEOUT);
    this.setState({ hitSent: false });
  };

  /**
   * Returns the rendered components that make up the validation status.
   * @return {Object}
   */
  renderValidationStatus() {
    switch (this.props.hitStatus) {
      case "VALID":
        return (
          <header className="HitElement-status">
            <span className="HitElement-statusIcon">
              <Icon type="check" />
            </span>
            <div className="HitElement-statusBody">
              <h1 className="HitElement-statusHeading">Hit is valid!</h1>
              <p className="HitElement-statusMessage">
                Use the controls below to copy the hit or share it with
                coworkers.
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
                {this.props.validationMessages.map(message => (
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
  }

  /**
   * React lifecycyle methods below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
   */

  /**
   * Resets the hit if a new payload is entered by the user.
   * @param {Object} nextProps
   */
  componentWillReceiveProps(nextProps: HitElementProps) {
    if (nextProps.hitPayload != this.props.hitPayload) {
      this.setState({
        hitSent: false
      });
    }
  }

  render(): JSX.Element {
    let className = "HitElement";
    if (this.props.hitStatus == "VALID") className += " HitElement--valid";
    if (this.props.hitStatus == "INVALID") className += " HitElement--invalid";

    return (
      <section className={className}>
        {this.renderValidationStatus()}
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
                <HitPayloadInput
                  hitPayload={this.props.hitPayload}
                  updateHit={this.props.actions.updateHit}
                />
              </div>
            </div>
          </div>
          <HitActions
            hitPayload={this.props.hitPayload}
            hitStatus={this.props.hitStatus}
            hitSent={this.state.hitSent}
            validateHit={this.props.actions.validateHit}
            sendHit={this.sendHit}
          />
        </div>
      </section>
    );
  }
}

interface CopyButtonProps {
  type: IconType;
  textToCopy: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  children,
  type,
  textToCopy
}) => {
  const [iconType, setIconType] = React.useState<IconType>(type);
  const [copied, setCopied] = React.useState(false);
  const copiedTimeout = React.useRef(0);
  const copyText = React.useCallback(() => {
    if (copy(textToCopy)) {
      setCopied(true);

      gaAll("send", "event", {
        eventCategory: "Hit Builder",
        eventAction: "copy-to-clipboard",
        eventLabel: "payload"
      });
    }
  }, [textToCopy]);

  React.useEffect(() => {
    clearTimeout(copiedTimeout.current);
    if (copied) {
      setIconType("check");
      copiedTimeout.current = window.setTimeout(() => {
        setCopied(false);
        setIconType(type);
      }, ACTION_TIMEOUT);
    } else {
    }
  }, [copied]);
  return (
    <IconButton type={iconType} onClick={copyText}>
      {children}
    </IconButton>
  );
};

interface HitActionsProps {
  hitStatus: HitStatus;
  hitPayload: string;
  hitSent: boolean;
  validateHit: () => void;
  sendHit: () => void;
}

const HitActions: React.FC<HitActionsProps> = ({
  hitStatus,
  hitSent,
  hitPayload,
  sendHit,
  validateHit
}) => {
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

interface HitPayloadProps {
  hitPayload: string;
  // TODO: This should eventually just be done with redux, but right now it's
  // hard to pull this apart.
  updateHit: (newValue: string) => void;
}

const HitPayloadInput: React.FC<HitPayloadProps> = ({
  hitPayload,
  updateHit
}) => {
  const [value, setValue] = React.useState(hitPayload);
  const [editing, setIsEditing] = React.useState(false);

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
