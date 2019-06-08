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

/**
 * This component and associated context are used to implement auto scroll
 * on components that may have delayed rendering. When an AutoScrollDiv
 * is rendered (as a child or sub-child of AutoScrollProvider) it
 * automatically scrolls itself into view iff:
 *
 * - its id matches the URL fragment
 * - it hasn't already been scrolled into view
 *
 * Additionally, whenever the fragment changes, any existing AutoScrollDiv
 * component with a matching ID will automatically scroll itself into view.
 */
import * as React from "react";
import { useHash } from "../hooks";

const AutoScrollContext = React.createContext<(node: HTMLElement) => void>(
  () => {
    throw new Error(
      "Rendered an AutoScrollDiv outside of an AutoScrollProvider's children"
    );
  }
);

export const AutoScrollProvider: React.FC<{
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
}> = ({ children, behavior, block }) => {
  const navTarget = useHash();
  const [didNav, setDidNav] = React.useState(false);

  // Reset didNav whenever the hash changes
  React.useEffect(() => {
    setDidNav(false);
  }, [navTarget]);

  // observeScrollableNode is called with nodes that want to be scrolled
  // to. It executes a scroll if that node hasn't already been scrolled to
  // and
  const observeScrollableNode = React.useCallback(
    (node: HTMLElement) => {
      // TODO: replace with localeCompare
      if (!didNav && navTarget.toLowerCase() === node.id.toLowerCase()) {
        node.scrollIntoView({ behavior, block });
        setDidNav(true);
      }
    },
    [navTarget, didNav, setDidNav]
  );

  return (
    <AutoScrollContext.Provider value={observeScrollableNode}>
      {children}
    </AutoScrollContext.Provider>
  );
};

export const AutoScrollDiv: React.FC<{ id: string; className?: string }> = ({
  children,
  id,
  className
}) => {
  // Note to future developers: feel free to add additional div attributes
  // as props on this component as necessary
  const observeScrollableNode = React.useContext(AutoScrollContext);
  const [node, setNode] = React.useState<null | HTMLDivElement>(null);

  React.useEffect(() => {
    if (node !== null) {
      observeScrollableNode(node);
    }
  }, [observeScrollableNode, node]);

  return (
    <div id={id} className={className} ref={setNode}>
      {children}
    </div>
  );
};
