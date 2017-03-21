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


import styles from './breakdown-chart.css';
import TrendChart from './trend-chart';


/**
 * A component to display the a chart of data from just one dimension.
 */
export default class BreakdownChart extends TrendChart {
  static defaultProps = {className: styles.root};
  state = {}

  /**
   * Caculates the range in the vertical axis from the dataset.
   * @return {Object}
   */
  calculateRange() {
    const values = this.props.dataset.slice(1).map((row) => row[1]);

    let max = Math.max(...values);
    let min = Math.min(...values);
    const delta = max - min;

    min = Math.max(min - delta/6, 0);
    if (min < 0.01) min = 0;

    max = Math.min(max + delta/6, 1);
    max = Math.max(max, min + 0.03);

    return {min, max};
  }

  /**
   * @return {Object}
   */
  getOptions() {
    const options = super.getOptions();

    options.colors = [options.colors[this.props.index]];
    options.chartArea.height = 400;
    options.vAxis.viewWindow = this.calculateRange();
    options.trendlines = {0: {
      type: 'linear',
      color: '#000',
      lineWidth: 3,
      opacity: 0.1,
      pointSize: 0,
    }};

    return options;
  }
}
