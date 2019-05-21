// Copyright 2015 Google Inc. All rights reserved.
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

import Icon, { IconType } from "./icon";
import * as React from "react";

type ButtonProps = {
  className?: string;
  disabled?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  title?: string;
  iconStyle?: React.CSSProperties;
  type: IconType;
};

type AnchorProps = {
  download?: boolean;
  className?: string;
  href: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  title?: string;
  iconStyle?: React.CSSProperties;
  type: IconType;
};

const IconButton: React.FC<AnchorProps | ButtonProps> = props => {
  const inner = (
    <span className="Button-iconWrapper" title={props.title}>
      <span className="Button-icon" style={props.iconStyle}>
        <Icon type={props.type} />
      </span>
      {props.children}
    </span>
  );

  return "href" in props ? (
    <a
      download={props.download}
      className={props.className || "Button"}
      href={props.href}
      onClick={props.onClick}
      title={props.title}
    >
      {inner}
    </a>
  ) : (
    <button
      className={props.className || "Button"}
      disabled={props.disabled}
      onClick={props.onClick}
      title={props.title}
    >
      {inner}
    </button>
  );
};

export default IconButton;
