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
 * on components that may have delayed rendering. When a child component of
 * AutoScroll loads an element that it wants to scroll to, it uses
 * the AutoScrollContext value, which is a function taking an HTMLElement.
 * When called, the the function will cause the page to auto-scroll to that
 * element iff it hasn't been scrolled to yet, and its ID matches the URL
 * fragment.
 */
import * as React from "react";
import { useHash } from "../hooks";

const AutoScrollContext = React.createContext<(node: HTMLElement) => void>(
  () => {
    throw new Error("Called context function without provider");
  }
);

export const AutoScrollProvider: React.FC<{}> = ({ children }) => {
  const navTarget = useHash();
  const [didNav, setDidNav] = React.useState(false);

  // Reset didNav whenever the hash changes
  React.useEffect(() => {
    setDidNav(false);
  }, [navTarget]);

  // Observe node is called with nodes that may potentially want to be
  // scrolled to.
  const observeNode = React.useCallback(
    (node: HTMLElement) => {
      if (!didNav && navTarget === node.id) {
        node.scrollIntoView({ behavior: "auto", block: "start" });
        setDidNav(true);
      }
    },
    [navTarget, didNav, setDidNav]
  );

  return (
    <AutoScrollContext.Provider value={observeNode}>
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
  const observeNode = React.useContext(AutoScrollContext);
  const [node, setNode] = React.useState<null | HTMLDivElement>(null);

  React.useEffect(() => {
    if (node !== null) {
      observeNode(node);
    }
  }, [observeNode, node]);

  return (
    <div id={id} className={className} ref={setNode}>
      {children}
    </div>
  );
};
