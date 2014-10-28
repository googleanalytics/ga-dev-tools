// Copyright 2014 Google Inc. All rights reserved.
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

/**
 * @fileoverview This file contains classes to create the dropdowns for
 * the GA Query Explorer. The first class is a drop down for the account
 * selection. The second class subclasses the account dropdown and adds
 * functionality to select different parameters.
 * @author api.nickm@google.com (Nick Mihailovski)
 */

// create a namespace if not done already
var explorer = explorer || {};


/**
 * Adds a click handler to the document to close certain elements if
 * any clicks happen outside of those elements. This also closes any of
 * the existing elements that are open. This is used for dropdowns.
 */
(function() {
  // generic function to close all drop downs if a click event happens
  $(document).bind('click.dd', function(e) {
    if ($(e.target).closest('.dd-main,.dd-dropInput').length === 0) {
      $('.dd-main').hide();
    }
  });
})();



/**
 * Class Drop Down. This class creates a drop down for the account feed.
 * @constructor
 */
explorer.Dropdown = function() {
  this.input = {};
  this.values = {};
  this.output = {};
  this.dropdown = {};
  this.isInit = false;
};


/**
 * Runs all the initialization routines to construct the
 * dropdown from the parameters passed into this method. Once complete
 * the isInit member is set to true.
 * @param {String} inputId The id of the text input box to bind this
 *     control to.
 */
explorer.Dropdown.prototype.init = function(inputId) {
  this.input = document.getElementById(inputId);

  this.createHtmlContainer();
  this.addFocusHandler(this.input);
  this.isInit = true;
  $(this.input).addClass('dd-cursor');
};


/**
 * Creates an HTML wrapper surrounding the dropdown code.
 * The wrapper is then added to document.body. To update
 * the dropdown, the innerHTML of the wrapper can be
 * regenerated using the update method.
 */
explorer.Dropdown.prototype.createHtmlContainer = function() {
  var titles = {
    'account': 'Select an account',
    'webproperty': 'Select a web property',
    'profile': 'Select a view (profile)'
  };

  var ddId = this.input.id + '-dd';
  var html = [
    '<div id="', ddId, '" class="dd-main">',
    '<div class="dd-groupName">', titles[this.input.id], '</div>',
    '<div id="', ddId, '-content"></div>',
    '</div>'
  ].join('');

  $('body').append(html);

  this.dropdown = document.getElementById(ddId);
};


/**
 * Sets the position of the dropdown box's right most edge
 * to align with the right most edge of the element passed in. It uses the
 * getPosition method to determine the actual top and left positions of the
 * page.
 * @param {Object} elem The DOM element to align the dropdown with.
 */
explorer.Dropdown.prototype.setPosition = function(elem) {
  var pos = this.getPosition(elem);
  var iHeight = $(elem).outerHeight();
  var iWidth = $(elem).outerWidth();
  var ddWidth = $(this.dropdown).outerWidth();
  $(this.dropdown).css({
    'top': pos.top + iHeight,
    'left': pos.left + iWidth - ddWidth
  });
};


/**
 * Adds a focus handler to open the drop down.
 * @param {Object} inputControl The input box to listen when it receives focus.
 */
explorer.Dropdown.prototype.addFocusHandler = function(inputControl) {
  var openHandler = explorer.util.bindMethod(this, explorer.Dropdown.prototype.open);
  $(inputControl).focus(openHandler);
};


/**
 * Opens this dropdown. First all the other deop downs are hidden.
 * Then the position of the dropdown is recalculated and moved to be
 * under the input element. Finally the dropdown is shown.
 */
explorer.Dropdown.prototype.open = function() {
  $('.dd-main').hide();
  this.setPosition(this.input);
  $(this.dropdown).show();
};


/**
 * Updates the dropdown with data returned from the analytics API.
 * This redeners the content of the dropdown, then adds new row handlers
 * to handle clicks, and mouseovers.
 * @param {object} results Core Reporting API response.
 */
explorer.Dropdown.prototype.update = function(results) {
  this.createDropdown(results);
  this.addRowHandlers();
};


/**
 * Creates the drop down and populates all the rows with values
 * by going though all the elements in the values parameter. It also
 * overwrites the values parameter with a simplified version of the result
 * feed.
 * @param {object} results Core Reporting API response.
 */
explorer.Dropdown.prototype.createDropdown = function(results) {
  var html = [];

  results.items.sort(this.sortItemsByName);

  for (var i = 0, item; item = results.items[i]; ++i) {
    html.push(
        '<div class="dd-row dd-item" id="', item.id, '">',
        explorer.util.htmlEscape(item.name),
        '</div>');
  }

  var ddId = '#' + this.input.id + '-dd-content';
  $(ddId).html(html.join(''));
};


/**
 * Compares two items and returns whether they are in alphabetical order.
 * @param {string} a The first item in the set.
 * @param {string} b The second item in the set.
 * @return {number} -1 if they are in order, 1 if they are out of order, 0
 *    if they are the same.
 */
explorer.Dropdown.prototype.sortItemsByName = function(a, b) {
  var lowerA = a.name.toLowerCase();
  var lowerB = b.name.toLowerCase();

  if (lowerA < lowerB) {
    return -1;
  } else if (lowerA > lowerB) {
    return 1;
  }
  return 0;
};


/**
 * Adds handlers for each row in the drop down. It adds a click
 * handler to update the bound input text box with the id of the current div.
 * This id is the table id and set in the explorer.createDropdown method. This method
 * also adds mouse overs to every row.
 */
explorer.Dropdown.prototype.addRowHandlers = function() {
  var obj = this;
  $('#' + this.dropdown.id + ' .dd-row')
    .click(function() {
        var entityName = obj.input.id;
        var name = $(this).text();
        var id = $(this).attr('id');

        //$(obj.input).val(name);
        $(obj.dropdown).hide();

        explorer.mgmt.updateUi(entityName, name, id);

      }).mouseenter(function() {
        $(this).addClass('dd-highlight');

      }).mouseout(function() {
        $(this).removeClass('dd-highlight');
      });
};


/**
 * Returns the exact position of an element.
 * @param {string} obj The id of an element to get it's position.
 * @return {Object} an object containing the top and the left position
 *     relative to the document.
 */
explorer.Dropdown.prototype.getPosition = function(obj) {
  var curleft = 0;
  var curtop = 0;
  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
  }
  return {'top': curtop, 'left': curleft};
};



/**
 * Class Check Drop Down. This class dynamically creates a drop down from
 * the parameters passed into the init's value parameter. The drop down
 * has checkboxes to select multiple values and this class handles making
 * sure the bound input box as well as the checkboxes stay in sync.
 * @constructor
 * @extends {explorer.Dropdownn}
 */
explorer.CheckDropdown = function() {
  this.boxesChecked = {};
  this.form = {};
};


/** get access to the prototype of the explorer.Dropdown class */
explorer.CheckDropdown.prototype = new explorer.Dropdown();


/**
 * Runs all the initialization routines to construct the
 * dropdown from the parameters passed to this method.
 * @param {string} inputId The id of the text input box to bind this
 *     control to.
 * @param {Object} values An object representing the groupings and
 *     values to insert into the rows of the drop down. This object
 *     may also have help information.
 * @param {string} output The id of the location to display any help
 *     information.
 * @override
 */
explorer.CheckDropdown.prototype.init = function(inputId, values, output) {
  this.input = document.getElementById(inputId);
  this.values = values;
  this.output = document.getElementById(output);

  // give the associated input box a dropInput class
  $(this.input).addClass('dd-dropInput').addClass('dd-cursor');

  this.createDropdown();
  this.addInputKeyupHandler();
  this.addFocusHandler(this.input);
  this.addRowHandlers();
  this.setPosition(this.input);

  $(this.input).keyup();  // Set defaults from perma link.
};


/**
 * Creates all of the drop down controls based on this object's
 * values parameter.
 * @override
 */
explorer.CheckDropdown.prototype.createDropdown = function() {
  // the new id of the drop down
  var ddId = this.input.id + '-dd';
  var formId = this.input.id + '-form';

  var html = ['<div id="', ddId, '" class="dd-main">'];
  html.push('<form id="', formId, '" name="', formId, '">');

  // add the group name
  for (var groupName in this.values) {
    html.push('<div class="group"><div class="dd-groupName">',
        groupName, '</div>');

    // add the property names
    for (var property in this.values[groupName]) {
      html.push('<label class="dd-row" for="', property, '">',
          '<input type="checkbox" name="', property, '" id="', property,
          '" class="dd-check" value="', property, '"/>',
          '<span class="dd-text">', property, '</span>',
          '</label>');
    }
    html.push('</div>');
  }
  html.push('</form></div>');
  $('body').append(html.join(''));

  // reference the newly created form and drop down from this object
  this.form = document.getElementById(formId);
  this.dropdown = document.getElementById(ddId);
};


/**
 * Adds a keyup event handler to the input text box to keep the
 * drop down check boxes status' in sync with the modified text. This handler
 * executes the CheckDropDown.updateCheckboxes method.
 */
explorer.CheckDropdown.prototype.addInputKeyupHandler = function() {
  var obj = this;
  $(this.input).keyup(function() {
    obj.updateCheckboxes();
  });
};


/**
 * Adds handlers for each row in the drop down. It adds a click
 * handler to the checkboxes (using the label's "for" parameter achieves the
 * effect of clicking a row to select the checkbox). When clicked,
 * CheckDropdown.updateInput is called to update the input text box. Also
 * mouse overs are added to each row to display the help information.
 * @override
 */
explorer.CheckDropdown.prototype.addRowHandlers = function() {
  var sel = ['#', this.dropdown.id, ' .dd-row'].join('');

  // click handler for the checkboxes
  var obj = this;
  $(sel).mouseover(function() {
    $(this).addClass('dd-highlight');
    var groupId = $(this).parent().children('.dd-groupName').text();
    var valueId = $(this).attr('for');
    obj.displayHelp(groupId, valueId);
  })
  .mouseout(function() {
        $(this).removeClass('dd-highlight');
      })
  .children('.dd-check')
  .click(function() {
        obj.updateInput(this.checked, this.value);
      });
};


/**
 * Displays information for the groupId and valueId passed
 * into the method. The help text comes from this class's values object.
 * The HTML markup for the help text is constructed on the fly since there
 * can be many items in a list and only a subset of them selected at any
 * given time so it slightly faster to build the string at run time.
 * @param {string} groupId The group id of the particular element to display
 *     it's help information.
 * @param {string} valueId The value id of the particular element to display
 *     it's help information.
 */
explorer.CheckDropdown.prototype.displayHelp = function(groupId, valueId) {
  var html = ['<div class="name">', valueId, '</div><br/>',
    '<p class="desc">', this.values[groupId][valueId], '</p>',
    '<a class="docLink" target="blank"',
    ' href="', explorer.DIMS_METS_URL, '">Read the ', this.input.id,
    ' values reference</a>'].join('');
  $(this.output).html(html).show();
};


/**
 * Updates the checkboxes after the input text box has been
 * modified. It goes through two passes. First it checks the boxes for all
 * valid parameters in the text box. It then deselects any checkboxes that
 * had previously been in the text box but were removed.
 */
explorer.CheckDropdown.prototype.updateCheckboxes = function() {
  var tmpChecked = {};
  var id;

  // first check to see if new values were added that need to be checked
  // in the CheckDropdown
  var inputVals = this.input.value.split(',');
  for (var i = 0; i < inputVals.length; i++) {
    id = inputVals[i];
    // add into tmpChecked for later
    tmpChecked[id] = true;
    // check if this value is a checkbox in the form
    if (this.form.elements[id]) {
      // check if this value has not been checked through
      // the boxesChecked object
      if (!this.boxesChecked[id]) {
        this.form.elements[id].checked = true;  //check the box
        this.boxesChecked[id] = true;  //add to the boxes checked array
      }
    }
  }
  // if a value exists in the boxesChecked object but is not in the input box,
  // then it has been removed and needs to be unselected
  for (id in this.boxesChecked) {
    if (!tmpChecked[id]) {
      this.form.elements[id].checked = false;
      delete this.boxesChecked[id];
    }
  }
};


/**
 * Updates the input box's value with the checkbox's value. It is called from
 * the CheckDropdown's checkboxes click event handler.
 * If the checkbox is clicked, it's value is added to the input box.
 * If the check box is unclicked, any instance of the checkbox's value
 * in the input box is removed.
 * @param {boolean} isChecked True if the checkbox was checked.
 * @param {string} checkedValue The checkbox's value.
 */
explorer.CheckDropdown.prototype.updateInput = function(isChecked, checkedValue) {
  // if checkbox was checked and the checkedValue to the input box.
  if (isChecked) {

    if (this.input.value) {
      this.input.value += ',';
    }
    this.input.value += checkedValue;
    this.boxesChecked[checkedValue] = true;  // for input handler

  } else {
    // if the checkbox is unchecked, remove all instances of the value

    var str = this.input.value;

    // collapse all inner instances of the value to the list delimiter
    var exp = [',(', checkedValue, ',)*'].join('');
    var regEx = new RegExp(exp, 'g');
    str = str.replace(regEx, ',');

    // remove beginning and ending instances of the value
    exp = ['^', checkedValue, ',|,', checkedValue, '$'].join('');
    regEx = new RegExp(exp, 'g');
    str = str.replace(regEx, '');

    // remove value if it is the only thing left
    exp = ['^', checkedValue, '$'].join('');
    regEx = new RegExp(exp, 'g');
    str = str.replace(regEx, '');

    this.input.value = str;
    delete this.boxesChecked[checkedValue];  // For input handler.
  }
  $(this.input).keyup(); // Fire this input box's keyup event.
};



/**
 * Class SegmentsDropdown. This class dynamically creates a drop down from
 * the parameters passed into the init's value parameter.
 * @constructor
 * @extends {explorer.Dropdown}
 */
explorer.SegmentsDropdown = function() {};


/** get access to the prototype of the explorer.Dropdown class */
explorer.SegmentsDropdown.prototype = new explorer.Dropdown();


/**
 * Runs all the initialization routines to construct the
 * dropdown from the parameters passed to this method.
 * @param {string} inputId The id of the text input box to bind this control.
 * @param {Object} values An object representing the groupings and values to
 *     insert into the rows of the drop down.
 * @param {string} output The id of the location to display any help
 *     information.
 * @override
 */
explorer.SegmentsDropdown.prototype.init = function(inputId, values, output) {
  this.input = document.getElementById(inputId);
  this.values = values;
  this.output = document.getElementById(output);

  // give the associated input box a dropInput class
  $(this.input).addClass('dd-dropInput').addClass('dd-cursor');

  this.createDropdown();
  this.addFocusHandler(this.input);
};


/**
 * Creates all of the drop down controls based on this object's
 * values parameter.
 * @override
 */
explorer.SegmentsDropdown.prototype.createDropdown = function() {
  // The new id of the drop down.
  var ddId = this.input.id + '-dd';

  // Create the HTML of the dropdown.
  var html = ['<div id="', ddId, '" class="dd-main">'];
  $('body').append(html.join(''));

  // reference the newly created form and drop down from this object
  this.dropdown = document.getElementById(ddId);
  this.updateDropdown();
  this.addRowHandlers();
};


/**
 * Updates the rows of the dropdown with the values object.
 */
explorer.SegmentsDropdown.prototype.updateDropdown = function() {
  var html = [];
  // Add the group name.
  for (var groupName in this.values) {
    html.push('<div class="group">');
    html.push('<div class="dd-groupName">', groupName, '</div>');

    // Add the segment names.
    var segments = this.values[groupName];
    for (var segment in segments.values) {
      html.push([
        '<div class="dd-row" id="', segments.values[segment], '">',
        explorer.util.htmlEscape(segment),
        '</div>'
      ].join(''));
    }
    html.push('</div>'); // End div group.
  }
  html.push('</div>'); // End div dropdown.
  $(this.dropdown).html(html.join(''));
};


/**
 * Updates the dropdown to include the authorized user's segments.
 * This method updates the explorer.segmentsHelp['Custom Segments'].values
 * object. Each of segment names found in results are added as keys
 * and the segment IDs are added as values. Finally this segment
 * is rerendered and new row handlers are added.
 * @param {object} results The results returned from the segments
 *     collection of the Management API.
 */
explorer.SegmentsDropdown.prototype.updateValues = function(results) {
  var hasCustomSegments = false;
  var customSegments = {};

  if (results && results.items && results.items.length) {
    var items = results.items;
    for (var i = 0, segment; segment = items[i]; ++i) {

      // Default segment IDs are always < 0. Custom segments IDs are
      // alphanumeric values. When you parseInt a custom segment ID you'll
      // either get NaN or a positive integer. So to identify custom segments
      // we use anything that is not a number or > -1.
      var segmentId = parseInt(segment.id, 10);
      if (!segmentId || (segmentId >= -1)) {
        customSegments[segment.name] = segment.segmentId;
        hasCustomSegments = true;
      }
    }
  }

  if (!hasCustomSegments) {
    customSegments['No custom segments for user'] = '';
  }

  explorer.segmentsHelp[explorer.customSegName].values = customSegments;
  this.updateDropdown();
  this.addRowHandlers();
};


/**
 * Adds handlers for each row in the drop down.
 * @override
 */
explorer.SegmentsDropdown.prototype.addRowHandlers = function() {
  var self = this;
  $('#' + this.dropdown.id + ' .dd-row')
    .click(function() {
        var segmentTxt = $(this).attr('id');

        // update input value and fire keyup to update query object
        $(self.input).val(segmentTxt).keyup();
        $(self.input).focus();

      }).mouseenter(function() {
        $(this).addClass('dd-highlight');

      }).mouseout(function() {
        $(this).removeClass('dd-highlight');

      });
};

