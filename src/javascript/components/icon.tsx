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

import * as React from "react";

export type IconType =
  | "add-circle"
  | "arrow-back"
  | "arrow-forward"
  | "call-made"
  | "check"
  | "content-paste"
  | "close"
  | "error-outline"
  | "event"
  | "file-download"
  | "home"
  | "info-outline"
  | "link"
  | "menu"
  | "person"
  | "remove-circle"
  | "refresh"
  | "send"
  | "warning"
  | "bitly-logo";

/**
 * A components that renders an <svg> icon from the iconset in:
 * src/images/icons.svg
 */
const Icon: React.FC<{ type: IconType }> = React.memo(({ type }) => {
  /**
   * This component should simply render:
   *
   * <svg className="Icon" viewBox="0 0 24 24">
   *     <use xlinkHref={`/public/images/icons.svg#icon-${type}`} />
   * </svg>
   *
   * However, there is a known issue in React where for some reason an
   * svg `<use>` element is not compatible with the render cycle, because
   * somehow the Virtual DOM can't reconcile it when there are complex
   * changes in the tree. We therefore use this manual dom element
   * manipulaton effect to account for when `props.type` changes.
   *
   * See https://stackoverflow.com/questions/50771280/react-svg-disappearing-when-component-rerenders
   * and http://sfdcinpractice.com/index.php/2016/12/29/svg-icon-disappears-rerendering/
   * for details
   */

  const [svgNode, setSvgNode] = React.useState<SVGElement | null>(null);

  React.useLayoutEffect(() => {
    if (svgNode === null) {
      return;
    }

    const url = `/public/images/icons.svg#icon-${type}`;
    const useNode = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "use"
    );
    useNode.setAttributeNS("http://www.w3.org/1999/xlink", "href", url);
    svgNode.appendChild(useNode);

    return () => {
      useNode.remove();
    };
  }, [type, svgNode]);

  return <svg className="Icon" viewBox="0 0 24 24" ref={setSvgNode} />;
});

export default Icon;
