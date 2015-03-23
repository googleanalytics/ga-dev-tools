# coding=utf-8


# Copyright 2015 Google Inc. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


import webapp2

from webapp2_extras.routes import RedirectRoute
from lib.redirects import EmbedApiController
from lib.controllers.base import BaseController
from lib.controllers.explorer_csv import ExplorerCsvController

router = webapp2.WSGIApplication([

  # Redirects
  (r'/demos/embed-api.*', EmbedApiController),

  # Main routes
  (r'/explorer/csvhandler.*', ExplorerCsvController),
  RedirectRoute(r'/',
      handler=BaseController, name='Home', strict_slash=True),
  RedirectRoute(r'/<project>/',
      handler=BaseController, name='Project', strict_slash=True),
  RedirectRoute(r'/<project>/<page>/',
      handler=BaseController, name='Page', strict_slash=True),

], debug=False)
