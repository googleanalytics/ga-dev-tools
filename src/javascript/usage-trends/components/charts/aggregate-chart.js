// Copyright 2017 Google Inc. All rights reserved.
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


import styles from './aggregate-chart.css';
import TrendChart from './trend-chart';


/**
 * A component to display the chart with all the aggregate data.
 */
export default class AggregateChart extends TrendChart {
  static defaultProps = {
    className: styles.root,
    title: 'All Results',
  }

  state = {}

  /**
   * @return {Array} The range of possible values.
   */
  getValueRange() {
    return [0, 100];
  }
}
