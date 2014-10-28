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


var explorer = explorer || {};

/**
 * Configuration object for Fun stuff
 */
explorer.fun = explorer.fun || {};


// Browser BS. you guys suck for making it difficult.
var transitionProperty = 'transitionProperty';
var transitionDuration = 'transitionDuration';
var transitionTimingFunction = 'transitionTimingFunction';
var transitionEnd = 'transitionEnd';

if (typeof document.body.style.webkitTransitionProperty !== 'undefined') {
  transitionProperty = 'webkitTransitionProperty';
  transitionDuration = 'webkitTransitionDuration';
  transitionTimingFunction = 'webkitTransitionTimingFunction';
  transitionEnd = 'webkitTransitionEnd';
}
/*else if (typeof document.body.style.MozTransitionProperty !== 'undefined') {
  transitionProperty = 'MozTransitionProperty';
  transitionDuration = 'MozTransitionDuration';
  transitionTimingFunction = 'MozTransitionTimingFunction';
  transitionEnd = 'transitionend';
}*/

/**
 * Creates the haduken experience
 */
explorer.fun.haduken = function() {
  var img = document.createElement('img');
  var now = new Date();
  var id = now.getTime();
  var audioId = id + 'audio';
  var resourceDir = '/public/images/explorer/';

  img.id = id;
  img.src = resourceDir + 'had.png';

  //img.style.left = '-225px';
  img.style.left = '0px';
  img.style.top = '275px';
  img.style.position = 'absolute';
  img.style[transitionProperty] = 'left';
  img.style[transitionDuration] = '2s';
  img.style[transitionTimingFunction] = 'ease-out';
    //return true;

  img.addEventListener(transitionEnd, function() {
    // Remove image.
    var had = document.getElementById(id);
    had.parentNode.removeChild(had);

    // Remove audio.
    var audio = document.getElementById(audioId);
    audio.parentNode.removeChild(audio);
  });

  document.body.appendChild(img);

  window.setTimeout(function() {
    if (typeof document.body.style.webkitTransitionProperty !== 'undefined') {
      // play clip
      var source1 = document.createElement('source');
      source1.src = resourceDir + 'had.mp3';
      var source2 = document.createElement('source');
      source2.src = resourceDir + 'had.ogg';
      var audio = document.createElement('audio');
      audio.id = audioId;
      audio.autoplay = 'true';
      audio.appendChild(source2);
      audio.appendChild(source1);
      document.body.appendChild(audio);
    }

    // do aninamtion
    var endDistance = window.innerWidth + 225;
    var had = document.getElementById(id);
    had.style.left = endDistance + 'px';
  }, 1);
};

